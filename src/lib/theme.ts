import { createContext } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Atualiza apenas as 3 cores dinâmicas (texto/acento)
export const updateThemeVariables = () => {
  const root = document.documentElement;
  const primary = import.meta.env.VITE_PRIMARY_COLOR || '#22c55e';
  const primaryDark = import.meta.env.VITE_PRIMARY_DARK || '#16a34a';
  const shadow = import.meta.env.VITE_SHADOW_COLOR || 'rgba(34,197,94,0.30)';

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