import { useState, useEffect } from 'react';
import { useParams, Navigate, useSearchParams } from 'react-router-dom';
import { MessageSquare, FileText, Layout, ClipboardList, ListTodo, Lock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { ProjectModal } from '../components/ProjectModal';
import { AiAssistant } from '../components/AiAssistant';
import { BriefTab } from '../components/project/BriefTab';
import { ChatTab } from '../components/project/ChatTab';
import { NotesTab } from '../components/project/NotesTab';
import { TasksTab } from '../components/project/TasksTab';
import { ProjectDetailHeader } from '../components/project/ProjectDetailHeader';
import { ProjectOverview } from '../components/project/ProjectOverview';

type TabType = 'overview' | 'tasks' | 'brief' | 'chat' | 'notes';

export function ProjectDetails() {
  const { projectCode } = useParams<{ projectCode: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'overview';
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [chatInitialValue, setChatInitialValue] = useState('');
  const { user } = useAuth();
  const { getProjectByCode, updateProject } = useProjects();

  const project = getProjectByCode(projectCode || '');

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['overview', 'tasks', 'brief', 'chat', 'notes'].includes(tab)) {
        setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  // Permission Logic
  const isAssigned = user ? project.assignedUsers.includes(user.id) : false;
  const isAdmin = user?.role === 'Admin';
  // Sales can view but might not be assigned, usually Admins/Assigned get full access
  const hasFullAccess = isAdmin || isAssigned;

  const canEditProject = user?.role === 'Admin' || (user?.role === 'Developer' && isAssigned);

  const renderContent = () => {
    // Restricted Access Check for Sensitive Tabs
    // Added 'tasks' to this list to prevent unassigned users from viewing/editing the plan
    if (['brief', 'chat', 'notes', 'tasks'].includes(activeTab) && !hasFullAccess) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <Lock size={32} className="text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Access Restricted</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md text-center">
                    You are not assigned to this project. Sensitive information like the Workspace Plan, Brief, Team Chat, and Internal Notes are hidden to protect client privacy.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <ShieldAlert size={14} />
                    Security Protocol Enforced
                </div>
            </div>
        );
    }

    switch(activeTab) {
      case 'overview':
        return (
          <ProjectOverview 
            project={project} 
            onEditClick={() => setIsEditModalOpen(true)}
            onTabChange={handleTabChange}
            onMessageClick={(userName) => {
              if (hasFullAccess) {
                setChatInitialValue(`@${userName} `);
                handleTabChange('chat');
              } else {
                 alert("You do not have access to the team chat.");
              }
            }}
          />
        );
      case 'tasks':
        return <TasksTab project={project} />;
      case 'brief':
        return (
          <BriefTab 
            project={project} 
            canEdit={canEditProject} 
            onUpdate={(data) => updateProject(project.id, data)}
          />
        );
      case 'chat':
        return <ChatTab project={project} initialMessage={chatInitialValue} onMessageUsed={() => setChatInitialValue('')} />;
      case 'notes':
        return <NotesTab project={project} />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout, restricted: false },
    // Marked tasks as restricted: true
    { id: 'tasks', label: 'Workspace Plane', icon: ListTodo, restricted: true },
    { id: 'brief', label: 'Brief', icon: FileText, restricted: true },
    { id: 'chat', label: 'Chat', icon: MessageSquare, restricted: true },
    { id: 'notes', label: 'Notes', icon: ClipboardList, restricted: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ProjectDetailHeader 
        project={project}
        canEdit={canEditProject}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isRestricted = tab.restricted && !hasFullAccess;
            return (
                <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as TabType)}
                className={`${
                    activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                } group inline-flex items-center py-4 px-1 border-b-2 font-black text-[10px] uppercase tracking-widest whitespace-nowrap gap-2 transition-all relative`}
                >
                <tab.icon size={16} className={activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'} />
                {tab.label}
                {isRestricted && (
                    <Lock size={10} className="text-gray-300 dark:text-gray-600 mb-0.5" />
                )}
                </button>
            );
          })}
        </nav>
      </div>

      <div className="min-h-[400px]">
        {renderContent()}
      </div>

      <ProjectModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(data) => updateProject(project.id, data)}
        initialData={project}
        title="Edit Project"
      />

      {/* Floating AI Assistant - Always rendered, handles its own state permissions internally */}
      <AiAssistant project={project} />
    </div>
  );
}