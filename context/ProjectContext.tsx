import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, ProjectBrief, ChatMessage, Note, SearchResults, SearchResult, ProjectTask, ProjectPhase, AiChatMessage } from '../types';
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
  performSearch: (query: string) => SearchResults;
  
  // AI Chat Persistence
  aiChats: Record<string, AiChatMessage[]>;
  updateAiChat: (projectId: string, messages: AiChatMessage[]) => void;
  
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [aiChats, setAiChats] = useState<Record<string, AiChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedProjects = localStorage.getItem('growency_projects');
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (e) {
        console.error('Failed to parse projects');
        setProjects(INITIAL_PROJECTS);
      }
    } else {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem('growency_projects', JSON.stringify(INITIAL_PROJECTS));
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
    saveProjects([...projects, newProject] as Project[]);
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
    const result = Array.from(projects);
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

  function performSearch(query: string): SearchResults {
    const results: SearchResults = {
      projects: [],
      briefs: [],
      messages: [],
      notes: []
    };

    if (!query.trim()) return results;
    const lowerQuery = query.toLowerCase();

    projects.forEach(p => {
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