
import React, { useState } from 'react';
import { Search, LayoutGrid, List, CheckCircle2, Circle, Clock, ArrowRight, Layout, CheckSquare, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { Link } from 'react-router-dom';
import { QuickAddTaskModal } from '../components/tasks/QuickAddTaskModal';

interface AggregatedTask {
  id: string;
  title: string;
  isCompleted: boolean;
  assignedTo?: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  phaseId: string;
  phaseName: string;
}

export function MyTasks() {
  const { user } = useAuth();
  const { projects, toggleTask } = useProjects();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchTerm, setSearchTerm] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  if (!user) return null;

  const canManageTasks = user.roles.some(r => ['SuperAdmin', 'Admin', 'Manager'].includes(r));

  const allTasks: AggregatedTask[] = projects.flatMap(p => 
    p.phases.flatMap(ph => 
      ph.tasks
        .filter(t => t.assignedTo === user.id)
        .map(t => ({
          ...t,
          projectId: p.id,
          projectName: p.name,
          projectCode: p.code,
          phaseId: ph.id,
          phaseName: ph.name
        }))
    )
  );

  const filteredTasks = allTasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(t => !t.isCompleted);
  const completedTasks = filteredTasks.filter(t => t.isCompleted);

  const groupedByProject = filteredTasks.reduce((acc, task) => {
    if (!acc[task.projectId]) {
      acc[task.projectId] = {
        name: task.projectName,
        code: task.projectCode,
        tasks: []
      };
    }
    acc[task.projectId].tasks.push(task);
    return acc;
  }, {} as Record<string, { name: string; code: string; tasks: AggregatedTask[] }>);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
               <CheckSquare size={24} />
            </div>
            My Tasks
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium ml-1">
            You have <strong className="text-indigo-600 dark:text-indigo-400">{pendingTasks.length} pending tasks</strong> across {Object.keys(groupedByProject).length} projects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
           {canManageTasks && (
             <button 
               onClick={() => setIsQuickAddOpen(true)}
               className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 text-sm font-bold"
             >
               <Plus size={18} />
               New Task
             </button>
           )}

           <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filter tasks..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#151921] border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
           </div>
           
           <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl shrink-0 border border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setViewMode('board')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'board' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                title="Board View"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                title="List View"
              >
                <List size={18} />
              </button>
           </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-[#151921] rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
           <div className="p-5 bg-white dark:bg-[#1e222e] rounded-full shadow-sm mb-4">
              <CheckCircle2 size={32} className="text-slate-300" />
           </div>
           <p className="font-bold text-lg text-slate-600 dark:text-slate-300">No tasks found</p>
           <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">You're all caught up! Or try adjusting your search.</p>
           {canManageTasks && (
             <button 
               onClick={() => setIsQuickAddOpen(true)}
               className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-[#1e222e] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:border-indigo-300 transition-all shadow-sm font-bold text-xs uppercase tracking-widest"
             >
               <Plus size={14} />
               Add your first task
             </button>
           )}
        </div>
      ) : (
        <>
          {viewMode === 'board' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full min-h-[500px]">
               {/* To Do Column */}
               <div className="flex flex-col bg-slate-100/50 dark:bg-[#0f1117] rounded-[2rem] p-4 border border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center justify-between px-2 mb-4">
                     <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        To Do
                     </h3>
                     <span className="bg-white dark:bg-[#1e222e] text-slate-500 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700">{pendingTasks.length}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                     {pendingTasks.map(task => (
                        <TaskCard key={task.id} task={task} onToggle={() => toggleTask(task.projectId, task.phaseId, task.id)} />
                     ))}
                     {pendingTasks.length === 0 && (
                        <div className="h-40 flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                           No pending tasks
                        </div>
                     )}
                  </div>
               </div>

               {/* Done Column */}
               <div className="flex flex-col bg-slate-100/50 dark:bg-[#0f1117] rounded-[2rem] p-4 border border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center justify-between px-2 mb-4">
                     <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        Completed
                     </h3>
                     <span className="bg-white dark:bg-[#1e222e] text-slate-500 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700">{completedTasks.length}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                     {completedTasks.map(task => (
                        <TaskCard key={task.id} task={task} onToggle={() => toggleTask(task.projectId, task.phaseId, task.id)} />
                     ))}
                     {completedTasks.length === 0 && (
                        <div className="h-40 flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                           No completed tasks yet
                        </div>
                     )}
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-8">
               {Object.entries(groupedByProject).map(([projectId, group]) => (
                  <div key={projectId} className="bg-white dark:bg-[#151921] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                     <div className="bg-slate-50/50 dark:bg-[#1e222e]/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                              <Layout className="text-indigo-600 dark:text-indigo-400" size={16} />
                           </div>
                           <h3 className="font-bold text-slate-900 dark:text-white">{group.name}</h3>
                           <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded uppercase tracking-widest">{group.code}</span>
                        </div>
                        <Link to={`/projects/${group.code}?tab=tasks`} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                           View Project <ArrowRight size={14} />
                        </Link>
                     </div>
                     <div className="p-2 space-y-1">
                        {group.tasks.map(task => (
                           <div key={task.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-[#1e222e] rounded-xl transition-colors group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                              <div className="flex items-center gap-4">
                                 <button 
                                    onClick={() => toggleTask(task.projectId, task.phaseId, task.id)}
                                    className={`shrink-0 transition-colors ${task.isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
                                 >
                                    {task.isCompleted ? <CheckCircle2 size={20} className="fill-emerald-500/10" /> : <Circle size={20} />}
                                 </button>
                                 <div>
                                    <p className={`text-sm font-bold ${task.isCompleted ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-900 dark:text-white'}`}>{task.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{task.phaseName}</p>
                                 </div>
                              </div>
                              <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border ${
                                  task.isCompleted 
                                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                              }`}>
                                 {task.isCompleted ? 'Done' : 'Pending'}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
          )}
        </>
      )}

      <QuickAddTaskModal 
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
}

const TaskCard: React.FC<{ task: AggregatedTask, onToggle: () => void }> = ({ task, onToggle }) => {
   return (
      <div className="group bg-white dark:bg-[#1e222e] p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all cursor-pointer relative" onClick={onToggle}>
         <div className="flex items-start gap-3">
            <button 
               className={`shrink-0 mt-0.5 transition-colors ${task.isCompleted ? 'text-emerald-500' : 'text-slate-300 group-hover:text-indigo-500'}`}
            >
               {task.isCompleted ? <CheckCircle2 size={20} className="fill-emerald-500/10" /> : <Circle size={20} />}
            </button>
            <div className="flex-1 min-w-0">
               <p className={`text-sm font-bold leading-snug mb-3 ${task.isCompleted ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-900 dark:text-white'}`}>
                  {task.title}
               </p>
               <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-black bg-slate-100 dark:bg-[#151921] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg uppercase tracking-widest truncate max-w-[120px]">
                     {task.projectCode}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 truncate">
                     <Clock size={10} />
                     {task.phaseName}
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
}
