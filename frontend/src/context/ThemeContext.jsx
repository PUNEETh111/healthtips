// ============================================================
// THEME CONTEXT - Dark mode toggle with localStorage persistence
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

/**
 * ThemeProvider - Manages dark/light mode globally
 */
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('healthhub_darkmode');
    if (saved !== null) return JSON.parse(saved);
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark class to HTML element when theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('healthhub_darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme - Custom hook to access theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
