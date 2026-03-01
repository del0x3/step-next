# TASK 06: "Peek Ahead" Opt-in Feature
## Sprint: 2 | Priority: P2-medium | Size: M (1-2 days) | activeForm: Sphere

## Description
Add a per-sphere toggle that allows users to temporarily disable fog-of-war and see all steps in a muted preview mode. This respects user autonomy (SDT) while keeping progressive disclosure as the default.

## Context / Why
Self-Determination Theory emphasizes autonomy. Some users will feel controlled by hidden information. The "Peek Ahead" toggle provides an escape valve -- users can see the plan exists without being forced to process it. Default remains fog ON.

## What to Do

### 1. Add eye icon toggle to Sphere header in Sphere.jsx
Place an eye icon button in the sphere header, next to the delete button:
- Closed eye icon when fog is active (default): use CSS/SVG or Unicode character
- Open eye icon when peek mode is on
- Button class: `sphere__peek-toggle`
- Title attribute: "Показати всi кроки" / "Сховати майбутнi кроки"

### 2. Store peek state per sphere
- Add `peekAhead` boolean flag to sphere data model in localStorage
- Default: `false` (fog active)
- Update storage.js: when loading data, default missing `peekAhead` to `false`
- In handleUpdateSphere, preserve the peekAhead flag

### 3. Implement peek mode rendering in Sphere.jsx
When `sphere.peekAhead === true`:
- Skip fog engine computation (or compute but override hidden/locked to "available")
- Show ALL steps, but hidden/locked steps render in a muted state:
  - Opacity: 40%
  - Border: dashed instead of solid
  - Label: "Preview" badge in grey
- Show a "PREVIEW MODE" indicator bar above the timeline:
  - Small bar with text "Perehlyad" (Preview) in muted purple
  - Background: `rgba(99, 102, 241, 0.1)`

### 4. Toggle handler
```jsx
function handleTogglePeek() {
  const updated = {
    ...sphere,
    peekAhead: !sphere.peekAhead,
  };
  onUpdate(updated);
}
```

### 5. Style the peek toggle and preview mode
In Sphere.css:
- `.sphere__peek-toggle`: small icon button, same style family as delete button
- `.sphere__preview-bar`: thin indicator bar, indigo tint
- `.step-node--preview`: muted, dashed border, 40% opacity modifier

## Files to Modify
- `src/components/Sphere.jsx` -- add peek toggle button, conditional fog bypass, preview mode indicator
- `src/components/Sphere.css` -- styles for peek toggle, preview bar, preview state
- `src/utils/storage.js` -- add peekAhead default to DEMO_DATA, handle migration

## Acceptance Criteria
- [ ] Eye icon toggle visible in sphere header
- [ ] Clicking toggle switches between fog mode and peek mode
- [ ] In peek mode, all steps visible but hidden/locked ones are muted (40% opacity, dashed)
- [ ] "Preview" indicator bar appears when peek mode is active
- [ ] Setting persists per-sphere in localStorage
- [ ] Default for new spheres: peek OFF (fog active)
- [ ] Existing spheres without peekAhead field default to false (backward compatible)
- [ ] Toggle icon changes between open/closed eye states

## Dependencies
- **Requires**: Task 05 (fog engine) -- must exist to bypass it
