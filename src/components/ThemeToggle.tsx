'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-md w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <IconSun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      ) : (
        <IconMoon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
}
