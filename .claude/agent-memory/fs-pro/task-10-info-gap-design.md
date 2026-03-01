# TASK 10: Information Gap Design for Locked/Hidden Nodes
## Sprint: 3 | Priority: P2-medium | Size: M (1-2 days) | activeForm: StepNode

## Description
Implement three-tier information density that decreases with distance from the current step. Near-locked nodes show a category tag + vague hint; far-locked show silhouette with title only; hidden show blank shapes. This creates optimal curiosity (Loewenstein's inverted U-curve).

## Context / Why
Currently, hidden nodes show nothing. Knowing nothing produces zero curiosity. Knowing everything closes the gap. The optimal point: reveal JUST ENOUGH -- a category tag, a vague hint -- to create an information gap that pulls the user forward.

## What to Do

### 1. Add hint/category fields to step data model
Extend step objects with optional fields:
- `category`: string (e.g., "Покупка", "Звичка", "Соцiальне") -- shown on locked nodes
- `hint`: string (e.g., "Щось для покращення сну...") -- shown on near-locked nodes

### 2. Three-tier info density in StepNode
Based on visualState from fog engine:
- **"locked" (near)**: show category tag + hint text in muted grey, title hidden behind partial blur
- **"hidden" (far)**: show only a grey silhouette shape (circle dot + horizontal line placeholder), zero text
- Between locked and hidden, vary the blur intensity: locked=blur(2px), hidden=blur(8px)

### 3. AddStepForm update
Add optional "Пiдказка" (Hint) field and "Категорiя" (Category) dropdown to AddStepForm for steps being added as future goals.

### 4. Styling
- Category tags: small colored pills (like badges) visible through fog
- Hints: italic, muted text, partially visible
- Silhouettes: consistent grey shapes to maintain visual rhythm without revealing content

## Files to Modify
- `src/components/StepNode.jsx` -- render hint/category based on visual state
- `src/components/StepNode.css` -- three-tier blur and visibility styles
- `src/components/AddStepForm.jsx` -- add hint and category inputs
- `src/utils/fogEngine.js` -- potentially add sub-states for near-locked vs far-locked

## Acceptance Criteria
- [ ] Near-locked nodes show category tag and hint
- [ ] Far-locked nodes show silhouette only
- [ ] Hidden nodes show blank shapes with zero readable content
- [ ] Info density clearly decreases with distance from active step
- [ ] Category and hint fields available in step creation form
- [ ] Existing steps without hint/category fields render correctly (backward compatible)

## Dependencies
- **Requires**: Task 01 (visual states), Task 05 (fog engine)
