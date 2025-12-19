import React, { ReactNode } from 'react';
import { EyeOff, Move } from 'lucide-react';
import { useDashboardLayout } from '../../context/DashboardLayoutContext';
import { WidgetId } from '../../types';

interface DashboardWidgetProps {
  id: WidgetId;
  children: ReactNode;
  colSpan?: number; 
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ id, children, colSpan = 1 }) => {
  const { isEditMode, updateWidget, widgets } = useDashboardLayout();
  const widget = widgets.find(w => w.id === id);
  const isVisible = widget ? widget.isVisible : true;

  if (!isVisible && !isEditMode) return null;

  const handleToggleVisibility = () => {
    updateWidget(id, { isVisible: !isVisible });
  };

  // Map configuration colSpan to Tailwind grid classes for responsive behavior
  // Mobile: Always col-span-1 (full width in a grid-cols-1)
  // Tablet: Dynamic or full
  // Desktop: Dynamic based on layout config
  const getGridClass = (span: number) => {
      switch(span) {
          case 3: return 'md:col-span-2 xl:col-span-3'; // Full width on 3-col grid
          case 2: return 'md:col-span-2 xl:col-span-2'; // 2/3 width
          default: return 'md:col-span-1 xl:col-span-1'; // 1/3 width
      }
  };

  return (
    <div className={`relative transition-all duration-300 h-full ${getGridClass(colSpan)} ${
      isEditMode ? 'p-2 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-[2.5rem] bg-indigo-50/5 dark:bg-indigo-900/5' : ''
    } ${!isVisible ? 'opacity-40 grayscale' : ''}`}>
      
      {isEditMode && (
        <div className="absolute -top-3 right-6 flex items-center gap-1 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-full px-3 py-1.5 shadow-lg z-20 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1 text-indigo-400 cursor-move">
            <Move size={12} />
          </div>
          <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-1" />
          <button 
            onClick={handleToggleVisibility}
            className={`p-1 rounded-full transition-colors ${isVisible ? 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700' : 'text-red-500 bg-red-50 dark:bg-red-900/20'}`}
            title={isVisible ? "Hide Widget" : "Show Widget"}
          >
            <EyeOff size={12} />
          </button>
        </div>
      )}
      
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};