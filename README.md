# ProcessLens

ProcessLens is a modern workflow intelligence dashboard for **visualizing business processes**, **detecting bottlenecks**, and **tracking operational efficiency** through a polished, interactive interface.

It is designed for ops teams, product managers, and process owners who want to make hidden workflow friction visible and actionable.

---

## ✨ Features

- **Interactive process mapping** with task, decision, delay, and external nodes
- **Bottleneck scoring** to quickly identify risky or slow workflow steps
- **Operational analytics** with KPI cards, trends, and comparison charts
- **Scenario simulation** for testing process changes before rollout
- **Team and collaboration views** for shared process ownership
- **API-ready frontend** with graceful fallback to demo data when the backend is unavailable

---

## 🛠 Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **State:** Zustand
- **Charts:** Recharts
- **Flow UI:** `@xyflow/react`
- **Animations:** Framer Motion
- **UI primitives:** Base UI / custom components

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22+
- **npm** 10+

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The app runs at:

- **Frontend:** `http://localhost:3005`

---

## 🔌 Backend Integration

If a local ProcessLens API is available at:

```text
http://localhost:4000/api/v1
```

…the frontend automatically loads live process and analytics data.

If the API is not available, the app falls back to bundled demo data so the interface still works out of the box.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server on port `3005` |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint checks |

---

## 📁 Project Structure

```text
src/
  app/                # App Router pages and layouts
  components/         # Shared UI, layout, and process visualization components
  lib/                # API helpers, mock data, and utilities
  store/              # Zustand application state
  types/              # Shared TypeScript types
```

---

## 🎯 Project Goal

ProcessLens aims to turn vague, hard-to-explain workflow problems into something teams can **see**, **measure**, and **improve**.

Instead of static documentation or scattered process notes, it provides a living operational view of how work actually flows.

---

## 📌 Status

This repository currently contains the **frontend application** for ProcessLens and is actively set up for local development, UI iteration, and backend integration.

---

## License

Private project for development and portfolio use.

