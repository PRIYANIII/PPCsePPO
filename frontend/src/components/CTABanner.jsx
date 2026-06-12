import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="py-20 bg-white dark:bg-[#0b1120] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 dark:bg-[#131c31] rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block w-32 h-32 bg-slate-800 rounded-2xl flex-shrink-0 relative overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24 bg-blue-600/30 rounded-t-full" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-600 rounded-full" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-3 bg-slate-700 rounded" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to Start Your Placement Journey?
              </h2>
              <p className="mt-3 text-slate-400 max-w-md">
                Join 1200+ students who are already preparing smarter with
                CareerPilot&apos;s AI-powered coaching.
              </p>
            </div>
          </div>

          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shrink-0"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
