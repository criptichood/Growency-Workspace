import React, { useState } from 'react';
import { Users, DollarSign, Activity, Clock, Zap, Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { useDashboardLayout } from '../context/DashboardLayoutContext';
import { StatCard } from '../components/dashboard/StatCard';
import { HealthSection } from '../components/dashboard/HealthSection';
import { PrioritiesSection } from '../components/dashboard/PrioritiesSection';
import { DashboardWidget } from '../components/dashboard/DashboardWidget';
import { DashboardToolbar } from '../components/dashboard/DashboardToolbar';
import { NotificationModal } from '../components/dashboard/NotificationModal';
import { ActivityFeed } from '../components/dashboard/ActivityFeed'; // Extracted for cleanliness

export function Dashboard() {
  const { user } = useAuth();
  const { projects, notifications } = useProjects();
  const { widgets, isEditMode } = useDashboardLayout();
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Pending');
  const completedCount = projects.filter(p => p.status === 'Completed').length;
  const inProgressCount = projects.filter(p => p.status === 'In Progress').length;
  const pendingCount = projects.filter(p => p.status === 'Pending').length;

  const isAdmin = user?.role === 'Admin';
  const isSales = user?.role === 'Sales';
  const canSeeRevenue = isAdmin || isSales;
  const canPostAnnouncements = isAdmin || isSales;

  // We order widgets based on the context order
  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  const renderWidgetContent = (id: string) => {
    switch (id) {
      case 'welcome':
        return (
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-gray-900 text-white p-8 sm:p-10 shadow-xl">
             <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                   <h2 className="text-3xl font-black tracking-tight mb-2">
                      Good Morning, {user?.name.split(' ')[0]}!
                   </h2>
                   <p className="text-indigo-100 text-sm font-medium max-w-lg leading-relaxed">
                      You have {activeProjects.filter(p => p.assignedUsers.includes(user?.id || '')).length} active projects requiring attention today. 
                      Here is your daily workspace overview.
                   </p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Date</span>
                      <span className="text-xl font-bold">{new Date().getDate()}</span>
                   </div>
                   <div className="h-10 w-px bg-white/20" />
                   <div className="flex flex-col">
                      <span className="text-3xl font-black">{new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                      <span className="text-xs font-medium text-indigo-200">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
                   </div>
                </div>
             </div>
             
             {/* Decorative Circles */}
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
             <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none" />
          </div>
        );
      case 'stats':
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {canSeeRevenue && (
              <StatCard title="Revenue" value="$45,231" change="+20%" trend="up" icon={DollarSign} color="text-green-500" />
            )}
            <StatCard title="Total Users" value="2,345" change="+15%" trend="up" icon={Users} color="text-blue-500" />
            <StatCard title="Avg Lead Time" value="12 Days" change="-4%" trend="down" icon={Activity} color="text-purple-500" />
            <StatCard title="Active Sprints" value="8" change="+2" trend="up" icon={Zap} color="text-amber-500" />
          </div>
        );
      case 'health':
        return (
          <div className="flex flex-col gap-6 h-full">
             <HealthSection 
               completedCount={completedCount}
               inProgressCount={inProgressCount}
               pendingCount={pendingCount}
             />
             <ActivityFeed />
          </div>
        );
      case 'priorities':
        return <PrioritiesSection activeProjects={activeProjects} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Header Toolbar */}
      <div className="flex justify-end items-center gap-3 mb-2">
          {!isEditMode && canPostAnnouncements && (
             <button 
               onClick={() => setIsNotifModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all active:scale-95"
             >
               <Megaphone size={14} />
               <span className="hidden sm:inline">Announcement</span>
             </button>
          )}
          <DashboardToolbar />
      </div>

      {/* Main Grid: Responsive 3 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-min">
        {sortedWidgets.map(widget => (
           <DashboardWidget 
             key={widget.id} 
             id={widget.id} 
             colSpan={widget.colSpan} // Passed but handled via className logic in Widget wrapper
           >
             {renderWidgetContent(widget.id)}
           </DashboardWidget>
        ))}
      </div>

      <NotificationModal 
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
      />
    </div>
  );
}