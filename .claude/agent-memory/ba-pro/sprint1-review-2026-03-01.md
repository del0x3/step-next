# Sprint 1 Review -- BA Analysis
## Date: 2026-03-01
## Tasks Reviewed: Task 01, Task 03, Task 04

---

## EXECUTIVE SUMMARY

Three tasks from Sprint 1 were delivered. Individual implementations are solid -- each task's code matches its own spec well. However, there is one **CRITICAL integration bug**: Sphere.jsx does NOT pass the `visualState` prop to StepNode, which means the entire Task 01 (5 visual states) is implemented but **never activated**. The app renders identically to how it looked before Task 01. Additionally, the `level` calculation in Sphere.jsx deviates from the spec, and there are several minor issues with text encoding and edge cases.

Severity classification:
- **CRITICAL** (1 issue): visualState prop not wired -- Task 01 is dead code
- **MEDIUM** (3 issues): level calc deviation, progress text edge case, missing `level` field in sphere data model
- **LOW** (4 issues): text encoding, cursor on available dot hover, missing transition on root node, lock icon rendering

---

## TASK 01: 5 Visual Node States -- DETAILED REVIEW

### Status: CODE COMPLETE but NOT INTEGRATED

### Acceptance Criteria Checklist

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | StepNode accepts `visualState` prop with 5 values | PASS | Line 148: `{ step, onToggleComplete, onDelete, visualState }` |
| 2 | Each of 5 states visually distinct | PASS | CSS has distinct blocks for each state |
| 3 | "completed" -- checkmark, full color, no strikethrough | PASS | SVG checkmark (lines 130-146), `text-decoration: none` (line 222), opacity 1.0 |
| 4 | "active" -- pulsating animation, 24px dot | PASS | `vs-pulse` keyframes (lines 232-239), `width: 24px; height: 24px` (line 243) |
| 5 | "available" -- 70% opacity, tappable | PASS | `opacity: 0.7` (line 279), `cursor: pointer` (line 283) |
| 6 | "locked" -- 50% opacity, grey, lock icon | PASS | `opacity: 0.5` (line 305), grey dot (line 309), lock `::after` (lines 329-338) |
| 7 | "hidden" -- blurred, placeholder, non-interactive | PASS | `blur(6px)` (line 376), title replaced with "------" (JSX line 53), `pointer-events: none` (line 352) |
| 8 | CSS transitions smooth (0.4s ease) | PARTIAL | Root `.step-node` has `transition: opacity 0.4s ease, filter 0.4s ease` but spec says `transition: all 0.4s ease` -- currently only opacity and filter are transitioned, not all properties |
| 9 | Without `visualState`, renders as before | PASS | All functions check `if (!visualState)` before applying legacy behavior |
| 10 | Correct cursor behavior | PASS | pointer/default/not-allowed applied correctly per state |
| 11 | No visual regressions | PASS | Legacy classes preserved with `!visualState` guards |

### Issues Found

#### CRITICAL-01: visualState prop NEVER passed from Sphere.jsx

**File**: `C:\Users\hlibs\sns\src\components\Sphere.jsx`, line 96-101
```jsx
<StepNode
  key={step.id}
  step={step}
  onToggleComplete={handleToggleComplete}
  onDelete={handleDeleteStep}
/>
```
`visualState` is NOT passed. Every StepNode renders with `visualState === undefined`, meaning all Task 01 CSS is dead code. The user sees zero visual difference.

**Root Cause**: Task 01 spec says "Sphere.jsx is not in files to modify" -- it only touches StepNode. But nobody wires the prop from the parent. This is a **spec gap** that should have been caught by PM or by the DEV agent noticing the integration hole.

**Required Fix**: Sphere.jsx must compute `visualState` for each step and pass it. A basic auto-assignment algorithm:
```js
function getVisualState(step, index, steps) {
  if (step.completed) return 'completed';
  // First non-completed step = active
  const firstIncomplete = steps.find(s => !s.completed);
  if (firstIncomplete && firstIncomplete.id === step.id) return 'active';
  // Next non-completed after active = available
  const incompleteSteps = steps.filter(s => !s.completed);
  const activeIndex = incompleteSteps.findIndex(s => s.id === firstIncomplete?.id);
  if (incompleteSteps[activeIndex + 1]?.id === step.id) return 'available';
  // Locked type or further away
  if (step.type === 'locked') return 'hidden';
  return 'locked';
}
```
**Note**: The exact algorithm should be defined by PM/BA as a separate task or as part of Task 02 (fog-of-war). The point is: without ANY wiring, Task 01 is 100% invisible.

