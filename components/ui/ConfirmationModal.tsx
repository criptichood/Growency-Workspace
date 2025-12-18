import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = 'Delete', 
  cancelLabel = 'Cancel',
  variant = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const colors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
    info: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20',
  };

  const iconColors = {
    danger: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    warning: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    info: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-2xl ${iconColors[variant]}`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{message}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
            >
              {cancelLabel}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-6 py-3 text-sm font-bold rounded-2xl shadow-lg transition-all active:scale-95 ${colors[variant]}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}