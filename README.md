# Growency Internal Workspace

![Growency Workspace](https://img.shields.io/badge/Status-In%20Development-blue)
![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![Gemini API](https://img.shields.io/badge/AI-Google%20Gemini-8e75b2?logo=google)

A modern, modular, and scalable internal workspace application designed for digital agencies. Growency streamlines project management, team collaboration, and resource sharing into a single, intuitive interface.

## 🚀 Key Features

### 📊 **Dynamic Dashboard**
*   **Customizable Layout**: Drag-and-drop widgets to personalize your workspace.
*   **Real-time Metrics**: Track revenue, lead times, and project health at a glance.
*   **Activity Feed**: Unified stream of system notifications and team updates.

### 📁 **Project Management**
*   **Centralized Hub**: Manage briefs, tasks, internal notes, and assets in one place.
*   **Granular Permissions**: Role-Based Access Control (RBAC) ensures clients and sensitive data are protected.
*   **Kanban & List Views**: Flexible task management for different workflows.

### 🤖 **AI Co-pilot (Powered by Gemini)**
*   **Context-Aware Assistance**: Chat with an AI that understands specific project briefs, tasks, and history.
*   **Automated Insights**: Generate risk assessments, action items, and status summaries instantly.
*   **Streaming Responses**: Low-latency, real-time AI interaction.

### 💬 **Communication**
*   **Direct Messaging**: Real-time private messaging with file attachment support.
*   **Project Channels**: Dedicated chat rooms for every project context.
*   **Video Hub**: Instant meeting link generation (Jitsi/Google Meet integration).

### 🗄️ **Resource Vault**
*   **Central Repository**: Store and organize company assets, HR policies, and templates.
*   **Smart Filtering**: categorize files by department (Brand, Sales, Engineering).
*   **Access Control**: Restricted upload permissions for Admins and Managers.

## 🛠️ Technology Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **Routing**: React Router DOM v7
*   **State Management**: React Context API (Modular Stores)
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Build Tool**: Vite (implied standard for this stack)

## ⚡ Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-org/growency-workspace.git
    cd growency-workspace
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your API key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```
/
├── components/         # Reusable UI components
│   ├── dashboard/      # Dashboard-specific widgets
│   ├── navigation/     # Sidebar, Topbar, Search
│   ├── project/        # Project detail views (Brief, Chat, Tasks)
│   └── settings/       # User profile and app settings
├── context/            # Global state (Auth, Project, Team, Theme)
├── pages/              # Main route views
├── services/           # External API integrations (AI)
└── types.ts            # TypeScript interfaces and shared types
```

## 🔐 Roles & Permissions

The application implements a strict Role-Based Access Control system:

| Feature | Admin | Sales (Manager) | Developer |
| :--- | :---: | :---: | :---: |
| **Create Projects** | ✅ | ✅ | ❌ |
| **Assign Team** | ✅ | ❌ | ❌ |
| **Upload Resources** | ✅ | ✅ | ❌ |
| **View Financials** | ✅ | ✅ | ❌ |
| **Edit Sensitive Briefs**| ✅ | ❌ | ❌ (Unless Assigned) |

## 🎨 Customization

### Themes
The app supports **Light**, **Dark**, and **System** modes. Toggle this via the sidebar or Settings page.

### Compact Mode
Power users can enable "Compact Mode" in Settings to increase information density across the application.

## 📄 License

This project is proprietary software developed for internal use. Unauthorized distribution is prohibited.
