'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Tema değiştirici toggle bileşeni. Cyber-themed glitch animation ile light/dark mode geçişi.
 * Primary accent renkli, mono font hints.
 *
 * @example
 * <ThemeToggle />
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const root = document.documentElement;
    setIsDark(root.classList.contains('dark'));
  }, []);

  function toggleTheme() {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    const root = document.documentElement;
    root.classList.toggle('dark');
    setIsDark(root.classList.contains('dark'));
  }

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        disabled
      >
        <Sun className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`relative h-9 w-9 hover:bg-primary/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
        isAnimating ? 'theme-toggle-glitch' : ''
      }`}
      aria-label={isDark ? 'Açık moda geç' : 'Koyu moda geç'}
    >
      <div className="relative h-4 w-4">
        <Sun
          className={`absolute h-4 w-4 transition-all duration-300 ${
            isDark
              ? 'scale-0 -rotate-90 opacity-0 text-muted-foreground'
              : 'scale-100 rotate-0 opacity-100 text-primary'
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 transition-all duration-300 ${
            isDark
              ? 'scale-100 rotate-0 opacity-100 text-primary'
              : 'scale-0 rotate-90 opacity-0 text-muted-foreground'
          }`}
        />
      </div>
    </Button>
  );
}
