
import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, Briefcase, ListTodo, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { useTeam } from '../../context/TeamContext';
import { INPUT_LIMITS } from '../../constants';
import { SearchableDropdown } from '../ui/SearchableDropdown';

interface QuickAddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAddTaskModal({ isOpen, onClose }: QuickAddTaskModalProps) {
  const { user } = useAuth();
  const { projects, addTaskToPhase, addPhase } = useProjects();
  const { users } = useTeam();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedPhaseId, setSelectedPhaseId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isCreatingPhase, setIsCreatingPhase] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Permission Logic
  const canManageTasks = user?.roles.some(r => ['SuperAdmin', 'Admin', 'Manager'].includes(r));

  // Filter projects assigned to the user
  const availableProjects = projects.filter(p => 
    user?.roles.some(r => ['SuperAdmin', 'Admin', 'Manager'].includes(r)) || 
    (user && p.assignedUsers.includes(user.id))
  );

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Filter assignable users
  const assignableUsers = selectedProject 
    ? users.filter(u => selectedProject.assignedUsers.includes(u.id))
    : [];

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setSelectedProjectId('');
      setSelectedPhaseId('');
      setTaskTitle('');
      setAssignedTo(user?.id || ''); // Default to self
      setIsCreatingPhase(false);
      setNewPhaseName('');
      setIsSubmitting(false);
    }
  }, [isOpen, user]);

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

    const assignee = canManageTasks ? assignedTo : user.id;

    addTaskToPhase(selectedProjectId, targetPhaseId, taskTitle, assignee);
    
    setIsSubmitting(false);
    onClose();
  };

  // Maps for Dropdown Options
  const projectOptions = availableProjects.map(p => ({
    value: p.id,
    label: p.name,
    subtitle: p.code
  }));

  const phaseOptions = selectedProject 
    ? selectedProject.phases.map(ph => ({ value: ph.id, label: ph.name }))
    : [];

  const userOptions = assignableUsers.map(u => ({
    value: u.id,
    label: u.name,
    subtitle: u.roles.join(', ')
  }));

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
          <SearchableDropdown
            label="Project"
            icon={<Briefcase size={16} />}
            value={selectedProjectId}
            onChange={setSelectedProjectId}
            options={projectOptions}
            placeholder={availableProjects.length === 0 ? "No active projects" : "Select Project..."}
          />

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
                 <div className="animate-in fade-in slide-in-from-right-2 duration-200">
                    <SearchableDropdown
                        icon={<ListTodo size={16} />}
                        value={selectedPhaseId}
                        onChange={setSelectedPhaseId}
                        options={phaseOptions}
                        disabled={!selectedProject || selectedProject.phases.length === 0}
                        placeholder={!selectedProject ? "Select a project first" : "Select Phase..."}
                        searchable={false} // Usually phases are few
                    />
                 </div>
             )}
          </div>

          {/* Assignment Selection (Restricted) */}
          {canManageTasks && (
            <SearchableDropdown
              label="Assign To"
              icon={<UserIcon size={16} />}
              value={assignedTo}
              onChange={setAssignedTo}
              options={userOptions}
              disabled={!selectedProject}
              placeholder="Select Team Member..."
            />
          )}

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
