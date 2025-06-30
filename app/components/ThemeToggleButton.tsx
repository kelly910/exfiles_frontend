'use client';
import { Button } from '@mui/material';
import { useThemeMode } from '@/app/utils/ThemeContext';

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useThemeMode();

  return (
    <Button
      onClick={toggleTheme}
      variant="outlined"
      sx={{
        zIndex: 99999999999999999,
        position: 'fixed',
        top: 10,
        left: 10,
        color: theme === 'dark' ? '#fff' : '#000',
        borderColor: theme === 'dark' ? '#000' : '#fff',
        background: theme === 'dark' ? '#000' : '#fff',
      }}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </Button>
  );
}
