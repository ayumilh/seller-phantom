import { createContext } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Atualiza apenas as 3 cores dinâmicas (texto/acento)
export const updateThemeVariables = () => {
  const root = document.documentElement;
  const primary = import.meta.env.VITE_PRIMARY_COLOR || '#FFFF00';
  const primaryDark = import.meta.env.VITE_PRIMARY_DARK || '#E64500';
  const shadow = import.meta.env.VITE_SHADOW_COLOR || 'rgba(36,107,222,0.30)';

  root.style.setProperty('--primary-color', primary);
  root.style.setProperty('--primary-dark', primaryDark);
  root.style.setProperty('--shadow-color', shadow);
};

// Initialize theme variables
updateThemeVariables();

// Create theme context
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
});