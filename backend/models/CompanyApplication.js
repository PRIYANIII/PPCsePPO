import mongoose from 'mongoose';

const companyApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  jobDescription: { type: String, required: true, maxlength: 30000 },
  requirements: [String],
  analysis: { atsScore: Number, matchedSkills: [String], missingSkills: [String], summary: String, recommendations: [String] }
}, { timestamps: true });

export default mongoose.model('CompanyApplication', companyApplicationSchema);
