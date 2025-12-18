import { Copy } from 'lucide-react';

interface AiSummaryViewProps {
  summary: string;
}

export function AiSummaryView({ summary }: AiSummaryViewProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-lg text-indigo-900 dark:text-indigo-100 text-sm leading-relaxed whitespace-pre-line shadow-sm">
        {summary}
      </div>
      <div className="flex justify-end">
        <button 
          onClick={handleCopy}
          className="text-xs flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <Copy size={12} /> Copy to clipboard
        </button>
      </div>
    </div>
  );
}