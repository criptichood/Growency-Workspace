import { AlertTriangle } from 'lucide-react';
import { RiskItem } from '../../services/ai';

interface AiRisksViewProps {
  risks: RiskItem[];
}

export function AiRisksView({ risks }: AiRisksViewProps) {
  if (risks.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        No major risks identified. Good job!
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
      {risks.map((risk, idx) => (
        <div key={idx} className="p-4 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-900/30 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Ambiguity Detected</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-2">"{risk.requirement}"</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{risk.issue}</p>
              <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 text-xs px-2 py-1.5 rounded inline-block">
                Suggestion: {risk.suggestion}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}