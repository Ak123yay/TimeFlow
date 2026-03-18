import React, { createContext, useContext } from 'react';
import { useDarkMode } from '../utils/useDarkMode';

/**
 * IconContext provides dark mode awareness to all icon components
 * Icons can auto-detect dark mode or have it manually overridden
 */
export const IconContext = createContext();

export const IconProvider = ({ children }) => {
  const isDark = useDarkMode();

  return (
    <IconContext.Provider value={{ isDark }}>
      {children}
    </IconContext.Provider>
  );
};

/**
 * Hook for icon components to access context
 * Returns empty object if context is not available (graceful degradation)
 */
export const useIconContext = () => {
  const context = useContext(IconContext);
  return context || {};
};
