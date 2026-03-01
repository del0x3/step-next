import { useState, useCallback, useRef } from 'react';
import StepNode from './StepNode';
import AddStepForm from './AddStepForm';
import CelebrationOverlay from './CelebrationOverlay';
import './Sphere.css';

function getProgressText(completed, total) {
  if (total === 0) return '';
  if (completed === total) return 'Всі кроки виконано!';

  const percent = completed / total;

  if (percent < 0.5) {
    if (completed === 0) return `Крок 1 з ${total} — почни зараз!`;
    return `Крок ${completed} з ${total} — вже ${completed} виконано!`;
  }

  const remaining = total - completed;
  return `Крок ${completed} з ${total} — ще лише ${remaining}!`;
}

/**
 * Checks whether celebration animations are enabled.
 * Respects the localStorage flag 'step-next-celebrations'.
 * Default: enabled (true).
 */
function areCelebrationsEnabled() {
  try {
    return localStorage.getItem('step-next-celebrations') !== 'false';
  } catch {
    return true;
  }
}

/**
 * Computes the visual state for each step based on its position and completion.
 * completed steps → "completed"
 * first non-completed → "active"
 * second non-completed → "available"
 * rest non-completed → "locked"
 * type "locked" steps → "hidden"
 */
function getVisualState(step, sortedSteps) {
  if (step.type === 'locked' && !step.completed) return 'hidden';
  if (step.completed) return 'completed';

  const incompleteSteps = sortedSteps.filter(s => !s.completed && s.type !== 'locked');
  const idx = incompleteSteps.findIndex(s => s.id === step.id);

  if (idx === 0) return 'active';
  if (idx === 1) return 'available';
  return 'locked';
}

export default function Sphere({ sphere, onUpdate, onDelete }) {
  // celebration: { type: "step"|"milestone"|"unlock", stepId: string, dotPosition?: {...} } | null
  const [celebration, setCelebration] = useState(null);
  // Track which step IDs are currently in the completing animation
  const [completingStepId, setCompletingStepId] = useState(null);
  const sphereRef = useRef(null);

  const sortedSteps = [...sphere.steps].sort((a, b) => a.order - b.order);

  const totalSteps = sphere.steps.length;
  const completedCount = sphere.steps.filter(s => s.completed).length;
  const allCompleted = totalSteps > 0 && completedCount === totalSteps;
  const progressText = getProgressText(completedCount, totalSteps);

  const level = Math.max(1, completedCount);
  const progressPercent = totalSteps > 0
    ? Math.max(15, Math.round((completedCount / totalSteps) * 100))
    : 15;

  /**
   * Computes the dot position relative to the sphere container
   * by finding the dot DOM element for a given step ID.
   */
  function getDotPosition(stepId) {
    if (!sphereRef.current) return null;

    const sphereRect = sphereRef.current.getBoundingClientRect();
    const dotEl = sphereRef.current.querySelector(
      `[data-step-id="${stepId}"] .step-node__dot`
    );

    if (!dotEl) return null;

    const dotRect = dotEl.getBoundingClientRect();
    return {
      top: dotRect.top - sphereRect.top + dotRect.height / 2,
      left: dotRect.left - sphereRect.left + dotRect.width / 2,
    };
  }

  const handleCelebrationComplete = useCallback(() => {
    setCelebration(null);
    setCompletingStepId(null);
  }, []);

  function handleToggleComplete(stepId) {
    const step = sphere.steps.find(s => s.id === stepId);
    const isCompleting = step && !step.completed;

    const updated = {
      ...sphere,
      steps: sphere.steps.map((s) =>
        s.id === stepId ? { ...s, completed: !s.completed } : s
      ),
    };
    onUpdate(updated);

    // Fire celebration if the step is being completed (not un-completed)
    if (isCompleting && areCelebrationsEnabled()) {
      const dotPosition = getDotPosition(stepId);
      const isMilestone = step.type === 'milestone';

      setCompletingStepId(stepId);
      setCelebration({
        type: isMilestone ? 'milestone' : 'step',
        stepId,
        dotPosition,
      });
    }
  }

  function handleDeleteStep(stepId) {
    const updated = {
      ...sphere,
      steps: sphere.steps.filter((s) => s.id !== stepId),
    };
    onUpdate(updated);
  }

  function handleAddStep({ title, description, type, milestone }) {
    const maxOrder = sphere.steps.reduce((max, s) => Math.max(max, s.order), -1);
    const newStep = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      title,
      description,
      type,
      milestone,
      completed: false,
      order: maxOrder + 1,
    };
    const updated = {
      ...sphere,
      steps: [...sphere.steps, newStep],
    };
    onUpdate(updated);
  }

  return (
    <div className="sphere" ref={sphereRef}>
      <div className="sphere__header">
        <div className="sphere__title-row">
          <h2 className="sphere__name">{sphere.name}</h2>
          <span className="sphere__level">Level {level}</span>
        </div>
        <button className="sphere__delete" onClick={() => onDelete(sphere.id)} title="Видалити сферу">
          ×
        </button>
      </div>

      <div className="sphere__progress-track">
        <div
          className="sphere__progress-bar"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {progressText && (
        <p className={`sphere__progress-text${allCompleted ? ' sphere__progress-text--completed' : ''}`}>
          {progressText}
        </p>
      )}

      <div className="sphere__timeline">
        {sortedSteps.map((step) => (
          <div key={step.id} data-step-id={step.id}>
            <StepNode
              step={step}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteStep}
              completing={completingStepId === step.id}
              visualState={getVisualState(step, sortedSteps)}
            />
          </div>
        ))}
      </div>

      <div className="sphere__actions">
        <AddStepForm onAdd={handleAddStep} />
      </div>

      {celebration && (
        <CelebrationOverlay
          type={celebration.type}
          onComplete={handleCelebrationComplete}
          dotPosition={celebration.dotPosition}
        />
      )}
    </div>
  );
}
