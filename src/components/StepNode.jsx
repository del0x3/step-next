import './StepNode.css';

const TYPE_LABELS = {
  current: 'Зараз',
  free: 'Безкоштовно',
  milestone: null, // will use milestone field
  locked: 'Заблоковано',
};

const VALID_VISUAL_STATES = ['completed', 'active', 'available', 'locked', 'hidden'];

/**
 * Builds the CSS class list for the root .step-node element.
 * When visualState is provided, a BEM modifier --vs-{state} is added.
 * Legacy --locked modifier is preserved for backward compatibility.
 * Animation modifiers --completing and --revealing are added via flags.
 */
function buildRootClassName(step, visualState, { completing, revealing } = {}) {
  const classes = ['step-node'];

  // Legacy modifier (backward compat when visualState is absent)
  if (!visualState && step.type === 'locked') {
    classes.push('step-node--locked');
  }

  // New visual-state modifier
  if (visualState && VALID_VISUAL_STATES.includes(visualState)) {
    classes.push(`step-node--vs-${visualState}`);
  }

  // Celebration animation modifiers
  if (completing) {
    classes.push('step-node--completing');
  }
  if (revealing) {
    classes.push('step-node--revealing');
  }

  return classes.join(' ');
}

/**
 * Builds the CSS class list for the .step-node__dot element.
 */
function buildDotClassName(step, visualState) {
  const classes = ['step-node__dot', `step-node__dot--${step.type}`];

  // Legacy completed style (only when no visualState)
  if (!visualState && step.completed) {
    classes.push('step-node__dot--completed');
  }

  return classes.join(' ');
}

/**
 * Returns the title text to display.
 * Hidden state replaces the real title with a placeholder.
 */
function getDisplayTitle(step, visualState) {
  if (visualState === 'hidden') {
    return '------';
  }
  return step.title;
}

/**
 * Determines whether the description should be shown.
 */
function shouldShowDescription(step, visualState) {
  if (!step.description) return false;
  if (visualState === 'locked' || visualState === 'hidden') return false;
  return true;
}

/**
 * Determines whether the badge should be shown.
 */
function shouldShowBadge(visualState) {
  if (visualState === 'hidden') return false;
  return true;
}

/**
 * Determines whether the delete button should be shown.
 */
function shouldShowDelete(step, visualState) {
  if (visualState === 'locked' || visualState === 'hidden') return false;
  if (!visualState && step.type === 'locked') return false;
  return true;
}

/**
 * Determines whether clicking the dot should trigger toggle-complete.
 */
function isDotClickable(step, visualState) {
  if (visualState === 'locked' || visualState === 'hidden') return false;
  if (!visualState && step.type === 'locked') return false;
  return true;
}

/**
 * Returns the title attribute for the dot (tooltip).
 */
function getDotTitle(step, visualState) {
  if (visualState === 'locked') {
    return step.prerequisites || 'Заблоковано — дійди до цього кроку';
  }
  if (visualState === 'hidden') {
    return '';
  }
  if (!visualState && step.type === 'locked') {
    return 'Заблоковано — дійди до цього кроку';
  }
  return 'Натисни щоб відмітити';
}

/**
 * Builds the title CSS class.
 */
function buildTitleClassName(step, visualState) {
  const classes = ['step-node__title'];

  // Legacy completed style (only when no visualState)
  if (!visualState && step.completed) {
    classes.push('step-node__title--completed');
  }

  return classes.join(' ');
}

/**
 * Renders the inner content of the dot based on visual state.
 * - completed: SVG checkmark
 * - locked (vs): lock icon via CSS pseudo-element (handled in CSS)
 * - default / no visualState with completed: white circle (handled in CSS via ::after)
 */
function renderDotContent(visualState) {
  if (visualState === 'completed') {
    return (
      <svg
        className="step-node__checkmark"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 12 10 18 20 6" />
      </svg>
    );
  }
  return null;
}

export default function StepNode({ step, onToggleComplete, onDelete, visualState }) {
  const isClickable = isDotClickable(step, visualState);

  function handleDotClick() {
    if (isClickable) {
      onToggleComplete(step.id);
    }
  }

  const badge = step.type === 'milestone' ? step.milestone : TYPE_LABELS[step.type];

  return (
    <div className={buildRootClassName(step, visualState)}>
      <div className="step-node__dot-wrapper">
        <div
          className={buildDotClassName(step, visualState)}
          onClick={handleDotClick}
          title={getDotTitle(step, visualState)}
        >
          {renderDotContent(visualState)}
        </div>
      </div>
      <div className="step-node__content">
        <p className={buildTitleClassName(step, visualState)}>
          {getDisplayTitle(step, visualState)}
        </p>
        {shouldShowDescription(step, visualState) && (
          <p className="step-node__description">{step.description}</p>
        )}
        {shouldShowBadge(visualState) && badge && (
          <span className={`step-node__badge step-node__badge--${step.type}`}>
            {badge}
          </span>
        )}
      </div>
      {shouldShowDelete(step, visualState) && (
        <button className="step-node__delete" onClick={() => onDelete(step.id)} title="Видалити">
          &times;
        </button>
      )}
    </div>
  );
}
