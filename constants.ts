
import { LayoutDashboard, FolderKanban, Settings, Users, CheckSquare, Calendar as CalendarIcon, Video, FileBox, History, Shield } from 'lucide-react';
import { NavItem, Project, User, UserStatusType } from './types';

export const APP_NAME = 'Growency';

export const INPUT_LIMITS = {
  SHORT_TEXT: 100,       // Titles, Names, Usernames
  LONG_TEXT: 500,        // Summaries
  EMAIL: 254,
  PROJECT_NAME: 50,
  CLIENT_NAME: 50,
  PROJECT_CODE: 20,
  DESCRIPTION: 5000,     // Briefs, Notes (approx 1000 words)
  CHAT_MESSAGE: 1000,    // Chat
  URL: 2048
};

export const STATUS_OPTIONS: Record<UserStatusType, { color: string; label: string }> = {
  'Available': { color: 'bg-green-500', label: 'Available' },
  'Busy': { color: 'bg-red-500', label: 'Busy' },
  'Away': { color: 'bg-amber-500', label: 'Away' },
  'In a Meeting': { color: 'bg-purple-500', label: 'In a Meeting' },
  'Do Not Disturb': { color: 'bg-rose-700', label: 'Do Not Disturb' },
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Projects',
    path: '/projects',
    icon: FolderKanban,
  },
  {
    label: 'My Tasks',
    path: '/my-tasks',
    icon: CheckSquare,
  },
  {
    label: 'Calendar',
    path: '/calendar',
    icon: CalendarIcon,
  },
  {
    label: 'Meetings',
    path: '/meetings',
    icon: Video,
  },
  {
    label: 'Resources',
    path: '/resources',
    icon: FileBox,
  },
  {
    label: 'Team',
    path: '/team',
    icon: Users,
  },
  {
    label: 'Users', // SuperAdmin Only
    path: '/users',
    icon: Shield,
    restrictedTo: ['SuperAdmin']
  },
  {
    label: 'History',
    path: '/history',
    icon: History,
  },
];

