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

// GFG does not publish a stable public stats API. This best-effort sync only reads
// the public profile the student supplies and leaves existing values untouched if
// the profile format changes.
router.post('/platform-stats/gfg/sync', protect, async (req, res) => {
  try {
    const { profileUrl } = req.body;
    const parsed = new URL(profileUrl);
    if (parsed.hostname !== 'www.geeksforgeeks.org' || !parsed.pathname.startsWith('/user/')) return res.status(400).json({ message: 'Enter a public GeeksforGeeks profile URL.' });
    const response = await fetch(parsed.toString(), { headers: { 'User-Agent': 'CareerPilot student progress sync' }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) return res.status(422).json({ message: 'GeeksforGeeks profile could not be reached.' });
    const html = await response.text();
    const match = html.match(/(?:problems\s*solved|problemsSolved)[^0-9]{0,120}(\d+)/i);
    if (!match) return res.status(422).json({ message: 'GFG changed its public profile format. Please enter your counts manually for now.' });
    const user = await User.findById(req.user._id);
    user.platformStats.gfg.profileUrl = parsed.toString();
    user.platformStats.gfg.totalSolved = Number(match[1]);
    await user.save();
    res.json(user.platformStats.gfg);
  } catch (error) { res.status(400).json({ message: error.message.includes('URL') ? 'Enter a valid public GFG profile URL.' : error.message }); }
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
      const wasSolved = questionProgress.status === 'solved';
      if (questionProgress.status !== 'solved' && status === 'solved') {
        topicProgress.solvedQuestions++;
        if (question.difficulty === 'easy') topicProgress.easySolved++;
        else if (question.difficulty === 'medium') topicProgress.mediumSolved++;
        else if (question.difficulty === 'hard') topicProgress.hardSolved++;
      }
      if (wasSolved && !isSolved) {
        topicProgress.solvedQuestions = Math.max(0, topicProgress.solvedQuestions - 1);
        if (question.difficulty === 'easy') topicProgress.easySolved = Math.max(0, topicProgress.easySolved - 1);
        else if (question.difficulty === 'medium') topicProgress.mediumSolved = Math.max(0, topicProgress.mediumSolved - 1);
        else if (question.difficulty === 'hard') topicProgress.hardSolved = Math.max(0, topicProgress.hardSolved - 1);
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
    const allTopicCounts = await DSAQuestion.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
    user.totalDSAQuestions = allTopicCounts.reduce((total, item) => total + item.count, 0);
    user.totalEasyQuestions = allTopicCounts.find((item) => item._id === 'easy')?.count || 0;
    user.totalMediumQuestions = allTopicCounts.find((item) => item._id === 'medium')?.count || 0;
    user.totalHardQuestions = allTopicCounts.find((item) => item._id === 'hard')?.count || 0;
    
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
