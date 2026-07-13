import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DSAQuestion',
    required: true
  },
  language: {
    type: String,
    enum: ['cpp', 'java', 'python'],
    required: true
  },
  code: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'running', 'accepted', 'wrong_answer', 'time_limit_exceeded', 
           'memory_limit_exceeded', 'runtime_error', 'compilation_error'],
    default: 'pending'
  },
  runtime: { type: Number, default: 0 }, // in milliseconds
  memory: { type: Number, default: 0 }, // in KB
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  errorMessage: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

submissionSchema.index({ userId: 1, questionId: 1 });
submissionSchema.index({ submittedAt: -1 });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;