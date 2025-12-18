import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { Project } from '../../types';
import { ProjectSummaryCard } from './ProjectSummaryCard';

interface PrioritiesSectionProps {
  activeProjects: Project[];
}

export function PrioritiesSection({ activeProjects }: PrioritiesSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <Activity size={18} className="text-indigo-600" />
          </div>
          Active Priorities
        </h3>
        <Link to="/projects" className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-100 dark:border-indigo-900 pb-0.5 transition-colors">View Workspace</Link>
      </div>
      
      {activeProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 flex-1">
          {activeProjects.slice(0, 4).map(project => (
            <ProjectSummaryCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-gray-400 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700">
          <Activity size={40} className="mb-4 opacity-20" />
          <p className="font-medium text-sm">All clear! No active projects found.</p>
        </div>
      )}
    </div>
  );
}