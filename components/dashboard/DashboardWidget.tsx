import React, { ReactNode } from 'react';
import { ArrowUp, ArrowDown, EyeOff, Maximize2, Minimize2, Move } from 'lucide-react';
import { useDashboardLayout } from '../../context/DashboardLayoutContext';
import { WidgetId } from '../../types';

interface DashboardWidgetProps {
  id: WidgetId;
  children: ReactNode;
  colSpan?: 1 | 2 | 3;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ id, children, colSpan = 1 }) => {
  const { isEditMode, reorderWidget, updateWidget, widgets } = useDashboardLayout();
  const widget = widgets.find(w => w.id === id);

  if (!widget?.isVisible && !isEditMode) return null;

  const handleToggleVisibility = () => {
    updateWidget(id, { isVisible: !widget?.isVisible });
  };

  const handleToggleSpan = () => {
    const newSpan = widget?.colSpan === 3 ? 1 : widget?.colSpan === 1 ? 2 : 3;
    updateWidget(id, { colSpan: newSpan as 1 | 2 | 3 });
  };

  const spanClass = {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3'
  }[colSpan];

  return (
    <div className={`relative transition-all duration-500 ease-in-out ${spanClass} ${
      isEditMode ? 'p-2 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-[2.5rem] bg-indigo-50/5 dark:bg-indigo-900/5' : ''
    } ${!widget?.isVisible ? 'opacity-40 grayscale' : ''}`}>
      {isEditMode && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-full px-2 py-1 shadow-lg z-20 animate-in fade-in zoom-in-95 duration-200">
          <button 
            onClick={() => reorderWidget(id, 'up')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
            title="Move Up"
          >
            <ArrowUp size={14} />
          </button>
          <button 
            onClick={() => reorderWidget(id, 'down')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
            title="Move Down"
          >
            <ArrowDown size={14} />
          </button>
          <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-1" />
          <button 
            onClick={handleToggleSpan}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
            title="Change Width"
          >
            {widget?.colSpan === 3 ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button 
            onClick={handleToggleVisibility}
            className={`p-1 rounded-full transition-colors ${widget?.isVisible ? 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700' : 'text-red-500 bg-red-50 dark:bg-red-900/20'}`}
            title={widget?.isVisible ? "Hide Widget" : "Show Widget"}
          >
            <EyeOff size={14} />
          </button>
          <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-1" />
          <div className="p-1 text-indigo-500">
            <Move size={14} />
          </div>
        </div>
      )}
      
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};