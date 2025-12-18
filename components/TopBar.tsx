import { Bell, ChevronRight, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlobalSearch } from './navigation/GlobalSearch';

export function TopBar() {
  const { user } = useAuth();
  const location = useLocation();
  
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <nav className="hidden sm:flex items-center space-x-2 text-sm font-medium">
          <Link to="/" className="text-gray-400 hover:text-indigo-600 transition-colors">
            <Home size={16} />
          </Link>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

            return (
              <div key={to} className="flex items-center space-x-2">
                <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
                {last ? (
                  <span className="text-gray-900 dark:text-white font-black uppercase tracking-tighter">
                    {value.replace(/-/g, ' ')}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors capitalize"
                  >
                    {value.replace(/-/g, ' ')}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
        <div className="sm:hidden font-black text-gray-900 dark:text-white uppercase tracking-tighter">
          {pathnames[pathnames.length - 1]?.replace(/-/g, ' ') || 'Dashboard'}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden md:block">
          <GlobalSearch />
        </div>

        <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-xl transition-all active:scale-95 group">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
        </button>
      </div>
    </header>
  );
}