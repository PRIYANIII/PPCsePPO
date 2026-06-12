import {
  FileSearch,
  Gauge,
  Bot,
  MessageSquare,
  Target,
  Map,
} from 'lucide-react';

const features = [
  {
    icon: FileSearch,
    title: 'Resume Analysis',
    description:
      'AI-powered resume scanning to highlight strengths and gaps for your target role.',
    color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Gauge,
    title: 'Readiness Score',
    description:
      'Get a real-time placement readiness score based on skills, practice, and company fit.',
    color: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
  },
  {
    icon: Bot,
    title: 'AI Placement Coach',
    description:
      'Personalized coaching sessions powered by AI to guide your preparation journey.',
    color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
  },
  {
    icon: MessageSquare,
    title: 'Interview Experiences',
    description:
      'Browse real interview experiences from students who cracked top companies.',
    color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
  },
  {
    icon: Target,
    title: 'Skill Gap Analysis',
    description:
      'Identify exactly what skills you need to improve for your dream company.',
    color: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
  },
  {
    icon: Map,
    title: 'Roadmap Generator',
    description:
      'Get a step-by-step preparation roadmap tailored to your target company.',
    color: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400',
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300"
    >
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
            <div
              key={feature.title}
              className="bg-white dark:bg-[#131c31] rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all"
            >
              <div
                className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
