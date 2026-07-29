import express from 'express';
import { protect } from '../middleware/auth.js';
import DSATopic from '../models/DSATopic.js';
import DSAQuestion from '../models/DSAQuestion.js';

const router = express.Router();

// Get all DSA topics with progress (requires auth)
router.get('/topics', protect, async (req, res) => {
  try {
    const topics = await DSATopic.find({ isActive: true })
      .sort({ order: 1 })
      .populate('prerequisites', 'name slug');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public route for getting topics (for initial load)
router.get('/public/topics', async (req, res) => {
  try {
    const topics = await DSATopic.find({ isActive: true })
      .sort({ order: 1 })
      .select('-prerequisites');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get questions by topic
router.get('/topics/:topicId/questions', protect, async (req, res) => {
  try {
    const { difficulty, status, search } = req.query;
    const filter = { topicId: req.params.topicId, isActive: true };
    
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.title = { $regex: search, $options: 'i' };
    
    const questions = await DSAQuestion.find(filter)
      .select('-solutions -testCases')
      .sort({ difficulty: 1, title: 1 });
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single question details
router.get('/questions/:id', protect, async (req, res) => {
  try {
    const question = await DSAQuestion.findById(req.params.id)
      .populate('topicId', 'name slug');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get questions by subtopic
router.get('/topics/:topicId/subtopics/:subTopicSlug/questions', protect, async (req, res) => {
  try {
    const topic = await DSATopic.findById(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    const subTopic = topic.subTopics.find(st => st.slug === req.params.subTopicSlug);
    if (!subTopic) {
      return res.status(404).json({ message: 'SubTopic not found' });
    }
    
    const questions = await DSAQuestion.find({
      topicId: req.params.topicId,
      subTopicId: subTopic._id,
      isActive: true
    }).select('-solutions -testCases');
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
