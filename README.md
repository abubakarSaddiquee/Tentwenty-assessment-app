# ticktock — Timesheet Management App

> **TenTwenty Frontend Developer Assessment 2025**
> Built by **Abubakar Saddiq**

**Live Demo:** [https://tentwenty-assessment-app.vercel.app](https://tentwenty-assessment-app.vercel.app)

---

## Overview

**ticktock** is a SaaS-style Timesheet Management web application. It allows users to log in securely, view their weekly timesheets, manage timesheet entries (add, edit, delete), and track daily tasks within each week. The application is fully responsive — from 320px mobile screens up to large desktops.

---

## Getting Started

### Prerequisites

- Node.js **18+**
- npm

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Create environment file (already included)
# .env.local contains AUTH_SECRET and NEXTAUTH_URL

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Login Credentials

The app uses **mock/dummy authentication** — no real database. Two users are pre-seeded:

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@ticktock.com     | password123 |
| User  | user@ticktock.com      | password123 |

> On visiting `/`, the app checks your session and auto-redirects to `/dashboard` (logged in) or `/login` (not logged in).

---

## Available Scripts

```bash
npm run dev           # Start development server (http://localhost:3000)
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

---

## Tech Stack

### Core Framework

| Library | Version | Purpose |
|---------|---------|---------|
| **Next.js** | 16.2.3 | React framework — App Router, API routes, SSR |
| **React** | 19.2.4 | UI library |
| **TypeScript** | ^5 | Static type safety throughout the project |

### Styling

| Library | Version | Purpose |
|---------|---------|---------|
| **Tailwind CSS** | ^4 | Utility-first CSS framework |
| **@tailwindcss/postcss** | ^4 | PostCSS integration for Tailwind v4 |

### Authentication

| Library | Version | Purpose |
|---------|---------|---------|
| **NextAuth.js** | ^5.0.0-beta | Authentication — Credentials provider, JWT sessions |

### State Management & API

| Library | Version | Purpose |
|---------|---------|---------|
| **Redux Toolkit** | ^2.11.2 | Global state management |
| **RTK Query** | (included in RTK) | API calls, caching, auto-invalidation |
| **react-redux** | ^9.2.0 | React bindings for Redux |

### Forms & Validation

| Library | Version | Purpose |
|---------|---------|---------|
| **React Hook Form** | ^7.72.1 | Performant form handling |
| **Yup** | ^1.7.1 | Schema-based form validation |
| **@hookform/resolvers** | ^5.2.2 | Connects Yup schema to React Hook Form |

### Testing

| Library | Version | Purpose |
|---------|---------|---------|
| **Jest** | ^30.3.0 | Test runner |
| **jest-environment-jsdom** | ^30.3.0 | Browser-like environment for tests |
| **@testing-library/react** | ^16.3.2 | React component testing utilities |
| **@testing-library/jest-dom** | ^6.9.1 | Custom DOM matchers for Jest |

---

## Project Structure

```
abubakar-saddiq-tentwenty-assessment/
│
├── src/
│   │
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Root — redirects to /dashboard or /login
│   │   ├── layout.tsx                # Root layout — Inter font, Redux Provider
│   │   ├── globals.css               # Global CSS variables (design tokens)
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx              # Login page — renders SignIn feature
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Dashboard layout — Navbar + Footer
│   │   │   ├── page.tsx              # Dashboard page — renders Dashboard feature
│   │   │   └── timesheet/[id]/
│   │   │       └── page.tsx          # Timesheet detail page
│   │   │
│   │   └── api/                      # Internal API routes (mock backend)
│   │       ├── auth/[...nextauth]/
│   │       │   └── route.ts          # NextAuth GET/POST handler
│   │       └── timesheets/
│   │           ├── route.ts          # GET /timesheets, POST /timesheets
│   │           ├── store.ts          # In-memory timesheet data store
│   │           ├── tasks-store.ts    # In-memory task data store
│   │           └── [id]/
│   │               ├── route.ts      # GET /timesheets/:id, PUT, DELETE
│   │               └── tasks/
│   │                   ├── route.ts  # GET /timesheets/:id/tasks, POST
│   │                   └── [taskId]/
│   │                       └── route.ts  # PUT /tasks/:taskId, DELETE
│   │
│   ├── features/                     # Feature modules (UI + logic separated)
│   │   ├── auth/
│   │   │   └── signin/
│   │   │       ├── index.tsx         # Login form UI (JSX only)
│   │   │       ├── useSignin.ts      # Form logic, signIn call, redirect
│   │   │       └── data.ts           # Hero panel content constants
│   │   │
│   │   ├── dashboard/
│   │   │   ├── index.tsx             # Dashboard UI (JSX only)
│   │   │   ├── useDashboard.ts       # All logic — filters, pagination, modal state
│   │   │   ├── TimesheetModal.tsx    # Add/Edit timesheet modal
│   │   │   ├── data.tsx              # Table columns, status maps, filter options
│   │   │   └── icons.tsx             # SVG icon components (CalendarIcon, etc.)
│   │   │
│   │   └── timesheet/
│   │       ├── index.tsx             # Timesheet detail UI (JSX only)
│   │       ├── useTimesheet.ts       # All logic — task groups, CRUD handlers
│   │       ├── TaskModal.tsx         # Add/Edit task modal (separate from dashboard modal)
│   │       ├── components.tsx        # ThreeDotMenu component
│   │       ├── interface.ts          # TimesheetTaskGroup interface
│   │       └── data.ts               # Project options, type of work options, date helpers
│   │
│   ├── components/                   # Shared reusable components
│   │   ├── ui/
│   │   │   ├── Button.tsx            # Button — variants: primary, secondary, outline, ghost, danger
│   │   │   ├── Input.tsx             # Input — with label, error message support
│   │   │   ├── Badge.tsx             # Status badge — COMPLETED, INCOMPLETE, MISSING
│   │   │   └── index.ts              # Barrel export
│   │   └── common/
│   │       ├── Modal.tsx             # Reusable modal — Escape key, scroll lock, backdrop click
│   │       ├── Table.tsx             # Reusable table — pagination, loading skeleton, empty state
│   │       └── index.ts              # Barrel export
│   │
│   ├── services/                     # RTK Query API layer
│   │   ├── api.ts                    # Base RTK Query createApi — baseUrl: /api
│   │   ├── timesheetApi.ts           # Timesheet endpoints (GET list, GET by id, POST, PUT, DELETE)
│   │   └── taskApi.ts                # Task endpoints (GET, POST, PUT, DELETE)
│   │
│   ├── store/
│   │   ├── index.ts                  # Redux store configuration
│   │   └── provider.tsx              # ReduxProvider client component
│   │
│   ├── lib/
│   │   ├── auth.ts                   # NextAuth config — credentials, JWT callbacks, dummy users
│   │   └── utils.ts                  # Utility functions — cn(), formatDateRange(), formatSingleDate()
│   │
│   ├── types/
│   │   └── timesheet.ts              # All TypeScript interfaces — Timesheet, Task, payloads, form values
│   │
│   ├── theme/
│   │   ├── colors.ts                 # Brand colors, status colors, UI colors (single source of truth)
│   │   ├── typography.ts             # Font family, sizes, weights
│   │   └── index.ts                  # Barrel export
│   │
│   ├── layouts/
│   │   ├── navbar/index.tsx          # Top navigation — logo, user dropdown, logout
│   │   └── footer/index.tsx          # Footer component
│   │
│   └── __tests__/                    # Unit tests
│       ├── Button.test.tsx           # Button component tests
│       ├── Badge.test.tsx            # Badge component tests
│       └── Modal.test.tsx            # Modal component tests
│
├── .env.local                        # Environment variables (AUTH_SECRET, NEXTAUTH_URL)
├── next.config.ts                    # Next.js configuration
├── tailwind.config                   # Tailwind v4 (configured via postcss)
├── postcss.config.mjs                # PostCSS — @tailwindcss/postcss plugin
├── tsconfig.json                     # TypeScript configuration
├── jest.config.ts                    # Jest configuration
└── jest.setup.ts                     # Jest setup — @testing-library/jest-dom
```

---

## API Endpoints

All API routes are internal Next.js routes (no external server). Data is stored **in-memory** using `globalThis` so it persists across hot reloads in development.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/callback/credentials` | Sign in with email + password |
| POST | `/api/auth/signout` | Sign out |

### Timesheets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/timesheets` | List all timesheets (pagination, status filter, date range filter) |
| POST | `/api/timesheets` | Create new timesheet entry (auto sets weekNumber: 1, shifts others) |
| GET | `/api/timesheets/:id` | Get single timesheet by ID |
| PUT | `/api/timesheets/:id` | Update timesheet (project, hours, status, etc.) |
| DELETE | `/api/timesheets/:id` | Delete timesheet |

**GET /api/timesheets query params:**
```
?page=1&limit=5&status=COMPLETED&startDate=2024-01-01&endDate=2024-03-31
```

### Tasks (per timesheet week)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/timesheets/:id/tasks` | Get all tasks for a timesheet week |
| POST | `/api/timesheets/:id/tasks` | Add a new task to a specific date within the week |
| PUT | `/api/timesheets/:id/tasks/:taskId` | Update an existing task |
| DELETE | `/api/timesheets/:id/tasks/:taskId` | Delete a task |

---

## Key Features

- **Authentication** — Login/logout with JWT session via NextAuth.js
- **Dashboard** — Paginated timesheet list with date range filter and status filter
- **Status logic** — Auto-calculated: 0 hrs = MISSING, <40 hrs = INCOMPLETE, ≥40 hrs = COMPLETED
- **Action buttons** — COMPLETED → View detail, INCOMPLETE → Edit modal, MISSING → Add modal
- **Timesheet Detail** — View weekly tasks grouped by day (Mon–Fri)
- **Task CRUD** — Add, edit, delete individual tasks per day with their own modal
- **Responsive design** — Works from 320px mobile to large desktop; tables use horizontal scroll on small screens
- **Week numbering** — New entries always get Week 1; existing entries shift up automatically

---

## Architecture Decisions

### Feature-based Structure
Each feature (`dashboard`, `timesheet`, `auth/signin`) is self-contained:
- `index.tsx` — JSX only, no logic
- `useXxx.ts` — all state, effects, API calls, handlers
- `data.ts` / `data.tsx` — constants, column definitions, options
- `components.tsx` / `icons.tsx` — sub-components used only within the feature

### API Integration
Components never call mock data directly. All data flows through:
> Component → Custom Hook → RTK Query → `/api/...` route → In-memory Store

### Mock Data
- **15 weekly timesheets** seeded on first request (stored in `globalThis.__timesheetStore`)
- **Tasks** seeded per timesheet (stored in `globalThis.__taskStore`)
- **2 dummy users** hardcoded in `src/lib/auth.ts`

### Design Tokens
Colors and typography are defined once in `src/theme/` and referenced as CSS variables in `globals.css`, ensuring a single source of truth for the entire design system.

---

## Environment Variables

```env
AUTH_SECRET=ticktock-super-secret-key-2024-tentwenty-assessment
NEXTAUTH_URL=http://localhost:3000
```

---

*Built by **Abubakar Saddiq** — TenTwenty Frontend Developer Assessment 2025*
