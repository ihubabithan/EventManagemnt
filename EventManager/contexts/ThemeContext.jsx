import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({})

/**
 * Theme Provider Component
 * Manages dark/light theme state and persistence
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')

  /**
   * Initialize theme from localStorage or system preference
   */
  useEffect(() => {
    const initialTheme = 'light'
    setTheme(initialTheme)
  }, [])

  /**
   * Apply theme to document root
   * @param {string} newTheme - Theme to apply
   */
  const applyTheme = (newTheme) => {
    const root = document.documentElement
    root.classList.remove('light')
    root.classList.add('light')
  }

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    // Disabled toggleTheme to always keep light mode
  }

  /**
   * Set specific theme
   * @param {string} newTheme - Theme to set
   */
  const setThemeMode = (newTheme) => {
    const forcedTheme = 'light'
    setTheme(forcedTheme)
  }

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Custom hook to use theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext