// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's your placement readiness overview
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Overall Readiness</p>
          <div className="relative w-28 h-28 mx-auto">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#334155" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" stroke="#2563eb" strokeWidth="2.5"
                strokeDasharray={`${user?.readinessScore || 0} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-slate-900 dark:text-white font-bold text-2xl">
              {user?.readinessScore}%
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Target Company</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {user?.targetCompany}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{user?.targetRole}</p>
          <button
            onClick={() => navigate('/companies')}
            className="mt-4 text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            View Details →
          </button>
        </div>

        <div className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:col-span-2 lg:col-span-1">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Quick Stats</p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Strong Areas</span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                {user?.strongAreas?.length || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Needs Work</span>
              <span className="text-red-600 dark:text-red-400 font-medium">
                {user?.needsImprovement?.length || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Today's Tasks</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {user?.todayTasks?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-4">Strong Areas</p>
          <div className="space-y-3">
            {user?.strongAreas?.map((area) => (
              <div key={area} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                {area}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-4">Needs Improvement</p>
          <div className="space-y-3">
            {user?.needsImprovement?.map((area) => (
              <div key={area} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <X className="w-4 h-4 text-red-500 shrink-0" />
                {area}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Today's Tasks</p>
        <div className="space-y-3">
          {user?.todayTasks?.map((task) => (
            <label key={task} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {task}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}