export const MOCK_USERS: Record<string, User> = {
  '1': {
    id: '1',
    name: 'Alexandra Admin',
    username: 'alex_super',
    email: 'admin@growency.com',
    roles: ['SuperAdmin', 'Admin', 'Manager'],
    avatarUrl: 'https://i.pravatar.cc/150?u=1',
    status: 'Available',
    twoFactorEnabled: true,
  },
  '2': {
    id: '2',
    name: 'Sarah Sales',
    username: 'sarah_s',
    email: 'sales@growency.com',
    roles: ['Manager', 'Sales'],
    avatarUrl: 'https://i.pravatar.cc/150?u=2',
    status: 'Busy',
  },
  '3': {
    id: '3',
    name: 'Dave Developer',
    username: 'dave_dev',
    email: 'dev@growency.com',
    roles: ['Developer'],
    avatarUrl: 'https://i.pravatar.cc/150?u=3',
    status: 'Away',
  },
  '4': { 
    id: '4', 
    name: 'Mike Manager', 
    username: 'mike_lead',
    email: 'mike@growency.com', 
    roles: ['Manager', 'Developer'], // Technical Lead
    avatarUrl: 'https://i.pravatar.cc/150?u=4',
    status: 'Available',
  },
  '5': { 
    id: '5', 
    name: 'Emily Engineer', 
    username: 'emily_e',
    email: 'emily@growency.com', 
    roles: ['Developer'], 
    avatarUrl: 'https://i.pravatar.cc/150?u=5',
    status: 'In a Meeting',
  },
  '6': {
    id: '6',
    name: 'Gary General',
    username: 'gary_ops',
    email: 'gary@growency.com',
    roles: ['Admin'], // Operations Admin
    avatarUrl: 'https://i.pravatar.cc/150?u=6',
    status: 'Available',
  },
  '7': {
    id: '7',
    name: 'Fiona Frontend',
    username: 'fiona_ui',
    email: 'fiona@growency.com',
    roles: ['Developer'],
    avatarUrl: 'https://i.pravatar.cc/150?u=7',
    status: 'Do Not Disturb',
  },
  '8': {
    id: '8',
    name: 'Brian Backend',
    username: 'brian_api',
    email: 'brian@growency.com',
    roles: ['Developer'],
    avatarUrl: 'https://i.pravatar.cc/150?u=8',
    status: 'Away',
  },
  '9': {
    id: '9',
    name: 'Chloe Creative',
    username: 'chloe_design',
    email: 'chloe@growency.com',
    roles: ['Sales', 'Developer'], // Creative Technologist
    avatarUrl: 'https://i.pravatar.cc/150?u=9',
    status: 'Available',
  },
  '10': {
    id: '10',
    name: 'Kevin QA',
    username: 'kevin_test',
    email: 'kevin@growency.com',
    roles: ['Developer'],
    avatarUrl: 'https://i.pravatar.cc/150?u=10',
    status: 'Busy',
  },
  '11': {
    id: '11',
    name: 'Laura Legal',
    username: 'laura_l',
    email: 'laura@growency.com',
    roles: ['Admin'],
    avatarUrl: 'https://i.pravatar.cc/150?u=11',
    status: 'Available',
  },
  '12': {
    id: '12',
    name: 'Tom Trainee',
    username: 'tom_intern',
    email: 'tom@growency.com',
    roles: ['Developer'],
    avatarUrl: 'https://i.pravatar.cc/150?u=12',
    status: 'Available',
  },
  '13': {
    id: '13',
    name: 'System Bot',
    username: 'bot',
    email: 'bot@growency.com',
    roles: ['Admin'],
    avatarUrl: 'https://ui-avatars.com/api/?name=System+Bot&background=6366f1&color=fff',
    status: 'Available',
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    code: 'WEB-RED',
    name: 'Website Redesign',
    clientName: 'Acme Corp',
    status: 'In Progress',
    progress: 65,
    createdAt: '2023-10-24T10:00:00Z',
    updatedAt: '2023-10-25T14:00:00Z',
    dueDate: '2023-12-15',
    createdBy: '1',
    assignedUsers: ['1', '2', '3', '7'],
    description: 'Complete overhaul of the corporate website focusing on accessibility and modern design trends.',
    phases: [
      {
        id: 'p1',
        name: 'Discovery',
        tasks: [
          { id: 't1', title: 'Client kickoff meeting', isCompleted: true, assignedTo: '1' },
          { id: 't2', title: 'Technical requirement gathering', isCompleted: true, assignedTo: '3' },
          { id: 't3', title: 'Competitor analysis', isCompleted: true, assignedTo: '2' },
        ]
      },
      {
        id: 'p2',
        name: 'Design',
        tasks: [
          { id: 't4', title: 'Mood board creation', isCompleted: true, assignedTo: '2' },
          { id: 't5', title: 'High-fidelity wireframes', isCompleted: false, assignedTo: '2' },
          { id: 't6', title: 'Prototyping interactions', isCompleted: false, assignedTo: '3' },
        ]
      },
      {
        id: 'p3',
        name: 'Development',
        tasks: [
          { id: 't7', title: 'Setup Next.js project template', isCompleted: false, assignedTo: '3' },
          { id: 't8', title: 'Implement core navigation', isCompleted: false, assignedTo: '3' },
        ]
      }
    ],
    messages: [
      {
        id: 'msg_1',
        userId: '2',
        text: 'Client just sent over the new brand assets. I uploaded them to the drive.',
        timestamp: '2023-10-24T10:30:00Z'
      },
      {
        id: 'msg_2',
        userId: '3',
        text: 'Great, thanks Sarah. I will start integrating them into the style guide.',
        timestamp: '2023-10-24T11:15:00Z'
      }
    ],
    notes: [
      {
        id: 'note_1',
        userId: '3',
        title: 'Tech Stack Decision',
        content: 'We will be using Next.js 14 with App Router for this project to leverage server components and improve initial load times. Tailwind CSS for styling.',
        type: 'Decision',
        createdAt: '2023-10-25T09:00:00Z',
        updatedAt: '2023-10-25T09:00:00Z'
      },
      {
        id: 'note_2',
        userId: '1',
        title: 'API Rate Limits',
        content: 'The legacy CMS has a strict rate limit of 100 requests per minute. We need to implement aggressive caching on our end.',
        type: 'Architecture',
        createdAt: '2023-10-26T14:30:00Z',
        updatedAt: '2023-10-26T14:30:00Z'
      }
    ],
    brief: {
      clientGoal: 'Increase conversion rates by 20% and modernize brand perception.',
      problemStatement: 'Current site is slow (Lighthouse < 50), not mobile-friendly, and has a confusing navigation structure.',
      requestedFeatures: '- New Landing Page\n- Product Catalog\n- Contact Form Integration\n- Blog Section',
      mustHaves: '- WCAG 2.1 AA Compliance\n- Load time under 2s\n- Mobile-first design',
      niceToHaves: '- Dark mode\n- Animated hero section',
      constraints: 'Must use existing CMS (WordPress). Brand colors cannot change.',
      openQuestions: 'Do we need multi-language support immediately?',
      version: 1,
      lastUpdatedBy: '1',
      lastUpdatedAt: '2023-10-24T10:00:00Z'
    },
  },
  {
    id: '2',
    code: 'APP-MOB',
    name: 'Mobile App Launch',
    clientName: 'TechFlow',
    status: 'Pending',
    progress: 15,
    createdAt: '2023-11-01T09:00:00Z',
    updatedAt: '2023-11-01T09:00:00Z',
    dueDate: '2024-01-20',
    createdBy: '2',
    assignedUsers: ['3', '4', '8'],
    description: 'Initial planning and wireframing for the new iOS and Android application.',
    phases: [
      {
        id: 'p1_2',
        name: 'Planning',
        tasks: [
          { id: 't1_2', title: 'User flow diagrams', isCompleted: true, assignedTo: '3' },
          { id: 't2_2', title: 'Technology evaluation', isCompleted: false, assignedTo: '4' },
        ]
      }
    ],
    messages: [
      {
        id: 'msg_2_1',
        userId: '4',
        text: 'I have started researching React Native vs Flutter for this. Will share a doc soon.',
        timestamp: '2023-11-02T09:00:00Z'
      },
      {
        id: 'msg_2_2',
        userId: '3',
        text: 'Sounds good. Lean towards Flutter if we need complex custom UI rendering.',
        timestamp: '2023-11-02T09:15:00Z'
      }
    ],
    notes: [
      {
        id: 'note_2_1',
        userId: '4',
        title: 'Offline Sync Strategy',
        content: 'We will use a local SQLite database that syncs with the backend whenever connection is available. Conflict resolution will be "server wins".',
        type: 'Architecture',
        createdAt: '2023-11-03T14:00:00Z',
        updatedAt: '2023-11-03T14:00:00Z'
      }
    ],
    brief: {
      clientGoal: 'Launch a cross-platform mobile app for inventory management.',
      problemStatement: 'Field agents currently use pen and paper, leading to 15% data error rate.',
      requestedFeatures: '- Barcode Scanning\n- Offline Mode\n- User Auth\n- Real-time Sync',
      mustHaves: '- iOS and Android support\n- Offline first architecture',
      niceToHaves: '- AR measurement tool',
      constraints: 'Budget capped at $50k for MVP.',
      openQuestions: 'Which barcode format is primarily used?',
      version: 1,
      lastUpdatedBy: '2',
      lastUpdatedAt: '2023-11-01T09:00:00Z'
    },
  },
  {
    id: '3',
    code: 'MARK-Q4',
    name: 'Q4 Marketing Campaign',
    clientName: 'RetailGiant',
    status: 'Completed',
    progress: 100,
    createdAt: '2023-09-15T08:00:00Z',
    updatedAt: '2023-10-01T17:00:00Z',
    dueDate: '2023-10-01',
    createdBy: '2',
    assignedUsers: ['2', '4', '5', '9'],
    description: 'Holiday season digital marketing push across social media and email channels.',
    phases: [
      {
        id: 'p1_3',
        name: 'Execution',
        tasks: [
          { id: 't1_3', title: 'Banner design', isCompleted: true, assignedTo: '4' },
          { id: 't2_3', title: 'Social media scheduling', isCompleted: true, assignedTo: '2' },
        ]
      }
    ],
    messages: [
       {
        id: 'msg_3',
        userId: '2',
        text: 'Campaign is live! Checking analytics now.',
        timestamp: '2023-10-01T09:00:00Z'
      },
      {
        id: 'msg_3_2',
        userId: '4',
        text: 'The CTR on the video ads is performing 20% above benchmark.',
        timestamp: '2023-10-02T11:00:00Z'
      }
    ],
    notes: [
      {
        id: 'note_3_1',
        userId: '2',
        title: 'Budget Allocation',
        content: 'Shifted $5k from Facebook to TikTok ads due to higher engagement from the target demographic.',
        type: 'Decision',
        createdAt: '2023-09-25T10:00:00Z',
        updatedAt: '2023-09-25T10:00:00Z'
      }
    ],
    brief: {
      clientGoal: 'Maximize holiday sales through targeted digital ads.',
      problemStatement: 'Last year\'s campaign had low engagement due to generic messaging.',
      requestedFeatures: '- 5 Video Assets\n- 10 Static Banners\n- 3 Email Templates',
      mustHaves: '- Delivered by Oct 1st',
      niceToHaves: '- A/B testing variations',
      constraints: 'Strict adherence to new brand guidelines.',
      openQuestions: 'None.',
      version: 2,
      lastUpdatedBy: '2',
      lastUpdatedAt: '2023-09-20T14:00:00Z'
    },
  },
  {
    id: '4',
    code: 'AUD-INT',
    name: 'Internal Audit Tool',
    clientName: 'FinServe',
    status: 'In Progress',
    progress: 42,
    createdAt: '2023-12-12T11:00:00Z',
    updatedAt: '2023-12-14T16:00:00Z',
    dueDate: '2024-02-28',
    createdBy: '1',
    assignedUsers: ['3', '5', '10'],
    description: 'Development of an internal tool to automate compliance auditing processes.',
    phases: [
      {
        id: 'p1_4',
        name: 'Analysis',
        tasks: [
          { id: 't1_4', title: 'Audit log review', isCompleted: true, assignedTo: '3' },
          { id: 't2_4', title: 'Internal process documentation', isCompleted: false, assignedTo: '3' },
        ]
      }
    ],
    messages: [
      {
        id: 'msg_4_1',
        userId: '1',
        text: 'Dave, please ensure we are logging all failed login attempts as per the new security policy.',
        timestamp: '2023-12-12T13:00:00Z'
      },
      {
        id: 'msg_4_2',
        userId: '3',
        text: 'Understood. I am adding a middleware to capture those events now.',
        timestamp: '2023-12-12T13:05:00Z'
      },
      {
        id: 'msg_4_3',
        userId: '1',
        text: 'Also, the client requested a demo for the PDF generation feature by Friday.',
        timestamp: '2023-12-13T10:00:00Z'
      }
    ],
    notes: [
      {
        id: 'note_4_1',
        userId: '3',
        title: 'Encryption Standards',
        content: 'All data at rest must be encrypted using AES-256. Keys will be managed via AWS KMS.',
        type: 'Decision',
        createdAt: '2023-12-12T15:00:00Z',
        updatedAt: '2023-12-12T15:00:00Z'
      },
      {
        id: 'note_4_2',
        userId: '1',
        title: 'Compliance Checklist',
        content: '1. User Access Logs\n2. Data Retention Policy (7 years)\n3. Role-Based Access Control',
        type: 'Note',
        createdAt: '2023-12-13T09:00:00Z',
        updatedAt: '2023-12-13T09:00:00Z'
      }
    ],
    brief: {
      clientGoal: 'Streamline the quarterly audit process.',
      problemStatement: 'Manual Excel reconciliation takes 200+ hours per quarter.',
      requestedFeatures: '- CSV Import\n- Rule Engine\n- PDF Report Generation',
      mustHaves: '- GDPR Compliance\n- Audit Logs',
      niceToHaves: '- AI Anomaly Detection',
      constraints: 'Must run on-premise.',
      openQuestions: 'What is the max file size for imports?',
      version: 1,
      lastUpdatedBy: '1',
      lastUpdatedAt: '2023-12-12T11:00:00Z'
    },
  },
];
