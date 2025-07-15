import React, { createContext, useContext, useState, useEffect } from 'react';
import { darkTheme, beigeTheme, whiteTheme } from '../themes';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState('dark');
  const [theme, setTheme] = useState(darkTheme);
  const [isToggling, setIsToggling] = useState(false);

  const themes = {
    dark: darkTheme,
    beige: beigeTheme,
    white: whiteTheme
  };

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('oaklandAI-theme');
    console.log('Loading theme from localStorage:', savedTheme);
    
    if (savedTheme && themes[savedTheme]) {
      console.log('Setting theme:', savedTheme);
      setCurrentThemeName(savedTheme);
      setTheme(themes[savedTheme]);
      document.body.className = savedTheme === 'dark' ? '' : `theme-${savedTheme}`;
    } else {
      console.log('Setting default dark theme');
      setCurrentThemeName('dark');
      setTheme(darkTheme);
      document.body.className = '';
    }
  }, []);

  // Ensure theme and currentThemeName are always in sync
  useEffect(() => {
    console.log('Theme state changed - currentThemeName:', currentThemeName, 'theme.primaryBg:', theme.primaryBg);
    
    // Verify theme consistency
    const expectedTheme = themes[currentThemeName];
    if (theme.primaryBg !== expectedTheme.primaryBg) {
      console.warn('Theme inconsistency detected, fixing...');
      setTheme(expectedTheme);
    }
  }, [currentThemeName, theme]);

  const toggleTheme = () => {
    // Prevent rapid clicking
    if (isToggling) {
      console.log('Theme toggle already in progress, ignoring click');
      return;
    }
    
    console.log('=== THEME TOGGLE DEBUG ===');
    console.log('toggleTheme function called');
    console.log('Current theme:', currentThemeName);
    console.log('Current theme.primaryBg:', theme.primaryBg);
    
    setIsToggling(true);
    
    try {
      // Cycle through themes: dark -> beige -> white -> dark
      const themeOrder = ['dark', 'beige', 'white'];
      const currentIndex = themeOrder.indexOf(currentThemeName);
      const nextIndex = (currentIndex + 1) % themeOrder.length;
      const nextThemeName = themeOrder[nextIndex];
      
      console.log('Theme cycle - current:', currentThemeName, 'next:', nextThemeName);
      
      setCurrentThemeName(nextThemeName);
      setTheme(themes[nextThemeName]);
      
        // Update localStorage
        localStorage.setItem('oaklandAI-theme', nextThemeName);
        console.log('localStorage set to:', nextThemeName);
        
        // Update body class for CSS theme overrides
        if (nextThemeName === 'dark') {
          document.body.className = '';
          console.log('Body class set to empty');
        } else {
          document.body.className = `theme-${nextThemeName}`;
          console.log('Body class set to theme-' + nextThemeName);
        }
        
        // Reset toggle flag after a short delay
        setTimeout(() => {
          setIsToggling(false);
        }, 100);
        
        console.log('Theme toggle completed');
        console.log('=== END DEBUG ===');
    } catch (error) {
      console.error('Error during theme toggle:', error);
      setIsToggling(false);
    }
  };

  const value = {
    theme,
    currentThemeName,
    toggleTheme,
    isToggling
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 