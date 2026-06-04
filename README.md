# ProcessLens

A workflow intelligence dashboard for visualising business processes,
scoring bottlenecks, and tracking operational efficiency.

Built as a portfolio / learning project to explore Next.js 16's App Router,
React 19 client patterns, design-token-driven theming, and interactive
flow diagrams.

> **Scope of this repository:** This repo contains the **frontend** (Next.js)
> only. It ships with bundled demo data so the app runs standalone with no
> backend. An optional companion REST API (see [Backend Integration](#backend-integration))
> is consumed if reachable, otherwise the UI falls back to the demo data.

---

## Features

What's actually implemented in this codebase today:

- **Marketing landing page** at `/` with hero, animated flow preview, feature
  grid, and pricing layout (Framer Motion + custom SVG).
- **Application shell** (under `/dashboard`, `/processes`, `/analytics`,
  `/team`, `/settings`) with collapsible sidebar, topbar, and a
  ⌘K command palette (`cmdk`).
- **Process pages**
  - `/processes` — searchable, filterable grid of mapped processes with
    cycle time, completion rate, and bottleneck counters.
  - `/processes/[id]` — detail view with three modes (flow / table / timeline)
    and an interactive `@xyflow/react` canvas.
- **Custom node types** for the flow canvas: `task`, `decision`, `delay`,
  `external`.
- **Bottleneck scoring** (0–100) rendered as a coloured badge / glow per node
  (green → amber → red).
- **Scenario simulation** — toggle nodes off in the canvas and see the
  projected cycle-time reduction recomputed live (state in Zustand).
- **Dashboard** with KPI cards, an efficiency-trend area chart, a
  process-volume bar chart, recent processes, an activity feed, and an
  insights panel (Recharts).
- **Analytics page** with KPI tiles and trend charts wired to the same
  data layer.
- **Team page** — static viewer of team members, roles, and last-active
  times (mock data only; no auth, no invites).
- **Settings page** — UI shell with sections for profile, notifications,
  security, integrations, data export, and webhooks (form layout only;
  values are not persisted).
- **API client with graceful fallback** — every data call attempts the
  backend first and silently falls back to bundled fixtures on failure
  (`src/lib/api.ts`).

---

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 4, design tokens in `src/app/globals.css`
- **State:** Zustand (`src/store/app-store.ts`)
- **Charts:** Recharts
- **Flow canvas:** `@xyflow/react`
- **Animations:** Framer Motion
- **UI primitives:** Base UI + custom components in `src/components/ui/`
  (shadcn-style, not the shadcn CLI)
- **Icons:** Lucide
- **Date utilities:** date-fns
- **Command palette:** cmdk

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Install & run

```bash
npm install
npm run dev
```

The dev server starts on **`http://localhost:3005`** (port pinned in
`package.json`).

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev`   | Start the dev server on port `3005` |
| `npm run build` | Production build (`next build`) |
| `npm run start` | Run the production build |
| `npm run lint`  | Run ESLint |

---

## Project Structure

```text
src/
  app/
    (marketing)/       # Public landing page (/)
    (app)/             # Authenticated app shell
      dashboard/       # KPI dashboard
      processes/       # List + detail (/processes, /processes/[id])
      analytics/       # Charts & KPIs
      team/            # Team viewer (mock)
      settings/        # Settings UI shell
    layout.tsx         # Root layout
    globals.css        # Design tokens + base styles
  components/
    layout/            # Sidebar, topbar, command palette
    process/           # Flow canvas + custom nodes
    ui/                # Buttons, cards, inputs, dialogs, …
  lib/
    api.ts             # Fetch layer with mock-data fallback
    mock-data.ts       # Bundled demo processes, insights, team
    utils.ts           # cn() helper
  store/
    app-store.ts       # Zustand store (UI state, simulation)
  types/
    index.ts           # Shared types: Process, ProcessNode, Insight, …
```

---

## Backend Integration

The frontend expects an optional REST API at:

```text
http://localhost:4000/api/v1
```

(override via `NEXT_PUBLIC_API_URL`).

Endpoints currently consumed by the UI:

| Method | Path |
| --- | --- |
| GET | `/processes` |
| GET | `/processes/:id` |
| GET | `/processes/:id/insights` |
| GET | `/analytics/kpis` |
| GET | `/analytics/efficiency-trend` |
| GET | `/analytics/cycle-time-trend` |
| GET | `/analytics/process-volume` |
| GET | `/analytics/insights` |

If the API is unreachable, the client transparently returns the matching
fixture from `src/lib/mock-data.ts`, so the app remains fully explorable
without a backend.

> **Note:** The companion backend (a NestJS service serving these
> endpoints from in-memory data) lives outside this repository.

---

## Screenshots

<!--
Add screenshots here once captured. Suggested locations:

  public/screenshots/landing.png
  public/screenshots/dashboard.png
  public/screenshots/process-detail.png
  public/screenshots/analytics.png

Then reference them like:

  ![Landing page](public/screenshots/landing.png)
  ![Dashboard](public/screenshots/dashboard.png)
  ![Process detail with flow canvas](public/screenshots/process-detail.png)
  ![Analytics](public/screenshots/analytics.png)
-->

---

## Status / TODO

This is an actively iterated portfolio project. The UI is the focus;
several surfaces are intentionally not yet wired up:

- **No authentication.** "Sign in" routes directly to `/dashboard`. No
  user accounts, sessions, or RBAC are implemented.
- **No persistence layer.** Settings, profile edits, and process edits
  are not saved (no DB, no localStorage write path).
- **Team collaboration is read-only.** The `/team` page renders mock
  members. Comments, @mentions, and activity-feed writes are not built.
- **Insights are not really computed.** The "Insights Engine" panel
  displays pre-authored insight records. There is no rule engine
  evaluating live process data on the frontend.
- **Landing page social proof is placeholder.** Testimonials, stats
  ("500+ teams"), and pricing are layout content, not real data.
- **No tests yet.** No unit, integration, or E2E tests have been added
  to the frontend.
- **TanStack Query is installed but unused.** Data fetching currently
  uses plain `fetch` + `useEffect`; a Query-based refactor is on the list.
- **Companion backend is not in this repo.** The frontend works
  standalone via fallback fixtures.

---

## License

Private project, used for development and portfolio purposes.
