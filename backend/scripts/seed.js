import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Company from '../models/Company.js';
import DSATopic from '../models/DSATopic.js';

dotenv.config();

const topics = [
  {
    name: 'Learn the basics',
    slug: 'learn-the-basics',
    category: 'basics',
    difficulty: 'beginner',
    order: 1,
    subTopics: [
      { name: 'Things to Know in C++/Java/Python or any language', slug: 'language-basics', totalQuestions: 9, easyCount: 9 },
      { name: 'Build-up Logical Thinking', slug: 'logical-thinking', totalQuestions: 2, easyCount: 2 },
      { name: 'Patterns', slug: 'patterns', totalQuestions: 22, easyCount: 22 }
    ],
    totalQuestions: 54,
    easyCount: 54
  },
  {
    name: 'Learn STL/Java-Collections',
    slug: 'stl-collections',
    category: 'stl',
    difficulty: 'beginner',
    order: 2,
    subTopics: [
      { name: 'Learn STL/Java-Collections', slug: 'stl-basics', totalQuestions: 2, easyCount: 2 }
    ],
    totalQuestions: 2,
    easyCount: 2
  },
  {
    name: 'Know Basic Maths',
    slug: 'basic-maths',
    category: 'maths',
    difficulty: 'beginner',
    order: 3,
    subTopics: [],
    totalQuestions: 7,
    easyCount: 7
  },
  {
    name: 'Learn Basic Recursion',
    slug: 'basic-recursion',
    category: 'recursion',
    difficulty: 'beginner',
    order: 4,
    subTopics: [],
    totalQuestions: 9,
    easyCount: 9
  },
  {
    name: 'Learn Basic Hashing',
    slug: 'basic-hashing',
    category: 'hashing',
    difficulty: 'beginner',
    order: 5,
    subTopics: [],
    totalQuestions: 3,
    easyCount: 3
  },
  {
    name: 'Learn Important Sorting Techniques',
    slug: 'sorting-techniques',
    category: 'searching_sorting',
    difficulty: 'intermediate',
    order: 6,
    subTopics: [
      { name: 'Sorting-I', slug: 'sorting-1', totalQuestions: 3, easyCount: 2, mediumCount: 1 },
      { name: 'Sorting-II', slug: 'sorting-2', totalQuestions: 4, easyCount: 1, mediumCount: 3 }
    ],
    totalQuestions: 7,
    easyCount: 3,
    mediumCount: 4
  },
  {
    name: 'Solve Problems on Arrays [Easy -> Medium -> Hard]',
    slug: 'arrays',
    category: 'arrays',
    difficulty: 'intermediate',
    order: 7,
    subTopics: [],
    totalQuestions: 40,
    easyCount: 15,
    mediumCount: 20,
    hardCount: 5
  },
  {
    name: 'Binary Search [1D, 2D Arrays, Search Space]',
    slug: 'binary-search',
    category: 'searching_sorting',
    difficulty: 'intermediate',
    order: 8,
    subTopics: [],
    totalQuestions: 32,
    easyCount: 8,
    mediumCount: 18,
    hardCount: 6
  },
  {
    name: 'Strings [Basic and Medium]',
    slug: 'strings',
    category: 'strings',
    difficulty: 'intermediate',
    order: 9,
    subTopics: [],
    totalQuestions: 15,
    easyCount: 5,
    mediumCount: 10
  },
  {
    name: 'Learn LinkedList [Single LL, Double LL, Medium, Hard Problems]',
    slug: 'linked-list',
    category: 'linked_list',
    difficulty: 'intermediate',
    order: 10,
    subTopics: [],
    totalQuestions: 31,
    easyCount: 8,
    mediumCount: 15,
    hardCount: 8
  },
  {
    name: 'Recursion [PatternWise]',
    slug: 'recursion',
    category: 'recursion',
    difficulty: 'intermediate',
    order: 11,
    subTopics: [],
    totalQuestions: 25,
    easyCount: 5,
    mediumCount: 15,
    hardCount: 5
  },
  {
    name: 'Bit Manipulation [Concepts & Problems]',
    slug: 'bit-manipulation',
    category: 'bit_manipulation',
    difficulty: 'intermediate',
    order: 12,
    subTopics: [],
    totalQuestions: 18,
    easyCount: 6,
    mediumCount: 10,
    hardCount: 2
  },
  {
    name: 'Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implementation]',
    slug: 'stack-queues',
    category: 'stack_queue',
    difficulty: 'intermediate',
    order: 13,
    subTopics: [],
    totalQuestions: 30,
    easyCount: 5,
    mediumCount: 15,
    hardCount: 10
  },
  {
    name: 'Sliding Window & Two Pointer Combined Problems',
    slug: 'sliding-window',
    category: 'sliding_window',
    difficulty: 'intermediate',
    order: 14,
    subTopics: [],
    totalQuestions: 12,
    easyCount: 2,
    mediumCount: 8,
    hardCount: 2
  },
  {
    name: 'Heaps [Learning, Medium, Hard Problems]',
    slug: 'heaps',
    category: 'heaps',
    difficulty: 'intermediate',
    order: 15,
    subTopics: [],
    totalQuestions: 17,
    easyCount: 3,
    mediumCount: 10,
    hardCount: 4
  },
  {
    name: 'Greedy Algorithms [Easy, Medium/Hard]',
    slug: 'greedy',
    category: 'greedy',
    difficulty: 'intermediate',
    order: 16,
    subTopics: [],
    totalQuestions: 15,
    easyCount: 5,
    mediumCount: 8,
    hardCount: 2
  },
  {
    name: 'Binary Trees [Traversals, Medium and Hard Problems]',
    slug: 'binary-trees',
    category: 'trees',
    difficulty: 'advanced',
    order: 17,
    subTopics: [],
    totalQuestions: 38,
    easyCount: 8,
    mediumCount: 20,
    hardCount: 10
  },
  {
    name: 'Binary Search Trees [Concept and Problems]',
    slug: 'binary-search-trees',
    category: 'trees',
    difficulty: 'advanced',
    order: 18,
    subTopics: [],
    totalQuestions: 16,
    easyCount: 3,
    mediumCount: 8,
    hardCount: 5
  },
  {
    name: 'Graphs [Concepts & Problems]',
    slug: 'graphs',
    category: 'graphs',
    difficulty: 'advanced',
    order: 19,
    subTopics: [],
    totalQuestions: 53,
    easyCount: 5,
    mediumCount: 28,
    hardCount: 20
  },
  {
    name: 'Dynamic Programming [Patterns and Problems]',
    slug: 'dynamic-programming',
    category: 'dp',
    difficulty: 'advanced',
    order: 20,
    subTopics: [],
    totalQuestions: 55,
    easyCount: 5,
    mediumCount: 30,
    hardCount: 20
  },
  {
    name: 'Tries',
    slug: 'tries',
    category: 'tries',
    difficulty: 'advanced',
    order: 21,
    subTopics: [],
    totalQuestions: 7,
    easyCount: 1,
    mediumCount: 4,
    hardCount: 2
  }
];

