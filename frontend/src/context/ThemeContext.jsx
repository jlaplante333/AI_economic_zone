import React, { createContext, useContext, useState, useEffect } from 'react';
import { darkTheme, beigeTheme } from '../themes';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [theme, setTheme] = useState(darkTheme);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('oaklandAI-theme');
    if (savedTheme === 'beige') {
      setIsDarkTheme(false);
      setTheme(beigeTheme);
    } else {
      setIsDarkTheme(true);
      setTheme(darkTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDarkTheme;
    setIsDarkTheme(newIsDark);
    setTheme(newIsDark ? darkTheme : beigeTheme);
    localStorage.setItem('oaklandAI-theme', newIsDark ? 'dark' : 'beige');
  };

  const value = {
    theme,
    isDarkTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 