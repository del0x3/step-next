# TASK 02: Celebration/Unlock Animations
## Sprint: 1 | Priority: P1-high | Size: M (1-2 days) | activeForm: CelebrationOverlay

## Description
Add three tiers of celebration animations that fire when users complete steps, reach milestones, or unlock new steps. Currently, completing a step only toggles opacity and strikethrough -- zero emotional reward. These animations provide the dopamine hit that drives retention.

## Context / Why
Without celebration moments, step completion feels like checking a box. Research shows "fiero" moments (emotional peaks of achievement) encode positive memories and drive habit formation. This is critical for user retention.

## What to Do

### 1. Create CelebrationOverlay component
Create new file `src/components/CelebrationOverlay.jsx` and `src/components/CelebrationOverlay.css`.

This is a lightweight overlay component that renders celebration effects. It should:
- Accept props: `type` ("step" | "milestone" | "unlock"), `onComplete` callback (called when animation ends)
- Render absolutely positioned within the sphere
- Auto-dismiss after animation completes
- Be purely CSS-driven (no external libraries) for performance

### 2. Tier 1: Step Completion Animation
Triggers when: any step is toggled to completed state.

Effect:
- The dot does a color pulse: scale up to 1.3x over 200ms, then back to 1.0x over 300ms
- Brief particle burst around the dot: 6-8 small circles (4px) that expand outward from the dot center and fade out
- CSS keyframes implementation:
```css
@keyframes step-complete-pulse {
  0% { transform: scale(1); }
  40% { transform: scale(1.3); filter: brightness(1.5); }
  100% { transform: scale(1); filter: brightness(1); }
}

@keyframes particle-burst {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--px), var(--py)) scale(0); opacity: 0; }
}
```
- Use CSS custom properties `--px` and `--py` with different values for each particle to spread them in a circle
- Total duration: 600ms

### 3. Tier 2: Milestone Reached Animation
Triggers when: a step with `type === 'milestone'` is completed.

Effect:
- Everything from Tier 1 PLUS:
- A banner appears at the top of the sphere: "MILESTONE REACHED" in gold (#fbbf24) text
- Banner slides down from top with `translateY(-100%)` to `translateY(0)` over 300ms
- Banner has gold gradient background: `linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.1))`
- Banner stays for 1.5 seconds, then fades out over 300ms
- Optional: add a confetti effect using pure CSS (8-12 small colored squares that fall from the banner). If complex, skip confetti and keep the banner only.
- Total duration: ~2 seconds

### 4. Tier 3: New Step Unlocked Animation
Triggers when: a previously hidden/locked step becomes available/active (this will be triggered by fog-of-war engine in Task 05, but build the animation now).

Effect:
- The newly revealed node fades in from `opacity: 0` to `opacity: 1` over 400ms
- Simultaneously, a glow effect expands from the node: `box-shadow` animates from `0 0 0px` to `0 0 20px` of the type color, then settles to normal
- A micro-toast appears below the node: "NEW STEP UNLOCKED" in small text (#818cf8), fades in and out over 1.5 seconds
- CSS class `.step-node--revealing` triggers this animation

### 5. Integration with Sphere.jsx
- In Sphere.jsx, track the last action (step completion, milestone completion) in local state
- When `handleToggleComplete` fires:
  - Check if the step being completed is a milestone -> trigger Tier 2
  - Otherwise -> trigger Tier 1
- Render `<CelebrationOverlay>` conditionally based on celebration state
- Clear celebration state via `onComplete` callback

### 6. Settings toggle (minimal implementation)
- Add a `celebrationsEnabled` flag to localStorage (default: true)
- For now, no UI toggle is needed -- just respect the flag if it exists. UI toggle will come with a settings page later.
- In Sphere.jsx, check `localStorage.getItem('step-next-celebrations') !== 'false'` before triggering animations

## Files to Create
- `src/components/CelebrationOverlay.jsx`
- `src/components/CelebrationOverlay.css`

## Files to Modify
- `src/components/Sphere.jsx` -- add celebration state tracking, render CelebrationOverlay
- `src/components/StepNode.jsx` -- add `.step-node--completing` class trigger on completion
- `src/components/StepNode.css` -- add completion pulse animation, revealing animation

## Acceptance Criteria
- [ ] Tier 1 (step completion): dot pulses + particle burst, duration < 700ms
- [ ] Tier 2 (milestone): banner "MILESTONE REACHED" slides in, stays ~1.5s, fades out
- [ ] Tier 3 (unlock): node fades in with glow + "NEW STEP UNLOCKED" micro-toast
- [ ] All animations are pure CSS (no external libraries)
- [ ] Animations do not cause layout shifts or jank
- [ ] Animations work on mobile viewport (640px max-width)
- [ ] Celebrations can be disabled via localStorage flag `step-next-celebrations`
- [ ] CelebrationOverlay calls onComplete when animation finishes (for cleanup)
- [ ] No animation exceeds 2 seconds total duration

## Dependencies
- Partially depends on Task 01 (visual states) for the "revealing" animation class
- Can be developed in parallel with Task 01 -- the step-complete and milestone animations are independent
