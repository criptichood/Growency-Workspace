import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DashboardWidgetConfig, WidgetId } from '../types';

interface DashboardLayoutContextType {
  widgets: DashboardWidgetConfig[];
  isEditMode: boolean;
  toggleEditMode: () => void;
  updateWidget: (id: WidgetId, updates: Partial<DashboardWidgetConfig>) => void;
  reorderWidget: (id: WidgetId, direction: 'up' | 'down') => void;
  resetLayout: () => void;
}

// Updated Default Layout for Modern Look
const DEFAULT_LAYOUT: DashboardWidgetConfig[] = [
  { id: 'welcome', title: 'Welcome', isVisible: true, order: 0, colSpan: 3 }, // Span 3 (Full width on xl:grid-cols-3)
  { id: 'stats', title: 'Key Metrics', isVisible: true, order: 1, colSpan: 3 },
  { id: 'priorities', title: 'Active Priorities', isVisible: true, order: 2, colSpan: 2 },
  { id: 'health', title: 'Health & Activity', isVisible: true, order: 3, colSpan: 1 },
];

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined);

export const DashboardLayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>(() => {
    try {
      const stored = localStorage.getItem('growency_dashboard_layout_v2'); // New key for new layout version
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((w: any) => w.id));
          const missingWidgets = DEFAULT_LAYOUT.filter(d => !existingIds.has(d.id));
          return [...parsed, ...missingWidgets].sort((a, b) => a.order - b.order);
        }
      }
    } catch (e) {
      console.warn('Failed to load dashboard layout:', e);
    }
    return DEFAULT_LAYOUT;
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('growency_dashboard_layout_v2', JSON.stringify(widgets));
  }, [widgets]);

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const updateWidget = (id: WidgetId, updates: Partial<DashboardWidgetConfig>) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const reorderWidget = (id: WidgetId, direction: 'up' | 'down') => {
    const currentIndex = widgets.findIndex(w => w.id === id);
    if (currentIndex === -1) return;

    const newWidgets = [...widgets];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < newWidgets.length) {
      const temp = newWidgets[currentIndex];
      newWidgets[currentIndex] = newWidgets[targetIndex];
      newWidgets[targetIndex] = temp;
      newWidgets.forEach((w, idx) => w.order = idx);
      setWidgets(newWidgets);
    }
  };

  const resetLayout = () => {
    setWidgets(DEFAULT_LAYOUT);
  };

  return (
    <DashboardLayoutContext.Provider value={{ 
      widgets, isEditMode, toggleEditMode, updateWidget, reorderWidget, resetLayout 
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