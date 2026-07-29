import express from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import multer from 'multer';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { protect } from '../middleware/auth.js';
import Resume from '../models/Resume.js';
import Company from '../models/Company.js';
import CompanyApplication from '../models/CompanyApplication.js';
import Roadmap from '../models/Roadmap.js';
import PersonalizedSheet from '../models/PersonalizedSheet.js';
import ReadinessSnapshot from '../models/ReadinessSnapshot.js';
import UserUsage from '../models/UserUsage.js';
import AIRequestLog from '../models/AIRequestLog.js';
import AIRetryQueue from '../models/AIRetryQueue.js';
import { activeProviderName } from '../services/aiProviders.js';

const router = express.Router();
router.use(protect);
const aiContext = new AsyncLocalStorage();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, callback) => {
  callback(null, ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.mimetype));
} });

const model = () => process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const jsonSchema = (properties, required) => ({ type: 'object', properties, required });

async function askGemini(prompt, schema) {
  const date = new Date().toISOString().slice(0, 10); const month = date.slice(0, 7);
  const userId = aiContext.getStore()?.userId;
  const usage = await UserUsage.findOneAndUpdate({ userId, date }, { $setOnInsert: { month }, $inc: { requestsToday: 1, requestsThisMonth: 1 } }, { new: true, upsert: true });
  if (usage.requestsToday > Number(process.env.AI_DAILY_LIMIT || 20) || usage.requestsThisMonth > Number(process.env.AI_MONTHLY_LIMIT || 300)) { await UserUsage.updateOne({ _id: usage._id }, { $inc: { requestsToday: -1, requestsThisMonth: -1 } }); const error = new Error('AI request limit reached. Please try again later.'); error.statusCode = 429; throw error; }
  const started = Date.now(); let lastError;
  for (let attempt = 0; attempt < 3; attempt++) try {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('Gemini is not configured. Add GEMINI_API_KEY to backend/.env.');
    error.statusCode = 503;
    throw error;
  }
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model()}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.25 }
    })
  });
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload?.error?.message || 'Gemini request failed');
    error.statusCode = response.status;
    throw error;
  }
  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('');
  if (!text) throw new Error('Gemini returned no usable content.');
  const result = JSON.parse(text); await AIRequestLog.create({ userId, promptLength: prompt.length, responseTime: Date.now() - started, provider: activeProviderName(), success: true }); return result;
  } catch (error) { lastError = error; if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 500 * (2 ** attempt))); }
  await AIRequestLog.create({ userId, promptLength: prompt.length, responseTime: Date.now() - started, provider: activeProviderName(), success: false, failureReason: lastError.message }); await AIRetryQueue.create({ userId, operation: 'gemini', payload: { promptLength: prompt.length }, error: lastError.message }); throw lastError;
}

router.use((req, res, next) => aiContext.run({ userId: req.user._id }, next));

const userContext = (user) => JSON.stringify({
  name: user.name, college: user.college, branch: user.branch, graduationYear: user.graduationYear,
  targetRole: user.targetRole, platformStats: user.platformStats, dsaProgress: user.dsaProgress,
  companyReadiness: user.companyReadiness
});

router.post('/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Upload a PDF, DOCX, or TXT resume (max 5 MB).' });
    let resumeText;
    if (req.file.mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: req.file.buffer });
      const result = await parser.getText();
      await parser.destroy();
      resumeText = result.text;
    } else if (req.file.mimetype.includes('wordprocessingml')) {
      resumeText = (await mammoth.extractRawText({ buffer: req.file.buffer })).value;
    } else resumeText = req.file.buffer.toString('utf8');
    if (resumeText.trim().length < 50) return res.status(400).json({ message: 'The uploaded resume did not contain enough readable text.' });
    res.json({ resumeText: resumeText.trim().slice(0, 100000), fileName: req.file.originalname });
  } catch (error) { res.status(400).json({ message: `Could not read this resume: ${error.message}` }); }
});

router.post('/resume/analyze', async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (typeof resumeText !== 'string' || resumeText.trim().length < 50 || resumeText.length > 100000) {
      return res.status(400).json({ message: 'Resume extraction produced invalid text.' });
    }
    const analysis = await askGemini(`You are a careful placement resume analyst. Analyze the resume below. Never invent facts. Give concise, actionable feedback for an Indian software-placement student.\n\nPROFILE:\n${userContext(req.user)}\n\nRESUME:\n${resumeText}`, jsonSchema({
      summary: { type: 'string' }, skills: { type: 'array', items: { type: 'string' } },
      projects: { type: 'array', items: jsonSchema({ name: { type: 'string' }, highlights: { type: 'array', items: { type: 'string' } } }, ['name', 'highlights']) },
      experience: { type: 'array', items: jsonSchema({ role: { type: 'string' }, organization: { type: 'string' }, highlights: { type: 'array', items: { type: 'string' } } }, ['role', 'organization', 'highlights']) },
      strengths: { type: 'array', items: { type: 'string' } }, gaps: { type: 'array', items: { type: 'string' } }, suggestions: { type: 'array', items: { type: 'string' } }, atsScore: { type: 'integer' }
    }, ['summary', 'skills', 'projects', 'experience', 'strengths', 'gaps', 'suggestions', 'atsScore']));
    const resume = await Resume.findOneAndUpdate({ userId: req.user._id }, { analysis }, { new: true, upsert: true, runValidators: true });
    res.json(resume);
  } catch (error) { res.status(error.statusCode || 500).json({ message: error.message }); }
});

