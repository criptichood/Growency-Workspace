import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { Project, ProjectBrief } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { INPUT_LIMITS } from '../../constants';

interface BriefTabProps {
  project: Project;
  canEdit: boolean;
  onUpdate: (data: Partial<Project>) => void;
}

export function BriefTab({ project, canEdit, onUpdate }: BriefTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProjectBrief>(project.brief);
  const { user } = useAuth();

  const handleSave = () => {
    const updatedBrief: ProjectBrief = {
      ...formData,
      version: project.brief.version + 1,
      lastUpdatedBy: user?.id || 'unknown',
      lastUpdatedAt: new Date().toISOString()
    };
    onUpdate({ brief: updatedBrief });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(project.brief);
    setIsEditing(false);
  };

  const InputField = ({ label, field, multiline = false }: { label: string, field: keyof ProjectBrief, multiline?: boolean }) => {
    const value = formData[field] as string;
    const maxLength = multiline ? INPUT_LIMITS.DESCRIPTION : INPUT_LIMITS.SHORT_TEXT;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
          <span className={`text-[10px] font-medium ${value.length >= maxLength ? 'text-red-500' : 'text-gray-400'}`}>
            {value.length}/{maxLength}
          </span>
        </div>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            maxLength={maxLength}
            rows={4}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            maxLength={maxLength}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        )}
      </div>
    );
  };

  const DisplayField = ({ label, value }: { label: string, value: string }) => (
    <div className="mb-6">
      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</h4>
      {value ? (
        <p className="text-gray-900 dark:text-gray-200 whitespace-pre-line leading-relaxed">{value}</p>
      ) : (
        <p className="text-gray-400 dark:text-gray-500 italic text-sm">Not specified</p>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-700/30">
        <div>
           <h3 className="font-semibold text-gray-900 dark:text-white">Project Requirements</h3>
           <p className="text-xs text-gray-500 dark:text-gray-400">Version {project.brief.version} • Last updated {new Date(project.brief.lastUpdatedAt).toLocaleDateString()}</p>
        </div>
        {canEdit && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <Edit2 size={16} />
            Edit Brief
          </button>
        )}
        {isEditing && (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
            >
              <Save size={16} />
              Save
            </button>
          </div>
        )}
      </div>
      
      <div className="p-6 md:p-8">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
                <InputField label="Client Goal" field="clientGoal" />
             </div>
             <div className="md:col-span-2">
                <InputField label="Problem Statement" field="problemStatement" multiline />
             </div>
             <div>
                <InputField label="Requested Features" field="requestedFeatures" multiline />
             </div>
             <div>
                <InputField label="Must Haves" field="mustHaves" multiline />
             </div>
             <div>
                <InputField label="Nice to Haves" field="niceToHaves" multiline />
             </div>
             <div>
                <InputField label="Constraints" field="constraints" multiline />
             </div>
             <div className="md:col-span-2">
                <InputField label="Open Questions" field="openQuestions" multiline />
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="md:col-span-2">
                <DisplayField label="Client Goal" value={project.brief.clientGoal} />
             </div>
             <div className="md:col-span-2">
                <DisplayField label="Problem Statement" value={project.brief.problemStatement} />
             </div>
             <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl">
                <DisplayField label="Requested Features" value={project.brief.requestedFeatures} />
             </div>
             <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl">
                <DisplayField label="Must Haves" value={project.brief.mustHaves} />
             </div>
             <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl">
                <DisplayField label="Nice to Haves" value={project.brief.niceToHaves} />
             </div>
             <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl">
                <DisplayField label="Constraints" value={project.brief.constraints} />
             </div>
             <div className="md:col-span-2 border-t border-gray-100 dark:border-gray-700 pt-6">
                <DisplayField label="Open Questions" value={project.brief.openQuestions} />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}