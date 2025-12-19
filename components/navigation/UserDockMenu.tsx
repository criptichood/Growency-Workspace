import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { User } from '../../types';
import { STATUS_OPTIONS } from '../../constants';

interface UserDockMenuProps {
  user: User;
  isExpanded: boolean;
  onLogout: () => void;
}

export function UserDockMenu({ user, isExpanded, onLogout }: UserDockMenuProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusColor = STATUS_OPTIONS[user.status]?.color || 'bg-gray-400';

  return (
    <div ref={menuRef} className="relative">
      <button 
        onClick={() => setShowUserMenu(!showUserMenu)}
        className={`relative w-full flex items-center transition-all duration-300 group/profile ${isExpanded ? 'bg-gray-50 dark:bg-gray-900/40 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700' : 'justify-center'}`}
      >
        <div className="relative shrink-0">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className={`w-9 h-9 rounded-xl border-2 transition-all shadow-sm ${showUserMenu ? 'border-indigo-500 scale-105' : 'border-white dark:border-gray-600 group-hover/profile:border-indigo-300'}`} 
          />
          {/* Dynamic Status Indicator */}
          <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm transition-colors duration-500 ${statusColor}`} />
        </div>
        
        <div className={`flex-1 min-w-0 ml-2.5 text-left overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
           <p className="text-[10px] font-black text-gray-900 dark:text-white truncate uppercase tracking-tighter">@{user.username}</p>
           <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate">{user.roles.join(', ')}</p>
        </div>
      </button>

      {showUserMenu && (
        <div className="absolute left-full ml-4 bottom-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-4 animate-in slide-in-from-left-4 fade-in duration-300 z-[60]">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
             <div className="relative shrink-0">
               <img src={user.avatarUrl} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="" />
               <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-[3px] border-white dark:border-gray-800 transition-colors duration-500 ${statusColor}`} />
             </div>
             <div className="min-w-0">
                <p className="text-sm font-black text-gray-900 dark:text-white truncate">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                   <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">@{user.username}</p>
                </div>
             </div>
          </div>
          
          <div className="space-y-1">
            <NavLink 
              to="/settings" 
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <Settings size={18} />
              Profile Settings
            </NavLink>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}