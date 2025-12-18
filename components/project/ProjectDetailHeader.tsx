import { Link } from 'react-router-dom';
import { ArrowLeft, Layout, CheckCheck } from 'lucide-react';
import { Project } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { useProjects } from '../../context/ProjectContext';

interface ProjectDetailHeaderProps {
  project: Project;
  onEditClick: () => void;
  canEdit: boolean;
}

export function ProjectDetailHeader({ project, onEditClick, canEdit }: ProjectDetailHeaderProps) {
  const { completePhase } = useProjects();

  const handleCompleteSprint = () => {
    // Logic for Complete Sprint: Find the first phase with incomplete tasks and complete it.
    const activePhase = project.phases.find(ph => ph.tasks.some(t => !t.isCompleted));
    if (activePhase) {
      if (confirm(`Mark all tasks in "${activePhase.name}" as complete?`)) {
        completePhase(project.id, activePhase.id);
      }
    } else {
      alert("All current tasks are already complete!");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Link to="/projects" className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Projects
      </Link>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
             <Layout size={32} />
          </div>
          <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
             <div className="flex items-center gap-3 mt-1">
                 <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">{project.clientName}</span>
                 <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                 <StatusBadge status={project.status} />
             </div>
          </div>
        </div>
        <div className="flex gap-3">
            {canEdit && (
              <>
                <button 
                  onClick={onEditClick}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all active:scale-95"
                >
                    Edit
                </button>
                <button 
                  onClick={handleCompleteSprint}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                    <CheckCheck size={16} />
                    Complete Phase
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
}