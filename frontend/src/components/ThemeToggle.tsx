import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <SunIcon 
          className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300 transform ${
            isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
          }`}
        />
        
        {/* Moon Icon */}
        <MoonIcon 
          className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 transform ${
            isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
          }`}
        />
      </div>
      
      {/* Tooltip */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {isDark ? 'Light mode' : 'Dark mode'}
      </div>
    </button>
  );
};
