import mongoose from 'mongoose';
const personalizedSheetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  style: { type: String, enum: ['foundation', 'interview', 'company'], default: 'interview' },
  targetCompany: String,
  title: String,
  rationale: String,
  items: [{ topic: String, difficulty: String, objective: String, days: Number, completed: { type: Boolean, default: false } }]
}, { timestamps: true });
export default mongoose.model('PersonalizedSheet', personalizedSheetSchema);