#### LOW-01: Root transition is not `all 0.4s ease`

**File**: `C:\Users\hlibs\sns\src\components\StepNode.css`, line 11
```css
transition: opacity 0.4s ease, filter 0.4s ease;
```
Spec says: "Add `transition: all 0.4s ease` to `.step-node`"
Current: only `opacity` and `filter` are transitioned. Properties like `pointer-events` changes won't animate (though they can't), but more importantly, when nodes change from active (24px dot) to completed, the dot size change won't be smooth at the root level. The dot itself has `transition: all 0.4s ease` (line 29) so this is partially mitigated.

**Verdict**: Minor. The dot handles its own transitions. Root only needs opacity + filter. DEV made a reasonable choice, but technically deviates from spec.

#### LOW-02: Lock icon uses emoji, may render differently across platforms

**File**: `C:\Users\hlibs\sns\src\components\StepNode.css`, lines 329-338
```css
.step-node--vs-locked .step-node__dot::after {
  content: '\1F512';
  ...
  font-size: 10px;
}
```
The lock icon uses Unicode emoji (U+1F512). On different OS/browser combos, this may render as a colorful emoji (too large for the 20px dot) or as a text glyph. The spec says "CSS pseudo-element: a small padlock shape, or just use the text character" -- so this technically passes, but the cross-platform rendering risk is real.

**Recommendation**: Consider replacing with a pure CSS lock shape or an SVG (like the checkmark approach used for completed state) in a future polish pass.

#### LOW-03: Available state hover -- dot still scales despite 70% opacity

When `visualState === 'available'`, the base `.step-node__dot:hover { transform: scale(1.2) }` still applies. This is fine functionally but feels a bit aggressive at 70% opacity. No spec violation -- just a UX observation.

---

## TASK 03: Endowed Progress Effect -- DETAILED REVIEW

### Status: COMPLETE with minor deviations

### Acceptance Criteria Checklist

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | AddSphereForm shows 2-step wizard with indicators | PASS | "Крок 1 з 2" / "Крок 2 з 2" indicator present |
| 2 | Step 1 collects sphere name + current state | PASS | Two inputs: name + currentState |
| 3 | Step 2 collects first free action | PASS | Single input for firstStep |
| 4 | New sphere created with 3 steps | PASS | current (completed) + free + locked "???" |
| 5 | Level badge from completed count (min 1) | PARTIAL | See MEDIUM-01 below |
| 6 | Progress bar below sphere name | PASS | `.sphere__progress-track` + `.sphere__progress-bar` |
| 7 | Progress bar starts at min 15% | PASS | `Math.max(15, ...)` in Sphere.jsx line 30 |
| 8 | Progress bar animates smoothly | PASS | `transition: width 0.6s ease` in CSS |
| 9 | Back/Cancel navigation works | PASS | Back returns to step 1, Cancel resets everything |
| 10 | Demo data has level field + completed first step | PASS | `level: 1` + `completed: true` on first step |
| 11 | Backward compatible with spheres without level | PASS | Level is calculated dynamically, not read from `sphere.level` |

### Issues Found

#### MEDIUM-01: Level calculation deviates from spec

**File**: `C:\Users\hlibs\sns\src\components\Sphere.jsx`, line 28
```js
const level = Math.max(1, completedSteps);
```
Spec says: `Math.max(1, completedSteps.length)` -- i.e., it expects `completedSteps` to be an array (from `sphere.steps.filter(s => s.completed)`), then `.length`.

Current code uses `completedSteps` which is already a number (line 24: `sphere.steps.filter(s => s.completed).length`). So `Math.max(1, completedSteps)` is actually **functionally correct** -- it's just that the variable naming could be confusing. `completedSteps` sounds like an array but is a number.

**However**, the semantic meaning is wrong: the spec intends "Level = number of completed steps, minimum 1". The current code does exactly this. But if a sphere has 0 completed steps, `Math.max(1, 0)` = 1. If 3 completed, level = 3. This is correct per spec.

**Real Issue**: The `level` field is stored in `sphere.level` (set to `1` in App.jsx line 32 and storage.js line 12) but **never used or updated**. The level is always calculated dynamically. This means:
1. The `level` field in the data model is dead data -- it's written but never read
2. If the intent was to persist level separately (for future XP systems), the data is stale

