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

  // 1. Aggregate all tasks assigned to current user
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

  // 2. Filter
  const filteredTasks = allTasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Grouping for Board
  const pendingTasks = filteredTasks.filter(t => !t.isCompleted);
  const completedTasks = filteredTasks.filter(t => t.isCompleted);

  // 4. Grouping for List
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
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <CheckSquare className="text-indigo-600 dark:text-indigo-400" size={32} />
            My Tasks
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            You have <strong className="text-indigo-600 dark:text-indigo-400">{pendingTasks.length} pending tasks</strong> across {Object.keys(groupedByProject).length} projects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
           <button 
             onClick={() => setIsQuickAddOpen(true)}
             className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 text-sm font-bold"
           >
             <Plus size={18} />
             New Task
           </button>

           <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Filter tasks..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
           </div>
           
           <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl shrink-0">
              <button 
                onClick={() => setViewMode('board')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'board' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                title="Board View"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                title="List View"
              >
                <List size={18} />
              </button>
           </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
           <div className="p-5 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4">
              <CheckCircle2 size={32} className="text-gray-300" />
           </div>
           <p className="font-bold text-lg text-gray-600 dark:text-gray-300">No tasks found</p>
           <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You're all caught up! Or try adjusting your search.</p>
           <button 
             onClick={() => setIsQuickAddOpen(true)}
             className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:border-indigo-300 transition-all shadow-sm font-bold text-xs uppercase tracking-widest"
           >
             <Plus size={14} />
             Add your first task
           </button>
        </div>
      ) : (
        <>
          {viewMode === 'board' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full min-h-[500px]">
               {/* To Do Column */}
               <div className="flex flex-col bg-gray-50/50 dark:bg-gray-900/20 rounded-3xl p-4 border border-gray-100 dark:border-gray-800/50">
                  <div className="flex items-center justify-between px-2 mb-4">
                     <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        To Do
                     </h3>
                     <span className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">{pendingTasks.length}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                     {pendingTasks.map(task => (
                        <TaskCard key={task.id} task={task} onToggle={() => toggleTask(task.projectId, task.phaseId, task.id)} />
                     ))}
                     {pendingTasks.length === 0 && (
                        <div className="h-40 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                           No pending tasks
                        </div>
                     )}
                  </div>
               </div>

               {/* Done Column */}
               <div className="flex flex-col bg-gray-50/50 dark:bg-gray-900/20 rounded-3xl p-4 border border-gray-100 dark:border-gray-800/50">
                  <div className="flex items-center justify-between px-2 mb-4">
                     <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Completed
                     </h3>
                     <span className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">{completedTasks.length}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                     {completedTasks.map(task => (
                        <TaskCard key={task.id} task={task} onToggle={() => toggleTask(task.projectId, task.phaseId, task.id)} />
                     ))}
                     {completedTasks.length === 0 && (
                        <div className="h-40 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                           No completed tasks yet
                        </div>
                     )}
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-8">
               {Object.entries(groupedByProject).map(([projectId, group]) => (
                  <div key={projectId} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                     <div className="bg-gray-50/50 dark:bg-gray-900/20 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Layout className="text-indigo-600 dark:text-indigo-400" size={20} />
                           <h3 className="font-bold text-gray-900 dark:text-white">{group.name}</h3>
                           <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded uppercase tracking-widest">{group.code}</span>
                        </div>
                        <Link to={`/projects/${group.code}?tab=tasks`} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                           View Project <ArrowRight size={14} />
                        </Link>
                     </div>
                     <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {group.tasks.map(task => (
                           <div key={task.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                              <div className="flex items-center gap-4">
                                 <button 
                                    onClick={() => toggleTask(task.projectId, task.phaseId, task.id)}
                                    className={`shrink-0 transition-colors ${task.isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'}`}
                                 >
                                    {task.isCompleted ? <CheckCircle2 size={22} className="fill-green-500/20" /> : <Circle size={22} />}
                                 </button>
                                 <div>
                                    <p className={`text-sm font-medium ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{task.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.phaseName}</p>
                                 </div>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${task.isCompleted ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
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
      <div className="group bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer" onClick={onToggle}>
         <div className="flex items-start gap-3">
            <button 
               className={`shrink-0 mt-0.5 transition-colors ${task.isCompleted ? 'text-green-500' : 'text-gray-300 group-hover:text-indigo-500'}`}
            >
               {task.isCompleted ? <CheckCircle2 size={20} className="fill-green-500/20" /> : <Circle size={20} />}
            </button>
            <div className="flex-1 min-w-0">
               <p className={`text-sm font-bold leading-snug mb-2 ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
               </p>
               <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-black bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-lg uppercase tracking-widest truncate max-w-[120px]">
                     {task.projectCode}
                  </span>
                  <span className="text-[9px] font-medium text-gray-400 flex items-center gap-1 truncate">
                     <Clock size={10} />
                     {task.phaseName}
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
}