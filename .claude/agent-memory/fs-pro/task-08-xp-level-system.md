# TASK 08: Dual XP + Level System
## Sprint: 3 | Priority: P2-medium | Size: L (3-5 days) | activeForm: XPSystem

## Description
Implement a gamification layer with per-sphere XP accumulation, global "Life Level" aggregation, and level-up celebrations. Each step completion awards XP based on step type, and levels provide socially communicable milestones.

## Context / Why
Dual system: continuous XP bar provides micro-feedback on every action; discrete level-ups create celebration events. Levels are "far more socially communicable" ('I'm Level 12' vs 'I have 47,832 XP'). This drives long-term engagement and retention.

## What to Do

### 1. XP Calculation Logic
Create `src/utils/xpEngine.js`:
- Step type XP values: current=5, free=10, milestone=50, locked=0
- Per-sphere XP = sum of completed step XP values
- Per-sphere level = derived from XP thresholds (e.g., Level 1: 0-25, Level 2: 26-75, Level 3: 76-150, etc.)
- Global "Life Level" = average of all sphere levels (rounded up)

### 2. Per-Sphere XP Bar
- Thin XP bar inside each sphere showing progress to next level
- Shows: "42 / 75 XP" text
- On step completion, XP bar animates to new value

### 3. Global Life Level Display
- In App header, show "Life Level X" badge
- Below the app title/subtitle
- Updates when any sphere levels up

### 4. Level-Up Celebration
- When a sphere crosses a level threshold, trigger milestone celebration (reuse Task 02 infrastructure)
- Banner: "LEVEL UP! Level X" in sphere header

### 5. Data Storage
- XP is NOT stored -- computed on each render from completed steps
- Level thresholds are constants in xpEngine.js
- This keeps localStorage clean

## Files to Create
- `src/utils/xpEngine.js`

## Files to Modify
- `src/components/Sphere.jsx` -- per-sphere XP bar and level display
- `src/components/Sphere.css` -- XP bar styling
- `src/App.jsx` -- global Life Level in header
- `src/App.css` -- Life Level badge styling

## Acceptance Criteria
- [ ] Each step type has a defined XP value
- [ ] Per-sphere XP and level computed correctly from completed steps
- [ ] XP bar shows progress to next level within each sphere
- [ ] Global Life Level displays in app header
- [ ] Level-up triggers celebration animation
- [ ] XP is computed, not stored (pure function of data)
- [ ] Level thresholds feel achievable (early levels quick, later levels harder)

## Dependencies
- **Enhanced by**: Task 02 (celebration animations for level-up)
- **Requires**: Task 03 (Level badge concept, extended here)
