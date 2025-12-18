import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DashboardWidgetConfig, WidgetId } from '../types';

interface DashboardLayoutContextType {
  widgets: DashboardWidgetConfig[];
  isEditMode: boolean;
  toggleEditMode: () => void;
  updateWidget: (id: WidgetId, updates: Partial<DashboardWidgetConfig>) => void;
  reorderWidget: (id: WidgetId, direction: 'up' | 'down') => void;
  resetLayout: () => void;
}

const DEFAULT_LAYOUT: DashboardWidgetConfig[] = [
  { id: 'stats', title: 'Key Metrics', isVisible: true, order: 0, colSpan: 3 },
  { id: 'health', title: 'Project Health', isVisible: true, order: 1, colSpan: 1 },
  { id: 'priorities', title: 'Active Priorities', isVisible: true, order: 2, colSpan: 2 },
  { id: 'activity', title: 'Recent Activity', isVisible: true, order: 3, colSpan: 1 },
];

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined);

export function DashboardLayoutProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('growency_dashboard_layout');
    if (stored) {
      try {
        setWidgets(JSON.parse(stored));
      } catch (e) {
        setWidgets(DEFAULT_LAYOUT);
      }
    } else {
      setWidgets(DEFAULT_LAYOUT);
    }
  }, []);

  const saveLayout = (newLayout: DashboardWidgetConfig[]) => {
    const sorted = [...newLayout].sort((a, b) => a.order - b.order);
    setWidgets(sorted);
    localStorage.setItem('growency_dashboard_layout', JSON.stringify(sorted));
  };

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const updateWidget = (id: WidgetId, updates: Partial<DashboardWidgetConfig>) => {
    const newWidgets = widgets.map(w => w.id === id ? { ...w, ...updates } : w);
    saveLayout(newWidgets);
  };

  const reorderWidget = (id: WidgetId, direction: 'up' | 'down') => {
    const currentIndex = widgets.findIndex(w => w.id === id);
    if (currentIndex === -1) return;

    const newWidgets = [...widgets];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < newWidgets.length) {
      // Swap orders
      const currentOrder = newWidgets[currentIndex].order;
      newWidgets[currentIndex].order = newWidgets[targetIndex].order;
      newWidgets[targetIndex].order = currentOrder;
      
      saveLayout(newWidgets);
    }
  };

  const resetLayout = () => {
    saveLayout(DEFAULT_LAYOUT);
  };

  return (
    <DashboardLayoutContext.Provider value={{ 
      widgets, 
      isEditMode, 
      toggleEditMode, 
      updateWidget, 
      reorderWidget,
      resetLayout 
    }}>
      {children}
    </DashboardLayoutContext.Provider>
  );
}

export function useDashboardLayout() {
  const context = useContext(DashboardLayoutContext);
  if (context === undefined) {
    throw new Error('useDashboardLayout must be used within a DashboardLayoutProvider');
  }
  return context;
}