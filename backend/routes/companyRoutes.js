import express from 'express';
import { protect } from '../middleware/auth.js';
import Company from '../models/Company.js';
import User from '../models/User.js';

const router = express.Router();

// Get all companies (public)
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true })
      .select('-interviewExperiences');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get company details with readiness (authenticated)
router.get('/:id', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Get user's readiness for this company
    const user = await User.findById(req.user._id);
    const readiness = user.companyReadiness.find(
      cr => cr.companyId.toString() === req.params.id
    );
    
    res.json({
      company,
      userReadiness: readiness || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add interview experience
router.post('/:id/experiences', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    company.interviewExperiences.push({
      userId: req.user._id,
      userName: req.user.name,
      ...req.body
    });
    
    await company.save();
    res.json(company.interviewExperiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
