import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface SparklineProps {
  trend: 'up' | 'down';
  color: string;
}

function Sparkline({ trend, color }: SparklineProps) {
  const points = trend === 'up' 
    ? "0,25 5,20 10,22 15,15 20,18 25,10 30,12 35,5 40,8 45,2 50,5"
    : "0,5 5,10 10,8 15,18 20,15 25,22 30,20 35,25 40,22 45,28 50,25";
  
  return (
    <svg viewBox="0 0 50 30" className="w-16 h-8 overflow-visible">
      <path
        d={`M ${points}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
      />
    </svg>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
}

export function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  const isUp = trend === 'up';
  const color = isUp ? '#10b981' : '#ef4444';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
          <Icon size={22} />
        </div>
        <div className="flex flex-col items-end">
          <Sparkline trend={trend} color={color} />
          <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
            isUp 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {change}
            {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{title}</h3>
        <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</div>
      </div>
    </div>
  );
}