**Verdict**: Functional behavior is correct. Data model has unused `level` field. Rename `completedSteps` to `completedCount` for clarity. Remove `level: 1` from sphere creation OR start reading it for persistence.

#### MEDIUM-02: `level` field written to sphere but never read

**File**: `C:\Users\hlibs\sns\src\App.jsx`, line 32
```js
const newSphere = {
  id: generateId(),
  name,
  level: 1,  // <-- written but never read
  steps: [...]
};
```

And `C:\Users\hlibs\sns\src\utils\storage.js`, line 12:
```js
level: 1,  // <-- written but never read
```

Sphere.jsx calculates level dynamically: `Math.max(1, completedSteps)`. The stored `level: 1` is never referenced. This creates data model confusion.

**Fix options**:
- A) Remove `level` from data model (calculate always) -- simpler
- B) Keep `level` in data model AND update it when steps change -- needed for future XP system

**Recommendation**: Keep `level` in data model for forward compatibility (Sprint 2 will likely need persisted level for XP calculations), but add a comment explaining it's not yet read dynamically.

---

## TASK 04: Step Count Progress -- DETAILED REVIEW

### Status: COMPLETE with minor text deviation

### Acceptance Criteria Checklist

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Each sphere shows counter below header | PASS | `progressText` rendered in Sphere.jsx |
| 2 | Counter updates in real-time | PASS | Calculated from `sphere.steps` on every render |
| 3 | < 50% uses achievement framing | PASS | "вже X виконано!" |
| 4 | >= 50% uses proximity framing | PASS | "ще лише X!" |
| 5 | 100% shows completion text in emerald | PASS | `sphere__progress-text--completed` class with `color: #10b981` |
| 6 | 0% encourages to start | PASS | "почни зараз!" |
| 7 | Styled subtly (12px, grey) | PASS | `.sphere__progress-text { font-size: 12px; color: #6b7280; }` |
| 8 | Works with 0, 1, many steps | PARTIAL | See MEDIUM-03 below |
| 9 | Renders with or without Task 03 bar | PASS | Conditionally rendered below progress bar |

### Issues Found

#### MEDIUM-03: Edge case -- progress text with 0 completed shows "Крок 1"

**File**: `C:\Users\hlibs\sns\src\components\Sphere.jsx`, lines 5-18
```js
function getProgressText(completed, total) {
  ...
  if (completed === 0) return `Крок 1 з ${total} — почни зараз!`;
  return `Крок ${completed} з ${total} — вже ${completed} виконано!`;
}
```

When `completed === 0`, the text says "Крок 1 з Y" -- but the user hasn't done step 1 yet. This is intentional per spec (it says "Крок 1 з ${total} -- почни зараз!" for 0 completed). The spec explicitly uses "Крок 1" to encourage starting, as an application of the endowed progress effect.

