import mongoose from 'mongoose';

const subTopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  totalQuestions: { type: Number, default: 0 },
  easyCount: { type: Number, default: 0 },
  mediumCount: { type: Number, default: 0 },
  hardCount: { type: Number, default: 0 },
  order: { type: Number, default: 0 }
});

const dsaTopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['basics', 'arrays', 'strings', 'linked_list', 'stack_queue', 
           'recursion', 'trees', 'graphs', 'dp', 'greedy', 'bit_manipulation',
           'searching_sorting', 'hashing', 'heaps', 'tries', 'sliding_window',
           'maths', 'patterns', 'stl']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DSATopic'
  }],
  subTopics: [subTopicSchema],
  totalQuestions: { type: Number, default: 0 },
  easyCount: { type: Number, default: 0 },
  mediumCount: { type: Number, default: 0 },
  hardCount: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const DSATopic = mongoose.model('DSATopic', dsaTopicSchema);
export default DSATopic;