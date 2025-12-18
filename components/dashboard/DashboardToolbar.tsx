import { Settings2, Layout, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useDashboardLayout } from '../../context/DashboardLayoutContext';

export function DashboardToolbar() {
  const { isEditMode, toggleEditMode, resetLayout } = useDashboardLayout();

  return (
    <div className="flex items-center gap-2">
      {isEditMode ? (
        <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
          <button 
            onClick={resetLayout}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-red-600 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-all active:scale-95"
          >
            <RotateCcw size={14} />
            Reset Layout
          </button>
          <button 
            onClick={toggleEditMode}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-95"
          >
            <Check size={14} />
            Finish Customizing
          </button>
        </div>
      ) : (
        <button 
          onClick={toggleEditMode}
          className="group flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm transition-all active:scale-95"
        >
          <Settings2 size={14} className="group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline">Customize Dashboard</span>
        </button>
      )}
    </div>
  );
}