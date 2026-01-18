import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, actualTheme, setTheme } = useTheme();

  const handleThemeChange = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={16} className="text-yellow-500" />;
      case 'dark':
        return <Moon size={16} className="text-punk-gold" />;
      default:
        return <Moon size={16} className="text-punk-gold" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Modo Claro';
      case 'dark':
        return 'Modo Escuro';
      default:
        return 'Modo Escuro';
    }
  };

  return (
    <button
      onClick={handleThemeChange}
      className="p-2 rounded-full hover:bg-[var(--glass-bg-light)] transition-colors"
      title={`Alternar tema - ${getThemeLabel()}`}
      aria-label={`Alternar tema - ${getThemeLabel()}`}
    >
      {getThemeIcon()}
    </button>
  );
};

export default ThemeToggle;