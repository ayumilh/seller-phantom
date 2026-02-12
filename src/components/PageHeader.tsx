import React, { useContext } from 'react';
import { ThemeContext } from '../lib/theme.ts';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

function PageHeader({ title, description, children }: PageHeaderProps) {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <header className={`sticky top-0 z-20 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-white'} px-4 lg:px-8 py-4`}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-sm text-gray-400">{description}</p>}
        </div>
        {children}
      </div>
    </header>
  );
}

export default PageHeader;

export { PageHeader };