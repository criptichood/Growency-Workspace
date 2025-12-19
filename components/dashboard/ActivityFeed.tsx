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

  // 1. Project Activities
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

  // 2. System Notifications
  const systemNotifications: ActivityItem[] = notifications.map(n => ({
      type: 'notification' as const,
      id: n.id,
      notifType: n.type,
      title: n.title,
      message: n.message,
      timestamp: n.createdAt,
      createdBy: n.createdBy
  }));

  // 3. Merge, Sort, Limit
  const recentActivities = [...systemNotifications, ...projectActivities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8); // Keep it short

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex-1 flex flex-col min-h-[300px]">
        <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
               <Zap size={16} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Live Activity</h3>
        </div>

        <div className="space-y-5 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {recentActivities.map((activity, idx) => {
                if (activity.type === 'notification') {
                   const iconMap = {
                       info: <Info size={12} className="text-blue-500" />,
                       alert: <AlertTriangle size={12} className="text-amber-500" />,
                       success: <CheckCircle2 size={12} className="text-green-500" />
                   };
                   return (
                       <div key={idx} className="flex gap-3">
                           <div className="mt-1 shrink-0">{iconMap[activity.notifType]}</div>
                           <div>
                               <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{activity.title}</p>
                               <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{activity.message}</p>
                               <p className="text-[9px] text-gray-400 mt-1 font-medium">{new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                           </div>
                       </div>
                   );
                }

                const author = MOCK_USERS[activity.userId];
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="relative shrink-0">
                        <img 
                        src={author?.avatarUrl} 
                        className="w-7 h-7 rounded-lg object-cover bg-gray-100" 
                        alt="" 
                        />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-snug">
                        <span className="font-bold text-gray-900 dark:text-white">{author?.name}</span> {activity.content}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1 font-medium">{new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                );
            })}
            {recentActivities.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    <Bell size={24} className="mx-auto mb-2 opacity-20" />
                    <p className="text-xs">No updates yet</p>
                </div>
            )}
        </div>
    </div>
  );
}