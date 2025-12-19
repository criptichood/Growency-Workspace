import React, { useState, useMemo } from 'react';
import { Clock, User as UserIcon, MessageSquare, FileText, Search, Bell, AlertTriangle, CheckCircle2, Info, Filter } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS } from '../constants';
import { Link } from 'react-router-dom';

type ActivityFilter = 'all' | 'user' | 'system';

interface HistoryItem {
  id: string;
  type: 'message' | 'note' | 'system';
  systemType?: 'info' | 'alert' | 'success';
  title?: string;
  content: string;
  timestamp: string;
  userId?: string;
  projectId?: string;
  projectName?: string;
  projectCode?: string;
  link?: string;
}

export function History() {
  const { user } = useAuth();
  const { projects, notifications } = useProjects();
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Aggregate User Activity (Messages & Notes)
  const userActivities: HistoryItem[] = useMemo(() => {
    if (!user) return [];
    
    // Only access projects user is assigned to (RBAC)
    const accessibleProjects = projects.filter(p => 
      user.role === 'Admin' || p.assignedUsers.includes(user.id)
    );

    return accessibleProjects.flatMap(p => [
      ...p.messages.map(m => ({
        id: m.id,
        type: 'message' as const,
        content: m.text,
        timestamp: m.timestamp,
        userId: m.userId,
        projectId: p.id,
        projectName: p.name,
        projectCode: p.code,
        link: `/projects/${p.code}?tab=chat`
      })),
      ...p.notes.map(n => ({
        id: n.id,
        type: 'note' as const,
        title: n.title,
        content: `Created ${n.type.toLowerCase()}: ${n.content.substring(0, 100)}...`,
        timestamp: n.createdAt,
        userId: n.userId,
        projectId: p.id,
        projectName: p.name,
        projectCode: p.code,
        link: `/projects/${p.code}?tab=notes`
      }))
    ]);
  }, [projects, user]);

  // 2. Aggregate System Notifications
  const systemActivities: HistoryItem[] = useMemo(() => {
    return notifications.map(n => ({
      id: n.id,
      type: 'system' as const,
      systemType: n.type,
      title: n.title,
      content: n.message,
      timestamp: n.createdAt,
      link: n.link
    }));
  }, [notifications]);

  // 3. Merge & Filter
  const allActivities = useMemo(() => {
    let combined: HistoryItem[] = [];

    if (filter === 'all') {
      combined = [...userActivities, ...systemActivities];
    } else if (filter === 'user') {
      combined = userActivities;
    } else if (filter === 'system') {
      combined = systemActivities;
    }

    // Sort by date (newest first)
    combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Search filter
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      combined = combined.filter(item => 
        item.content.toLowerCase().includes(lower) || 
        (item.title && item.title.toLowerCase().includes(lower)) ||
        (item.projectName && item.projectName.toLowerCase().includes(lower))
      );
    }

    return combined;
  }, [userActivities, systemActivities, filter, searchTerm]);

  // 4. Group by Date
  const groupedHistory = useMemo(() => {
    const groups: Record<string, HistoryItem[]> = {};
    allActivities.forEach(item => {
      const date = new Date(item.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let key = date.toLocaleDateString();
      if (date.toDateString() === today.toDateString()) key = 'Today';
      else if (date.toDateString() === yesterday.toDateString()) key = 'Yesterday';
      else key = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [allActivities]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Clock className="text-indigo-600 dark:text-indigo-400" size={32} />
            History Log
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            A comprehensive timeline of system alerts and team activity.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
           <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search history..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
           </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setFilter('all')}
          className={`flex-1 sm:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            filter === 'all' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          All Activity
        </button>
        <button 
          onClick={() => setFilter('user')}
          className={`flex-1 sm:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            filter === 'user' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <UserIcon size={14} />
          User History
        </button>
        <button 
          onClick={() => setFilter('system')}
          className={`flex-1 sm:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            filter === 'system' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Bell size={14} />
          System Notifications
        </button>
      </div>

      {/* Grouped Timeline */}
      <div className="space-y-8">
        {Object.keys(groupedHistory).length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="p-5 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4">
                 <Filter size={32} className="text-gray-300" />
              </div>
              <p className="font-bold text-lg text-gray-600 dark:text-gray-300">No activity found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms.</p>
           </div>
        ) : (
          Object.entries(groupedHistory).map(([dateLabel, items]) => (
            <div key={dateLabel}>
              <div className="flex items-center gap-4 mb-4">
                 <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">{dateLabel}</h3>
                 <div className="h-px bg-gray-200 dark:border-gray-700 flex-1" />
              </div>
              
              <div className="space-y-3">
                {(items as HistoryItem[]).map((item) => {
                  // --- RENDER SYSTEM NOTIFICATION ---
                  if (item.type === 'system') {
                    const icons = {
                      info: <Info size={18} className="text-blue-500" />,
                      alert: <AlertTriangle size={18} className="text-amber-500" />,
                      success: <CheckCircle2 size={18} className="text-green-500" />
                    };
                    const styles = {
                      info: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30',
                      alert: 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30',
                      success: 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30'
                    };
                    
                    return (
                      <div key={item.id} className={`flex gap-4 p-5 rounded-2xl border transition-all hover:bg-white dark:hover:bg-gray-800 ${styles[item.systemType || 'info']}`}>
                         <div className="shrink-0 mt-0.5 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm h-fit">
                            {icons[item.systemType || 'info']}
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                               <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                               <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                                 {new Date(item.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                               </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{item.content}</p>
                            {item.link && (
                               <Link to={item.link} className="inline-block mt-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">
                                  View Details
                               </Link>
                            )}
                         </div>
                      </div>
                    );
                  }

                  // --- RENDER USER ACTIVITY (Message/Note) ---
                  const author = MOCK_USERS[item.userId || ''];
                  const isMessage = item.type === 'message';
                  
                  return (
                    <div key={item.id} className="group bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                       <div className="flex gap-4">
                          <div className="relative shrink-0">
                             <img src={author?.avatarUrl} alt={author?.name} className="w-10 h-10 rounded-xl bg-gray-200 object-cover" />
                             <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 p-0.5 rounded-full">
                                <div className={`p-1 rounded-full ${isMessage ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                   {isMessage ? <MessageSquare size={10} /> : <FileText size={10} />}
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start">
                                <div>
                                   <p className="text-sm font-bold text-gray-900 dark:text-white">
                                      {author?.name || 'Unknown User'} 
                                      <span className="font-medium text-gray-500 dark:text-gray-400 ml-1">
                                        {isMessage ? 'posted in' : 'updated'} 
                                        <Link to={item.link || '#'} className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
                                           {item.projectName}
                                        </Link>
                                      </span>
                                   </p>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                                   {new Date(item.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </span>
                             </div>
                             
                             <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                <p className="line-clamp-2">{item.title ? `${item.title}: ` : ''}{item.content}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}