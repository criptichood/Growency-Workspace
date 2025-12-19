import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export type Role = 'Admin' | 'Sales' | 'Developer';

export type UserStatusType = 'Available' | 'Busy' | 'Away' | 'In a Meeting' | 'Do Not Disturb';

export interface User {
  id: string;
  name: string; // This will act as Full Name
  username: string; // Unique handle
  email: string;
  role: Role;
  avatarUrl?: string;
  status: UserStatusType;
  customStatus?: string;
  twoFactorEnabled?: boolean;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
  notificationPrefs?: {
    mentions: boolean;
    comments: boolean;
    updates: boolean;
  };
}

export type ProjectStatus = 'In Progress' | 'Completed' | 'Pending' | 'On Hold' | 'Deletion Requested';

export interface ProjectTask {
  id: string;
  title: string;
  isCompleted: boolean;
  assignedTo?: string; // User ID
}

export interface ProjectPhase {
  id: string;
  name: string;
  tasks: ProjectTask[];
}

export interface ProjectBrief {
  clientGoal: string;
  problemStatement: string;
  requestedFeatures: string;
  mustHaves: string;
  niceToHaves: string;
  constraints: string;
  openQuestions: string;
  version: number;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string; // MIME type
  url: string; // Data URL for this demo
  size: number;
  // In a real app, this would be a URL to Supabase Storage
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface AiChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type NoteType = 'Note' | 'Decision' | 'Architecture';

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: NoteType;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  code: string; // Short code name for navigation (e.g. GRW-01)
  name: string;
  clientName: string;
  status: ProjectStatus;
  progress: number; // This will be calculated from tasks
  description: string;
  brief: ProjectBrief;
  phases: ProjectPhase[];
  dueDate: string;
  messages: ChatMessage[];
  notes: Note[];
  createdBy: string;
  assignedUsers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemNotification {
  id: string;
  type: 'alert' | 'info' | 'success';
  title: string;
  message: string;
  createdBy: string;
  createdAt: string;
  isRead: boolean;
  link?: string; // Optional path to navigate to
}

export interface DirectMessageThread {
  id: string;
  participants: string[]; // User IDs
  lastMessage: string;
  lastUpdated: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export enum PageTitle {
  DASHBOARD = 'Dashboard',
  PROJECTS = 'Projects',
  SETTINGS = 'Settings'
}

export type SearchResultType = 'Project' | 'Brief' | 'Message' | 'Note';

export interface SearchResult {
  id: string;
  projectId: string;
  projectCode: string;
  title: string;
  subtitle?: string;
  type: SearchResultType;
  path: string;
}

export interface SearchResults {
  projects: SearchResult[];
  briefs: SearchResult[];
  messages: SearchResult[];
  notes: SearchResult[];
}

// Dashboard Layout Types
export type WidgetId = 'welcome' | 'stats' | 'health' | 'activity' | 'priorities';

export interface DashboardWidgetConfig {
  id: WidgetId;
  title: string;
  isVisible: boolean;
  order: number;
  colSpan: 1 | 2 | 3;
}

// Resource Vault Types
export type ResourceCategory = 'Brand' | 'HR' | 'Sales' | 'Engineering' | 'Templates' | 'General';

export interface ResourceFile {
  id: string;
  name: string;
  type: string; // mime-type or extension
  size: number;
  url: string;
  category: ResourceCategory;
  uploadedBy: string; // User ID
  uploadedAt: string;
  description?: string;
}