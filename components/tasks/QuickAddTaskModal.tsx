import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Plus, Briefcase, ListTodo, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { Project } from '../../types';
import { INPUT_LIMITS } from '../../constants';

interface QuickAddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAddTaskModal({ isOpen, onClose }: QuickAddTaskModalProps) {
  const { user } = useAuth();
  const { projects, addTaskToPhase, addPhase } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedPhaseId, setSelectedPhaseId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [isCreatingPhase, setIsCreatingPhase] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter projects assigned to the user
  const availableProjects = projects.filter(p => 
    user?.role === 'Admin' || (user && p.assignedUsers.includes(user.id))
  );

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setSelectedProjectId('');
      setSelectedPhaseId('');
      setTaskTitle('');
      setIsCreatingPhase(false);
      setNewPhaseName('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Auto-select first project if available
  useEffect(() => {
    if (isOpen && availableProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(availableProjects[0].id);
    }
  }, [isOpen, availableProjects, selectedProjectId]);

  // Auto-select first phase when project changes
  useEffect(() => {
    if (selectedProject && selectedProject.phases.length > 0) {
      setSelectedPhaseId(selectedProject.phases[0].id);
    } else {
      setSelectedPhaseId('');
    }
    setIsCreatingPhase(false);
  }, [selectedProjectId, selectedProject]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProjectId || !taskTitle.trim()) return;
    
    // Validation
    if (isCreatingPhase && !newPhaseName.trim()) return;
    if (!isCreatingPhase && !selectedPhaseId) return;

    setIsSubmitting(true);

    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    let targetPhaseId = selectedPhaseId;

    if (isCreatingPhase) {
      targetPhaseId = addPhase(selectedProjectId, newPhaseName);
    }

    addTaskToPhase(selectedProjectId, targetPhaseId, taskTitle, user.id); // Auto-assign to self
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
            <Plus size={20} className="text-indigo-600" />
            Quick Add Task
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Project Selection */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Project</label>
            <div className="relative">
                <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl appearance-none text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                >
                    {availableProjects.length === 0 && <option value="">No active projects</option>}
                    {availableProjects.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                    ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Phase Selection / Creation */}
          <div>
             <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Phase / Bucket</label>
                <button 
                    type="button"
                    onClick={() => setIsCreatingPhase(!isCreatingPhase)}
                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    {isCreatingPhase ? 'Select existing phase' : '+ Create new phase'}
                </button>
             </div>
             
             {isCreatingPhase ? (
                 <div className="animate-in fade-in slide-in-from-left-2 duration-200">
                    <input 
                        type="text"
                        value={newPhaseName}
                        onChange={(e) => setNewPhaseName(e.target.value)}
                        placeholder="New Phase Name (e.g. QA Testing)"
                        className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-indigo-900/50 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                        autoFocus
                    />
                 </div>
             ) : (
                 <div className="relative animate-in fade-in slide-in-from-right-2 duration-200">
                    <ListTodo size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={selectedPhaseId}
                        onChange={(e) => setSelectedPhaseId(e.target.value)}
                        disabled={!selectedProject || selectedProject.phases.length === 0}
                        className="w-full pl-11 pr-10 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl appearance-none text-sm font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer disabled:opacity-50"
                    >
                        {!selectedProject ? (
                            <option>Select a project first</option>
                        ) : selectedProject.phases.length === 0 ? (
                            <option>No phases found</option>
                        ) : (
                            selectedProject.phases.map(ph => (
                                <option key={ph.id} value={ph.id}>{ph.name}</option>
                            ))
                        )}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                 </div>
             )}
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Task Title</label>
            <textarea
                rows={2}
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                maxLength={INPUT_LIMITS.SHORT_TEXT}
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                placeholder="What needs to be done?"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-transparent rounded-2xl transition-colors disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isSubmitting || !selectedProjectId || !taskTitle.trim() || (isCreatingPhase ? !newPhaseName.trim() : !selectedPhaseId)}
                className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded-2xl shadow-xl hover:shadow-indigo-500/20 hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={14} className="animate-spin" />
                        Adding...
                    </>
                ) : (
                    <>
                        <Plus size={14} />
                        Add Task
                    </>
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}