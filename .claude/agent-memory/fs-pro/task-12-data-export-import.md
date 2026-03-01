# TASK 12: Data Export/Import
## Sprint: 3 | Priority: P2-medium | Size: S (2-4 hours) | activeForm: App

## Description
Add JSON export and import buttons so users can back up and restore their data. Critical for trust before asking for any payment -- users need to know their progress is safe.

## Context / Why
localStorage = data loss risk (browser clear, device change). Users need a safety net. This is also table stakes for any app that asks for ongoing engagement.

## What to Do

### 1. Export function
In App.jsx (or a new Settings section), add an "Експорт даних" button:
- On click: serialize current localStorage data to JSON
- Trigger browser download of `step-next-backup-YYYY-MM-DD.json`
- Implementation:
```js
function handleExport() {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `step-next-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

### 2. Import function
Add an "Iмпорт даних" button:
- On click: open file picker for .json files
- Parse the file, validate structure (must have `spheres` array)
- Confirm with user: "Це замiнить всi поточнi данi. Продовжити?" (This will replace all current data. Continue?)
- On confirm: save to localStorage and reload state
- On invalid file: show error message

### 3. UI placement
Add both buttons in the app footer area, near the existing "Скинути до демо-даних" button:
- Group as a simple "Данi" (Data) section
- Export button: ghost style (outline)
- Import button: ghost style (outline)
- Keep them subtle -- not primary actions

### 4. Validation
Import must validate:
- File is valid JSON
- Has `spheres` array
- Each sphere has `id`, `name`, `steps` array
- Reject malformed data with user-friendly error

## Files to Modify
- `src/App.jsx` -- add export/import handlers and buttons
- `src/App.css` -- style the data management buttons

## Acceptance Criteria
- [ ] Export button downloads a .json file with all user data
- [ ] File name includes current date
- [ ] Import button opens file picker
- [ ] Import validates JSON structure before applying
- [ ] Confirmation dialog before overwriting data
- [ ] Error message on invalid file
- [ ] After import, app state reflects imported data immediately
- [ ] Both buttons styled consistently with existing UI

## Dependencies
- None -- fully independent, can be done anytime
