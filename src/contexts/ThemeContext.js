import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [chatWallpaper, setChatWallpaper] = useState('default');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    const savedWallpaper = localStorage.getItem('chatWallpaper') || 'default';
    
    setTheme(savedTheme);
    setFontSize(savedFontSize);
    setChatWallpaper(savedWallpaper);
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const updateFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
  };

  const updateChatWallpaper = (wallpaper) => {
    setChatWallpaper(wallpaper);
    localStorage.setItem('chatWallpaper', wallpaper);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'medium': return 'text-base';
      case 'large': return 'text-lg';
      case 'xlarge': return 'text-xl';
      default: return 'text-base';
    }
  };

  const getChatWallpaperStyle = () => {
    switch (chatWallpaper) {
      case 'ocean':
        return 'bg-gradient-to-br from-ocean-50 to-ocean-100 dark:from-ocean-900 dark:to-ocean-800';
      case 'gradient':
        return 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900';
      case 'dark':
        return 'bg-gray-900';
      case 'light':
        return 'bg-gray-50';
      default:
        return 'bg-white dark:bg-gray-900';
    }
  };

  const value = {
    theme,
    fontSize,
    chatWallpaper,
    toggleTheme,
    updateFontSize,
    updateChatWallpaper,
    getFontSizeClass,
    getChatWallpaperStyle
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
