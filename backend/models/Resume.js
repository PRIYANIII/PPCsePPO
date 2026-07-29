import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  sourceText: { type: String, select: false, maxlength: 100000 },
  analysis: {
    summary: String,
    skills: [String],
    projects: [{ name: String, highlights: [String] }],
    experience: [{ role: String, organization: String, highlights: [String] }],
    strengths: [String],
    gaps: [String],
    suggestions: [String],
    atsScore: Number
  }
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
