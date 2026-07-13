import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import DSAQuestion from '../models/DSAQuestion.js';
import DSATopic from '../models/DSATopic.js';

const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('companyReadiness.companyId');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password update through this route
    delete updates.role; // Don't allow role update
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update platform stats
router.put('/platform-stats', protect, async (req, res) => {
  try {
    const { leetcode, gfg, codeforces } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (leetcode) {
      user.platformStats.leetcode = { ...user.platformStats.leetcode, ...leetcode };
    }
    if (gfg) {
      user.platformStats.gfg = { ...user.platformStats.gfg, ...gfg };
    }
    if (codeforces) {
      user.platformStats.codeforces = { ...user.platformStats.codeforces, ...codeforces };
    }
    
    await user.save();
    res.json(user.platformStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get DSA progress for all topics
router.get('/dsa-progress', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('dsaProgress.topicId');
    res.json(user.dsaProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update DSA progress for a specific question
router.put('/dsa-progress/:questionId', protect, async (req, res) => {
  try {
    const { questionId } = req.params;
    const { status, notes, timeSpent } = req.body;
    
    const question = await DSAQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Find or create progress for this topic
    let topicProgress = user.dsaProgress.find(
      p => p.topicId.toString() === question.topicId.toString()
    );
    
    if (!topicProgress) {
      const topic = await DSATopic.findById(question.topicId);
      topicProgress = {
        topicId: question.topicId,
        topicName: topic.name,
        totalQuestions: 0,
        solvedQuestions: 0,
        questions: []
      };
      user.dsaProgress.push(topicProgress);
    }
    
    // Find or create question progress
    let questionProgress = topicProgress.questions.find(
      q => q.questionId.toString() === questionId
    );
    
    if (!questionProgress) {
      questionProgress = {
        questionId: question._id,
        status: 'not_started',
        attempts: 0,
        solutions: []
      };
      topicProgress.questions.push(questionProgress);
    }
    
    // Update progress
    if (status) {
      if (questionProgress.status !== 'solved' && status === 'solved') {
        topicProgress.solvedQuestions++;
        if (question.difficulty === 'easy') topicProgress.easySolved++;
        else if (question.difficulty === 'medium') topicProgress.mediumSolved++;
        else if (question.difficulty === 'hard') topicProgress.hardSolved++;
      }
      questionProgress.status = status;
    }
    
    if (notes) questionProgress.notes = notes;
    if (timeSpent) questionProgress.timeSpent += timeSpent;
    questionProgress.lastAttempted = new Date();
    
    // Update study streak
    const today = new Date().toDateString();
    const lastStudy = user.studyStreak.lastStudyDate 
      ? new Date(user.studyStreak.lastStudyDate).toDateString() 
      : null;
    
    if (lastStudy !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastStudy === yesterday) {
        user.studyStreak.current++;
      } else {
        user.studyStreak.current = 1;
      }
      user.studyStreak.longest = Math.max(user.studyStreak.longest, user.studyStreak.current);
      user.studyStreak.lastStudyDate = new Date();
    }
    
    if (timeSpent) {
      user.totalStudyTime += timeSpent;
    }
    
    // Recalculate topic totals
    const allQuestions = await DSAQuestion.countDocuments({ topicId: question.topicId });
    topicProgress.totalQuestions = allQuestions;
    
    await user.save();
    res.json(topicProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update company readiness
router.put('/company-readiness', protect, async (req, res) => {
  try {
    const { companyId, readinessData } = req.body;
    
    const user = await User.findById(req.user._id);
    let companyReadiness = user.companyReadiness.find(
      c => c.companyId.toString() === companyId
    );
    
    if (!companyReadiness) {
      companyReadiness = { companyId };
      user.companyReadiness.push(companyReadiness);
    }
    
    Object.assign(companyReadiness, readinessData);
    await user.save();
    
    res.json(user.companyReadiness);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;