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
    <div className="bg-white dark:bg-[#151921] p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-slate-50 dark:to-slate-800/20 rounded-bl-[2rem] -mr-4 -mt-4 transition-all group-hover:scale-110" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
         <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-[#1e222e] border border-slate-100 dark:border-slate-700/50 ${color} shadow-inner`}>
            <Icon size={20} />
         </div>
         <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-full border ${
             isUp 
             ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' 
             : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30'
         }`}>
             {change}
             {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
         </div>
      </div>
      <div className="relative z-10">
         <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h4>
         <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{title}</p>
      </div>
    </div>
  );
}