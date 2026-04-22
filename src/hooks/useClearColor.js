import { useState, useEffect } from 'react';

export default function useClearColor() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const el = document.documentElement;
    setTheme(el.getAttribute('data-theme') || 'dark');

    const observer = new MutationObserver(() => {
      setTheme(el.getAttribute('data-theme') || 'dark');
    });
    observer.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Dark mode: transparent (blends with dark page bg)
  // Light mode: dark solid color (keeps points visible)
  return {
    color: theme === 'light' ? 0x0D1117 : 0x000000,
    alpha: theme === 'light' ? 1 : 0,
    theme,
  };
}
