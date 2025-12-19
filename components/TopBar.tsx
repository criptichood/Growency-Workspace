import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronRight, Home, MessageSquareText, Check, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { GlobalSearch } from './navigation/GlobalSearch';

export function TopBar() {
  const { user } = useAuth();
  const { toggleDmDrawer, dmThreads, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useProjects();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const pathnames = location.pathname.split('/').filter((x) => x);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  // DM Unread Check (Mock)
  const hasMessages = dmThreads.some(t => t.participants.includes(user.id));
  
  // Notification Logic
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayNotifications = notifications.slice(0, 5); // Show last 5

  const handleNotificationClick = (id: string, link?: string) => {
      markNotificationAsRead(id);
      setIsNotifOpen(false);
      if (link) {
          navigate(link);
      }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'success': return <CheckCircle2 size={16} className="text-green-500" />;
          case 'alert': return <AlertTriangle size={16} className="text-amber-500" />;
          default: return <Info size={16} className="text-indigo-500" />;
      }
  };

  const isActive = (path: string) => {
      if (path === '/' && location.pathname === '/dashboard') return true;
      return location.pathname.startsWith(path);
  };

  const quickLinks = [
      { path: '/projects', label: 'Projects' },
      { path: '/my-tasks', label: 'My Tasks' },
      { path: '/team', label: 'Team' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 flex items-center justify-between transition-colors supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-4 shrink-0">
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

      {/* Center: Quick Navigation (Refined Segmented Control) */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <nav className="flex items-center p-1 bg-slate-200/50 dark:bg-gray-900/50 border border-slate-200/50 dark:border-gray-700/50 rounded-full backdrop-blur-md shadow-inner">
              {quickLinks.map(link => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ease-out ${
                        isActive(link.path)
                        ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] ring-1 ring-black/5 dark:ring-white/10 scale-105'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-gray-700/40'
                    }`}
                  >
                      {link.label}
                  </Link>
              ))}
          </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="hidden lg:block">
          <GlobalSearch />
        </div>
        
        {/* Mobile Search Trigger */}
        <button 
            onClick={() => navigate('/search')}
            className="lg:hidden p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-xl transition-all"
        >
            <Home className="hidden" /> 
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>

        <button 
          onClick={() => toggleDmDrawer(true)}
          className="relative p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-xl transition-all active:scale-95 group"
          title="Messages"
        >
          <MessageSquareText size={20} className="group-hover:scale-110 transition-transform" />
          {hasMessages && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>}
        </button>

        <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-2.5 rounded-xl transition-all active:scale-95 group ${
                  isNotifOpen ? 'bg-gray-100 dark:bg-gray-700 text-indigo-600' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              <Bell size={20} className={`group-hover:rotate-12 transition-transform ${unreadCount > 0 ? 'text-gray-700 dark:text-gray-200' : ''}`} />
              {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full ring-2 ring-white dark:ring-gray-800">
                      {unreadCount}
                  </span>
              )}
            </button>

            {isNotifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200 origin-top-right">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                              onClick={markAllNotificationsAsRead}
                              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
                            >
                                <Check size={12} /> Mark all read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-[320px] overflow-y-auto">
                        {displayNotifications.length > 0 ? (
                            displayNotifications.map((notif) => (
                                <button
                                   key={notif.id}
                                   onClick={() => handleNotificationClick(notif.id, notif.link)}
                                   className={`w-full text-left p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex gap-3 ${
                                       !notif.isRead ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''
                                   }`}
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <p className={`text-xs font-bold ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {notif.title}
                                            </p>
                                            {!notif.isRead && <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 mt-1" />}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{notif.message}</p>
                                        <p className="text-[9px] text-gray-400 mt-1.5 font-medium">{new Date(notif.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="py-12 text-center text-gray-400">
                                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-medium">No notifications yet</p>
                            </div>
                        )}
                    </div>
                    <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 text-center">
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsNotifOpen(false)}
                          className="text-[10px] font-bold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest"
                        >
                            View All Activity
                        </Link>
                    </div>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}