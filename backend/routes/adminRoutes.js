import express from 'express';
import { adminProtect } from '../middleware/adminAuth.js';
import DSATopic from '../models/DSATopic.js';
import DSAQuestion from '../models/DSAQuestion.js';
import Company from '../models/Company.js';
import User from '../models/User.js';
import AIRequestLog from '../models/AIRequestLog.js';
import AIRetryQueue from '../models/AIRetryQueue.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// All routes are protected and require admin access
router.use(adminProtect);

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalQuestions = await DSAQuestion.countDocuments();
    const totalTopics = await DSATopic.countDocuments();
    const totalCompanies = await Company.countDocuments();
    
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password');
    
    const submissionsByDifficulty = await DSAQuestion.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalUsers,
      totalQuestions,
      totalTopics,
      totalCompanies,
      recentUsers,
      submissionsByDifficulty
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/audit', async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1); const limit = Math.min(Number(req.query.limit) || 25, 100);
  const filter = {}; if (req.query.success) filter.success = req.query.success === 'true'; if (req.query.provider) filter.provider = req.query.provider;
  const [items, total] = await Promise.all([AIRequestLog.find(filter).populate('userId', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), AIRequestLog.countDocuments(filter)]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});
router.get('/retry-queue', async (req, res) => res.json(await AIRetryQueue.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(100)));

// CRUD for DSA Topics
router.post('/topics', [
  body('name').trim().notEmpty(),
  body('slug').trim().notEmpty(),
  body('category').isIn(['basics', 'arrays', 'strings', 'linked_list', 'stack_queue',
    'recursion', 'trees', 'graphs', 'dp', 'greedy', 'bit_manipulation',
    'searching_sorting', 'hashing', 'heaps', 'tries', 'sliding_window',
    'maths', 'patterns', 'stl'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const topic = await DSATopic.create(req.body);
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/topics/:id', async (req, res) => {
  try {
    const topic = await DSATopic.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/topics/:id', async (req, res) => {
  try {
    // Also delete all questions under this topic
    await DSAQuestion.deleteMany({ topicId: req.params.id });
    await DSATopic.findByIdAndDelete(req.params.id);
    res.json({ message: 'Topic and associated questions deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add SubTopic to a Topic
router.post('/topics/:topicId/subtopics', async (req, res) => {
  try {
    const topic = await DSATopic.findById(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    topic.subTopics.push(req.body);
    await topic.save();
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CRUD for DSA Questions
router.post('/questions', [
  body('title').trim().notEmpty(),
  body('slug').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('topicId').notEmpty(),
  body('difficulty').isIn(['easy', 'medium', 'hard'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const question = await DSAQuestion.create({
      ...req.body,
      createdBy: req.user._id
    });
    
    // Update topic counts
    const topic = await DSATopic.findById(question.topicId);
    if (topic) {
      topic.totalQuestions = (topic.totalQuestions || 0) + 1;
      if (question.difficulty === 'easy') topic.easyCount++;
      else if (question.difficulty === 'medium') topic.mediumCount++;
      else if (question.difficulty === 'hard') topic.hardCount++;
      await topic.save();
    }
    
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/questions/:id', async (req, res) => {
  try {
    const question = await DSAQuestion.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/questions/:id', async (req, res) => {
  try {
    const question = await DSAQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Update topic counts
    const topic = await DSATopic.findById(question.topicId);
    if (topic) {
      topic.totalQuestions--;
      if (question.difficulty === 'easy') topic.easyCount--;
      else if (question.difficulty === 'medium') topic.mediumCount--;
      else if (question.difficulty === 'hard') topic.hardCount--;
      await topic.save();
    }
    
    await DSAQuestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk add test cases to a question
router.post('/questions/:id/testcases', async (req, res) => {
  try {
    const { testCases } = req.body;
    const question = await DSAQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    question.testCases.push(...testCases);
    await question.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CRUD for Companies
router.post('/companies', async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/companies/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
