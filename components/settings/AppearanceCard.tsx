import React from 'react';
import { Palette, Sun, Moon, Laptop, LucideIcon, LayoutGrid, LayoutList } from 'lucide-react';
import { Theme } from '../../context/ThemeContext';
import { useStore } from '../../hooks/useStore';

interface AppearanceCardProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function AppearanceCard({ currentTheme, onThemeChange }: AppearanceCardProps) {
  const { settings, updateSettings } = useStore();
  
  const modes: { id: Theme; icon: LucideIcon; label: string; desc: string }[] = [
    { id: 'light', icon: Sun, label: 'Light', desc: 'Clear and high contrast' },
    { id: 'dark', icon: Moon, label: 'Dark', desc: 'Reduced eye strain' },
    { id: 'system', icon: Laptop, label: 'System', desc: 'Matches device settings' }
  ];

  return (
    <section className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-8 space-y-10">
        <div className="sm:flex gap-10">
          <div className="sm:w-1/3 mb-6 sm:mb-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Palette size={20} className="text-indigo-600 dark:text-indigo-400" />
              Theme Mode
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Personalize the workspace look and feel to your preference.</p>
          </div>
          <div className="sm:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onThemeChange(mode.id)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${
                      currentTheme === mode.id
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 ring-4 ring-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/20 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                    }`}
                  >
                    <mode.icon size={28} className={`mb-3 transition-transform ${currentTheme === mode.id ? 'scale-110' : ''}`} />
                    <span className="text-sm font-bold uppercase tracking-wider">{mode.label}</span>
                    <span className="text-[10px] mt-1 font-medium opacity-60 text-center">{mode.desc}</span>
                  </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 dark:border-gray-700 sm:flex gap-10">
          <div className="sm:w-1/3 mb-6 sm:mb-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <LayoutGrid size={20} className="text-indigo-600 dark:text-indigo-400" />
              Workspace Density
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Control the information density of your workspace UI.</p>
          </div>
          <div className="sm:w-2/3">
             <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                      <LayoutList size={20} className="text-indigo-600 dark:text-indigo-400" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Compact Mode</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Reduce padding and font sizes to see more data at once.</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.compactMode}
                    onChange={(e) => updateSettings({ compactMode: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/30 dark:peer-focus:ring-indigo-800/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 shadow-inner"></div>
                </label>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}