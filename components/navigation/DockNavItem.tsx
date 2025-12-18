import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface DockNavItemProps {
  path: string;
  icon: LucideIcon;
  label: string;
  isExpanded: boolean;
}

export function DockNavItem({ path, icon: Icon, label, isExpanded }: DockNavItemProps) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center rounded-xl transition-all duration-300 group relative ${
          isExpanded ? 'px-3 py-2.5' : 'justify-center p-2.5'
        } ${
          isActive
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
        }`
      }
    >
      <Icon size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
      <span className={`ml-3 font-bold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
        {label}
      </span>
      
      {!isExpanded && (
        <div className="absolute left-full ml-6 px-3 py-1.5 bg-gray-900 dark:bg-gray-950 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap shadow-xl z-50">
          {label}
        </div>
      )}
    </NavLink>
  );
}