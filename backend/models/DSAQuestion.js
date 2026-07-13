import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  explanation: { type: String, default: '' },
  isHidden: { type: Boolean, default: false }
});

const solutionSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ['cpp', 'java', 'python'],
    required: true
  },
  code: { type: String, required: true },
  timeComplexity: { type: String, default: '' },
  spaceComplexity: { type: String, default: '' },
  explanation: { type: String, default: '' }
});

const dsaQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DSATopic',
    required: true
  },
  subTopicId: { type: String },
  
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  
  // Problem Details
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  
  constraints: [String],
  
  // Test Cases
  testCases: [testCaseSchema],
  
  // Solutions
  solutions: [solutionSchema],
  
  // Metadata
  companies: [String],
  tags: [String],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  acceptanceRate: { type: Number, default: 0 },
  totalSubmissions: { type: Number, default: 0 },
  successfulSubmissions: { type: Number, default: 0 },
  
  // Related Questions
  relatedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DSAQuestion'
  }],
  
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Hints
  hints: [String],
  
  // Time limit in seconds
  timeLimit: { type: Number, default: 2 },
  memoryLimit: { type: Number, default: 256 } // MB
  
}, { timestamps: true });

dsaQuestionSchema.index({ topicId: 1, difficulty: 1 });
dsaQuestionSchema.index({ slug: 1 });

const DSAQuestion = mongoose.model('DSAQuestion', dsaQuestionSchema);
export default DSAQuestion;