router.post('/readiness/:companyId', async (req, res) => {
  try {
    const [company, resume] = await Promise.all([Company.findById(req.params.companyId), Resume.findOne({ userId: req.user._id })]);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    const readinessData = await askGemini(`Assess placement readiness using only the supplied student information. Be honest and specific. Company: ${JSON.stringify(company.toObject())}. Student profile: ${userContext(req.user)}. Resume analysis: ${JSON.stringify(resume?.analysis || null)}.`, jsonSchema({
      overallScore: { type: 'integer' }, dsaScore: { type: 'integer' }, csFundamentalsScore: { type: 'integer' }, aptitudeScore: { type: 'integer' }, summary: { type: 'string' }, topicsToFocus: { type: 'array', items: jsonSchema({ topic: { type: 'string' }, priority: { type: 'string', enum: ['high', 'medium', 'low'] }, estimatedHours: { type: 'integer' } }, ['topic', 'priority', 'estimatedHours']) }
    }, ['overallScore', 'dsaScore', 'csFundamentalsScore', 'aptitudeScore', 'summary', 'topicsToFocus']));
    const existing = req.user.companyReadiness.find((item) => item.companyId?.toString() === company.id);
    if (existing) Object.assign(existing, readinessData, { companyName: company.name, lastUpdated: new Date() });
    else req.user.companyReadiness.push({ companyId: company._id, companyName: company.name, ...readinessData });
    await req.user.save();
    await ReadinessSnapshot.create({ userId: req.user._id, companyId: company._id, companyName: company.name, score: readinessData.overallScore, strengths: readinessData.topicsToFocus?.filter((item) => item.priority === 'low').map((item) => item.topic), weaknesses: readinessData.topicsToFocus?.filter((item) => item.priority !== 'low').map((item) => item.topic), recommendations: readinessData.topicsToFocus?.map((item) => `Practice ${item.topic} (${item.estimatedHours}h)`) });
    res.json(readinessData);
  } catch (error) { res.status(error.statusCode || 500).json({ message: error.message }); }
});
router.get('/readiness/history', async (req, res) => {
  const filter = { userId: req.user._id }; if (req.query.companyId) filter.companyId = req.query.companyId;
  res.json(await ReadinessSnapshot.find(filter).sort({ createdAt: 1 }).limit(500));
});

router.post('/coach', async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    const result = await askGemini(`You are CareerPilot's encouraging, practical placement coach. Based only on this student data, give the next 3 highest-impact actions and a short motivational note. Student: ${userContext(req.user)}. Resume: ${JSON.stringify(resume?.analysis || null)}.`, jsonSchema({ actions: { type: 'array', items: jsonSchema({ title: { type: 'string' }, reason: { type: 'string' }, estimatedMinutes: { type: 'integer' } }, ['title', 'reason', 'estimatedMinutes']) }, note: { type: 'string' } }, ['actions', 'note']));
    res.json(result);
  } catch (error) { res.status(error.statusCode || 500).json({ message: error.message }); }
});

router.post('/roadmap', async (req, res) => {
  try {
    const weeks = Math.min(Math.max(Number(req.body.weeks) || 4, 1), 12);
    const resume = await Resume.findOne({ userId: req.user._id });
    const result = await askGemini(`Create a ${weeks}-week placement preparation roadmap. It must be achievable around college hours, personalized to the student data, and balance DSA, CS fundamentals, projects/resume, and interview practice. Student: ${userContext(req.user)}. Resume: ${JSON.stringify(resume?.analysis || null)}.`, jsonSchema({ overview: { type: 'string' }, weeks: { type: 'array', items: jsonSchema({ week: { type: 'integer' }, focus: { type: 'string' }, goals: { type: 'array', items: { type: 'string' } }, hours: { type: 'integer' } }, ['week', 'focus', 'goals', 'hours']) } }, ['overview', 'weeks']));
    const roadmap = await Roadmap.findOneAndUpdate({ userId: req.user._id }, { userId: req.user._id, overview: result.overview, weeks: result.weeks.map((week) => ({ ...week, tasks: week.goals.map((title) => ({ title })) })) }, { new: true, upsert: true });
    res.json(roadmap);
  } catch (error) { res.status(error.statusCode || 500).json({ message: error.message }); }
});

