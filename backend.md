# Backend Implementation & Next.js Migration Guide

This document outlines the architectural decisions for migrating "Growency Internal Workspace" to a full-stack Next.js application using **Supabase**.

## 1. Architecture Overview

*   **Framework**: Next.js 15+ (App Router)
*   **Database**: Supabase (PostgreSQL)
*   **Authentication**: Supabase Auth (Integrates with `auth.users`)
*   **Permissions**: PostgreSQL Row Level Security (RLS)
*   **Real-time**: Supabase Realtime (WebSockets)
*   **File Storage**: Supabase Storage (Buckets for Resources/Attachments)
*   **AI**: Google GenAI SDK (Edge Functions) + Supabase PgVector (for RAG)

## 2. Directory Structure (Next.js App Router)

```text
/app
  layout.tsx              # Root layout (Auth provider)
  /auth
    /callback
      route.ts            # Supabase Auth Callback
  /dashboard
    page.tsx              # Server Component (fetches directly from DB)
  /api                    # Route Handlers
    /chat
      route.ts            # AI Stream Handler
/lib
  supabase/
    server.ts             # Server-side client (cookies)
    client.ts             # Client-side client
  database.types.ts       # Generated Types
```

## 3. Authentication & Security (RLS)

We move away from checking roles in React `useEffect` hooks. Instead, we define policies in the database.

**The concept:**
1.  User logs in via Supabase Auth.
2.  Supabase generates a JWT containing their `user_id`.
3.  Every query to the database automatically checks this ID against RLS policies.

**Example Policy Logic (See `database/schema.sql`):**
*   **Projects**:
    *   *Admins*: Can viewing, create, edit, delete ALL projects.
    *   *Sales/Developers*: Can only view projects where their ID is in the `assigned_users` array.
*   **Tasks**:
    *   *Anyone assigned to the project*: Can update task status.

## 4. Data Fetching Strategy

### Server Components (Read)
Fetching data in Next.js Server Components is secure and fast.

```typescript
// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function Dashboard() {
  const supabase = createClient();
  
  // RLS automatically filters this list based on the logged-in user!
  // No need to manually filter by 'assigned_users' in JS.
  const { data: projects } = await supabase.from('projects').select('*');

  return <DashboardView projects={projects} />;
}
```

### Server Actions (Write)
Replace `ProjectContext` functions with Server Actions.

```typescript
// actions/create-project.ts
'use server'
import { createClient } from '@/lib/supabase/server';

export async function createProject(formData: FormData) {
  const supabase = createClient();
  
  // 1. Validate Admin Role (Double check)
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  
  if (profile.role !== 'Admin') throw new Error('Unauthorized');

  // 2. Insert
  await supabase.from('projects').insert({ ... });
}
```

## 5. Real-time Features

Supabase exposes a Postgres replication stream over WebSockets.

**Chat Implementation:**
1.  **Frontend**: Subscribe to `project_messages` table.
2.  **Filter**: `eq('project_id', currentProjectId)`.
3.  **Event**: On `INSERT`, update the UI state.

```typescript
// Client Component
const channel = supabase
  .channel('chat_room')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'project_messages',
    filter: `project_id=eq.${projectId}` 
  }, (payload) => {
    setMessages((prev) => [...prev, payload.new]);
  })
  .subscribe();
```

## 6. AI Integration

1.  **Context**: Use the `googleSearch` tool in `gemini-3-pro-image-preview` for real-time data if needed.
2.  **Vector Search**: We will eventually enable the `pgvector` extension in Supabase. This allows us to store the `Project Brief` as a vector embedding. When a user asks the AI a question, we query the vector store for relevant brief sections before sending the prompt to Gemini.

## 7. Migration Checklist

1.  [ ] **Create Supabase Project**: Enable Database, Auth, and Storage.
2.  [ ] **Run Schema**: Execute `database/schema.sql` in the Supabase SQL Editor.
3.  [ ] **Generate Types**: `npx supabase gen types typescript --project-id "your-id" > lib/database.types.ts`
4.  [ ] **Env Variables**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5.  [ ] **Migrate Assets**: Move mock images to Supabase Storage buckets.
