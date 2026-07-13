import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const platformStatsSchema = new mongoose.Schema({
  leetcode: {
    totalSolved: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    profileUrl: { type: String, default: '' }
  },
  gfg: {
    totalSolved: { type: Number, default: 0 },
    school: { type: Number, default: 0 },
    basic: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    profileUrl: { type: String, default: '' }
  },
  codeforces: {
    rating: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 },
    handle: { type: String, default: '' }
  }
});

const dsaProgressSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DSATopic',
    required: true
  },
  topicName: { type: String, required: true },
  totalQuestions: { type: Number, default: 0 },
  solvedQuestions: { type: Number, default: 0 },
  easySolved: { type: Number, default: 0 },
  mediumSolved: { type: Number, default: 0 },
  hardSolved: { type: Number, default: 0 },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DSAQuestion'
    },
    status: {
      type: String,
      enum: ['not_started', 'attempted', 'solved', 'revision'],
      default: 'not_started'
    },
    attempts: { type: Number, default: 0 },
    lastAttempted: { type: Date },
    timeSpent: { type: Number, default: 0 }, // in minutes
    notes: { type: String, default: '' },
    solutions: [{
      language: String,
      code: String,
      submittedAt: { type: Date, default: Date.now },
      passed: { type: Boolean, default: false },
      runtime: { type: Number, default: 0 },
      memory: { type: Number, default: 0 }
    }]
  }]
});

const companyReadinessSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  companyName: { type: String, required: true },
  overallScore: { type: Number, default: 0 },
  dsaScore: { type: Number, default: 0 },
  csFundamentalsScore: { type: Number, default: 0 },
  aptitudeScore: { type: Number, default: 0 },
  topicsToFocus: [{
    topic: String,
    priority: { type: String, enum: ['high', 'medium', 'low'] },
    estimatedHours: Number
  }],
  lastUpdated: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Personal Details
  phone: { type: String, default: '' },
  college: { type: String, default: '' },
  branch: { type: String, default: '' },
  graduationYear: { type: Number },
  currentSemester: { type: Number },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  
  // Career Details
  targetRole: {
    type: String,
    default: 'Software Engineer',
  },
  preferredLocation: { type: String, default: '' },
  
  // Platform Stats
  platformStats: {
    type: platformStatsSchema,
    default: () => ({})
  },
  
  // Company Readiness
  companyReadiness: [companyReadinessSchema],
  
  // DSA Progress
  dsaProgress: [dsaProgressSchema],
  
  // Overall Stats
  totalDSAQuestions: { type: Number, default: 474 },
  totalEasyQuestions: { type: Number, default: 152 },
  totalMediumQuestions: { type: Number, default: 186 },
  totalHardQuestions: { type: Number, default: 136 },
  
  // Study Streak
  studyStreak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastStudyDate: { type: Date }
  },
  
  // Total Study Time (in minutes)
  totalStudyTime: { type: Number, default: 0 },
  
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;