import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color?: string;
}

export function StatCard({ title, value, change, trend, icon: Icon, color = "text-indigo-600" }: StatCardProps) {
  const isUp = trend === 'up';

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
         <div className={`p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 ${color}`}>
            <Icon size={20} />
         </div>
         <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${
             isUp ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
         }`}>
             {change}
             {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
         </div>
      </div>
      <div>
         <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</h4>
         <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{title}</p>
      </div>
    </div>
  );
}