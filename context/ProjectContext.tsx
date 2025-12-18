import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, ProjectBrief, ChatMessage, Note, SearchResults, SearchResult, ProjectTask, ProjectPhase, AiChatMessage, Role, SystemNotification, DirectMessageThread, Attachment, ResourceFile, ResourceCategory } from '../types';
import { INITIAL_PROJECTS } from '../constants';

interface NewProjectData {
  name: string;
  code: string;
  clientName: string;
  status: Project['status'];
  description: string;
  createdBy: string;
  assignedUsers: string[];
  dueDate: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: NewProjectData) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;
  getProject: (id: string) => Project | undefined;
  getProjectByCode: (code: string) => Project | undefined;
  sendMessage: (projectId: string, text: string, userId: string) => void;
  addNote: (projectId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (projectId: string, noteId: string, updates: Partial<Note>) => void;
  deleteNote: (projectId: string, noteId: string) => void;
  toggleTask: (projectId: string, phaseId: string, taskId: string) => void;
  addTaskToPhase: (projectId: string, phaseId: string, taskTitle: string, assignedTo?: string) => void;
  deleteTask: (projectId: string, phaseId: string, taskId: string) => void;
  addPhase: (projectId: string, phaseName: string) => void;
  deletePhase: (projectId: string, phaseId: string) => void;
  completePhase: (projectId: string, phaseId: string) => void;
  performSearch: (query: string, userId: string, role: Role) => SearchResults;
  
  // AI Chat Persistence
  aiChats: Record<string, AiChatMessage[]>;
  updateAiChat: (projectId: string, messages: AiChatMessage[]) => void;
  
  // System Notifications
  notifications: SystemNotification[];
  addNotification: (notification: Omit<SystemNotification, 'id' | 'createdAt'>) => void;

  // Direct Messages
  dmThreads: DirectMessageThread[];
  isDmDrawerOpen: boolean;
  activeDmThreadId: string | null;
  toggleDmDrawer: (isOpen: boolean) => void;
  openDmWithUser: (currentUserId: string, targetUserId: string) => void;
  sendDmMessage: (threadId: string, text: string, userId: string, attachments?: Attachment[]) => void;
  
  // Resources
  resources: ResourceFile[];
  addResource: (file: Omit<ResourceFile, 'id' | 'uploadedAt'>) => void;
  deleteResource: (id: string) => void;

  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'sys-1',
    type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance this Saturday at 2 AM EST.',
    createdBy: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  }
];

