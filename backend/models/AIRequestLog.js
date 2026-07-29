import mongoose from 'mongoose';
const schema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, promptLength: Number, responseTime: Number, provider: String, success: Boolean, failureReason: String }, { timestamps: true });
export default mongoose.model('AIRequestLog', schema);
