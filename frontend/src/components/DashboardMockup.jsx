import {
  LayoutDashboard,
  User,
  Building2,
  Map,
  MessageSquare,
  Bot,
  FileText,
  Settings,
  LogOut,
  Check,
  X,
} from 'lucide-react';

export default function DashboardMockup() {
  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: User, label: 'Profile' },
    { icon: Building2, label: 'Companies' },
    { icon: Map, label: 'Roadmap' },
    { icon: MessageSquare, label: 'Experiences' },
    { icon: Bot, label: 'AI Coach' },
    { icon: FileText, label: 'Resume' },
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Logout' },
  ];

  const strongAreas = ['React.js', 'Node.js', 'JavaScript'];
  const needsImprovement = ['DBMS', 'Docker', 'Operating Systems'];
  const tasks = [
    'Solve 5 SQL Questions',
    'Revise OS concepts',
    'Practice 2 DSA problems',
  ];

  return (
    <div className="relative bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
      <div className="flex">
        <div className="hidden sm:flex flex-col gap-1 p-3 bg-slate-950 border-r border-slate-800 w-14">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg ${
                item.active ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500'
              }`}
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </div>
          ))}
        </div>

        <div className="flex-1 p-4 sm:p-5 min-w-0">
          <p className="text-white font-semibold text-sm sm:text-base">
            Good Evening, Priyani 👋
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Overall Readiness</p>
              <div className="relative w-16 h-16 mx-auto">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeDasharray="74 100"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                  74%
                </span>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Target Company</p>
              <p className="text-white font-semibold text-xs sm:text-sm">
                JP Morgan
              </p>
              <p className="text-slate-400 text-xs">Software Engineer</p>
              <button className="text-blue-400 text-xs mt-2 hover:underline">
                View Details →
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
              <p className="text-xs text-green-400 font-medium mb-2">
                Strong Areas
              </p>
              {strongAreas.map((area) => (
                <div key={area} className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                  <Check className="w-3 h-3 text-green-500" />
                  {area}
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
              <p className="text-xs text-red-400 font-medium mb-2">
                Needs Improvement
              </p>
              {needsImprovement.map((area) => (
                <div key={area} className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                  <X className="w-3 h-3 text-red-500" />
                  {area}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <p className="text-xs text-slate-400 font-medium mb-2">
              Today&apos;s Tasks
            </p>
            {tasks.map((task) => (
              <label
                key={task}
                className="flex items-center gap-2 text-xs text-slate-300 mb-1.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="rounded border-slate-600 bg-slate-700 text-blue-600"
                  readOnly
                />
                {task}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
