import { User } from 'lucide-react';
import { ActionItem } from '../../services/ai';

interface AiActionsViewProps {
  actions: ActionItem[];
}

export function AiActionsView({ actions }: AiActionsViewProps) {
  if (actions.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        No pending actions found in recent context.
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
      {actions.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors group">
          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
            item.priority === 'High' ? 'bg-red-500' : item.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
          }`} />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{item.task}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">{item.priority}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
               <span className="flex items-center gap-1"><User size={12} /> {item.assignee}</span>
               <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
               <span>Source: {item.source}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}