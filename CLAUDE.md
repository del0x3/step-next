# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Step Next** — RPG-style life progression visualizer. Users create "spheres" (life areas like Sleep, Fitness, Finances) and build vertical skill-tree timelines with steps progressing from current state upward through free actions, milestone-gated achievements, and locked/hidden future nodes.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # ESLint check
```

## Architecture

- **Vite + React 19**, no routing library, no state management library — plain `useState`/`useEffect`
- **All data in localStorage** under key `step-next-data`. Load/save via `src/utils/storage.js`
- **No backend, no API calls** — fully client-side

### Component hierarchy

```
App.jsx (state owner, localStorage sync via useEffect)
├── Sphere.jsx (one life area — renders vertical timeline + manages step CRUD)
│   ├── StepNode.jsx (single node: dot + title + badge, handles toggle-complete)
│   └── AddStepForm.jsx (collapsible form with type radio selector)
└── AddSphereForm.jsx (collapsible form to create new sphere)
```

### Data model

Each sphere has an ordered array of steps. Step types: `current` (blue, where you are), `free` (green, zero-cost action), `milestone` (gold, requires a named milestone like "Зарплата 7к"), `locked` (grey, blurred, non-interactive).

### Styling

Plain CSS files per component (no CSS modules, no Tailwind). Dark theme only (`#0f0f23` background). Step dots use colored `box-shadow` glows. Locked nodes use CSS `filter: blur(3px)`. Vertical timeline line is a `::before` pseudo-element gradient on `.sphere__timeline`.

## Language

UI text is in Ukrainian. Keep all user-facing strings in Ukrainian unless told otherwise.
