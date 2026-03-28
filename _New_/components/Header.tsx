import React from 'react';
import { Sun, Moon, Info } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  onAboutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme, onAboutClick }) => {
  return (
    <header className="w-full py-8 px-4 flex flex-col items-center justify-center text-center relative z-20">
      
      <div className="absolute top-8 right-8 flex gap-3">
        <button 
          onClick={onAboutClick}
          className="p-3 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 hover:bg-white/40 dark:hover:bg-black/40 transition-all shadow-sm group"
          title="About ArborZen"
        >
          <Info className="text-nature-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" size={20} />
        </button>

        <button 
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 hover:bg-white/40 dark:hover:bg-black/40 transition-all shadow-sm group"
          title="Toggle Theme"
        >
          {darkMode ? (
            <Sun className="text-amber-400 group-hover:rotate-45 transition-transform" size={20} />
          ) : (
            <Moon className="text-nature-600 dark:text-indigo-300 group-hover:-rotate-12 transition-transform" size={20} />
          )}
        </button>
      </div>

      <div className="animate-slide-up cursor-default group">
        <div className="text-center relative">
             {/* Glow Effect */}
            <div className="absolute inset-0 bg-emerald-400 dark:bg-emerald-600 blur-3xl opacity-20 rounded-full scale-150 group-hover:scale-175 transition-transform duration-1000"></div>
            
            <h1 className="relative text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-nature-900 via-emerald-600 to-teal-500 dark:from-nature-100 dark:via-emerald-400 dark:to-teal-300 drop-shadow-sm select-none transition-all duration-500">
              ArborZen AI
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-nature-500 dark:text-nature-400 font-bold mt-2 animate-pulse-slow">
                Hyper-Nature Intelligence
            </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
