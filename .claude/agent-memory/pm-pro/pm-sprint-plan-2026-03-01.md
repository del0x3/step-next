# PM Sprint Plan -- Step Next
## Date: 2026-03-01
## Status: TASKS CREATED, READY FOR DEV

---

## PROJECT ANALYSIS

### Current State Assessment
The codebase is clean, minimal, and well-structured. React 19.2 + Vite, plain CSS with BEM naming, localStorage for persistence, Ukrainian UI. The architecture is sound but the product is a basic CRUD app with zero differentiating features. Four step types exist (current/free/milestone/locked) but there is no visual state system, no animations, no progress feedback, and no progressive disclosure.

Key observation: the data model is already sufficient for Sprint 1 work. Steps have `type`, `completed`, `order` fields. The fog-of-war engine (Sprint 2) can be a pure view-layer computation without data model changes. This is a significant advantage -- Sprint 1 is purely frontend rendering work with no data migration risk.

### Strategic Priority
The BA brief identifies genuine whitespace: no existing product combines "hidden future steps + multi-step life goals + progressive disclosure". The fog-of-war engine (Task 05) is the P0-critical differentiator, BUT it requires the 5-state visual system (Task 01) as a foundation. Therefore, Sprint 1 builds the rendering foundation that Sprint 2's core differentiator depends on.

### Risk Assessment
| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Task 01 visual states delay blocks Task 05 fog engine | Medium | High | Task 01 is Sprint 1 top priority; no other tasks depend on it finishing first within Sprint 1 |
| Celebration animations cause performance jank on mobile | Low | Medium | CSS-only animations, no external libraries, test on 640px viewport |
| AddSphereForm wizard (Task 03) breaks existing sphere creation | Low | High | Backward compatibility required -- object param with fallback |
| localStorage data model changes break existing user data | Medium | High | No data model changes in Sprint 1-2; fog states computed on render only |
| Sprint 1 scope creep from polishing animations | Medium | Medium | Strict acceptance criteria; "good enough" animations, polish in Sprint 3 |

---

## SPRINT 1: CORE UX FOUNDATIONS
**Goal**: Build the visual rendering foundation that all future features depend on. After Sprint 1, the app should FEEL dramatically different even though the data model is unchanged.

**Duration**: 3-5 days
**Success Criteria**: 5 visual node states working, step completion feels rewarding, new spheres have momentum, progress is visible.

### Tasks (execution order)

| Order | Task | File | Size | Key Deliverable |
|---|---|---|---|---|
| 1 | Task 01: 5 Visual Node States | task-01-visual-node-states.md | M | StepNode accepts visualState prop with 5 states |
| 2 | Task 04: Step Count Progress | task-04-step-count-progress.md | S | "Krok X z Y" counter with dynamic framing |
| 3 | Task 03: Endowed Progress | task-03-endowed-progress.md | S | 2-step sphere wizard, Level badge, progress bar |
| 4 | Task 02: Celebration Animations | task-02-celebration-animations.md | M | 3-tier CSS animations on step completion |

**Execution rationale**:
- Task 01 first because it is the foundation for everything. Task 05 (Sprint 2) CANNOT start until Task 01 is done.
- Task 04 second because it is small, independent, and provides immediate visible progress feedback.
- Task 03 third because it enriches the sphere creation flow and adds the progress bar.
- Task 02 fourth because animations are the polish layer -- they enhance what Tasks 01/03/04 build.

**Parallel opportunities**: Tasks 03 and 04 are fully independent and can be done simultaneously if multiple dev threads are available.

---

## SPRINT 2: CORE DIFFERENTIATOR
**Goal**: Ship the fog-of-war engine -- the product's unique value proposition. After Sprint 2, Step Next is fundamentally different from every competitor.

**Duration**: 5-7 days
**Success Criteria**: Progressive disclosure works automatically, users experience "reveal" moments, peek-ahead respects autonomy, first-time onboarding demonstrates the concept.

### Tasks (execution order)

| Order | Task | File | Size | Key Deliverable |
|---|---|---|---|---|
| 5 | Task 05: Fog-of-War Engine | task-05-fog-of-war-engine.md | L | computeVisualStates() utility, auto-reveal on completion |
| 6 | Task 06: Peek Ahead | task-06-peek-ahead.md | M | Per-sphere eye toggle to bypass fog |
| 7 | Task 07: Onboarding Flow | task-07-onboarding-flow.md | M | 3-step interactive onboarding with aha moment |

