import { useState, useCallback, useRef } from 'react';
import StepNode from './StepNode';
import AddStepForm from './AddStepForm';
import CelebrationOverlay from './CelebrationOverlay';
import { computeVisualStates, countHiddenSteps, findRevealedStepIds } from '../utils/fogEngine';
import './Sphere.css';

/**
 * Builds the progress text including hidden step count when applicable.
 * Examples:
 *   "Крок 1 з 7 — почни зараз!"
 *   "Крок 3 з 7 — ще лише 4! (2 приховано)"
 */
function getProgressText(completed, total, hiddenCount) {
  if (total === 0) return '';
  if (completed === total) return 'Всі кроки виконано!';

  const percent = completed / total;
  let text;

  if (percent < 0.5) {
    if (completed === 0) {
      text = `Крок 1 з ${total} — почни зараз!`;
    } else {
      text = `Крок ${completed} з ${total} — вже ${completed} виконано!`;
    }
  } else {
    const remaining = total - completed;
    text = `Крок ${completed} з ${total} — ще лише ${remaining}!`;
  }

  if (hiddenCount > 0) {
    text += ` (${hiddenCount} приховано)`;
  }

  return text;
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

export default function Sphere({ sphere, onUpdate, onDelete }) {
  // celebration: { type: "step"|"milestone"|"unlock", stepId: string, dotPosition?: {...} } | null
  const [celebration, setCelebration] = useState(null);
  // Track which step IDs are currently in the completing animation
  const [completingStepId, setCompletingStepId] = useState(null);
  // Track which step IDs are currently in the revealing (unlock) animation
  const [revealingStepIds, setRevealingStepIds] = useState([]);
  // Store previous visual states for reveal detection
  const prevVisualStatesRef = useRef(null);
  const sphereRef = useRef(null);

  // Compute fog-of-war visual states (pure view-layer, not persisted)
  const stepsWithVisualState = computeVisualStates(sphere.steps);
  const hiddenCount = countHiddenSteps(stepsWithVisualState);

  const totalSteps = sphere.steps.length;
  const completedCount = sphere.steps.filter((s) => s.completed).length;
  const allCompleted = totalSteps > 0 && completedCount === totalSteps;
  const progressText = getProgressText(completedCount, totalSteps, hiddenCount);

  const level = Math.max(1, completedCount);
  const progressPercent =
    totalSteps > 0
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

  /**
   * Clears the revealing animation state for a set of step IDs.
   * Called after the reveal animation duration (1500ms).
   */
  function clearRevealingSteps(stepIds) {
    setRevealingStepIds((prev) =>
      prev.filter((id) => !stepIds.includes(id))
    );
  }

  function handleToggleComplete(stepId) {
    const step = sphere.steps.find((s) => s.id === stepId);
    const isCompleting = step && !step.completed;

    // Snapshot previous visual states BEFORE the update (for reveal detection)
    const prevStates = stepsWithVisualState;

    const updatedSteps = sphere.steps.map((s) =>
      s.id === stepId ? { ...s, completed: !s.completed } : s
    );
    const updated = { ...sphere, steps: updatedSteps };
    onUpdate(updated);

    // Fire celebration + reveal detection only when completing (not un-completing)
    if (isCompleting && areCelebrationsEnabled()) {
      const dotPosition = getDotPosition(stepId);
      const isMilestone = step.type === 'milestone';

      setCompletingStepId(stepId);
      setCelebration({
        type: isMilestone ? 'milestone' : 'step',
        stepId,
        dotPosition,
      });

      // Compute next visual states to detect reveals
      const nextStates = computeVisualStates(updatedSteps);
      const revealed = findRevealedStepIds(prevStates, nextStates);

      if (revealed.length > 0) {
        // Small delay so the completion animation starts first,
        // then the reveal kicks in
        setTimeout(() => {
          setRevealingStepIds(revealed);

          // Find the first revealed step to position the unlock toast
          const firstRevealedId = revealed[0];
          const revealDotPosition = getDotPosition(firstRevealedId);

          // Show unlock celebration (Tier 3)
          setCelebration({
            type: 'unlock',
            stepId: firstRevealedId,
            dotPosition: revealDotPosition,
          });
        }, 650); // After the step-complete pulse (600ms)

        // Clear revealing state after the reveal animation completes
        setTimeout(() => {
          clearRevealingSteps(revealed);
        }, 650 + 1500); // delay + reveal animation duration
      }
    }

    // Store current states as "previous" for next toggle
    prevVisualStatesRef.current = stepsWithVisualState;
  }

  function handleDeleteStep(stepId) {
    const updated = {
      ...sphere,
      steps: sphere.steps.filter((s) => s.id !== stepId),
    };
    onUpdate(updated);
  }

  function handleAddStep({ title, description, type, milestone }) {
    const maxOrder = sphere.steps.reduce(
      (max, s) => Math.max(max, s.order),
      -1
    );
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
        <button
          className="sphere__delete"
          onClick={() => onDelete(sphere.id)}
          title="Видалити сферу"
        >
          &times;
        </button>
      </div>

      <div className="sphere__progress-track">
        <div
          className="sphere__progress-bar"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {progressText && (
        <p
          className={`sphere__progress-text${allCompleted ? ' sphere__progress-text--completed' : ''}`}
        >
          {progressText}
        </p>
      )}

      <div className="sphere__timeline">
        {stepsWithVisualState.map((step) => (
          <div key={step.id} data-step-id={step.id}>
            <StepNode
              step={step}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteStep}
              completing={completingStepId === step.id}
              revealing={revealingStepIds.includes(step.id)}
              visualState={step.visualState}
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
