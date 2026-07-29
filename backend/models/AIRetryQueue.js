import mongoose from 'mongoose';
const schema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, operation: String, payload: mongoose.Schema.Types.Mixed, attempts: { type: Number, default: 3 }, error: String, status: { type: String, default: 'pending', enum: ['pending', 'retried', 'resolved'] } }, { timestamps: true });
export default mongoose.model('AIRetryQueue', schema);
