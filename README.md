# ✦ TaskFlow

<p align="center">
  <strong>AI-powered task management with a premium dark interface</strong>
</p>

<p align="center">
  <a href="https://taskflow-snehal.vercel.app">Live Demo</a> · 
  <a href="#features">Features</a> · 
  <a href="#tech-stack">Stack</a> · 
  <a href="#getting-started">Setup</a>
</p>

---

## About

**TaskFlow** is a full-stack productivity app built with **Next.js 16**, **Supabase**, and **Gemini AI**. It combines fast task management with intelligent features like AI task breakdown, natural language input, and smart priority suggestions — all wrapped in a premium glassmorphism UI.

---

## Features

### Core
- **Task CRUD** — Create, complete, and delete tasks with optimistic UI updates
- **Project Organization** — Group tasks by color-coded projects
- **Drag & Drop Reordering** — Reorder tasks within categories using `@dnd-kit`
- **Search & Filters** — Filter by project, completion status, or keyword

### AI-Powered (Gemini 2.5 Flash)
- **🧠 AI Task Breakdown** — Enter a goal, get 3–6 actionable subtasks with priority levels
- **⚡ Smart Priority Suggestion** — AI analyzes task titles and suggests HIGH/MEDIUM/LOW
- **🎯 Focus Mode** — AI picks your top 3 tasks for the day with reasoning
- **💬 Natural Language Input** — Type "Call John tomorrow 3pm high priority" and it auto-fills title, date, and priority

### Design
- **Glassmorphism UI** — Frosted glass cards, blurred backdrops, gradient borders
- **Particle Background** — Interactive particle animation via `react-tsparticles`
- **Micro-Animations** — Hover lifts, shimmer effects, staggered task entry, checkbox bounce
- **Gradient Stat Cards** — Teal/emerald/amber stats with glow shadows
- **Editorial Typography** — Inter + Instrument Serif font pairing

### Auth
- **GitHub & Google OAuth** via Supabase
- **Email/Password** signup with session persistence
- **Fragment-based session recovery** for edge cases

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, React 19) |
| **Backend/Auth** | Supabase (PostgreSQL, Auth, SSR) |
| **AI** | Google Gemini 2.5 Flash via server-side API route |
| **Styling** | Tailwind CSS + custom glassmorphism utilities |
| **Drag & Drop** | @dnd-kit/core, @dnd-kit/sortable |
| **Animations** | Custom CSS keyframes + react-tsparticles |
| **Icons** | Google Material Symbols |
| **Fonts** | Inter, Instrument Serif (Google Fonts) |
| **Deployment** | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project with `tasks` and `projects` tables
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini

### 1. Clone & Install
```bash
git clone https://github.com/snehalchetry/taskflow.git
cd taskflow
npm install
```

### 2. Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run
```bash
npm run dev
```
Open [localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
├── api/
│   ├── gemini/route.ts     # Server-side Gemini proxy (all AI features)
│   ├── tasks/route.ts      # Task CRUD API
│   └── projects/route.ts   # Project CRUD API
├── auth/callback/route.ts  # OAuth callback handler
├── dashboard/page.tsx      # Main dashboard (1100+ lines)
├── login/page.tsx          # Login page
├── signup/page.tsx         # Signup page
├── globals.css             # Custom glassmorphism + animation utilities
└── layout.tsx              # Root layout with fonts
components/
├── auth/auth-sync.tsx      # Fragment-based session recovery
└── ui/                     # Particles, Logo components
lib/
├── gemini.ts               # Client helpers → /api/gemini
├── supabase.ts             # Supabase client
└── supabase-server.ts      # Server-side Supabase client
```

---

## Database Schema

### `tasks`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| title | text | Task title |
| priority | text | "1" (high), "2" (med), "3" (low) |
| category | text | Project name / "Inbox" |
| time | text | Optional deadline |
| completed | boolean | Completion status |

### `projects`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| name | text | Project name |
| color | text | Hex color code |

---

## Problems & Solutions

Real challenges encountered during development:

| # | Problem | Root Cause | Fix |
|---|---------|-----------|-----|
| 1 | **OAuth login lands on 404** | Supabase returns tokens in URL fragments (`#access_token=...`) which the server can't read | Built a global `AuthSync` component that parses fragments client-side as a fallback |
| 2 | **Gemini API key empty on client** | Next.js 16 Turbopack doesn't inline `NEXT_PUBLIC_` env vars reliably into client bundles | Moved all AI calls to a server-side API route (`/api/gemini`) — key never touches the browser |
| 3 | **`cookies()` build failures on Vercel** | `next/headers` cookies are now async in Next.js 15+ | Refactored all API routes and auth callback to `await cookies()` |
| 4 | **Social login redirects to localhost** | Supabase Site URL was still set to `localhost:3000` | Updated Supabase dashboard + used `window.location.origin` dynamically |
| 5 | **Drag intercepting click events** | Default `@dnd-kit` PointerSensor treats any mouse movement as a drag | Configured `activationConstraint: { distance: 5 }` — clicks pass through, drags activate on movement |

---

## License

MIT © [Snehal Chetry](https://github.com/snehalchetry)