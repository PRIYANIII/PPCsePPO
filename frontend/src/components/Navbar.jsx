import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Companies', href: '#companies' },
    { label: 'Interview Experiences', href: '#experiences' },
    { label: 'Pricing', href: '#pricing', badge: 'Coming Soon' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl"
          >
            <Rocket className="w-6 h-6 text-blue-500" />
            CareerPilot
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                {link.label}
                {link.badge && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-600/30">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
