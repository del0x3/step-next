# TASK 09: Domain Template Library
## Sprint: 3 | Priority: P2-medium | Size: L (3-5 days) | activeForm: TemplateLibrary

## Description
Create a library of 5-10 pre-built sphere templates (Sleep, Morning Routine, Fitness, Financial Foundation, Social Skills, Reading Habit) that users can add with one tap. Templates come with 5-8 pre-populated steps with fog-of-war applied by default.

## Context / Why
Blank spheres require too much creative effort to populate. This is the cold-start problem. Templates reduce cognitive load for new users and showcase the product's potential.

## What to Do

### 1. Template Data Structure
Create `src/data/templates.js` with template definitions:
```js
export const TEMPLATES = [
  {
    id: 'sleep',
    name: 'Сон',
    icon: 'moon', // or emoji
    description: 'Покращення якостi сну крок за кроком',
    steps: [
      { title: 'Фiксую коли лягаю спати', type: 'current', order: 0 },
      { title: 'Блокування телефону пiсля 22:00', type: 'free', order: 1 },
      // ... 4-6 more steps
    ]
  },
  // ... more templates
];
```

### 2. Template Selection UI
- New component `src/components/TemplateLibrary.jsx`
- Grid of template cards (2 columns on mobile)
- Each card: icon, name, step count, "Додати" button
- Accessible from AddSphereForm as "Або обери шаблон" alternative

### 3. Template Application
- Selecting a template creates a new sphere with all pre-populated steps
- First step auto-completed (endowed progress from Task 03)
- Fog-of-war automatically applied (from Task 05)
- User can customize after creation

### 4. Template Content (Ukrainian)
Create at least 5 templates:
1. Sleep (Сон) - 6 steps
2. Morning Routine (Ранковий ритуал) - 5 steps
3. Fitness Beginner (Фiтнес для початкiвцiв) - 7 steps
4. Financial Foundation (Фiнансова база) - 6 steps
5. Reading Habit (Звичка читати) - 5 steps

## Files to Create
- `src/data/templates.js`
- `src/components/TemplateLibrary.jsx`
- `src/components/TemplateLibrary.css`

## Files to Modify
- `src/components/AddSphereForm.jsx` -- add "or choose template" option
- `src/App.jsx` -- handle template-based sphere creation

## Acceptance Criteria
- [ ] At least 5 templates available with realistic step progressions
- [ ] Template cards display in grid layout
- [ ] Selecting template creates sphere with all steps pre-populated
- [ ] First step auto-completed (endowed progress)
- [ ] Fog-of-war works on template spheres
- [ ] Templates accessible from sphere creation flow
- [ ] All template content in Ukrainian

## Dependencies
- **Enhanced by**: Task 03 (endowed progress), Task 05 (fog engine)
