import { PieChart } from 'lucide-react';

interface HealthSectionProps {
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
}

export function HealthSection({ completedCount, inProgressCount, pendingCount }: HealthSectionProps) {
  const total = completedCount + inProgressCount + pendingCount || 1;
  
  const completedPct = (completedCount / total) * 100;
  const inProgressPct = (inProgressCount / total) * 100;
  
  const gradient = `conic-gradient(
    #10b981 0% ${completedPct}%, 
    #6366f1 ${completedPct}% ${completedPct + inProgressPct}%, 
    #f59e0b ${completedPct + inProgressPct}% 100%
  )`;

  return (
    <div className="bg-white dark:bg-[#151921] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PieChart size={18} className="text-slate-400" />
          Project Pulse
        </h3>
      </div>

      <div className="flex items-center gap-6 relative z-10">
         {/* Donut Chart with Glow */}
         <div className="relative w-28 h-28 shrink-0 rounded-full shadow-lg" style={{ background: gradient }}>
            <div className="absolute inset-3 bg-white dark:bg-[#151921] rounded-full flex items-center justify-center shadow-inner">
               <div className="text-center">
                  <span className="block text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{total}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
               </div>
            </div>
         </div>

         {/* Legend Tiles */}
         <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#1e222e]">
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Done</span>
               </div>
               <span className="text-xs font-black text-slate-900 dark:text-white">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#1e222e]">
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Active</span>
               </div>
               <span className="text-xs font-black text-slate-900 dark:text-white">{inProgressCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#1e222e]">
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Pending</span>
               </div>
               <span className="text-xs font-black text-slate-900 dark:text-white">{pendingCount}</span>
            </div>
         </div>
      </div>
    </div>
  );
}