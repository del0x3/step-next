# TASK 03: Endowed Progress Effect for New Spheres
## Sprint: 1 | Priority: P1-high | Size: S (2-4 hours) | activeForm: AddSphereForm

## Description
Replace the current single-field sphere creation with a 2-step guided wizard. New spheres should feel like the user already has momentum (starting at "Level 1", progress bar at ~15%) rather than starting from zero.

## Context / Why
Nunes & Dreze (2006) endowed progress effect: when users perceive they already have progress, completion rates increase significantly. Currently, new spheres start with a blank "current state" + locked "???", which feels like zero momentum. A guided creation flow + Level 1 badge + non-zero progress bar creates immediate engagement.

## What to Do

### 1. Refactor AddSphereForm.jsx to a 2-step wizard
Replace the current single text input with a 2-step flow:

**Step 1: "Де ти зараз?" (Where are you now?)**
- Sphere name input (existing)
- "Current state" description input: "Опиши свій поточний стан" (Describe your current state)
- This becomes the first step in the sphere (type: "current", auto-completed: true, auto-marked as starting point)

**Step 2: "Що ти можеш зробити безкоштовно?" (What can you do for free?)**
- "Free action" title input: "Один безкоштовний крок який ти можеш зробити"
- This becomes the second step (type: "free", completed: false)

**Wizard UI:**
- Show step indicators: "Крок 1 з 2" / "Крок 2 з 2"
- "Далі" (Next) button on step 1, "Створити" (Create) on step 2
- "Назад" (Back) button on step 2
- "Скасувати" (Cancel) on both steps
- Keep the same styling conventions as existing form (dark inputs, indigo accents)

### 2. Update handleAddSphere in App.jsx
The `handleAddSphere` function currently accepts just a `name` string. Update it to accept an object:
```js
function handleAddSphere({ name, currentState, firstStep }) {
  const newSphere = {
    id: generateId(),
    name,
    level: 1,
    steps: [
      {
        id: generateId(),
        title: currentState || 'Поточний стан',
        description: '',
        type: 'current',
        milestone: null,
        completed: true,   // <-- auto-completed as starting point
        order: 0,
      },
      {
        id: generateId(),
        title: firstStep,
        description: '',
        type: 'free',
        milestone: null,
        completed: false,
        order: 1,
      },
      {
        id: generateId(),
        title: '???',
        description: '',
        type: 'locked',
        milestone: null,
        completed: false,
        order: 2,
      },
    ],
  };
  // ... rest of logic
}
```

### 3. Add "Level 1" badge to Sphere header in Sphere.jsx
- Next to sphere name, show a badge: `<span className="sphere__level">Level 1</span>`
- Level is calculated from completed step count: `Math.max(1, completedSteps.length)`
- Badge styling: small pill with indigo background `rgba(99, 102, 241, 0.2)`, text color `#818cf8`, font-size 11px

### 4. Add progress bar to Sphere header in Sphere.jsx and Sphere.css
- Thin bar (4px height) below the sphere name
- Width = percentage of completed steps out of total steps
- Minimum width: 15% (endowed progress -- even with 0 real progress, show some)
- Gradient: left-to-right from indigo (#6366f1) to emerald (#10b981)
- Background track: `#2a2a4a`
- CSS transition on width: `transition: width 0.6s ease`
- Container: full width of sphere header area

### 5. Update storage.js DEMO_DATA
- Add `level: 1` field to the demo sphere
- Mark the first step ("Просто лягаю спати") as `completed: true` to show endowed progress in demo

## Files to Modify
- `src/components/AddSphereForm.jsx` -- rewrite to 2-step wizard
- `src/App.jsx` -- update handleAddSphere signature to accept object
- `src/components/Sphere.jsx` -- add Level badge + progress bar to header
- `src/components/Sphere.css` -- add styles for level badge and progress bar
- `src/utils/storage.js` -- update DEMO_DATA with level field and completed first step

## Acceptance Criteria
- [ ] AddSphereForm shows 2-step wizard with step indicators
- [ ] Step 1 collects sphere name + current state description
- [ ] Step 2 collects first free action
- [ ] New sphere is created with 3 steps: current (completed), free action, locked "???"
- [ ] Sphere header shows "Level N" badge calculated from completed step count (minimum 1)
- [ ] Thin progress bar appears below sphere name
- [ ] Progress bar starts at minimum 15% even for new spheres
- [ ] Progress bar animates smoothly when steps are completed
- [ ] Back/Cancel navigation works in wizard
- [ ] Demo data reflects the new structure (first step completed, level field present)
- [ ] Existing spheres without `level` field still render correctly (backward compatible)

## Dependencies
- None -- can be developed independently
- Does NOT depend on Task 01 (visual states)
