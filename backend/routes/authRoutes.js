import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  college: user.college,
  branch: user.branch,
  graduationYear: user.graduationYear,
  targetRole: user.targetRole,
  platformStats: user.platformStats,
  companyReadiness: user.companyReadiness,
  dsaProgress: user.dsaProgress,
  totalDSAQuestions: user.totalDSAQuestions,
  totalEasyQuestions: user.totalEasyQuestions,
  totalMediumQuestions: user.totalMediumQuestions,
  totalHardQuestions: user.totalHardQuestions,
  studyStreak: user.studyStreak,
  totalStudyTime: user.totalStudyTime,
  createdAt: user.createdAt
});

// Validation middleware
const validateSignup = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/signup', validateSignup, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if this is the admin email
    const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
    
    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      ...formatUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      ...formatUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(formatUser(req.user));
});

export default router;