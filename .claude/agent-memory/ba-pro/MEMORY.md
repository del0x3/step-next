# BA Agent Memory - Step Next Project

## Project Context
- Step Next: RPG-style life progression visualizer (React 19 + Vite 7, localStorage, dark theme)
- Core concept: vertical timeline with step types: current, free, milestone, locked
- UI in Ukrainian. No backend. Plain CSS (no Tailwind/modules).
- Key files: App.jsx, Sphere.jsx, StepNode.jsx, AddStepForm.jsx, AddSphereForm.jsx, storage.js

## Research Documents Analyzed (2026-03-01)
- 1.pdf: Competitive landscape (17+ apps), influencer frameworks, 6 psychology mechanisms, design patterns (skill tree structures), 5 visual node states
- 2.pdf: Progressive disclosure for life goals, 7 research traditions (Bandura proximal goals, Sweller cognitive load, Zeigarnik, Loewenstein info gap, Gollwitzer implementation intentions, decision fatigue, goal gradient), ADHD community demand, design objections

## Key Strategic Insights
- No existing product combines "hidden future steps + life goals + progressive disclosure" -- genuine whitespace
- Hybrid vertical-path model recommended (linear primary axis + branching at milestones)
- 5 visual states needed: Completed, Active/Current, Available (next), Locked, Hidden (fog of war)
- Dual progress system: continuous XP bar + discrete level-ups
- Endowed Progress Effect: start at Level 1, not Level 0
- Celebration animations are critical for dopamine/fiero moments
- ADHD/neurodivergent users are primary early adopters
- "Peek ahead" optional feature addresses autonomy concerns from SDT
- Goal gradient effect: show "approaching the end" without revealing content

## Agent Communication
- Claude Code agents (ba-pro, pm-pro, fs-pro) cannot invoke each other via Skill tool
- Inter-agent communication done via shared files in .claude/agent-memory/{agent-name}/
- PM brief delivered to: .claude/agent-memory/pm-pro/ba-brief-2026-03-01.md
- User must manually switch to pm-pro agent to process the brief

## Sprint 1 Review (2026-03-01)
- Tasks delivered: 01 (Visual Node States), 03 (Endowed Progress), 04 (Step Count Progress)
- CRITICAL BUG: Sphere.jsx never passes visualState prop to StepNode -- Task 01 is dead code
- Task 03 + 04 work correctly and integrate well with each other
- `level` field in sphere data model is written but never read (dead data)
- Review file: .claude/agent-memory/ba-pro/sprint1-review-2026-03-01.md

## Lessons Learned
- When tasks touch different files in a pipeline (StepNode vs Sphere), the wiring between them can fall through the cracks -- always verify integration points in specs
- Parallel DEV agents editing shared files did NOT cause merge conflicts (good spec scoping by PM)
- DEV made good localization decisions (em-dash typography) beyond spec requirements

## Competitors (Quick Reference)
- Skilltree: 50K dl, closest locked-node UX, weak visual polish
- Habitica: 4M users, deep RPG, no locked future levels
- Finch: 5M MAU, non-punitive Tamagotchi model, no life planning
- LifeUp: niche, max customization, complex UX
- Market size: $11.4B habit-tracking, projected $43.9B by 2034
