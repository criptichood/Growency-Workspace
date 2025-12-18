import { Sun, Moon, Laptop, LucideIcon } from 'lucide-react';
import { Theme, useTheme } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  isExpanded: boolean;
}

export function ThemeSwitcher({ isExpanded }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  const modes: { id: Theme; icon: LucideIcon; label: string }[] = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'system', icon: Laptop, label: 'System' },
    { id: 'dark', icon: Moon, label: 'Dark' }
  ];

  return (
    <div className={`bg-gray-100 dark:bg-gray-900/50 rounded-xl p-1 transition-all duration-300 ${isExpanded ? 'flex' : 'flex flex-col space-y-1'}`}>
      {modes.map((mode) => (
        <button 
          key={mode.id}
          onClick={() => setTheme(mode.id)} 
          className={`flex-1 flex items-center justify-center p-1.5 rounded-lg transition-all ${
            theme === mode.id 
              ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
          title={mode.label}
        >
          <mode.icon size={14} />
        </button>
      ))}
    </div>
  );
}