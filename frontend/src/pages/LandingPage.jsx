import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Play, 
  Star,
  Upload, 
  UserPlus, 
  LineChart, 
  List, 
  Trophy,
  FileSearch,
  Gauge,
  Bot,
  MessageSquare,
  Target,
  Map,
  Check,
  X,
  Rocket,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Send
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingPage() {
  // Sample data
  const avatars = ['P', 'A', 'R', 'S'];
  
  const steps = [
    { number: 1, icon: Upload, title: 'Upload Resume', description: 'Upload your resume for AI-powered analysis' },
    { number: 2, icon: UserPlus, title: 'Add Skills & LeetCode', description: 'Connect your skills and coding profiles' },
    { number: 3, icon: LineChart, title: 'Get Readiness Score', description: 'See your placement readiness instantly' },
    { number: 4, icon: List, title: 'Follow AI Roadmap', description: 'Get a personalized preparation plan' },
    { number: 5, icon: Trophy, title: 'Crack Placements', description: 'Land your dream job with confidence' },
  ];

  const features = [
    { icon: FileSearch, title: 'Resume Analysis', description: 'AI-powered resume scanning to highlight strengths and gaps for your target role.', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' },
    { icon: Gauge, title: 'Readiness Score', description: 'Get a real-time placement readiness score based on skills, practice, and company fit.', color: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' },
    { icon: Bot, title: 'AI Placement Coach', description: 'Personalized coaching sessions powered by AI to guide your preparation journey.', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' },
    { icon: MessageSquare, title: 'Interview Experiences', description: 'Browse real interview experiences from students who cracked top companies.', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400' },
    { icon: Target, title: 'Skill Gap Analysis', description: 'Identify exactly what skills you need to improve for your dream company.', color: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' },
    { icon: Map, title: 'Roadmap Generator', description: 'Get a step-by-step preparation roadmap tailored to your target company.', color: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400' },
  ];

  const companies = [
    { name: 'JP Morgan', score: 74, color: 'bg-green-500', letter: 'J' },
    { name: 'Oracle', score: 68, color: 'bg-red-500', letter: 'O' },
    { name: 'Deloitte', score: 82, color: 'bg-teal-500', letter: 'D' },
    { name: 'Barclays', score: 61, color: 'bg-blue-500', letter: 'B' },
    { name: 'Accenture', score: 77, color: 'bg-purple-500', letter: 'A' },
  ];

  const experiences = [
    { company: 'JP Morgan', letter: 'J', color: 'bg-blue-600', rounds: ['OA Round', 'Technical Round', 'HR Round'], topics: ['Arrays', 'SQL', 'System Design'], result: 'Selected' },
    { company: 'Deloitte', letter: 'D', color: 'bg-green-600', rounds: ['Aptitude', 'Technical', 'Managerial'], topics: ['Java', 'DBMS', 'OOP'], result: 'Selected' },
    { company: 'Oracle', letter: 'O', color: 'bg-red-600', rounds: ['Online Test', 'Technical', 'HR'], topics: ['DSA', 'OS', 'Networks'], result: 'Selected' },
  ];

  const strongAreas = ['React.js', 'Node.js', 'JavaScript'];
  const needsImprovement = ['DBMS', 'Docker', 'Operating Systems'];
  const tasks = ['Solve 5 SQL Questions', 'Revise OS concepts', 'Practice 2 DSA problems'];
  const productLinks = ['Features', 'Companies', 'AI Coach', 'Roadmap'];
  const resourceLinks = ['Interview Experiences', 'Blog', 'Guides', 'FAQs'];
  const companyLinks = ['About Us', 'Contact Us', 'Privacy Policy', 'Terms of Service'];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] transition-colors duration-300">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl">
              <Rocket className="w-6 h-6 text-blue-500" />
              CareerPilot
            </a>
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Companies', 'Experiences'].map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">
                  {link}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#070d19] pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your <span className="text-blue-500">AI</span> Placement Coach
              </h1>
              <p className="mt-6 text-lg text-slate-300">
                Target companies like <span className="text-blue-400 font-medium">JP Morgan</span>,{' '}
                <span className="text-blue-400 font-medium">Oracle</span>, and{' '}
                <span className="text-blue-400 font-medium">Deloitte</span> with confidence.
              </p>
              <p className="mt-4 text-slate-400">
                Get personalized readiness scores, skill-gap analysis and preparation roadmaps tailored to your dream company.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                  <Play className="w-4 h-4 fill-white" />
                  Watch Demo
                </button>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {avatars.map((letter, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold border-2 border-slate-950">
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">4.8/5 from 1200+ students</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full" />
              <div className="relative bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                <div className="p-5">
                  <p className="text-white font-semibold">Good Evening, Priyani 👋</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                      <p className="text-xs text-slate-400 mb-2">Overall Readiness</p>
                      <div className="text-center">
                        <span className="text-white font-bold text-2xl">74%</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">Target Company</p>
                      <p className="text-white font-semibold text-sm">JP Morgan</p>
                      <p className="text-slate-400 text-xs">Software Engineer</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                      <p className="text-xs text-green-400 font-medium mb-2">Strong Areas</p>
                      {strongAreas.map((area) => (
                        <div key={area} className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                          <Check className="w-3 h-3 text-green-500" />{area}
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                      <p className="text-xs text-red-400 font-medium mb-2">Needs Improvement</p>
                      {needsImprovement.map((area) => (
                        <div key={area} className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                          <X className="w-3 h-3 text-red-500" />{area}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                    <p className="text-xs text-slate-400 font-medium mb-2">Today's Tasks</p>
                    {tasks.map((task) => (
                      <label key={task} className="flex items-center gap-2 text-xs text-slate-300 mb-1.5">
                        <input type="checkbox" className="rounded" readOnly />{task}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Features that make you placement ready
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to crack your dream company, all in one platform.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white dark:bg-[#131c31] rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-white dark:bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center">How It Works</h2>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-slate-200 dark:bg-slate-700" />
                )}
                <div className="relative inline-flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 dark:bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DATA SECTION (Companies + Experiences) ===== */}
      <section id="companies" className="py-20 bg-slate-50 dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Companies */}
            <div className="bg-white dark:bg-[#131c31] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Track Readiness Across Companies</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Monitor your placement readiness for each target company</p>
              <div className="mt-6 space-y-5">
                {companies.map((company) => (
                  <div key={company.name} className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${company.color} rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {company.letter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{company.name}</span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{company.score}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${company.color} rounded-full`} style={{ width: `${company.score}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experiences */}
            <div id="experiences" className="bg-white dark:bg-[#131c31] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Real Interview Experiences</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Learn from students who cracked top companies</p>
              <div className="mt-6 space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.company} className="border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-600/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${exp.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                        {exp.letter}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{exp.company}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{exp.rounds.join(' · ')}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {exp.topics.map((topic) => (
                        <span key={topic} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">
                          {topic}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">
                        Result: {exp.result}
                      </span>
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Read More →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-white dark:bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 dark:bg-[#131c31] rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 border border-slate-200 dark:border-slate-700/60">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to Start Your Placement Journey?</h2>
              <p className="mt-3 text-slate-400 max-w-md">Join 1200+ students who are already preparing smarter with CareerPilot's AI-powered coaching.</p>
            </div>
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shrink-0">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-900 dark:bg-[#070d19] text-slate-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-1">
              <a href="#" className="flex items-center gap-2 text-white font-bold text-xl">
                <Rocket className="w-6 h-6 text-blue-500" />
                CareerPilot
              </a>
              <p className="mt-4 text-sm leading-relaxed">Your AI-powered placement coach. Get ready for your dream company with personalized roadmaps and insights.</p>
              <div className="mt-6 flex gap-4">
                {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                  <a key={i} href="#" className="text-slate-500 hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
              <p className="text-sm mb-4">Subscribe to our newsletter for placement tips and updates.</p>
              <div className="flex">
                <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2.5 bg-slate-800 dark:bg-[#0b1120] border border-slate-700 rounded-l-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                <button className="px-4 py-2.5 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
            © 2025 CareerPilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}