import mongoose from 'mongoose';
const readinessSnapshotSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, companyName: String, score: Number, strengths: [String], weaknesses: [String], missingSkills: [String], recommendations: [String] }, { timestamps: true });
readinessSnapshotSchema.index({ userId: 1, companyId: 1, createdAt: -1 });
export default mongoose.model('ReadinessSnapshot', readinessSnapshotSchema);
