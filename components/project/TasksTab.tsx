import React, { useState, useMemo } from 'react';
import { CheckCircle2, Circle, Plus, ListTodo, ChevronDown, ChevronRight, Trash2, Clock } from 'lucide-react';
import { Project, ProjectPhase } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { MOCK_USERS } from '../../constants';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface TasksTabProps {
  project: Project;
}

export function TasksTab({ project }: TasksTabProps) {
  const { toggleTask, addTaskToPhase, addPhase, deletePhase, deleteTask } = useProjects();
  const [newPhaseName, setNewPhaseName] = useState('');
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  
  // Confirmation state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const activePhaseId = useMemo(() => {
    const active = project.phases.find(ph => ph.tasks.some(t => !t.isCompleted));
    return active?.id || project.phases[0]?.id;
  }, [project.phases]);

  const [expandedPhases, setExpandedPhases] = useState<string[]>([activePhaseId]);

  const togglePhaseExpansion = (phaseId: string) => {
    setExpandedPhases(prev => 
      prev.includes(phaseId) ? prev.filter(id => id !== phaseId) : [...prev, phaseId]
    );
  };

  const handleAddPhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhaseName.trim()) return;
    addPhase(project.id, newPhaseName);
    setNewPhaseName('');
    setIsAddingPhase(false);
  };

  const handleDeletePhaseRequest = (phaseId: string, phaseName: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Phase',
      message: `Are you sure you want to delete "${phaseName}"? This will permanently remove all tasks within this phase.`,
      onConfirm: () => deletePhase(project.id, phaseId)
    });
  };

  const handleDeleteTaskRequest = (phaseId: string, taskId: string, taskTitle: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Task',
      message: `Permanently delete "${taskTitle}" from this project plan?`,
      onConfirm: () => deleteTask(project.id, phaseId, taskId)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <ListTodo size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Workspace Plane</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Manage project roadmap and task execution.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddingPhase(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all active:scale-95"
        >
          <Plus size={16} />
          New Phase
        </button>
      </div>

      {isAddingPhase && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg">
          <form onSubmit={handleAddPhase} className="flex gap-2">
            <input 
              type="text" 
              autoFocus
              value={newPhaseName}
              onChange={(e) => setNewPhaseName(e.target.value)}
              placeholder="Enter phase name (e.g., Development, Launch)..."
              className="flex-1 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="button" onClick={() => setIsAddingPhase(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl">Create</button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {project.phases.map((phase) => (
          <PhaseCard 
            key={phase.id} 
            phase={phase} 
            projectId={project.id}
            isExpanded={expandedPhases.includes(phase.id)}
            isActive={phase.id === activePhaseId}
            onToggleExpand={() => togglePhaseExpansion(phase.id)}
            onToggleTask={(taskId) => toggleTask(project.id, phase.id, taskId)}
            onAddTask={(title) => addTaskToPhase(project.id, phase.id, title)}
            onDeletePhase={() => handleDeletePhaseRequest(phase.id, phase.name)}
            onDeleteTask={(taskId, title) => handleDeleteTaskRequest(phase.id, taskId, title)}
          />
        ))}
      </div>

      <ConfirmationModal 
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
      />
    </div>
  );
}

function PhaseCard({ phase, isExpanded, isActive, onToggleExpand, onToggleTask, onAddTask, onDeletePhase, onDeleteTask }: { 
  phase: ProjectPhase, 
  projectId: string,
  isExpanded: boolean,
  isActive: boolean,
  onToggleExpand: () => void,
  onToggleTask: (tid: string) => void,
  onAddTask: (title: string) => void,
  onDeletePhase: () => void,
  onDeleteTask: (tid: string, title: string) => void
}) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const completedCount = phase.tasks.filter(t => t.isCompleted).length;
  const totalCount = phase.tasks.length;
  const isAllComplete = totalCount > 0 && completedCount === totalCount;

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border rounded-3xl transition-all duration-300 overflow-hidden shadow-sm ${
      isActive ? 'ring-2 ring-indigo-500/30 border-indigo-200 dark:border-indigo-800' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
          isExpanded ? 'bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-700' : ''
        }`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
          <div className="flex flex-col">
            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {phase.name}
              {isAllComplete ? <CheckCircle2 size={16} className="text-green-500" /> : isActive ? <Clock size={16} className="text-indigo-500 animate-pulse" /> : null}
            </h4>
            {isActive && !isExpanded && (
               <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Active Sprint</span>
            )}
          </div>
          <span className="text-[10px] font-black bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
            {completedCount}/{totalCount}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ${isAllComplete ? 'bg-green-500' : isActive ? 'bg-indigo-600' : 'bg-gray-400'}`} 
              style={{ width: `${totalCount === 0 ? 0 : (completedCount/totalCount)*100}%` }} 
            />
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onDeletePhase(); }}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete Phase"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
          {phase.tasks.length === 0 ? (
            <p className="text-center py-4 text-xs font-medium text-gray-400">No tasks defined for this phase yet.</p>
          ) : (
            phase.tasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-3 rounded-2xl group transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                    className={`shrink-0 transition-colors ${task.isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'}`}
                  >
                    {task.isCompleted ? <CheckCircle2 size={22} fill="currentColor" className="text-green-500 fill-green-500/20" /> : <Circle size={22} />}
                  </button>
                  <span className={`text-sm font-medium truncate text-gray-700 dark:text-gray-200`}>
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {task.assignedTo && (
                    <img src={MOCK_USERS[task.assignedTo]?.avatarUrl} className="w-6 h-6 rounded-full border border-white dark:border-gray-600" title={MOCK_USERS[task.assignedTo]?.name} alt="" />
                  )}
                  <button 
                    onClick={() => onDeleteTask(task.id, task.title)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}

          {isAddingTask ? (
            <form onSubmit={handleAddTaskSubmit} className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
              <input 
                type="text" 
                autoFocus
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 bg-transparent border-none text-sm text-gray-900 dark:text-white outline-none px-2"
              />
              <button type="button" onClick={() => setIsAddingTask(false)} className="px-3 py-1.5 text-xs font-bold text-gray-500">Cancel</button>
              <button type="submit" className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-xl">Add Task</button>
            </form>
          ) : (
            <button 
              onClick={() => setIsAddingTask(true)}
              className="w-full flex items-center gap-2 p-3 text-xs font-bold text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl transition-all hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
            >
              <Plus size={14} />
              Quick Add Task
            </button>
          )}
        </div>
      )}
    </div>
  );
}