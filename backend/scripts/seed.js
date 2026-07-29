import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Company from '../models/Company.js';
import DSATopic from '../models/DSATopic.js';
import DSAQuestion from '../models/DSAQuestion.js';

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

// These are runnable starter problems. Add more through the admin panel as the
// question bank grows; topic counters are calculated from this source of truth.
const questions = [
  { topic: 'learn-the-basics', title: 'Print Hello World', slug: 'print-hello-world', difficulty: 'easy', description: 'Write a program that prints exactly `Hello World`.', examples: [{ input: '', output: 'Hello World', explanation: '' }], constraints: ['No input is provided.'], testCases: [{ input: '', expectedOutput: 'Hello World' }] },
  { topic: 'basic-maths', title: 'Sum of Two Numbers', slug: 'sum-of-two-numbers', difficulty: 'easy', description: 'Read two integers and print their sum.', examples: [{ input: '4 7', output: '11', explanation: '4 + 7 = 11.' }], constraints: ['-10^9 <= a, b <= 10^9'], testCases: [{ input: '4 7', expectedOutput: '11' }, { input: '-5 8', expectedOutput: '3' }, { input: '100 200', expectedOutput: '300', isHidden: true }] },
  { topic: 'arrays', title: 'Largest Element in an Array', slug: 'largest-element-array', difficulty: 'easy', description: 'Read n followed by n integers. Print the largest element.', examples: [{ input: '5\n2 9 1 7 4', output: '9', explanation: '9 is the greatest value.' }], constraints: ['1 <= n <= 10^5'], testCases: [{ input: '5\n2 9 1 7 4', expectedOutput: '9' }, { input: '1\n-3', expectedOutput: '-3' }, { input: '4\n10 10 2 5', expectedOutput: '10', isHidden: true }] },
  { topic: 'arrays', title: 'Second Largest Distinct Element', slug: 'second-largest-distinct', difficulty: 'medium', description: 'Read n followed by n integers. Print the second largest distinct number, or -1 when it does not exist.', examples: [{ input: '5\n4 1 9 9 3', output: '4', explanation: 'The largest distinct value is 9 and the next is 4.' }], constraints: ['1 <= n <= 10^5'], testCases: [{ input: '5\n4 1 9 9 3', expectedOutput: '4' }, { input: '3\n5 5 5', expectedOutput: '-1' }, { input: '4\n-1 -4 -2 -3', expectedOutput: '-2', isHidden: true }] },
  { topic: 'strings', title: 'Palindrome Check', slug: 'palindrome-check', difficulty: 'easy', description: 'Read one lowercase word and print `YES` if it is a palindrome; otherwise print `NO`.', examples: [{ input: 'level', output: 'YES', explanation: 'The word reads the same in reverse.' }], constraints: ['1 <= length <= 10^5'], testCases: [{ input: 'level', expectedOutput: 'YES' }, { input: 'career', expectedOutput: 'NO' }, { input: 'a', expectedOutput: 'YES', isHidden: true }] },
  { topic: 'sorting-techniques', title: 'Sort an Array', slug: 'sort-an-array', difficulty: 'easy', description: 'Read n followed by n integers and print them in non-decreasing order separated by spaces.', examples: [{ input: '5\n3 1 4 1 5', output: '1 1 3 4 5', explanation: '' }], constraints: ['1 <= n <= 10^5'], testCases: [{ input: '5\n3 1 4 1 5', expectedOutput: '1 1 3 4 5' }, { input: '3\n-1 0 -2', expectedOutput: '-2 -1 0' }] },
  { topic: 'binary-search', title: 'Binary Search', slug: 'binary-search-index', difficulty: 'easy', description: 'Read n, a sorted array of n integers, then target. Print its zero-based index or -1 if absent.', examples: [{ input: '5\n1 3 5 7 9\n7', output: '3', explanation: '' }], constraints: ['1 <= n <= 10^5'], testCases: [{ input: '5\n1 3 5 7 9\n7', expectedOutput: '3' }, { input: '4\n2 4 6 8\n5', expectedOutput: '-1' }] },
  { topic: 'linked-list', title: 'Reverse a Sequence', slug: 'reverse-a-sequence', difficulty: 'easy', description: 'Read n followed by n integers and print the values in reverse order separated by spaces.', examples: [{ input: '4\n1 2 3 4', output: '4 3 2 1', explanation: '' }], constraints: ['1 <= n <= 10^5'], testCases: [{ input: '4\n1 2 3 4', expectedOutput: '4 3 2 1' }, { input: '1\n42', expectedOutput: '42' }] },
  { topic: 'recursion', title: 'Factorial', slug: 'factorial', difficulty: 'easy', description: 'Read a non-negative integer n and print n factorial.', examples: [{ input: '5', output: '120', explanation: '5! = 5 × 4 × 3 × 2 × 1.' }], constraints: ['0 <= n <= 20'], testCases: [{ input: '5', expectedOutput: '120' }, { input: '0', expectedOutput: '1' }, { input: '10', expectedOutput: '3628800', isHidden: true }] },
  { topic: 'stack-queues', title: 'Balanced Parentheses', slug: 'balanced-parentheses', difficulty: 'medium', description: 'Read a string containing only parentheses `(` and `)`. Print `YES` when it is balanced, otherwise `NO`.', examples: [{ input: '(()())', output: 'YES', explanation: '' }], constraints: ['1 <= length <= 10^5'], testCases: [{ input: '(()())', expectedOutput: 'YES' }, { input: '(()', expectedOutput: 'NO' }, { input: ')(', expectedOutput: 'NO', isHidden: true }] },
  { topic: 'graphs', title: 'Count Connected Components', slug: 'count-connected-components', difficulty: 'medium', description: 'Read n and m, followed by m undirected edges. Print the number of connected components in vertices 1 through n.', examples: [{ input: '5 3\n1 2\n2 3\n4 5', output: '2', explanation: '' }], constraints: ['1 <= n, m <= 10^5'], testCases: [{ input: '5 3\n1 2\n2 3\n4 5', expectedOutput: '2' }, { input: '3 0', expectedOutput: '3' }] },
  { topic: 'dynamic-programming', title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'easy', description: 'You can take one or two steps. Read n and print the number of distinct ways to reach step n.', examples: [{ input: '4', output: '5', explanation: '' }], constraints: ['1 <= n <= 40'], testCases: [{ input: '4', expectedOutput: '5' }, { input: '1', expectedOutput: '1' }, { input: '10', expectedOutput: '89', isHidden: true }] }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ role: 'user' });
    await Company.deleteMany({});
    await DSATopic.deleteMany({});
    await DSAQuestion.deleteMany({});

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

    const topicIds = new Map(createdTopics.map((topic) => [topic.slug, topic._id]));
    const questionDocuments = questions.map(({ topic, ...question }) => ({
      ...question,
      topicId: topicIds.get(topic),
      companies: ['Google', 'Microsoft', 'Amazon']
    }));
    await DSAQuestion.insertMany(questionDocuments);
    for (const topic of createdTopics) {
      const topicQuestions = questionDocuments.filter((question) => question.topicId.equals(topic._id));
      topic.totalQuestions = topicQuestions.length;
      topic.easyCount = topicQuestions.filter((question) => question.difficulty === 'easy').length;
      topic.mediumCount = topicQuestions.filter((question) => question.difficulty === 'medium').length;
      topic.hardCount = topicQuestions.filter((question) => question.difficulty === 'hard').length;
      await topic.save();
    }
    console.log(`${questionDocuments.length} runnable DSA questions created`);

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
