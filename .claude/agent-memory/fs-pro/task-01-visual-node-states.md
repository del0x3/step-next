# TASK 01: Implement 5 Visual Node States
## Sprint: 1 | Priority: P1-high | Size: M (1-2 days) | activeForm: StepNode

## Description
Refactor StepNode component to support 5 distinct visual states instead of the current 4 step types. The current implementation uses `step.type` (current/free/milestone/locked) as both data model and visual state. The new system introduces a `visualState` prop that controls rendering independently from the data type.

## Context / Why
The 5-state visual system is the rendering foundation for the entire progression UI. Every subsequent feature (fog-of-war, celebrations, progress indicators) depends on nodes being able to display these 5 states. Without this, the app cannot differentiate between "available next step" and "far future locked step".

## What to Do

### 1. Add `visualState` prop to StepNode.jsx
StepNode must accept an optional `visualState` prop with values: `"completed"`, `"active"`, `"available"`, `"locked"`, `"hidden"`. When `visualState` is not provided, fall back to the current behavior (backward compatible).

### 2. Implement each visual state in StepNode.jsx and StepNode.css

**State: completed**
- Full color of the step's original type (current=indigo, free=green, milestone=gold)
- White checkmark overlay inside the dot (replace current white circle with SVG checkmark or CSS checkmark)
- Subtle glow: `box-shadow: 0 0 8px` with 40% opacity of the type color
- Opacity: 1.0 (NOT the current 0.5 -- completed should feel rewarding, not faded)
- Title: no strikethrough, instead add a subtle `color: #9ca3af` to differentiate
- Cursor: pointer (tap to review)

**State: active**
- Pulsating CSS animation on the dot: `@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }` with `animation: pulse 2s ease-in-out infinite`
- Dot size: 24px (vs default 20px)
- Bright neon accent matching type color at full saturation
- Strong glow: `box-shadow: 0 0 16px` with 70% opacity
- This is the primary interaction point -- cursor: pointer
- Badge text: none needed (the pulse makes it obvious)

**State: available**
- Visible but at 70% opacity on the entire node
- Dot keeps its type color but with reduced glow (30% opacity shadow)
- Tappable -- cursor: pointer
- Title visible, description visible
- Badge: show type badge as normal

**State: locked**
- Dot: grey `#374151`, border `#4b5563`, no glow
- Show a lock icon inside the dot (CSS pseudo-element: a small padlock shape, or just use the text character from a `::after` pseudo-element with content "")
- Opacity: 50% on the entire node
- Title visible but in grey `#4b5563`
- Description: hidden
- Cursor: default (or show "not-allowed")
- On tap/click: show prerequisites text if available (use title attribute for now)

**State: hidden**
- Dot: `#1f2937` background, `#374151` border, no glow
- Content area: fully blurred (increase `filter: blur(6px)` from current `blur(3px)`)
- Title: replaced with "------" placeholder (do NOT show real title)
- Description: hidden
- Badge: hidden
- Cursor: default
- `pointer-events: none` on the entire node
- `user-select: none`

### 3. CSS class structure
Use BEM modifier pattern:
```
.step-node--vs-completed
.step-node--vs-active
.step-node--vs-available
.step-node--vs-locked
.step-node--vs-hidden
```
The `--vs-` prefix avoids collision with existing `--locked` class.

### 4. Smooth transitions
Add `transition: all 0.4s ease` to `.step-node` for smooth state changes when fog-of-war reveals nodes.

### 5. Keep backward compatibility
If `visualState` prop is not passed, StepNode should render exactly as it does now. This allows gradual adoption.

## Files to Modify
- `src/components/StepNode.jsx` -- add visualState prop handling, conditional rendering per state
- `src/components/StepNode.css` -- add 5 new visual state modifier classes with all styling

## Acceptance Criteria
- [ ] StepNode accepts `visualState` prop with 5 possible values
- [ ] Each of the 5 states is visually distinct from the others
- [ ] "completed" state shows checkmark, full color, no strikethrough
- [ ] "active" state has pulsating animation and larger dot (24px)
- [ ] "available" state is 70% opacity, tappable
- [ ] "locked" state is 50% opacity, grey, shows lock icon
- [ ] "hidden" state is fully blurred, shows placeholder text, non-interactive
- [ ] CSS transitions are smooth (0.4s ease) between states
- [ ] Without `visualState` prop, StepNode renders exactly as before (backward compatible)
- [ ] All states have correct cursor behavior (pointer vs default)
- [ ] No visual regressions on existing step types

## Dependencies
- None -- this is a foundation task
- **Blocks**: Task 02, Task 04, Task 05
