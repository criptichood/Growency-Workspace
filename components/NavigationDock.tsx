import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronsRight, ChevronsLeft } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { DockNavItem } from './navigation/DockNavItem';
import { ThemeSwitcher } from './navigation/ThemeSwitcher';
import { UserDockMenu } from './navigation/UserDockMenu';

export function NavigationDock() {
  const { user, logout } = useAuth();
  const { config, updateConfig } = useConfig();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
  }, [location.pathname]);

  const toggleDock = () => updateConfig({ sidebarExpanded: !config.sidebarExpanded });

  return (
    <>
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className={`lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-[60] bg-white dark:bg-gray-800 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border-y border-r border-gray-200 dark:border-gray-700 py-2 pr-1.5 pl-0.5 rounded-r-lg shadow-md transition-transform duration-300 ${isVisible ? 'translate-x-[64px]' : 'translate-x-0'}`}
        aria-label="Toggle Navigation"
      >
        {isVisible ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
      </button>

      <div 
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
          ${isVisible ? 'translate-x-0' : 'max-lg:-translate-x-[150%] lg:translate-x-0'}
        `}
      >
        <aside 
          className={`flex flex-col bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-[2rem] shadow-2xl transition-all duration-500 overflow-visible ${
            config.sidebarExpanded ? 'w-56 p-4' : 'w-16 p-2'
          }`}
          style={{ height: 'fit-content', maxHeight: '90vh' }}
        >
          <button 
            onClick={toggleDock}
            className="hidden lg:flex absolute top-10 -right-3 w-6 h-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full items-center justify-center text-gray-400 hover:text-indigo-600 shadow-md z-10 transition-colors"
          >
            {config.sidebarExpanded ? <ChevronsLeft size={12} /> : <ChevronsRight size={12} />}
          </button>

          <nav className="space-y-2 flex-1">
            {NAV_ITEMS.map((item) => (
              <DockNavItem 
                key={item.path}
                {...item}
                isExpanded={config.sidebarExpanded}
              />
            ))}
          </nav>

          <div className="mt-6 space-y-4">
            <ThemeSwitcher isExpanded={config.sidebarExpanded} />
            {user && (
              <UserDockMenu 
                user={user} 
                isExpanded={config.sidebarExpanded} 
                onLogout={logout} 
              />
            )}
          </div>
        </aside>
      </div>
    </>
  );
}