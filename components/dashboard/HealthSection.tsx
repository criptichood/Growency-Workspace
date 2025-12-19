import { PieChart } from 'lucide-react';

interface HealthSectionProps {
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
}

export function HealthSection({ completedCount, inProgressCount, pendingCount }: HealthSectionProps) {
  const total = completedCount + inProgressCount + pendingCount || 1;
  
  // Calculate percentages for CSS conic gradient
  const completedPct = (completedCount / total) * 100;
  const inProgressPct = (inProgressCount / total) * 100;
  
  // CSS Conic Gradient Logic
  // Green starts at 0, goes to completedPct
  // Blue starts at completedPct, goes to completedPct + inProgressPct
  // Yellow takes the rest
  const gradient = `conic-gradient(
    #22c55e 0% ${completedPct}%, 
    #3b82f6 ${completedPct}% ${completedPct + inProgressPct}%, 
    #eab308 ${completedPct + inProgressPct}% 100%
  )`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <PieChart size={18} className="text-gray-400" />
          Project Pulse
        </h3>
      </div>

      <div className="flex items-center gap-8">
         {/* Donut Chart */}
         <div className="relative w-24 h-24 shrink-0 rounded-full" style={{ background: gradient }}>
            <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
               <div className="text-center">
                  <span className="block text-xl font-black text-gray-900 dark:text-white">{total}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Total</span>
               </div>
            </div>
         </div>

         {/* Legend */}
         <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm" />
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Done</span>
               </div>
               <span className="text-xs font-black">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Active</span>
               </div>
               <span className="text-xs font-black">{inProgressCount}</span>
            </div>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm" />
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Pending</span>
               </div>
               <span className="text-xs font-black">{pendingCount}</span>
            </div>
         </div>
      </div>
    </div>
  );
}