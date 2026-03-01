import { TEMPLATES } from '../data/templates';
import './TemplateLibrary.css';

/**
 * Renders a single template card.
 * On click, calls onSelect with the template object.
 */
function TemplateCard({ template, onSelect }) {
  return (
    <button
      className="template-card"
      onClick={() => onSelect(template)}
      type="button"
      aria-label={`Створити сферу з шаблону "${template.name}"`}
    >
      <span className="template-card__icon">{template.icon}</span>
      <p className="template-card__name">{template.name}</p>
      <p className="template-card__desc">{template.description}</p>
      <div className="template-card__meta">
        <span className="template-card__step-count">
          {template.steps.length} {getStepWord(template.steps.length)}
        </span>
        <span className="template-card__add-label">Додати</span>
      </div>
    </button>
  );
}

/**
 * Returns the correct Ukrainian word form for "steps" based on count.
 * 1 -> "крок", 2-4 -> "кроки", 5+ -> "кроків"
 */
function getStepWord(count) {
  if (count === 1) return 'крок';
  if (count >= 2 && count <= 4) return 'кроки';
  return 'кроків';
}

/**
 * TemplateLibrary -- Displays a grid of domain template cards.
 *
 * Props:
 *   onSelectTemplate(template) -- called when the user clicks a template card.
 */
export default function TemplateLibrary({ onSelectTemplate }) {
  return (
    <div className="template-library">
      <div className="template-library__divider">
        <span className="template-library__divider-text">
          Або обери шаблон
        </span>
      </div>

      <div className="template-library__grid">
        {TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
}
