import { Upload, UserPlus, LineChart, List, Trophy } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Upload,
    title: 'Upload Resume',
    description: 'Upload your resume for AI-powered analysis',
  },
  {
    number: 2,
    icon: UserPlus,
    title: 'Add Skills & LeetCode',
    description: 'Connect your skills and coding profiles',
  },
  {
    number: 3,
    icon: LineChart,
    title: 'Get Readiness Score',
    description: 'See your placement readiness instantly',
  },
  {
    number: 4,
    icon: List,
    title: 'Follow AI Roadmap',
    description: 'Get a personalized preparation plan',
  },
  {
    number: 5,
    icon: Trophy,
    title: 'Crack Placements',
    description: 'Land your dream job with confidence',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white dark:bg-[#0b1120] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center">
          How It Works
        </h2>

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
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
