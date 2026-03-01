# TASK 11: Monetization Architecture Prep
## Sprint: 3 | Priority: P3-low | Size: M (1-2 days) | activeForm: App

## Description
Add infrastructure-level support for future monetization: user tier flags in data model, premium feature gates, and analytics event hooks. No actual paywall or payment UI -- just the plumbing.

## Context / Why
The market is $11.4B (projected $43.9B by 2034). Before building payment flows, the data model needs tier awareness so premium features can be gated cleanly when the time comes.

## What to Do

### 1. User tier in data model
Extend localStorage data with a top-level `user` object:
```js
{
  user: {
    tier: 'free', // 'free' | 'premium'
    createdAt: '2026-03-01',
  },
  spheres: [...]
}
```

### 2. Feature gate utility
Create `src/utils/featureGates.js`:
```js
export function canUseFeature(featureName, userTier) {
  const PREMIUM_FEATURES = ['unlimited_spheres', 'templates', 'export', 'custom_themes'];
  if (PREMIUM_FEATURES.includes(featureName)) {
    return userTier === 'premium';
  }
  return true; // free features
}
```
For now, all features return true (no actual gating). The utility is just the pattern.

### 3. Analytics event hooks
Create `src/utils/analytics.js` with no-op functions:
```js
export function trackEvent(eventName, properties = {}) {
  // No-op for now. Will connect to analytics provider later.
  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', eventName, properties);
  }
}
```

Key events to define: `sphere_created`, `step_completed`, `milestone_reached`, `level_up`, `onboarding_completed`, `template_used`.

### 4. Migration
Update storage.js loadData to add `user` object if missing (migration for existing users).

## Files to Create
- `src/utils/featureGates.js`
- `src/utils/analytics.js`

## Files to Modify
- `src/utils/storage.js` -- add user object to data model, migration logic

## Acceptance Criteria
- [ ] Data model includes user tier (default: 'free')
- [ ] featureGates utility exists with premium feature list
- [ ] analytics utility exists with trackEvent function (no-op)
- [ ] Existing localStorage data migrates cleanly (adds user object)
- [ ] No actual paywall or restrictions -- purely infrastructure
- [ ] Development mode logs analytics events to console

## Dependencies
- None
