# Educare Institute

Educare Institute is a full-stack coaching institute platform with a redesigned public website, role-based authentication, an upgraded admin workspace, and a student dashboard for courses, classes, and notes.

## What Changed

This project was significantly reworked across both frontend and backend.

- The public-facing frontend was redesigned to give the app a cleaner and more modern identity.
- The application structure was reorganized with reusable layouts and shared UI pieces.
- The admin experience was rebuilt into a more complete dashboard with modular tabs and management flows.
- The student experience was refreshed with a dedicated dashboard, schedule view, notes access, and better loading states.
- The API integration was centralized around Vite environment variables instead of hardcoded localhost URLs.
- Git hygiene was improved by ignoring environment files, uploads, and server dependencies.

## Frontend Highlights

- Vite + React frontend
- Shared layouts for public, auth, and dashboard pages
- Reusable sidebar, top bar, and skeleton loading components
- Refreshed pages for home, about, contact, auth, admin, and student flows
- Central API configuration in [frontend/src/config/api.js](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/frontend/src/config/api.js)

## Admin Dashboard Work

The admin panel was expanded into a more complete management system with:

- Overview tab
- Students tab
- Pending students approvals
- Courses management
- Classes management
- Notes management
- Reusable entity and note modals
- Centralized admin dashboard service layer

Relevant files include:

- [frontend/src/pages/admin/AdminDashboard.jsx](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/frontend/src/pages/admin/AdminDashboard.jsx)
- [frontend/src/pages/admin/adminDashboard.service.js](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/frontend/src/pages/admin/adminDashboard.service.js)
- [frontend/src/pages/admin/OverviewTab.jsx](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/frontend/src/pages/admin/OverviewTab.jsx)
- [frontend/src/pages/admin/StudentsTab.jsx](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/frontend/src/pages/admin/StudentsTab.jsx)
- [frontend/src/pages/admin/CoursesTab.jsx](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/frontend/src/pages/admin/CoursesTab.jsx)
- [frontend/src/pages/admin/ClassesTab.jsx](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/frontend/src/pages/admin/ClassesTab.jsx)
- [frontend/src/pages/admin/NotesTab.jsx](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/frontend/src/pages/admin/NotesTab.jsx)

## Student Dashboard Work

The student side was reshaped into a cleaner dashboard experience with:

- Dashboard overview
- Enrolled courses display
- Class schedule display
- Notes browsing with PDF links
- Improved loading experience using skeleton UI

Relevant files:

- [frontend/src/pages/student/StudentDashboard.jsx](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/frontend/src/pages/student/StudentDashboard.jsx)
- [frontend/src/pages/student/StudentSidebar.jsx](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/frontend/src/pages/student/StudentSidebar.jsx)

## API Configuration

Hardcoded backend URLs were removed from the frontend and replaced with a central Vite-based API config:

```js
export const API_BASE = import.meta.env.VITE_API_URL;
```

All fetch and axios calls now use:

```js
`${API_BASE}/api/...`
```

Config file:

- [frontend/src/config/api.js](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/frontend/src/config/api.js)

## Environment Setup

Frontend:

- `VITE_API_URL` should point to the backend base URL, for example `http://localhost:5000`

Backend:

- Keep secrets in `server/.env`
- `server/.env` is ignored from git

## Repository Hygiene

The repository was cleaned up so that these are not committed:

- `server/.env`
- `frontend/.env.production`
- `server/node_modules/`
- `server/uploads/`

Server ignore rules are defined in:

- [server/.gitignore](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/server/.gitignore)
- [.gitignore](/c:/Users/HP/OneDrive/Desktop/Projects/educare-institute/.gitignore)

## Run Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm start
```

## Recent Major Commits

- `3cfe4ca` Update admin dashboard and clean server ignores
- `0ae529a` Update email handling, clean up .gitignore, and ensure .env is not tracked
- `437d59c` Simplify server for deployment - focus on API only

## Current Direction

This is no longer the original basic version of the project. The UI, structure, and workflow have all been reshaped into a more production-ready coaching platform with a stronger visual identity and better internal organization.
