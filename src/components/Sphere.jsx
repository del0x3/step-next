import StepNode from './StepNode';
import AddStepForm from './AddStepForm';
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

export default function Sphere({ sphere, onUpdate, onDelete }) {
  const sortedSteps = [...sphere.steps].sort((a, b) => a.order - b.order);

  const totalSteps = sphere.steps.length;
  const completedSteps = sphere.steps.filter(s => s.completed).length;
  const allCompleted = totalSteps > 0 && completedSteps === totalSteps;
  const progressText = getProgressText(completedSteps, totalSteps);

  const level = Math.max(1, completedSteps);
  const progressPercent = totalSteps > 0
    ? Math.max(15, Math.round((completedSteps / totalSteps) * 100))
    : 15;

  function handleToggleComplete(stepId) {
    const updated = {
      ...sphere,
      steps: sphere.steps.map((s) =>
        s.id === stepId ? { ...s, completed: !s.completed } : s
      ),
    };
    onUpdate(updated);
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
    <div className="sphere">
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
          <StepNode
            key={step.id}
            step={step}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteStep}
          />
        ))}
      </div>

      <div className="sphere__actions">
        <AddStepForm onAdd={handleAddStep} />
      </div>
    </div>
  );
}
