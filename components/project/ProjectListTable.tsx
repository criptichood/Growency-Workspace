import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, GripVertical, CheckCircle, ExternalLink, Hash, AlertTriangle, ShieldAlert, Undo2, Clock } from 'lucide-react';
import { Project, ProjectStatus } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface ProjectListTableProps {
  projects: Project[];
}

export function ProjectListTable({ projects }: ProjectListTableProps) {
  const { deleteProject, updateProject, reorderProjects } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
    confirmLabel?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger',
    confirmLabel: 'Delete'
  });

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleRowClick = (projectCode: string) => {
    navigate(`/projects/${projectCode}`);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    const ghost = document.createElement('div');
    e.dataTransfer.setDragImage(ghost, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    reorderProjects(draggedIdx, index);
    setDraggedIdx(index);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  // --- Deletion Logic --- (Same as before)
  const handleDeleteAction = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setActiveMenuId(null);

    const isCreator = project.createdBy === user?.id;
    const isAdmin = user?.role === 'Admin';
    const canDeleteImmediately = isCreator || isAdmin;
    const isDeletionRequested = project.status === 'Deletion Requested';

    if (isDeletionRequested) {
        if (canDeleteImmediately) {
            setConfirmConfig({
                isOpen: true,
                title: 'Approve Deletion',
                message: `As an Admin or Project Owner, you are about to permanently delete "${project.name}". This cannot be undone.`,
                onConfirm: () => deleteProject(project.id),
                variant: 'danger',
                confirmLabel: 'Permanently Delete'
            });
        }
    } else {
        if (canDeleteImmediately) {
            setConfirmConfig({
                isOpen: true,
                title: 'Delete Project',
                message: `Are you sure you want to permanently delete "${project.name}"?`,
                onConfirm: () => deleteProject(project.id),
                variant: 'danger',
                confirmLabel: 'Delete'
            });
        } else {
            setConfirmConfig({
                isOpen: true,
                title: 'Request Deletion',
                message: `You are not the owner of this project. Would you like to submit a deletion request to the Admin/Owner? The project status will change to "Deletion Requested".`,
                onConfirm: () => updateProject(project.id, { status: 'Deletion Requested' }),
                variant: 'warning',
                confirmLabel: 'Submit Request'
            });
        }
    }
  };

  const handleRejectDeletion = (e: React.MouseEvent, project: Project) => {
      e.stopPropagation();
      setActiveMenuId(null);
      
      setConfirmConfig({
        isOpen: true,
        title: 'Reject Deletion Request',
        message: `Restore "${project.name}" to its previous state (Pending)?`,
        onConfirm: () => updateProject(project.id, { status: 'Pending' }),
        variant: 'info',
        confirmLabel: 'Restore Project'
      });
  };

  const handleArchive = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const newStatus: ProjectStatus = project.status === 'Completed' ? 'In Progress' : 'Completed';
    updateProject(project.id, { status: newStatus });
  };

  return (
    <div className="overflow-x-auto relative min-h-[400px] px-6 pb-6">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead className="">
          <tr>
            <th className="w-10"></th>
            <th className="px-6 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Code / Project</th>
            <th className="px-6 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Client</th>
            <th className="px-6 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
            <th className="px-6 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Progress</th>
            <th className="px-6 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Updated</th>
            <th className="px-6 py-2 text-right text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400">
                   <Gaps size={48} className="mb-4 opacity-10" />
                   <p className="text-sm font-bold">No matching projects found</p>
                </div>
              </td>
            </tr>
          ) : (
            projects.map((project, index) => {
              const isCreator = project.createdBy === user?.id;
              const isAdmin = user?.role === 'Admin';
              const canDeleteImmediately = isCreator || isAdmin;
              const isDeletionRequested = project.status === 'Deletion Requested';
              
              return (
                <tr 
                  key={project.id} 
                  draggable 
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleRowClick(project.code)}
                  className={`group cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 relative rounded-2xl bg-white dark:bg-[#151921] shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 ${
                    draggedIdx === index ? 'opacity-30' : ''
                  }`}
                >
                  <td className="px-2 py-4 rounded-l-2xl border-l border-y border-transparent">
                    <div className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 cursor-grab active:cursor-grabbing p-1 transition-colors flex justify-center">
                      <GripVertical size={18} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-y border-transparent">
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex flex-col items-center justify-center w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
                          <Hash size={12} className="text-indigo-500 mb-0.5" />
                          <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">{project.code}</span>
                      </div>
                      <div className="flex flex-col">
                          <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.name}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[200px] mt-0.5">{project.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-y border-transparent">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#1e222e] px-3 py-1.5 rounded-lg inline-block border border-slate-200 dark:border-slate-700">{project.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-y border-transparent">
                    <StatusBadge status={project.status} className="!text-[9px] uppercase tracking-tighter" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-y border-transparent">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.3)] ${project.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600 dark:bg-indigo-500'}`} 
                          style={{ width: `${project.progress}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono border-y border-transparent">
                    {new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right rounded-r-2xl border-r border-y border-transparent relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === project.id ? null : project.id);
                      }}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {activeMenuId === project.id && (
                      <div 
                        className="absolute right-6 top-12 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-[60] animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={() => navigate(`/projects/${project.code}`)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                          <ExternalLink size={14} className="text-slate-400" />
                          Open Details
                        </button>
                        
                        <button 
                          onClick={(e) => handleArchive(e, project)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                          {project.status === 'Completed' ? (
                            <><Clock size={14} className="text-amber-500" /> Re-open</>
                          ) : (
                            <><CheckCircle size={14} className="text-green-500" /> Mark Complete</>
                          )}
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2" />
                        
                        {/* DELETION CONTROLS */}
                        {isDeletionRequested ? (
                            <>
                                {canDeleteImmediately ? (
                                    <>
                                        <button 
                                            onClick={(e) => handleDeleteAction(e, project)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                        >
                                            <ShieldAlert size={14} />
                                            Approve Deletion
                                        </button>
                                        <button 
                                            onClick={(e) => handleRejectDeletion(e, project)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                        >
                                            <Undo2 size={14} />
                                            Reject Request
                                        </button>
                                    </>
                                ) : (
                                     <div className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/10 rounded-xl cursor-not-allowed opacity-75">
                                        <Clock size={14} />
                                        Pending Approval
                                    </div>
                                )}
                            </>
                        ) : (
                            <button 
                                onClick={(e) => handleDeleteAction(e, project)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                                    canDeleteImmediately 
                                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
                                    : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                }`}
                            >
                                {canDeleteImmediately ? 'Delete Project' : 'Request Deletion'}
                            </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {activeMenuId && (
        <div 
          className="fixed inset-0 z-50" 
          onClick={() => setActiveMenuId(null)}
        />
      )}

      <ConfirmationModal 
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        confirmLabel={confirmConfig.confirmLabel}
      />
    </div>
  );
}

function Gaps({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}