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
    <div className="bg-white dark:bg-[#151921] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Activity size={18} />
          </div>
          High Priority
        </h3>
        <Link to="/projects" className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
            View All <ArrowRight size={12} />
        </Link>
      </div>
      
      {activeProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 relative z-10">
          {activeProjects.slice(0, 3).map(project => (
            <Link key={project.id} to={`/projects/${project.code}`} className="group block">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1e222e] border border-slate-200 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    {/* Active Indicator Bar */}
                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-indigo-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-3 pl-2">
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.name}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{project.clientName}</p>
                        </div>
                        <span className="text-[9px] font-black bg-slate-100 dark:bg-[#151921] border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 font-mono">
                            {project.code}
                        </span>
                    </div>
                    
                    <div className="space-y-3 pl-2">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span className="flex items-center gap-1"><Clock size={10} /> Due {new Date(project.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                            <span className="text-indigo-600 dark:text-indigo-400">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-[#151921] rounded-full h-1.5 overflow-hidden border border-slate-100 dark:border-slate-800">
                            <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                                style={{ width: `${project.progress}%` }} 
                            />
                        </div>
                        <div className="flex -space-x-2 pt-1">
                            {project.assignedUsers.slice(0, 3).map(uid => (
                                <img key={uid} src={MOCK_USERS[uid]?.avatarUrl} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#1e222e]" alt="" />
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] text-slate-400 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <Activity size={32} className="mb-2 opacity-20" />
          <p className="font-medium text-xs">No active priorities</p>
        </div>
      )}
    </div>
  );
}