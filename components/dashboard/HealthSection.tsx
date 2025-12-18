import { PieChart, CheckCircle2, Activity, Clock3, LucideIcon } from 'lucide-react';

interface HealthSectionProps {
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
}

interface HealthRowProps {
  icon: LucideIcon;
  label: string;
  count: number;
  colorClass: 'green' | 'blue' | 'yellow';
}

function HealthRow({ icon: Icon, label, count, colorClass }: HealthRowProps) {
  const themes: Record<string, string> = {
    green: 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20 hover:bg-green-50 text-green-600 dark:text-green-400',
    blue: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20 hover:bg-blue-50 text-blue-600 dark:text-blue-400',
    yellow: 'bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/20 hover:bg-yellow-50 text-yellow-600 dark:text-yellow-400',
  };

  return (
    <div className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all group shrink-0 ${themes[colorClass]}`}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-inherit shrink-0">
          <Icon size={18} />
        </div>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <span className="text-xl font-black">{count}</span>
    </div>
  );
}

export function HealthSection({ completedCount, inProgressCount, pendingCount }: HealthSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col h-fit">
      <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <PieChart size={18} className="text-gray-500" />
        </div>
        Project Health
      </h3>
      <div className="space-y-3.5">
        <HealthRow 
          icon={CheckCircle2} 
          label="Completed" 
          count={completedCount} 
          colorClass="green" 
        />
        <HealthRow 
          icon={Activity} 
          label="In Progress" 
          count={inProgressCount} 
          colorClass="blue" 
        />
        <HealthRow 
          icon={Clock3} 
          label="Pending" 
          count={pendingCount} 
          colorClass="yellow" 
        />
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status Overview</p>
      </div>
    </div>
  );
}