const companies = [
  {
    name: 'Google',
    description: 'Google LLC is an American multinational technology company focusing on AI, online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, and consumer electronics.',
    averagePackage: '30 LPA',
    highestPackage: '1 Cr+',
    recruitmentProcess: {
      rounds: [
        { name: 'Online Assessment', type: 'coding', description: 'Two coding problems in 60 minutes' },
        { name: 'Technical Interview 1', type: 'technical', description: 'DSA and problem solving' },
        { name: 'Technical Interview 2', type: 'technical', description: 'System design and CS fundamentals' },
        { name: 'Googleyness Interview', type: 'hr', description: 'Leadership and behavioral questions' }
      ],
      totalRounds: 4
    },
    skillWeights: { dsa: 50, csFundamentals: 25, aptitude: 10, communication: 10, projects: 5 }
  },
  {
    name: 'Microsoft',
    description: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, personal computers, and related services.',
    averagePackage: '25 LPA',
    highestPackage: '80 LPA',
    recruitmentProcess: {
      rounds: [
        { name: 'Online Assessment', type: 'coding', description: 'Coding and MCQ round' },
        { name: 'Technical Interview 1', type: 'technical', description: 'Coding and DSA' },
        { name: 'Technical Interview 2', type: 'technical', description: 'System design' },
        { name: 'AA Interview', type: 'hr', description: 'As Appropriate interview' }
      ],
      totalRounds: 4
    },
    skillWeights: { dsa: 45, csFundamentals: 30, aptitude: 10, communication: 10, projects: 5 }
  },
  {
    name: 'Amazon',
    description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    averagePackage: '20 LPA',
    highestPackage: '70 LPA',
    recruitmentProcess: {
      rounds: [
        { name: 'Online Assessment', type: 'coding', description: 'Coding and work style assessment' },
        { name: 'Technical Interview 1', type: 'technical', description: 'DSA and problem solving' },
        { name: 'Technical Interview 2', type: 'technical', description: 'Technical + Leadership principles' },
        { name: 'Bar Raiser', type: 'technical', description: 'Final round with experienced interviewer' }
      ],
      totalRounds: 4
    },
    skillWeights: { dsa: 40, csFundamentals: 25, aptitude: 15, communication: 10, projects: 10 }
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ role: 'user' });
    await Company.deleteMany({});
    await DSATopic.deleteMany({});

    // Create admin user
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });
      console.log('Admin user created');
    }

    // Create DSA Topics
    const createdTopics = await DSATopic.insertMany(topics);
    console.log(`${createdTopics.length} DSA topics created`);

    // Create Companies
    const createdCompanies = await Company.insertMany(companies);
    console.log(`${createdCompanies.length} companies created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();