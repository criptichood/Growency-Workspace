import React from 'react';
import { Zap, Info, AlertTriangle, CheckCircle2, Bell } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { MOCK_USERS } from '../../constants';

type ActivityItem = 
  | { type: 'message'; userId: string; projectName: string; projectId: string; timestamp: string; content: string }
  | { type: 'note'; userId: string; projectName: string; projectId: string; timestamp: string; content: string }
  | { type: 'notification'; id: string; notifType: 'info' | 'alert' | 'success'; title: string; message: string; timestamp: string; createdBy: string };

export function ActivityFeed() {
  const { projects, notifications } = useProjects();

  const projectActivities: ActivityItem[] = projects.flatMap(p => [
      ...p.messages.map(m => ({ 
        type: 'message' as const, 
        userId: m.userId, 
        projectName: p.name, 
        projectId: p.id,
        timestamp: m.timestamp,
        content: `sent a message in ${p.name}`
      })),
      ...p.notes.map(n => ({ 
        type: 'note' as const, 
        userId: n.userId, 
        projectName: p.name, 
        projectId: p.id,
        timestamp: n.createdAt,
        content: `added a note to ${p.name}`
      }))
  ]);

  const systemNotifications: ActivityItem[] = notifications.map(n => ({
      type: 'notification' as const,
      id: n.id,
      notifType: n.type,
      title: n.title,
      message: n.message,
      timestamp: n.createdAt,
      createdBy: n.createdBy
  }));

  const recentActivities = [...systemNotifications, ...projectActivities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return (
    <div className="bg-white dark:bg-[#151921] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex-1 flex flex-col min-h-[300px]">
        <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
               <Zap size={16} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Live Activity</h3>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {recentActivities.map((activity, idx) => {
                if (activity.type === 'notification') {
                   const iconMap = {
                       info: <Info size={14} className="text-blue-500" />,
                       alert: <AlertTriangle size={14} className="text-amber-500" />,
                       success: <CheckCircle2 size={14} className="text-emerald-500" />
                   };
                   const borderMap = {
                       info: 'border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10',
                       alert: 'border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-900/10',
                       success: 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10',
                   };

                   return (
                       <div key={idx} className={`flex gap-3 p-3 rounded-xl border ${borderMap[activity.notifType]}`}>
                           <div className="mt-0.5 shrink-0 bg-white dark:bg-slate-800 p-1 rounded-lg shadow-sm">{iconMap[activity.notifType]}</div>
                           <div>
                               <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{activity.title}</p>
                               <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{activity.message}</p>
                               <p className="text-[9px] text-slate-400 mt-1 font-mono font-medium opacity-75">{new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                           </div>
                       </div>
                   );
                }

                const author = MOCK_USERS[activity.userId];
                return (
                  <div key={idx} className="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#1e222e] transition-colors">
                    <div className="relative shrink-0">
                        <img 
                        src={author?.avatarUrl} 
                        className="w-8 h-8 rounded-lg object-cover bg-slate-200 ring-2 ring-white dark:ring-slate-700" 
                        alt="" 
                        />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                        <span className="font-bold text-slate-900 dark:text-white">{author?.name}</span> {activity.content}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-1 font-mono font-medium opacity-75">{new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                );
            })}
            {recentActivities.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                    <Bell size={24} className="mx-auto mb-2 opacity-20" />
                    <p className="text-xs">No updates yet</p>
                </div>
            )}
        </div>
    </div>
  );
}