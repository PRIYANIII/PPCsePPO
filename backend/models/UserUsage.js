import mongoose from 'mongoose';
const userUsageSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, date: { type: String, required: true }, month: { type: String, required: true }, requestsToday: { type: Number, default: 0 }, requestsThisMonth: { type: Number, default: 0 } }, { timestamps: true });
userUsageSchema.index({ userId: 1, date: 1 }, { unique: true });
export default mongoose.model('UserUsage', userUsageSchema);
