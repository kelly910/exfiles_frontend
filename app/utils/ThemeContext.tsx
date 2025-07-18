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
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = storedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const productionServer = process.env.NEXT_PUBLIC_ENVIRONMENT_SERVER;

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    const themePostMessage = new BroadcastChannel('react-auth-channel');
    themePostMessage.postMessage({
      type: 'THEME',
      theme: theme === 'dark' ? 'light' : 'dark',
    });
    if (productionServer === 'production') {
      document.cookie = `theme=${theme === 'dark' ? 'light' : 'dark'}; path=/; max-age=86400; domain=.ex-files.ai; Secure; SameSite=None`;
    }
    window.opener?.postMessage(
      {
        type: 'THEME',
        theme: theme === 'dark' ? 'light' : 'dark',
      },
      process.env.NEXT_PUBLIC_REDIRECT_URL
    );
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
