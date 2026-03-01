# TASK 04: Step Count Progress Indicator with Dynamic Framing
## Sprint: 1 | Priority: P1-high | Size: S (2-4 hours) | activeForm: Sphere

## Description
Add a text-based progress counter to each sphere header showing "Krok X z Y" (Step X of Y) with dynamic motivational framing that switches at the 50% threshold. This gives users clear visibility of their progress.

## Context / Why
Users currently have zero visibility of how far they have come or how far they have to go. Research shows dual feedback systems work best: a continuous bar (built in Task 03) + a discrete counter (this task). Dynamic framing (Bonezzi et al., 2011) shows that framing switches at 50% -- early on, emphasize achievements ("Completed 3 steps!"); later, emphasize proximity to goal ("Only 2 steps left!").

## What to Do

### 1. Add step counter text to Sphere header in Sphere.jsx
Below the sphere name (and Level badge from Task 03, if present), add a counter line:
```jsx
<p className="sphere__progress-text">
  {progressText}
</p>
```

Calculate the values:
```js
const totalSteps = sphere.steps.length;
const completedSteps = sphere.steps.filter(s => s.completed).length;
const progressPercent = totalSteps > 0 ? completedSteps / totalSteps : 0;
```

### 2. Implement dynamic framing logic
Create the text based on progress percentage:

```js
function getProgressText(completed, total) {
  if (total === 0) return '';
  if (completed === total) return 'Всi кроки виконано!';

  const percent = completed / total;

  if (percent < 0.5) {
    // Achievement framing: emphasize what's been done
    if (completed === 0) return `Крок 1 з ${total} -- почни зараз!`;
    return `Крок ${completed} з ${total} -- вже ${completed} виконано!`;
  } else {
    // Proximity framing: emphasize what's left
    const remaining = total - completed;
    return `Крок ${completed} з ${total} -- ще лише ${remaining}!`;
  }
}
```

Important: use Ukrainian text as the app UI is in Ukrainian.

### 3. Style the counter in Sphere.css
```css
.sphere__progress-text {
  font-size: 12px;
  color: #6b7280;
  margin: 4px 0 0 0;
  font-weight: 500;
}
```

### 4. Add completion celebration state
When `completed === total` (all steps done):
- Change progress text color to emerald (#10b981)
- Add a subtle glow or bold weight to indicate completion
- Text: "Всi кроки виконано!" (All steps completed!)

### 5. Integration with progress bar from Task 03
If Task 03's progress bar is already in place, the counter text sits directly below it. If Task 03 is not done yet, the counter text sits below the sphere name. Both should work -- this task is independent.

Layout order in sphere header:
1. Sphere name + Level badge + delete button (top row)
2. Progress bar (from Task 03, if present)
3. Progress text counter (this task)

## Files to Modify
- `src/components/Sphere.jsx` -- add progress calculation logic + counter text rendering
- `src/components/Sphere.css` -- add `.sphere__progress-text` styles + completion state styles

## Acceptance Criteria
- [ ] Each sphere shows "Krok X z Y" text counter below the header
- [ ] Counter updates in real-time when steps are completed or added
- [ ] At < 50% progress, text uses achievement framing ("vzhe X vykonano!")
- [ ] At >= 50% progress, text uses proximity framing ("shche lyshe X!")
- [ ] At 100% completion, text shows "Vsi kroky vykonano!" in emerald color
- [ ] At 0% with 0 completed, text encourages to start
- [ ] Text is styled subtly (12px, grey) and does not dominate the header
- [ ] Works correctly with 0 steps, 1 step, many steps (edge cases)
- [ ] Counter renders correctly regardless of whether Task 03 progress bar is present

## Dependencies
- None -- fully independent
- Complements Task 03 (progress bar) but does not depend on it
