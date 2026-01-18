// aurachain-ui/src/components/Shared/ThemeToggle.tsx
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all duration-300 relative overflow-hidden group bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
      aria-label="Toggle Theme"
    >
      <div className="relative z-10">
        {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
      </div>
    </button>
  );
};

export default ThemeToggle;