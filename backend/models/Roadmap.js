import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    overview: String,
    weeks: [
      {
        week: Number,
        focus: String,
        hours: Number,
        tasks: [
          {
            title: String,
            completed: {
              type: Boolean,
              default: false,
            },
          },
        ],
        goals: [String],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Roadmap', roadmapSchema);