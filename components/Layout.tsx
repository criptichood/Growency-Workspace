import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { NavigationDock } from './NavigationDock';
import { TopBar } from './TopBar';
import { DirectMessageDrawer } from './navigation/DirectMessageDrawer';
import { useConfig } from '../context/ConfigContext';

export function Layout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const { config } = useConfig();

  // Reset scroll position on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-[#0f1117] overflow-hidden transition-colors duration-200 ${config.compactMode ? 'text-xs' : 'text-sm'}`}>
      <NavigationDock />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        
        <main 
          ref={mainRef}
          className={`flex-1 overflow-y-auto focus:outline-none transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            config.sidebarExpanded ? 'lg:pl-64' : 'lg:pl-24'
          }`}
        >
          <div className={`max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-10 ${config.compactMode ? 'lg:p-4' : ''}`}>
            <Outlet />
          </div>
        </main>
      </div>

      <DirectMessageDrawer />
    </div>
  );
}