# PM Agent Memory -- Step Next Project

## Project: Step Next
- React 19.2 + Vite 7.3, localStorage, no backend, plain CSS (BEM), Ukrainian UI
- Dark theme: bg #0f0f23, card #1a1a2e, border #2a2a4a
- Neon accents: indigo #6366f1, emerald #10b981, amber #f59e0b
- 640px max-width, mobile-first
- Key files: src/App.jsx, src/components/{Sphere,StepNode,AddStepForm,AddSphereForm}.jsx, src/utils/storage.js

## Agent Pipeline
- BA agent (ba-pro) -> PM agent (pm-pro) -> DEV agent (fs-pro) -> BA -> PM -> ...
- BA writes briefs to: `.claude/agent-memory/pm-pro/`
- PM writes task files to: `.claude/agent-memory/fs-pro/`
- PM writes sprint plans to: `.claude/agent-memory/pm-pro/`

## Sprint Status (2026-03-01)
- 12 tasks created from BA brief, 3 sprints planned
- Sprint 1 (4 tasks): Visual states, celebrations, endowed progress, step counter
- Sprint 2 (3 tasks): Fog-of-war engine (P0), peek ahead, onboarding
- Sprint 3 (5 tasks): XP system, templates, info gaps, monetization prep, export/import
- Critical dependency: Task 01 (visual states) blocks Task 05 (fog engine)

## Conventions
- Task files named: task-NN-short-name.md
- Each task has: description, what to do, files to modify, acceptance criteria, dependencies
- Sprint plans named: pm-sprint-plan-YYYY-MM-DD.md
- Always include activeForm field for DEV progress tracking
