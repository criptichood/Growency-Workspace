
# Database Schema Implementation Guide

This directory contains the SQL schema required to migrate "Growency" from a frontend-only mock application to a full-stack application.

## 1. Auth Flow Implementation

The schema includes a `password_hash` column. Do **not** store plain text passwords.

### Recommended Flow:
1.  **Backend:** Use Node.js (Express/NestJS) or Python (FastAPI).
2.  **Registration/Login:** 
    *   Receive `email` and `password`.
    *   Compare password using `bcrypt` or `argon2`.
    *   Generate a JWT (JSON Web Token) containing `{ userId, role }`.
3.  **Frontend:** 
    *   Store the JWT in `localStorage` or HttpOnly Cookie.
    *   Include `Authorization: Bearer <token>` in all API requests.

## 2. Progress Calculation

You will notice there is no `progress` column in the `projects` table. This is intentional to prevent data drift.

**How to calculate progress in SQL:**
```sql
SELECT 
    p.id, 
    p.name,
    CASE 
        WHEN COUNT(t.id) = 0 THEN 0
        ELSE ROUND((COUNT(CASE WHEN t.is_completed THEN 1 END) * 100.0) / COUNT(t.id))
    END as progress
FROM projects p
LEFT JOIN project_phases ph ON p.id = ph.project_id
LEFT JOIN project_tasks t ON ph.id = t.phase_id
GROUP BY p.id;
```

## 3. JSONB Usage

We use `JSONB` for:
1.  **Dashboard Layouts**: Allows users to drag/drop widgets without strict schema migrations.
2.  **Attachments**: Storing file metadata (url, size, type) in chat messages prevents creating a heavy `message_attachments` join table for simple chat features.
3.  **User Preferences**: Notification toggles and social links are rarely queried for analytics, making them perfect for JSON storage.

## 4. Real-time Features

For Chat and Notifications:
*   The schema supports polling via `created_at` timestamps.
*   For true real-time, implement **WebSockets** (Socket.io) on the backend.
*   When a `project_messages` row is inserted, emit a socket event to the room `project-{projectId}`.
