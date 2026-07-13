import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: { type: String, default: '' },
  description: { type: String, default: '' },
  website: { type: String, default: '' },
  
  // Placement Details
  averagePackage: { type: String, default: '' },
  highestPackage: { type: String, default: '' },
  roles: [{
    title: String,
    description: String,
    requiredSkills: [String],
    package: String
  }],
  
  // Recruitment Process
  recruitmentProcess: {
    rounds: [{
      name: String,
      description: String,
      duration: String,
      type: {
        type: String,
        enum: ['aptitude', 'coding', 'technical', 'hr', 'group_discussion']
      }
    }],
    totalRounds: Number
  },
  
  // Required Skills Weightage
  skillWeights: {
    dsa: { type: Number, default: 40, min: 0, max: 100 },
    csFundamentals: { type: Number, default: 30, min: 0, max: 100 },
    aptitude: { type: Number, default: 15, min: 0, max: 100 },
    communication: { type: Number, default: 10, min: 0, max: 100 },
    projects: { type: Number, default: 5, min: 0, max: 100 }
  },
  
  // Required Topics
  requiredTopics: [{
    topic: String,
    importance: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low']
    },
    subTopics: [String]
  }],
  
  // Past Interview Experiences
  interviewExperiences: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    role: String,
    year: Number,
    experience: String,
    rounds: [{
      roundType: String,
      questions: [String],
      tips: String
    }],
    selected: Boolean,
    package: String
  }],
  
  isActive: { type: Boolean, default: true },
  visitingCampuses: [String],
  recruitmentYear: { type: Number, default: new Date().getFullYear() }
  
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;