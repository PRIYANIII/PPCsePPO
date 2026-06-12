import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2 rounded-lg border transition-colors ${
        isDark
          ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
          : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      } ${className}`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
