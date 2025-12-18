import React from 'react';
import { Users, DollarSign, Activity, Clock, Zap, Layout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { useDashboardLayout } from '../context/DashboardLayoutContext';
import { StatCard } from '../components/dashboard/StatCard';
import { HealthSection } from '../components/dashboard/HealthSection';
import { PrioritiesSection } from '../components/dashboard/PrioritiesSection';
import { DashboardWidget } from '../components/dashboard/DashboardWidget';
import { DashboardToolbar } from '../components/dashboard/DashboardToolbar';
import { MOCK_USERS } from '../constants';

export function Dashboard() {
  const { user } = useAuth();
  const { projects } = useProjects();
  const { widgets, isEditMode } = useDashboardLayout();
  
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Pending');
  const completedCount = projects.filter(p => p.status === 'Completed').length;
  const inProgressCount = projects.filter(p => p.status === 'In Progress').length;
  // Fix: Removed duplicate assignment to pendingCount which caused variable reference errors
  const pendingCount = projects.filter(p => p.status === 'Pending').length;

  const recentActivities = projects
    .flatMap(p => [
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
        content: `added a new ${n.type.toLowerCase()} to ${p.name}`
      }))
    ])
    .filter(activity => !!MOCK_USERS[activity.userId])
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const isAdmin = user?.role === 'Admin';
  const isSales = user?.role === 'Sales';
  const canSeeRevenue = isAdmin || isSales;
  const canCreateReports = isAdmin || isSales;

  const renderWidget = (id: string) => {
    switch (id) {
      case 'stats':
        const visibleStatsCount = [canSeeRevenue, true, true, isAdmin].filter(Boolean).length;
        const gridCols = {
          1: 'lg:grid-cols-1',
          2: 'lg:grid-cols-2',
          3: 'lg:grid-cols-3',
          4: 'lg:grid-cols-4'
        }[visibleStatsCount as 1|2|3|4] || 'lg:grid-cols-4';

        return (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
            {canSeeRevenue && (
              <StatCard title="Revenue Growth" value="$45,231.89" change="+20.1%" trend="up" icon={DollarSign} />
            )}
            <StatCard title="Workspace Users" value="2,345" change="+15.2%" trend="up" icon={Users} />
            <StatCard title="Avg. Lead Time" value="12.4 Days" change="-4.5%" trend="down" icon={Activity} />
            {isAdmin && (
              <StatCard title="Session Length" value="4m 12s" change="+1.2%" trend="up" icon={Clock} />
            )}
          </div>
        );
      case 'health':
        return (
          <HealthSection 
            completedCount={completedCount}
            inProgressCount={inProgressCount}
            pendingCount={pendingCount}
          />
        );
      case 'activity':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 h-full">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <Zap size={18} className="text-yellow-600" />
              </div>
              Recent Activity
            </h3>
            <div className="space-y-6">
              {recentActivities.map((activity, idx) => {
                const author = MOCK_USERS[activity.userId];
                return (
                  <div key={idx} className="flex gap-4 group">
                    <img 
                      src={author?.avatarUrl} 
                      className="w-8 h-8 rounded-xl object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all shadow-sm" 
                      alt="" 
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">
                        <span className="font-bold text-gray-900 dark:text-white">{author?.name}</span> {activity.content}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest">{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'priorities':
        return <PrioritiesSection activeProjects={activeProjects} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Overview</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {isEditMode ? 'Drag and drop or toggle widgets to customize your view.' : `Welcome back, ${user?.name.split(' ')[0]}. Here's what's happening.`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DashboardToolbar />
          {!isEditMode && canCreateReports && (
            <button className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all active:scale-95">
              New Report
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500">
        {widgets.map((w) => (
          <DashboardWidget key={w.id} id={w.id} colSpan={w.colSpan}>
            {renderWidget(w.id)}
          </DashboardWidget>
        ))}
      </div>

      {isEditMode && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-900 text-white text-xs font-bold rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-8 duration-500 z-50">
           <Layout size={16} className="text-indigo-400" />
           Editing Workspace Layout
           <div className="w-px h-4 bg-gray-700" />
           <span className="text-gray-400">Changes are saved automatically</span>
        </div>
      )}
    </div>
  );
}