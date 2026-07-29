import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Rocket,
  LayoutDashboard,
  User,
  Building2,
  BookOpen,
  FileText,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: FileText, label: 'Resume', path: '/resume' },
    { icon: BookOpen, label: 'DSA Practice', path: '/dsa' },
    { icon: Building2, label: 'Companies', path: '/companies' },
    { icon: Sparkles, label: 'AI Coach', path: '/coach' },
    { icon: BookOpen, label: 'My Sheet', path: '/sheet' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b1120] flex transition-colors duration-300">
      {/* ---------- SIDEBAR ---------- */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#131c31] border-r border-slate-200 dark:border-slate-800 p-4 fixed top-0 left-0 h-full z-40">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg mb-8 px-2"
        >
          <Rocket className="w-6 h-6 text-blue-500" />
          CareerPilot
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header (only shows on small screens) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
          <Rocket className="w-5 h-5 text-blue-500" />
          CareerPilot
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 dark:text-red-400 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 p-0">
        <div className="p-0 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] py-0">
          {children}
        </div>
      </main>
    </div>
  );
}