const INITIAL_RESOURCES: ResourceFile[] = [
  {
    id: 'res-1',
    name: 'Brand Guidelines 2024.pdf',
    type: 'application/pdf',
    size: 2500000, // 2.5 MB
    url: '#', // Mock URL
    category: 'Brand',
    uploadedBy: '1',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    description: 'Updated color palette and logo usage rules.'
  },
  {
    id: 'res-2',
    name: 'Q4 Sales Deck Template.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    size: 5200000, // 5.2 MB
    url: '#',
    category: 'Sales',
    uploadedBy: '2',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    description: 'Standard slide deck for Q4 client pitches.'
  },
  {
    id: 'res-3',
    name: 'Employee Handbook.pdf',
    type: 'application/pdf',
    size: 1500000,
    url: '#',
    category: 'HR',
    uploadedBy: '1',
    uploadedAt: new Date('2023-01-15').toISOString(),
    description: 'Company policies, benefits, and code of conduct.'
  },
  {
    id: 'res-4',
    name: 'Logo Pack (SVG/PNG).zip',
    type: 'application/zip',
    size: 12000000,
    url: '#',
    category: 'Brand',
    uploadedBy: '1',
    uploadedAt: new Date('2023-06-10').toISOString()
  }
];

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [dmThreads, setDmThreads] = useState<DirectMessageThread[]>([]);
  const [resources, setResources] = useState<ResourceFile[]>([]);
  const [isDmDrawerOpen, setIsDmDrawerOpen] = useState(false);
  const [activeDmThreadId, setActiveDmThreadId] = useState<string | null>(null);

  const [aiChats, setAiChats] = useState<Record<string, AiChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedProjects = localStorage.getItem('growency_projects');
    const storedNotifs = localStorage.getItem('growency_notifications');
    const storedDms = localStorage.getItem('growency_dms');
    const storedResources = localStorage.getItem('growency_resources');
    
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects) as Project[]);
      } catch (e) {
        setProjects(INITIAL_PROJECTS);
      }
    } else {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem('growency_projects', JSON.stringify(INITIAL_PROJECTS));
    }

    if (storedNotifs) {
      try {
        setNotifications(JSON.parse(storedNotifs) as SystemNotification[]);
      } catch (e) {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } else {
      setNotifications(INITIAL_NOTIFICATIONS);
      localStorage.setItem('growency_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }

    if (storedDms) {
      try {
        setDmThreads(JSON.parse(storedDms) as DirectMessageThread[]);
      } catch (e) {
        setDmThreads([]);
      }
    }

    if (storedResources) {
        try {
            setResources(JSON.parse(storedResources) as ResourceFile[]);
        } catch (e) {
            setResources(INITIAL_RESOURCES);
        }
    } else {
        setResources(INITIAL_RESOURCES);
        localStorage.setItem('growency_resources', JSON.stringify(INITIAL_RESOURCES));
    }

    setIsLoading(false);
  }, []);

  function saveProjects(newProjects: Project[]) {
    const finalProjects = newProjects.map(p => {
      const allTasks = p.phases.flatMap(ph => ph.tasks);
      const completedTasks = allTasks.filter(t => t.isCompleted).length;
      const progress = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;
      return { ...p, progress };
    });

    setProjects(finalProjects);
    localStorage.setItem('growency_projects', JSON.stringify(finalProjects));
  }

  function saveNotifications(newNotifs: SystemNotification[]) {
    setNotifications(newNotifs);
    localStorage.setItem('growency_notifications', JSON.stringify(newNotifs));
  }

  function saveDms(newDms: DirectMessageThread[]) {
    setDmThreads(newDms);
    localStorage.setItem('growency_dms', JSON.stringify(newDms));
  }

  function saveResources(newResources: ResourceFile[]) {
      setResources(newResources);
      localStorage.setItem('growency_resources', JSON.stringify(newResources));
  }

  // --- DM Logic ---

  function toggleDmDrawer(isOpen: boolean) {
    setIsDmDrawerOpen(isOpen);
    if (!isOpen) setActiveDmThreadId(null);
  }

  function openDmWithUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) return;

    // Check if thread exists
    const existingThread = dmThreads.find(
      t => t.participants.includes(currentUserId) && t.participants.includes(targetUserId)
    );

    setIsDmDrawerOpen(true);

    if (existingThread) {
      setActiveDmThreadId(existingThread.id);
    } else {
      // Create new thread
      const newThread: DirectMessageThread = {
        id: Math.random().toString(36).substr(2, 9),
        participants: [currentUserId, targetUserId],
        lastMessage: '',
        lastUpdated: new Date().toISOString(),
        unreadCount: 0,
        messages: []
      };
      saveDms([newThread, ...dmThreads]);
      setActiveDmThreadId(newThread.id);
    }
  }

  function sendDmMessage(threadId: string, text: string, userId: string, attachments: Attachment[] = []) {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      text,
      timestamp: new Date().toISOString(),
      attachments
    };

    const displayText = attachments.length > 0 && !text ? `Sent ${attachments.length} attachment(s)` : text;

    const updatedThreads = dmThreads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          messages: [...t.messages, newMessage],
          lastMessage: displayText,
          lastUpdated: new Date().toISOString(),
          // In a real app, we'd handle unread counts per user here
        };
      }
      return t;
    }).sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

    saveDms(updatedThreads);
  }

  // --- End DM Logic ---

  function addNotification(notification: Omit<SystemNotification, 'id' | 'createdAt'>) {
    const newNotif: SystemNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    saveNotifications([newNotif, ...notifications]);
  }

  function addResource(file: Omit<ResourceFile, 'id' | 'uploadedAt'>) {
      const newResource: ResourceFile = {
          ...file,
          id: Math.random().toString(36).substr(2, 9),
          uploadedAt: new Date().toISOString()
      };
      saveResources([newResource, ...resources]);
  }

  function deleteResource(id: string) {
      saveResources(resources.filter(r => r.id !== id));
  }

  function updateAiChat(projectId: string, messages: AiChatMessage[]) {
    setAiChats(prev => ({
      ...prev,
      [projectId]: messages
    }));
  }

  function addProject(projectData: NewProjectData) {
    const defaultBrief: ProjectBrief = {
      clientGoal: '',
      problemStatement: '',
      requestedFeatures: '',
      mustHaves: '',
      niceToHaves: '',
      constraints: '',
      openQuestions: '',
      version: 1,
      lastUpdatedBy: projectData.createdBy,
      lastUpdatedAt: new Date().toISOString()
    };

    const newProject: Project = {
      ...projectData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      brief: defaultBrief,
      phases: [{ id: 'init', name: 'Initial Phase', tasks: [] }],
      progress: 0,
      messages: [],
      notes: []
    };
    const updatedList: Project[] = [...projects, newProject];
    saveProjects(updatedList);
  }

  function updateProject(id: string, updates: Partial<Project>) {
    const newProjects = projects.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    saveProjects(newProjects);
  }

  function deleteProject(id: string) {
    const newProjects = projects.filter(p => p.id !== id);
    saveProjects(newProjects);
  }

  function reorderProjects(startIndex: number, endIndex: number) {
    const result = [...projects];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    saveProjects(result);
  }

  function getProject(id: string) {
    return projects.find(p => p.id === id);
  }

  function getProjectByCode(code: string) {
    return projects.find(p => p.code.toUpperCase() === code.toUpperCase());
  }

  function sendMessage(projectId: string, text: string, userId: string) {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      text,
      timestamp: new Date().toISOString()
    };

    const newProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          messages: [...p.messages, newMessage],
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    saveProjects(newProjects);
  }

  function addNote(projectId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
    const newNote: Note = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          notes: [...(p.notes || []), newNote],
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    saveProjects(newProjects);
  }

  function updateNote(projectId: string, noteId: string, updates: Partial<Note>) {
    const newProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          notes: (p.notes || []).map(n => n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    saveProjects(newProjects);
  }

  function deleteNote(projectId: string, noteId: string) {
    const newProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          notes: (p.notes || []).filter(n => n.id !== noteId),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    saveProjects(newProjects);
  }

  function toggleTask(projectId: string, phaseId: string, taskId: string) {
    const newProjects = projects.map(p => {
      if (p.id === projectId) {
        const newPhases = p.phases.map(ph => {
          if (ph.id === phaseId) {
            return {
              ...ph,
              tasks: ph.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)
            };
          }
          return ph;
        });
        return { ...p, phases: newPhases, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    saveProjects(newProjects);
  }

  function addTaskToPhase(projectId: string, phaseId: string, taskTitle: string, assignedTo?: string) {
    const newProjects = projects.map(p => {
      if (p.id === projectId) {
        const newPhases = p.phases.map(ph => {
          if (ph.id === phaseId) {
            return {
              ...ph,
              tasks: [...ph.tasks, { id: Math.random().toString(36).substr(2, 9), title: taskTitle, isCompleted: false, assignedTo }]
            };
          }
          return ph;
        });
        return { ...p, phases: newPhases, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    saveProjects(newProjects);
  }

  function deleteTask(projectId: string, phaseId: string, taskId: string) {
    const newProjects = projects.map(p => {
      if (p.id === projectId) {
        const newPhases = p.phases.map(ph => {
          if (ph.id === phaseId) {
            return {
              ...ph,
              tasks: ph.tasks.filter(t => t.id !== taskId)
            };
          }
          return ph;
        });
        return { ...p, phases: newPhases, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    saveProjects(newProjects);
  }

  function addPhase(projectId: string, phaseName: string) {
    const newProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          phases: [...p.phases, { id: Math.random().toString(36).substr(2, 9), name: phaseName, tasks: [] }],
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    saveProjects(newProjects);
  }

  function deletePhase(projectId: string, phaseId: string) {
    const newProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          phases: p.phases.filter(ph => ph.id !== phaseId),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    saveProjects(newProjects);
  }

  function completePhase(projectId: string, phaseId: string) {
    const newProjects = projects.map(p => {
      if (p.id === projectId) {
        const newPhases = p.phases.map(ph => {
          if (ph.id === phaseId) {
            return {
              ...ph,
              tasks: ph.tasks.map(t => ({ ...t, isCompleted: true }))
            };
          }
          return ph;
        });
        return { ...p, phases: newPhases, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    saveProjects(newProjects);
  }

  function performSearch(query: string, userId: string, role: Role): SearchResults {
    const results: SearchResults = {
      projects: [],
      briefs: [],
      messages: [],
      notes: []
    };

    if (!query.trim()) return results;
    const lowerQuery = query.toLowerCase();

    projects.forEach(p => {
      // Permission Check: Admin sees all, others only see assigned projects
      if (role !== 'Admin' && !p.assignedUsers.includes(userId)) {
        return;
      }

      if (p.name.toLowerCase().includes(lowerQuery) || p.code.toLowerCase().includes(lowerQuery) || p.clientName.toLowerCase().includes(lowerQuery) || p.description.toLowerCase().includes(lowerQuery)) {
        results.projects.push({
          id: p.id,
          projectId: p.id,
          projectCode: p.code,
          title: p.name,
          subtitle: p.clientName,
          type: 'Project',
          path: `/projects/${p.code}`
        });
      }

      const briefContent = [
        p.brief.clientGoal,
        p.brief.problemStatement,
        p.brief.requestedFeatures,
        p.brief.mustHaves,
        p.brief.niceToHaves,
        p.brief.constraints,
        p.brief.openQuestions
      ].join(' ').toLowerCase();

      if (briefContent.includes(lowerQuery)) {
        results.briefs.push({
          id: `${p.id}-brief`,
          projectId: p.id,
          projectCode: p.code,
          title: `Brief: ${p.name}`,
          subtitle: 'Found in project requirements',
          type: 'Brief',
          path: `/projects/${p.code}?tab=brief`
        });
      }

      p.messages.forEach(msg => {
        if (msg.text.toLowerCase().includes(lowerQuery)) {
          results.messages.push({
            id: msg.id,
            projectId: p.id,
            projectCode: p.code,
            title: msg.text,
            subtitle: `Chat in ${p.name}`,
            type: 'Message',
            path: `/projects/${p.code}?tab=chat`
          });
        }
      });

      if (p.notes) {
        p.notes.forEach(note => {
          if (note.title.toLowerCase().includes(lowerQuery) || note.content.toLowerCase().includes(lowerQuery)) {
            results.notes.push({
              id: note.id,
              projectId: p.id,
              projectCode: p.code,
              title: note.title,
              subtitle: `Note in ${p.name}`,
              type: 'Note',
              path: `/projects/${p.code}?tab=notes`
            });
          }
        });
      }
    });

    return results;
  }

  return (
    <ProjectContext.Provider value={{ 
      projects, addProject, updateProject, deleteProject, reorderProjects, getProject, getProjectByCode,
      sendMessage, addNote, updateNote, deleteNote, 
      toggleTask, addTaskToPhase, deleteTask, addPhase, deletePhase, completePhase,
      performSearch, 
      aiChats, updateAiChat,
      notifications, addNotification,
      dmThreads, isDmDrawerOpen, activeDmThreadId, toggleDmDrawer, openDmWithUser, sendDmMessage,
      resources, addResource, deleteResource,
      isLoading 
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
