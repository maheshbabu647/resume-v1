import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext'; // Adjust path if your context is elsewhere
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before rendering theme-specific UI
  // to prevent hydration mismatch if using SSR/SSG
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder or null during server-side rendering or before hydration
    // to avoid mismatch. A simple span is often enough.
    return <span style={{ display: 'inline-block', width: '24px', height: '24px' }} />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="rounded-full p-2 hover:bg-accent/10 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {theme === 'light' ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-foreground transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-foreground transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
    