import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    readinessScore: {
      type: Number,
      default: 74,
    },
    targetCompany: {
      type: String,
      default: 'JP Morgan',
    },
    targetRole: {
      type: String,
      default: 'Software Engineer',
    },
    strongAreas: {
      type: [String],
      default: ['React.js', 'Node.js', 'JavaScript'],
    },
    needsImprovement: {
      type: [String],
      default: ['DBMS', 'Docker', 'Operating Systems'],
    },
    todayTasks: {
      type: [String],
      default: [
        'Solve 5 SQL Questions',
        'Revise OS concepts',
        'Practice 2 DSA problems',
      ],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
