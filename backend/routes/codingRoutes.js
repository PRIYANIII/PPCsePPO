import express from 'express';
import { protect } from '../middleware/auth.js';
import DSAQuestion from '../models/DSAQuestion.js';
import Submission from '../models/Submission.js';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
const router = express.Router();

// Docker-based code execution (you'll need Docker installed)
const LANGUAGE_CONFIG = {
  python: { image: 'python:3.11-alpine', source: 'Main.py', command: ['python', '/workspace/Main.py'] },
  cpp: { image: 'gcc:14', source: 'Main.cpp', command: ['sh', '-c', 'g++ -O2 -std=c++17 /workspace/Main.cpp -o /tmp/Main && /tmp/Main'] },
  c: { image: 'gcc:14', source: 'Main.c', command: ['sh', '-c', 'gcc -O2 /workspace/Main.c -o /tmp/Main && /tmp/Main'] },
  java: { image: 'eclipse-temurin:21-jdk-alpine', source: 'Main.java', command: ['sh', '-c', 'javac -d /tmp /workspace/Main.java && java -cp /tmp Main'] }
};

const runProcess = (command, args, { input, timeoutMs }) => new Promise((resolve) => {
  const child = spawn(command, args, { windowsHide: true });
  let stdout = '';
  let stderr = '';
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    child.kill('SIGKILL');
  }, timeoutMs);

  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  child.on('error', (error) => { stderr += error.message; });
  child.on('close', (code) => {
    clearTimeout(timer);
    resolve({ stdout, stderr, code, timedOut });
  });
  child.stdin.end(input);
});

// Submit and run code
router.post('/submit/:questionId', protect, async (req, res) => {
  try {
    const { questionId } = req.params;
    const { code, language } = req.body;
    if (!LANGUAGE_CONFIG[language] || typeof code !== 'string' || code.length > 50_000) {
      return res.status(400).json({ message: 'Provide supported code (C, C++, Java, or Python) under 50 KB.' });
    }
    
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
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (!LANGUAGE_CONFIG[language] || typeof code !== 'string' || code.length > 50_000) {
      return res.status(400).json({ message: 'Provide supported code (C, C++, Java, or Python) under 50 KB.' });
    }
    
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
  const config = LANGUAGE_CONFIG[language];
  if (!config) return { output: '', error: 'Unsupported language', runtime: 0, memory: 0 };
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'careerpilot-'));
  const filePath = path.join(tempDirectory, config.source);
  
  try {
    await fs.writeFile(filePath, code);
    
    const startTime = Date.now();
    const result = await runProcess('docker', [
      'run', '--rm', '-i', '--network', 'none', '--read-only',
      '--pids-limit', '64', '--memory', `${memoryLimit}m`, '--cpus', '1',
      '--tmpfs', '/tmp:rw,noexec,nosuid,size=64m',
      '--mount', `type=bind,src=${tempDirectory},dst=/workspace,readonly`,
      config.image, ...config.command
    ], { input, timeoutMs: (timeLimit * 1000) + 1500 });
    const runtime = Date.now() - startTime;

    return {
      output: result.stdout,
      error: result.timedOut ? 'Time Limit Exceeded' : (result.stderr || (result.code ? 'Execution failed' : null)),
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
      await fs.rm(tempDirectory, { recursive: true, force: true });
    } catch (err) {
      // Ignore cleanup errors
    }
  }
}

export default router;
