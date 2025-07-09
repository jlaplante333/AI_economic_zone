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
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('oaklandAI-theme');
    console.log('Loading theme from localStorage:', savedTheme);
    if (savedTheme === 'beige') {
      console.log('Setting beige theme');
      setIsDarkTheme(false);
      setTheme(beigeTheme);
      document.body.className = 'theme-beige';
    } else {
      console.log('Setting dark theme');
      setIsDarkTheme(true);
      setTheme(darkTheme);
      document.body.className = '';
    }
  }, []);

  // Ensure theme and isDarkTheme are always in sync
  useEffect(() => {
    console.log('Theme state changed - isDarkTheme:', isDarkTheme, 'theme.primaryBg:', theme.primaryBg);
    
    // Verify theme consistency
    const expectedTheme = isDarkTheme ? darkTheme : beigeTheme;
    if (theme.primaryBg !== expectedTheme.primaryBg) {
      console.warn('Theme inconsistency detected, fixing...');
      setTheme(expectedTheme);
    }
  }, [isDarkTheme, theme]);

  const toggleTheme = () => {
    // Prevent rapid clicking
    if (isToggling) {
      console.log('Theme toggle already in progress, ignoring click');
      return;
    }
    
    console.log('=== THEME TOGGLE DEBUG ===');
    console.log('toggleTheme function called');
    console.log('Current isDarkTheme:', isDarkTheme);
    console.log('Current theme.primaryBg:', theme.primaryBg);
    
    setIsToggling(true);
    
    try {
      // Use a callback approach to ensure state updates are based on current state
      setIsDarkTheme(prevIsDark => {
        const updatedIsDark = !prevIsDark;
        console.log('State update callback - prevIsDark:', prevIsDark, 'updatedIsDark:', updatedIsDark);
        
        // Update theme immediately in the same callback context
        const newTheme = updatedIsDark ? darkTheme : beigeTheme;
        setTheme(newTheme);
        
        console.log('New theme.primaryBg:', newTheme.primaryBg);
        
        // Update localStorage
        const themeName = updatedIsDark ? 'dark' : 'beige';
        localStorage.setItem('oaklandAI-theme', themeName);
        console.log('localStorage set to:', themeName);
        
        // Update body class for CSS theme overrides
        if (updatedIsDark) {
          document.body.className = '';
          console.log('Body class set to empty');
        } else {
          document.body.className = 'theme-beige';
          console.log('Body class set to theme-beige');
        }
        
        // Reset toggle flag after a short delay
        setTimeout(() => {
          setIsToggling(false);
        }, 100);
        
        return updatedIsDark;
      });
      
      console.log('Theme toggle completed');
      console.log('=== END DEBUG ===');
    } catch (error) {
      console.error('Error during theme toggle:', error);
      setIsToggling(false);
    }
  };

  const value = {
    theme,
    isDarkTheme,
    toggleTheme,
    isToggling
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 