**However**: With the endowed progress from Task 03, new spheres ALWAYS start with 1 completed step (the "current state" step). So `completed === 0` should be impossible for newly created spheres. It could happen for:
- Manually un-completing all steps
- Edge case with empty spheres (only if AddStepForm allows adding 0-step spheres, which it doesn't)

**Verdict**: Low risk. The text branch exists for completeness. No fix required, but note this path is effectively unreachable for normal user flows.

#### LOW-04: Text uses em-dash entity differently from spec

**Spec**: Uses `--` (double hyphen) in template literals
**Code**: Uses ` — ` (actual em-dash character with spaces)
```js
return `Крок ${completed} з ${total} — вже ${completed} виконано!`;
```

This is actually BETTER than the spec -- proper Ukrainian typography uses em-dash with spaces. The DEV made a good localization decision. No fix needed.

---

## CROSS-TASK INTEGRATION ANALYSIS

### Conflict Check: Parallel edits to shared files

**Sphere.jsx** -- modified by Task 03 (progress bar, level badge) AND Task 04 (progress text)
- **No conflict**: Both tasks add different elements. Task 03 adds level badge + progress bar. Task 04 adds progress text below it. The ordering is correct: name row -> progress bar -> progress text -> timeline.
- Both tasks calculate `completedSteps` and `totalSteps` independently but use the same logic. No duplication issue because both are in the same file and share the same variables.

**Sphere.css** -- modified by Task 03 AND Task 04
- **No conflict**: Task 03 adds `.sphere__level`, `.sphere__progress-track`, `.sphere__progress-bar`. Task 04 adds `.sphere__progress-text`. No overlapping selectors.

**App.jsx** -- modified by Task 03 (handleAddSphere signature change)
- **No conflict**: Only Task 03 touched App.jsx. Clean change from string to object parameter.

**storage.js** -- modified by Task 03 (level field, completed flag)
- **No conflict**: Only Task 03 touched storage.js.

**StepNode.jsx / StepNode.css** -- modified by Task 01 only
- **No conflict**: No other tasks touched these files.

### Integration Gap: Task 01 <-> Tasks 03/04

Task 01 creates the rendering foundation. Tasks 03 and 04 operate on Sphere.jsx level. But Sphere.jsx does NOT use Task 01's capabilities -- it never passes `visualState` to StepNode. This is the CRITICAL-01 issue documented above.

This was a **spec design gap**: Task 01 was scoped to only modify StepNode.jsx/StepNode.css. The wiring from Sphere to StepNode was presumably intended for Task 02 (fog-of-war) or left implicit. But this means Sprint 1 delivers visual-state CSS that cannot be seen by any user.

---

## PRIORITIZED FIX LIST

### CRITICAL (Block Sprint 1 sign-off)

| ID | Issue | File | Fix | Effort |
|----|-------|------|-----|--------|
| CRITICAL-01 | visualState never passed to StepNode | Sphere.jsx | Add basic auto-assignment function + pass visualState prop | 1-2 hours |

### MEDIUM (Fix before Sprint 2)

| ID | Issue | File | Fix | Effort |
|----|-------|------|-----|--------|
| MEDIUM-01 | Variable naming: `completedSteps` is a number, not array | Sphere.jsx | Rename to `completedCount` | 5 min |
| MEDIUM-02 | `level` field in data model never read | App.jsx, storage.js | Add comment or wire up reading | 15 min |
| MEDIUM-03 | "Крок 1 з Y" unreachable for normal flows | Sphere.jsx | No code fix, just document as known dead branch | 0 min |

### LOW (Backlog / Polish)

| ID | Issue | File | Fix | Effort |
|----|-------|------|-----|--------|
| LOW-01 | Root transition not `all 0.4s ease` | StepNode.css | Change to `transition: all 0.4s ease` or document rationale | 2 min |
| LOW-02 | Lock icon emoji cross-platform risk | StepNode.css | Replace with CSS shape or SVG | 30 min |
| LOW-03 | Available state hover scale at 70% opacity | StepNode.css | Add override to reduce scale on hover | 5 min |
| LOW-04 | Em-dash vs double-hyphen (non-issue) | Sphere.jsx | No fix -- DEV choice is superior | 0 min |

---

## RECOMMENDATIONS FOR PM

1. **CRITICAL-01 must be resolved before Sprint 1 is considered done.** Without it, the user cannot see any visual state differentiation -- the entire Task 01 is invisible. Options:
   - (A) Create a hotfix task for CRITICAL-01: "Wire visualState prop in Sphere.jsx" (1-2h effort)
   - (B) Defer to Sprint 2 Task 02 (fog-of-war), which naturally requires this wiring. But this means Sprint 1 demo shows zero visual improvement from Task 01.

   **My recommendation: Option A.** The wiring is small, and it makes Sprint 1 demonstrably improved. Even a basic algorithm (completed/active/available/locked based on step position) is better than nothing.

2. **Clarify `level` data model strategy** before Sprint 2. If XP calculations in Sprint 2/3 need persisted level, keep the field. If level is always derived from completedCount, remove the dead field to avoid confusion.

3. **All three tasks individually pass their specs.** The code quality is good -- clean functions, proper BEM naming, Ukrainian localization, backward compatibility preserved. The only real problem is the integration gap between Task 01 and the rest.

---

## METRICS SNAPSHOT (Post-Sprint 1)

| Metric | Before Sprint 1 | After Sprint 1 | Notes |
|--------|-----------------|-----------------|-------|
| Visual node states | 4 (type-based only) | 5 (but INACTIVE) | Blocked by CRITICAL-01 |
| Sphere creation UX | 1-step, single field | 2-step wizard | Working |
| Progress visibility | None | Progress bar + text counter | Working |
| Endowed progress | No | Yes (Level 1, 15% bar) | Working |
| Dynamic framing | No | Yes (<50% / >=50% switch) | Working |
| Backward compatibility | N/A | Preserved | All legacy paths work |