**Execution rationale**:
- Task 05 is P0-critical and blocks Tasks 06 and 07.
- Task 06 before 07 because it is smaller and directly extends fog engine.
- Task 07 last because it integrates everything: fog engine + sphere wizard + celebrations.

**Dependencies**:
- Task 05 requires Task 01 (completed in Sprint 1)
- Task 06 requires Task 05
- Task 07 requires Task 05, enhanced by Tasks 02 and 03

---

## SPRINT 3: STRATEGIC EXPANSION
**Goal**: Add gamification depth, reduce friction, prepare for scale.

**Duration**: 7-10 days (can be split into Sprint 3a/3b)
**Success Criteria**: XP system provides ongoing motivation, templates solve cold-start, info gaps create curiosity pull, data is exportable.

### Tasks (priority order)

| Order | Task | File | Size | Priority |
|---|---|---|---|---|
| 8 | Task 12: Data Export/Import | task-12-data-export-import.md | S | P2 |
| 9 | Task 08: XP + Level System | task-08-xp-level-system.md | L | P2 |
| 10 | Task 10: Info Gap Design | task-10-info-gap-design.md | M | P2 |
| 11 | Task 09: Domain Templates | task-09-domain-templates.md | L | P2 |
| 12 | Task 11: Monetization Prep | task-11-monetization-prep.md | M | P3 |

**Execution rationale**:
- Task 12 (export/import) first because it is small, independent, and builds user trust.
- Task 08 (XP system) provides the deepest gamification layer.
- Task 10 (info gaps) refines the fog-of-war UX.
- Task 09 (templates) solves cold-start but requires content creation effort.
- Task 11 (monetization) is infrastructure-only, lowest priority.

---

## DEPENDENCY GRAPH

```
Task 01 (Visual States)
  |
  +---> Task 05 (Fog Engine)
  |       |
  |       +---> Task 06 (Peek Ahead)
  |       +---> Task 07 (Onboarding) [also needs Task 02, Task 03]
  |       +---> Task 10 (Info Gap Design)
  |
  +---> Task 02 (Celebrations) [partially, for "revealing" animation]

Task 03 (Endowed Progress) -- independent
Task 04 (Step Count) -- independent
Task 08 (XP System) -- needs Task 03 concept
Task 09 (Templates) -- enhanced by Task 03, Task 05
Task 11 (Monetization) -- independent
Task 12 (Export/Import) -- independent
```

---

## TASK FILES CREATED FOR DEV AGENT (fs-pro)

All files at: `C:\Users\hlibs\sns\.claude\agent-memory\fs-pro\`

### Sprint 1 (DO FIRST)
1. `task-01-visual-node-states.md` -- P1-high, Size M
2. `task-02-celebration-animations.md` -- P1-high, Size M
3. `task-03-endowed-progress.md` -- P1-high, Size S
4. `task-04-step-count-progress.md` -- P1-high, Size S

### Sprint 2
5. `task-05-fog-of-war-engine.md` -- P0-critical, Size L
6. `task-06-peek-ahead.md` -- P2-medium, Size M
7. `task-07-onboarding-flow.md` -- P2-medium, Size M

### Sprint 3
8. `task-08-xp-level-system.md` -- P2-medium, Size L
9. `task-09-domain-templates.md` -- P2-medium, Size L
10. `task-10-info-gap-design.md` -- P2-medium, Size M
11. `task-11-monetization-prep.md` -- P3-low, Size M
12. `task-12-data-export-import.md` -- P2-medium, Size S

---

## DEV AGENT INSTRUCTIONS

DEV agent (fs-pro): Start with Sprint 1 tasks in this order:
1. **task-01** first (foundation for everything)
2. **task-04** second (quick win, independent)
3. **task-03** third (enriches sphere creation)
4. **task-02** fourth (animation polish)

After Sprint 1 completion, proceed to Sprint 2 starting with **task-05** (the core differentiator).

Each task file contains:
- Exact files to modify/create
- Code examples and patterns to follow
- Acceptance criteria checklist
- Dependency information
- activeForm for progress tracking

Coding conventions to maintain:
- BEM CSS naming (.block__element--modifier)
- Ukrainian UI text
- Dark theme colors: background #0f0f23, card #1a1a2e, border #2a2a4a
- Neon accents: indigo #6366f1, emerald #10b981, amber #f59e0b
- 640px max-width mobile-first layout
- localStorage via storage.js utility
- Functional React components with hooks
