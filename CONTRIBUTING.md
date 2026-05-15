# Contributing

Developer guide for the **ProcessLens** frontend.

> Documentation convention: this guide is tool-agnostic. No editor- or AI-assistant-specific instructions.

---

## 1. Project Overview

ProcessLens is a workflow intelligence dashboard for visualizing business processes, detecting bottlenecks, and tracking operational efficiency.

This repository contains the **frontend** only. Backend API (if available) is consumed from `http://localhost:4000/api/v1`. With no backend running, the app falls back to bundled demo data.

For a feature-level overview, see the project [README.md](./README.md).

---

## 2. Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 4
- **State:** Zustand
- **Data fetching:** TanStack Query
- **Charts:** Recharts
- **Flow UI:** `@xyflow/react`
- **Animations:** Framer Motion
- **UI primitives:** Base UI, shadcn-style custom components

---

## 3. Project Structure

```text
src/
  app/          # App Router: pages, layouts, routes
  components/   # Shared UI, layout, process visualization
  lib/          # API helpers, mock data, utilities
  store/        # Zustand stores
  types/        # Shared TypeScript types
public/         # Static assets
```

---

## 4. Development Setup

### Prerequisites

- Node.js 22+
- npm 10+

### Install

```bash
npm install
```

### Run

```bash
npm run dev       # http://localhost:3005
```

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Dev server (port 3005) |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

---

## 5. Coding Conventions

- TypeScript strict mode; avoid `any` unless documented
- Tailwind utility-first; component-level abstraction lives in `components/`
- Zustand stores in `store/`, scoped per domain (no global god store)
- Server components by default in `app/`; mark `"use client"` only where interactivity demands it
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:`, `test:`, `perf:`, `security:`

---

## 6. Workflow

- Solo repo, direct commits to `main`
- Run `npm run lint` and `npm run build` before pushing non-trivial changes
- Keep PRs/commits small and focused

---

## 7. Architecture Notes

### Backend Contract

The frontend expects a REST API at `http://localhost:4000/api/v1`. When unavailable, fixtures in `src/lib/` provide demo data so the UI remains explorable.

### Routing

App Router-based. Top-level routes live under `src/app/`. Shared layouts at `src/app/layout.tsx`.

### State

- **UI state:** Zustand stores in `src/store/` (per-domain)
- **Server state:** TanStack Query for any backend-bound data

### Next.js Version Note

The pinned Next.js version (16.x) introduces breaking changes compared to older majors — APIs, conventions, and file structure differ. When unsure, consult `node_modules/next/dist/docs/` for the version-specific guides rather than relying on outdated tutorials. See [`AGENTS.md`](./AGENTS.md) for a brief reminder.
