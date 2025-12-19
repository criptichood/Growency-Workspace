import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Clock } from 'lucide-react';
import { Project } from '../../types';
import { MOCK_USERS } from '../../constants';

interface PrioritiesSectionProps {
  activeProjects: Project[];
}

export function PrioritiesSection({ activeProjects }: PrioritiesSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
            <Activity size={18} />
          </div>
          High Priority
        </h3>
        <Link to="/projects" className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
            View All <ArrowRight size={12} />
        </Link>
      </div>
      
      {activeProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {activeProjects.slice(0, 3).map(project => (
            <Link key={project.id} to={`/projects/${project.code}`} className="group block">
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-750 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 transition-colors">{project.name}</h4>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{project.clientName}</p>
                        </div>
                        <span className="text-[9px] font-black bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-2 py-1 rounded-lg text-gray-500">
                            {project.code}
                        </span>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-medium text-gray-400">
                            <span className="flex items-center gap-1"><Clock size={10} /> Due {new Date(project.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-700" 
                                style={{ width: `${project.progress}%` }} 
                            />
                        </div>
                        <div className="flex -space-x-1.5 pt-1">
                            {project.assignedUsers.slice(0, 3).map(uid => (
                                <img key={uid} src={MOCK_USERS[uid]?.avatarUrl} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800" alt="" />
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] text-gray-400 bg-gray-50/30 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700">
          <Activity size={32} className="mb-2 opacity-20" />
          <p className="font-medium text-xs">No active priorities</p>
        </div>
      )}
    </div>
  );
}