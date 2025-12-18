import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { MOCK_USERS } from '../../constants';

interface ProjectSummaryCardProps {
  project: Project;
}

export const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({ project }) => {
  // Only render avatars for users that actually exist in MOCK_USERS to prevent "stray" or broken icons
  const assignedTeam = project.assignedUsers
    .map(id => MOCK_USERS[id])
    .filter(Boolean);

  return (
    <Link to={`/projects/${project.code}`} className="block group h-full">
      <div className="h-full p-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-750 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="min-w-0 flex-1">
             <div className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">{project.code}</div>
             <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
               {project.name}
             </h4>
          </div>
          <StatusBadge status={project.status} className="!text-[10px] shrink-0" />
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-1">
          {project.clientName}
        </p>
        
        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
              <span>Progress</span>
              <span className="text-indigo-600 dark:text-indigo-400">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${project.progress}%` }} 
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex -space-x-2 overflow-visible flex-nowrap shrink-0">
              {assignedTeam.slice(0, 3).map((user, i) => (
                <img
                  key={user.id}
                  className="relative inline-block h-7 w-7 rounded-lg ring-2 ring-white dark:ring-gray-800 object-cover bg-gray-100 dark:bg-gray-700 shrink-0"
                  src={user.avatarUrl}
                  alt={user.name}
                  title={user.name}
                  style={{ zIndex: 10 - i }}
                />
              ))}
              {assignedTeam.length > 3 && (
                <div className="relative flex items-center justify-center h-7 w-7 rounded-lg bg-gray-200 dark:bg-gray-700 text-[10px] font-bold text-gray-500 dark:text-gray-400 ring-2 ring-white dark:ring-gray-800 shrink-0 z-0">
                  +{assignedTeam.length - 3}
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
};