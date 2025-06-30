'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderMode = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Delay setting data-theme and class on mount
  useEffect(() => {
    const storedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
    setTheme(storedTheme);

    setTimeout(() => {
      document.documentElement.setAttribute('data-theme', storedTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(storedTheme);
    }, 900);
  }, []);

  const triggerAnimation = () => {
    const html = document.documentElement;
    html.style.animation = 'none';
    void html.offsetWidth;
    html.style.animation = '';
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    triggerAnimation();

    setTimeout(() => {
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
    }, 900);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProviderMode');
  }
  return context;
};
