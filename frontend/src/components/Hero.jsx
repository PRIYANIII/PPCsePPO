import DashboardMockup from './DashboardMockup';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star } from 'lucide-react';

export default function Hero() {
  const avatars = ['P', 'A', 'R', 'S'];

  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#070d19] pt-24 pb-16 lg:pt-32 lg:pb-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your <span className="text-blue-500">AI</span> Placement Coach
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              Target companies like{' '}
              <span className="text-blue-400 font-medium">JP Morgan</span>,{' '}
              <span className="text-blue-400 font-medium">Oracle</span>, and{' '}
              <span className="text-blue-400 font-medium">Deloitte</span> with
              confidence.
            </p>
            <p className="mt-4 text-slate-400">
              Get personalized readiness scores, skill-gap analysis and
              preparation roadmaps tailored to your dream company.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
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
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold border-2 border-slate-950"
                  >
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
                <p className="text-sm text-slate-400 mt-1">
                  4.8/5 from 1200+ students
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full" />
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