router.get('/roadmap', async (req, res) => res.json(await Roadmap.findOne({ userId: req.user._id })));
router.patch('/roadmap/tasks/:taskId', async (req, res) => {
  const roadmap = await Roadmap.findOne({ userId: req.user._id });
  const task = roadmap?.weeks.flatMap((week) => week.tasks).find((item) => item._id.toString() === req.params.taskId);
  if (!task) return res.status(404).json({ message: 'Roadmap task not found.' });
  task.completed = Boolean(req.body.completed); await roadmap.save(); res.json(roadmap);
});

router.get('/applications', async (req, res) => res.json(await CompanyApplication.find({ userId: req.user._id }).sort({ updatedAt: -1 })));
router.post('/applications/:companyId/analyze', async (req, res) => {
  try {
    const { role, jobDescription } = req.body;
    const company = await Company.findById(req.params.companyId);
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!company) return res.status(404).json({ message: 'Company not found.' });
    if (!resume?.analysis) return res.status(400).json({ message: 'Upload and analyze your resume before creating a company ATS report.' });
    if (!role?.trim() || !jobDescription?.trim()) return res.status(400).json({ message: 'Role and job description are required.' });
    const analysis = await askGemini(`Compare this student's verified resume analysis against this job description. Give a realistic ATS match score; do not invent skills. Resume: ${JSON.stringify(resume.analysis)}. Company: ${company.name}. Role: ${role}. Job description: ${jobDescription}`, jsonSchema({ atsScore: { type: 'integer' }, matchedSkills: { type: 'array', items: { type: 'string' } }, missingSkills: { type: 'array', items: { type: 'string' } }, summary: { type: 'string' }, recommendations: { type: 'array', items: { type: 'string' } } }, ['atsScore', 'matchedSkills', 'missingSkills', 'summary', 'recommendations']));
    const application = await CompanyApplication.create({ userId: req.user._id, companyId: company._id, companyName: company.name, role: role.trim(), jobDescription: jobDescription.trim(), requirements: analysis.missingSkills, analysis });
    res.status(201).json(application);
  } catch (error) { res.status(error.statusCode || 500).json({ message: error.message }); }
});

router.post('/experiences/:companyId/summary', async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId).select('name interviewExperiences');
    if (!company) return res.status(404).json({ message: 'Company not found' });
    const experiences = company.interviewExperiences.slice(-100);
    const result = await askGemini(`Summarize these ${company.name} interview experiences. Identify most asked topics, observed difficulty, round pattern, and practical preparation advice. Do not claim statistical certainty for limited data. Experiences: ${JSON.stringify(experiences)}`, jsonSchema({ mostAskedTopics: { type: 'array', items: { type: 'string' } }, difficulty: { type: 'string' }, roundPattern: { type: 'array', items: { type: 'string' } }, advice: { type: 'array', items: { type: 'string' } } }, ['mostAskedTopics', 'difficulty', 'roundPattern', 'advice']));
    res.json(result);
  } catch (error) { res.status(error.statusCode || 500).json({ message: error.message }); }
});

router.get('/sheet', async (req, res) => res.json(await PersonalizedSheet.findOne({ userId: req.user._id }).sort({ updatedAt: -1 })));
router.post('/sheet', async (req, res) => {
  try {
    const style = ['foundation', 'interview', 'company'].includes(req.body.style) ? req.body.style : 'interview';
    const result = await askGemini(`Create an original personalized placement preparation sheet. Do not copy any third-party question sheet. Use this student's profile: ${userContext(req.user)}. Style: ${style}. Return a practical 30-day sequence of topics/objectives, balancing DSA and company readiness.`, jsonSchema({ title: { type: 'string' }, rationale: { type: 'string' }, items: { type: 'array', items: jsonSchema({ topic: { type: 'string' }, difficulty: { type: 'string' }, objective: { type: 'string' }, days: { type: 'integer' } }, ['topic', 'difficulty', 'objective', 'days']) } }, ['title', 'rationale', 'items']));
    res.json(await PersonalizedSheet.findOneAndUpdate({ userId: req.user._id }, { userId: req.user._id, style, ...result }, { new: true, upsert: true }));
  } catch (error) { res.status(error.statusCode || 500).json({ message: error.message }); }
});
router.patch('/sheet/items/:itemId', async (req, res) => {
  const sheet = await PersonalizedSheet.findOne({ userId: req.user._id });
  const item = sheet?.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Sheet item not found.' });
  item.completed = Boolean(req.body.completed); await sheet.save(); res.json(sheet);
});

export default router;
