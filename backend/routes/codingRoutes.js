import express from 'express';
import { protect } from '../middleware/auth.js';
import DSAQuestion from '../models/DSAQuestion.js';
import Submission from '../models/Submission.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);
const router = express.Router();

// Docker-based code execution (you'll need Docker installed)
const DOCKER_IMAGES = {
  cpp: 'gcc:latest',
  java: 'openjdk:latest',
  python: 'python:3.9-slim',
  c: 'gcc:latest'
};

const FILE_EXTENSIONS = {
  cpp: 'cpp',
  java: 'java',
  python: 'py',
  c: 'c'
};

// Submit and run code
router.post('/submit/:questionId', protect, async (req, res) => {
  try {
    const { questionId } = req.params;
    const { code, language } = req.body;
    
    const question = await DSAQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Create submission record
    const submission = await Submission.create({
      userId: req.user._id,
      questionId,
      language,
      code,
      status: 'running',
      totalTestCases: question.testCases.filter(tc => !tc.isHidden).length
    });
    
    // Run code against test cases
    const results = await runCodeAgainstTestCases(code, language, question.testCases, question.timeLimit, question.memoryLimit);
    
    // Update submission
    submission.status = results.status;
    submission.runtime = results.runtime;
    submission.memory = results.memory;
    submission.testCasesPassed = results.passedCount;
    submission.errorMessage = results.errorMessage || '';
    
    await submission.save();
    
    // Update question stats
    question.totalSubmissions++;
    if (results.status === 'accepted') {
      question.successfulSubmissions++;
      question.acceptanceRate = (question.successfulSubmissions / question.totalSubmissions) * 100;
    }
    await question.save();
    
    res.json({
      submission,
      testResults: results.testResults
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Run code (without saving submission)
router.post('/run/:questionId', protect, async (req, res) => {
  try {
    const { code, language, customInput } = req.body;
    const question = await DSAQuestion.findById(req.params.questionId);
    
    const testCases = customInput 
      ? [{ input: customInput, expectedOutput: '', isHidden: false }]
      : question.testCases.filter(tc => !tc.isHidden).slice(0, 2);
    
    const results = await runCodeAgainstTestCases(code, language, testCases, 5, 512);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user submissions for a question
router.get('/submissions/:questionId', protect, async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.user._id,
      questionId: req.params.questionId
    }).sort({ submittedAt: -1 }).limit(20);
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to run code against test cases
async function runCodeAgainstTestCases(code, language, testCases, timeLimit, memoryLimit) {
  const testResults = [];
  let totalRuntime = 0;
  let maxMemory = 0;
  let passedCount = 0;
  let status = 'accepted';
  let errorMessage = '';
  
  try {
    for (const testCase of testCases) {
      const result = await executeCode(code, language, testCase.input, timeLimit, memoryLimit);
      
      testResults.push({
        input: testCase.isHidden ? 'Hidden' : testCase.input,
        expectedOutput: testCase.isHidden ? 'Hidden' : testCase.expectedOutput,
        actualOutput: testCase.isHidden ? 'Hidden' : result.output?.trim(),
        passed: result.output?.trim() === testCase.expectedOutput?.trim(),
        runtime: result.runtime,
        memory: result.memory,
        error: result.error
      });
      
      totalRuntime += result.runtime || 0;
      maxMemory = Math.max(maxMemory, result.memory || 0);
      
      if (result.output?.trim() !== testCase.expectedOutput?.trim()) {
        if (result.error) {
          status = result.error.includes('time') ? 'time_limit_exceeded' : 'runtime_error';
          errorMessage = result.error;
        } else {
          status = 'wrong_answer';
        }
        break;
      }
      
      passedCount++;
    }
  } catch (error) {
    status = 'runtime_error';
    errorMessage = error.message;
  }
  
  return {
    status,
    runtime: totalRuntime,
    memory: maxMemory,
    passedCount,
    totalTestCases: testCases.length,
    testResults,
    errorMessage
  };
}

// Execute code in a temporary file
async function executeCode(code, language, input, timeLimit = 2, memoryLimit = 256) {
  const id = uuidv4();
  const extension = FILE_EXTENSIONS[language];
  const fileName = `${id}.${extension}`;
  const filePath = path.join('/tmp', fileName);
  
  try {
    await fs.writeFile(filePath, code);
    
    let command = '';
    let dockerImage = DOCKER_IMAGES[language];
    
    switch (language) {
      case 'python':
        command = `echo "${input}" | docker run --rm -i --memory=${memoryLimit}m --cpus=1 --network none -v ${filePath}:/code.${extension}:ro ${dockerImage} python /code.${extension}`;
        break;
      case 'cpp':
        command = `docker run --rm -i --memory=${memoryLimit}m --cpus=1 --network none -v ${filePath}:/code.${extension}:ro ${dockerImage} sh -c "g++ /code.${extension} -o /code && echo '${input}' | /code"`;
        break;
      case 'c':
        command = `docker run --rm -i --memory=${memoryLimit}m --cpus=1 --network none -v ${filePath}:/code.${extension}:ro ${dockerImage} sh -c "gcc /code.${extension} -o /code && echo '${input}' | /code"`;
        break;
      case 'java':
        command = `docker run --rm -i --memory=${memoryLimit}m --cpus=1 --network none -v ${filePath}:/Main.${extension}:ro ${dockerImage} sh -c "javac /Main.${extension} && echo '${input}' | java -cp / Main"`;
        break;
    }
    
    const startTime = Date.now();
    const { stdout, stderr } = await execAsync(command, { timeout: timeLimit * 1000 + 5000 });
    const runtime = Date.now() - startTime;
    
    return {
      output: stdout,
      error: stderr || null,
      runtime,
      memory: 0 // Docker memory usage would need additional monitoring
    };
  } catch (error) {
    return {
      output: '',
      error: error.message.includes('timed out') ? 'Time Limit Exceeded' : error.message,
      runtime: 0,
      memory: 0
    };
  } finally {
    // Cleanup
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // Ignore cleanup errors
    }
  }
}

export default router;