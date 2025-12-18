import { ProjectStatus } from '../../types';
import { AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const styles = {
    'In Progress': 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/50',
    'Completed': 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-100 dark:border-green-900/50',
    'Pending': 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-100 dark:border-yellow-900/50',
    'On Hold': 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
    'Deletion Requested': 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30 animate-pulse',
  };
  
  const currentStyle = styles[status] || styles['On Hold'];

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1 ${currentStyle} ${className}`}>
      {status === 'Deletion Requested' && <AlertTriangle size={10} />}
      {status}
    </span>
  );
}