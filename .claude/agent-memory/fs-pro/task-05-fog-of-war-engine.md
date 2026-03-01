# TASK 05: Progressive Disclosure / Fog-of-War Engine
## Sprint: 2 | Priority: P0-critical | Size: L (3-5 days) | activeForm: fogEngine

## Description
Implement the core differentiator of Step Next: a view-layer fog-of-war computation engine that automatically determines which steps are visible, locked, or hidden based on user progress. This does NOT change the data model -- it is purely a rendering transformation.

## Context / Why
This is the product's unique value proposition. No competitor combines "hidden future steps + multi-step life goals + progressive disclosure". Seven research traditions (Bandura proximal goals, Sweller cognitive load, Masicampo open loops, Loewenstein info gap, Gollwitzer implementation intentions, Baumeister decision fatigue, Kivetz goal gradient) converge on this: the SYSTEM holds the future so the USER doesn't have to.

## What to Do

### 1. Create fogEngine utility
Create new file `src/utils/fogEngine.js`:

```js
/**
 * Computes the visual state for each step based on its position
 * relative to the user's progress.
 *
 * Rules:
 * - All completed steps -> "completed"
 * - First incomplete step -> "active"
 * - Second incomplete step -> "available"
 * - Third incomplete step -> "locked" (show title only)
 * - Fourth+ incomplete steps -> "hidden" (silhouette only)
 *
 * @param {Array} steps - sorted array of step objects
 * @returns {Array} steps with added `visualState` property
 */
export function computeVisualStates(steps) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);
  let incompleteCount = 0;

  return sorted.map((step) => {
    if (step.completed) {
      return { ...step, visualState: 'completed' };
    }

    incompleteCount++;

    if (incompleteCount === 1) {
      return { ...step, visualState: 'active' };
    } else if (incompleteCount === 2) {
      return { ...step, visualState: 'available' };
    } else if (incompleteCount === 3) {
      return { ...step, visualState: 'locked' };
    } else {
      return { ...step, visualState: 'hidden' };
    }
  });
}

/**
 * Returns a count of hidden steps for display in progress indicator.
 * @param {Array} stepsWithStates - output of computeVisualStates
 * @returns {number}
 */
export function countHiddenSteps(stepsWithStates) {
  return stepsWithStates.filter(s => s.visualState === 'hidden').length;
}
```

### 2. Integrate fog engine into Sphere.jsx
In Sphere component, wrap the sorted steps through the fog computation before rendering:

```jsx
import { computeVisualStates, countHiddenSteps } from '../utils/fogEngine';

// Inside Sphere component:
const sortedSteps = [...sphere.steps].sort((a, b) => a.order - b.order);
const stepsWithVisualState = computeVisualStates(sortedSteps);
const hiddenCount = countHiddenSteps(stepsWithVisualState);
```

Then pass `visualState` to each StepNode:
```jsx
{stepsWithVisualState.map((step) => (
  <StepNode
    key={step.id}
    step={step}
    visualState={step.visualState}
    onToggleComplete={handleToggleComplete}
    onDelete={handleDeleteStep}
  />
))}
```

### 3. Update StepNode.jsx to consume visualState
StepNode should use the `visualState` prop (from Task 01) to determine rendering. The fog engine provides the state; StepNode renders it.

Key behavior changes:
- "hidden" steps: completely non-interactive, blurred, placeholder text
- "locked" steps: show title only, no description, no delete button, show lock icon
- "available" steps: 70% opacity, still tappable (clicking shows a preview or can start the step)
- "active" step: full brightness, pulsing, primary interaction target
- "completed" steps: checkmark, full color, can be reviewed

### 4. Update progress text to show hidden count
In Sphere.jsx progress text (from Task 04), when hidden steps exist, append count:
```
"Krok 3 z 7 (4 prykhovano)" -> "Крок 3 з 7 (4 приховано)"
```

### 5. Handle step completion cascade
When a step is completed in handleToggleComplete:
- Recompute visual states
- If the newly active step was previously "hidden" or "locked", trigger the Tier 3 unlock animation (from Task 02)
- This creates the "reveal" moment that is the core UX

### 6. Handle edge cases
- Sphere with 0 steps: return empty array
- Sphere with 1 step: that step is "active" if incomplete, "completed" if done
- All steps completed: all show as "completed"
- Uncompleting a step (toggle back): recompute -- downstream steps return to their fog states

## Files to Create
- `src/utils/fogEngine.js` -- pure utility, no side effects, easy to test

## Files to Modify
- `src/components/Sphere.jsx` -- import and apply fog engine before rendering steps
- `src/components/StepNode.jsx` -- consume visualState prop (relies on Task 01)

## Acceptance Criteria
- [ ] `computeVisualStates()` correctly assigns 5 states based on completion progress
- [ ] Fog states are computed on every render, not stored in data model
- [ ] localStorage data model remains unchanged (no visualState persisted)
- [ ] First incomplete step shows as "active" with pulse
- [ ] Second incomplete shows as "available" at 70% opacity
- [ ] Third incomplete shows as "locked" with title only
- [ ] Fourth+ incomplete show as "hidden" silhouettes
- [ ] Completing a step triggers re-computation and reveals next steps
- [ ] Hidden step count displays in progress text
- [ ] Uncompleting a step re-hides downstream steps correctly
- [ ] Edge cases handled: 0 steps, 1 step, all completed

## Dependencies
- **Requires**: Task 01 (5 visual states in StepNode) -- MUST be completed first
- **Enhanced by**: Task 02 (celebration animations for unlock reveals)
- **Enhanced by**: Task 04 (progress text shows hidden count)
- **Blocks**: Task 06 (Peek Ahead)
