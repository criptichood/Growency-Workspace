import { Calendar, MessageSquare, Plus, ListTodo, CheckCircle2, ChevronRight, Clock, User as UserIcon } from 'lucide-react';
import { Project } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTeam } from '../../context/TeamContext';

interface ProjectOverviewProps {
  project: Project;
  onEditClick: () => void;
  onMessageClick: (userName: string) => void;
  onTabChange?: (tab: 'overview' | 'tasks' | 'brief' | 'chat' | 'notes') => void;
}

export function ProjectOverview({ project, onEditClick, onMessageClick, onTabChange }: ProjectOverviewProps) {
  const { user } = useAuth();
  const { getUser } = useTeam();
  const isAdmin = user?.role === 'Admin';

  const totalTasks = project.phases.flatMap(p => p.tasks).length;
  const completedTasks = project.phases.flatMap(p => p.tasks).filter(t => t.isCompleted).length;
  
  // Find the index of the first phase that has incomplete tasks
  const activePhaseIndex = project.phases.findIndex(ph => ph.tasks.some(t => !t.isCompleted));
  const activePhase = activePhaseIndex !== -1 ? project.phases[activePhaseIndex] : null;

  const creator = getUser(project.createdBy);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Description</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{project.description}</p>
          
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="bg-gray-50 dark:bg-gray-900/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Task Completion</p>
                  <div className="flex items-end justify-between mb-4">
                     <div className="text-4xl font-black text-gray-900 dark:text-white">
                        {project.progress}<span className="text-indigo-600 dark:text-indigo-400 text-lg">%</span>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{completedTasks} of {totalTasks} tasks done</p>
                     </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-700" style={{ width: `${project.progress}%` }}></div>
                </div>
             </div>

             <div className="bg-gray-50 dark:bg-gray-900/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Milestone Status</p>
                <div className="space-y-2">
                   {project.phases.slice(0, 4).map((phase, idx) => {
                     const totalPhTasks = phase.tasks.length;
                     const donePhTasks = phase.tasks.filter(t => t.isCompleted).length;
                     const isDone = totalPhTasks > 0 && donePhTasks === totalPhTasks;
                     const isActive = idx === activePhaseIndex;
                     
                     return (
                       <button 
                         key={phase.id} 
                         onClick={() => onTabChange?.('tasks')}
                         className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all group/ms ${
                           isActive 
                           ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02] z-10' 
                           : isDone 
                           ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-800/30' 
                           : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-800'
                         }`}
                       >
                          <div className="flex items-center gap-2 overflow-hidden">
                             {isDone ? (
                               <div className="p-1 bg-green-500 rounded-full text-white shrink-0">
                                 <CheckCircle2 size={12} />
                               </div>
                             ) : isActive ? (
                               <div className="p-1 bg-white rounded-full text-indigo-600 shrink-0 animate-pulse">
                                 <Clock size={12} />
                               </div>
                             ) : (
                               <div className="w-4 h-4 rounded-full border-2 border-gray-200 dark:border-gray-700 shrink-0" />
                             )}
                             <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                               {phase.name}
                             </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {isActive && (
                              <span className="text-[8px] font-black bg-white/20 text-white px-1.5 py-0.5 rounded uppercase tracking-widest">
                                Current
                              </span>
                            )}
                            <span className={`text-[9px] font-black tabular-nums ${isActive ? 'text-indigo-100' : 'text-gray-400'}`}>
                              {donePhTasks}/{totalPhTasks}
                            </span>
                            <ChevronRight size={12} className={isActive ? 'text-white' : 'text-gray-300'} />
                          </div>
                       </button>
                     );
                   })}
                   {project.phases.length > 4 && (
                     <p className="text-[10px] text-gray-400 font-bold uppercase pt-1 text-center">+{project.phases.length - 4} more phases</p>
                   )}
                </div>
             </div>
          </div>
        </div>

        <div className="bg-indigo-600 dark:bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl">
           <div className="relative z-10">
              <h4 className="text-xl font-black mb-2">Next Deliverable</h4>
              <p className="text-indigo-100 text-sm max-w-md mb-6">
                The current focus is completing the &quot;{activePhase?.name || 'final'}&quot; phase. There are {activePhase?.tasks.filter(t => !t.isCompleted).length || 0} tasks remaining.
              </p>
              <button 
                onClick={() => onTabChange?.('tasks')}
                className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-md active:scale-95"
              >
                 Review Workspace Plane
              </button>
           </div>
           <ListTodo className="absolute -bottom-4 -right-4 w-40 h-40 text-white/10 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
        </div>
      </div>

      <div className="space-y-6">
         <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Project Info</h3>
             </div>
             <div className="space-y-5">
                 {/* Created By Section */}
                 <div>
                     <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-black mb-2">Created By</div>
                     <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-600">
                        {creator ? (
                            <>
                                <img src={creator.avatarUrl} alt={creator.name} className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-600 object-cover" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-900 dark:text-white">{creator.name}</span>
                                    <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium">@{creator.username}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <UserIcon size={14} />
                                </div>
                                <span className="text-xs font-bold">Unknown User</span>
                            </div>
                        )}
                     </div>
                 </div>

                 <div>
                     <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-black mb-2">Client</div>
                     <div className="text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-600">{project.clientName}</div>
                 </div>
                 <div>
                     <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-black mb-2">Due Date</div>
                     <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-600">
                         <Calendar size={14} className="text-indigo-500" />
                         {project.dueDate}
                     </div>
                 </div>
                 <div>
                     <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-black mb-3">Workspace Team</div>
                     <div className="space-y-2">
                         {project.assignedUsers.map((userId) => {
                             const member = getUser(userId);
                             if (!member) return null;
                             return (
                               <div key={userId} className="flex items-center justify-between group/user p-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-colors">
                                  <div className="flex items-center gap-3">
                                    <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-xl border-2 border-white dark:border-gray-800 bg-gray-100 shadow-sm" />
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-gray-900 dark:text-white leading-none mb-1">{member.name}</span>
                                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.role}</span>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => onMessageClick(member.name)}
                                    className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all opacity-0 group-hover/user:opacity-100 focus:opacity-100"
                                    title={`Message ${member.name}`}
                                  >
                                    <MessageSquare size={14} />
                                  </button>
                               </div>
                             );
                         })}
                         
                         {isAdmin && (
                             <button 
                               onClick={onEditClick} 
                               className="w-full mt-2 flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 hover:border-indigo-400 dark:hover:text-indigo-400 transition-all"
                             >
                                 <Plus size={12} />
                                 Add Team Member
                             </button>
                         )}
                     </div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}