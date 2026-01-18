import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import logger from '../utils/logger';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Carregar tema salvo ou usar 'dark' como padrão
    const savedTheme = localStorage.getItem('punk-blvck-theme') as Theme;
    return savedTheme || 'dark';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');

  // Determinar tema atual baseado na configuração
  const resolveActualTheme = (currentTheme: Theme): 'light' | 'dark' => {
    return currentTheme as 'light' | 'dark';
  };

  // Aplicar tema ao DOM
  const applyTheme = (newActualTheme: 'light' | 'dark', themeToSave: Theme) => {
    const root = document.documentElement;

    // Usar requestAnimationFrame para garantir que a mudança seja feita no próximo frame
    requestAnimationFrame(() => {
      // Remover classes anteriores
      root.classList.remove('light', 'dark');

      // Adicionar classe do tema atual
      root.classList.add(newActualTheme);

      // Atualizar meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', newActualTheme === 'dark' ? '#000000' : '#FF5F1F');
      }

      // Salvar no localStorage (não bloqueia a UI)
      setTimeout(() => {
        localStorage.setItem('punk-blvck-theme', themeToSave);
      }, 0);
    });

    logger.info('Theme applied', { theme: newActualTheme }, 'ThemeContext');
  };

  // Função para definir tema
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const newActualTheme = resolveActualTheme(newTheme);
    setActualTheme(newActualTheme);
    applyTheme(newActualTheme, newTheme);

    logger.info('Theme changed', { theme: newTheme, actualTheme: newActualTheme }, 'ThemeContext');
  };

  // Função para alternar entre light/dark (ignorando system)
  const toggleTheme = () => {
    const newTheme: Theme = actualTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Efeito para inicializar tema
  useEffect(() => {
    const initialActualTheme = resolveActualTheme(theme);
    setActualTheme(initialActualTheme);
    applyTheme(initialActualTheme, theme);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};