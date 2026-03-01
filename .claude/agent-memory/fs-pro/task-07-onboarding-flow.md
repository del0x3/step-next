# TASK 07: Onboarding Flow
## Sprint: 2 | Priority: P2-medium | Size: M (1-2 days) | activeForm: Onboarding

## Description
Create a 3-step interactive onboarding flow for first-time users that demonstrates the fog-of-war mechanic within 60 seconds. Replace the current "drop into demo data" experience with a guided introduction.

## Context / Why
Currently, users land on demo data with no explanation of the product's unique value. The "aha moment" must demonstrate the fog-of-war mechanic immediately. ADHD community (primary audience) needs simplicity and quick wins.

## What to Do

### 1. Create Onboarding component
Create `src/components/Onboarding.jsx` and `src/components/Onboarding.css`.

**Step 1: Welcome**
- Title: "Step Next"
- Subtitle: "Твоє майбутнє розкривається крок за кроком" (Your future reveals itself one step at a time)
- Brief explanation (2-3 short sentences max) of the concept
- "Почати" (Start) button
- "Пропустити" (Skip) link at the bottom

**Step 2: Create your first sphere**
- Title: "Створи свою першу сферу"
- Embed the AddSphereForm wizard (from Task 03) inline
- After sphere is created, auto-advance to Step 3

**Step 3: Complete your first step**
- Title: "Виконай перший крок"
- Show the newly created sphere with fog-of-war active
- Highlight the active step with an arrow or pulsing indicator
- When user completes the step, show the unlock animation (fog-of-war reveals next step)
- "Готово!" (Done!) button appears after completion
- This IS the "aha moment"

### 2. Onboarding state management
- Store `onboarding_completed: true` in localStorage key `step-next-onboarding`
- In App.jsx, check this flag on mount
- If not completed: render `<Onboarding>` instead of main app content
- If completed: render normal app

```jsx
const [onboardingDone, setOnboardingDone] = useState(
  () => localStorage.getItem('step-next-onboarding') === 'true'
);
```

### 3. Skip option
- "Skip" link available on every step
- Skipping loads the default demo data and marks onboarding as completed
- No penalty for skipping

### 4. Enrich demo data
If user skips or after onboarding completes, update DEMO_DATA in storage.js to include richer examples:

3 spheres instead of 1:
1. **"Сон"** (Sleep) -- 5 steps, first 2 completed, showing active/available/locked/hidden states
2. **"Фiтнес"** (Fitness) -- 4 steps, first 1 completed
3. **"Фiнанси"** (Finance) -- 6 steps, none completed

This demonstrates all visual states and fog-of-war in the demo.

### 5. Onboarding UI styling
- Full-screen overlay or replace app content (not a modal)
- Dark background matching app theme (#0f0f23)
- Centered content, max-width 480px
- Step indicator dots at top (3 dots, current highlighted in indigo)
- Smooth transitions between steps (opacity fade or slide)
- Buttons: primary indigo, secondary transparent

## Files to Create
- `src/components/Onboarding.jsx`
- `src/components/Onboarding.css`

## Files to Modify
- `src/App.jsx` -- add onboarding state check, conditionally render Onboarding
- `src/utils/storage.js` -- enrich DEMO_DATA with 3 spheres

## Acceptance Criteria
- [ ] First-time users see onboarding instead of demo data
- [ ] 3-step flow: Welcome -> Create sphere -> Complete first step
- [ ] User experiences fog-of-war reveal during onboarding (aha moment)
- [ ] Skip option available on every step
- [ ] `onboarding_completed` flag persists in localStorage
- [ ] After onboarding, user has their created sphere + demo data
- [ ] Demo data includes 3 spheres with varied progress states
- [ ] Onboarding UI matches dark theme, centered, step indicators
- [ ] "Aha" moment happens within 60 seconds of starting
- [ ] Returning users never see onboarding again

## Dependencies
- **Requires**: Task 05 (fog engine) -- onboarding step 3 demonstrates fog-of-war
- **Enhanced by**: Task 03 (sphere creation wizard used in onboarding step 2)
- **Enhanced by**: Task 02 (celebration animations for the reveal moment)
