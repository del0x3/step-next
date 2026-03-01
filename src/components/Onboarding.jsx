import { useState, useCallback } from 'react';
import { generateId } from '../utils/storage';
import Sphere from './Sphere';
import './Onboarding.css';

const TOTAL_STEPS = 3;
const ONBOARDING_KEY = 'step-next-onboarding';

/**
 * Renders the step indicator dots at the top of the onboarding.
 */
function StepDots({ currentStep }) {
  return (
    <div className="onboarding__dots">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNum = i + 1;
        let cls = 'onboarding__dot';
        if (stepNum === currentStep) cls += ' onboarding__dot--active';
        else if (stepNum < currentStep) cls += ' onboarding__dot--completed';
        return <div key={i} className={cls} />;
      })}
    </div>
  );
}

/**
 * Step 1: Welcome screen explaining the concept.
 */
function WelcomeStep({ onNext, onSkip }) {
  return (
    <div className="onboarding__content" key="step-1">
      <h1 className="onboarding__title">Step Next</h1>
      <p className="onboarding__subtitle">
        Твоє майбутнє розкривається крок за кроком
      </p>
      <p className="onboarding__description">
        Обери сферу життя яку хочеш покращити.
        Бачиш лише наступний крок — нічого зайвого.
        Виконуй, відкривай нове, рости далі.
      </p>
      <button className="onboarding__btn-primary" onClick={onNext}>
        Почати
      </button>
      <button className="onboarding__skip" onClick={onSkip}>
        Пропустити
      </button>
    </div>
  );
}

/**
 * Step 2: Inline sphere creation wizard.
 * Embeds the same 2-step form used in AddSphereForm but without the toggle button.
 */
function CreateSphereStep({ onSphereCreated, onSkip }) {
  const [wizardStep, setWizardStep] = useState(1);
  const [name, setName] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [firstStep, setFirstStep] = useState('');

  function handleNext(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setWizardStep(2);
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!firstStep.trim()) return;

    const newSphere = {
      id: generateId(),
      name: name.trim(),
      level: 1,
      steps: [
        {
          id: generateId(),
          title: currentState.trim() || 'Поточний стан',
          description: '',
          type: 'current',
          milestone: null,
          completed: true,
          order: 0,
        },
        {
          id: generateId(),
          title: firstStep.trim(),
          description: '',
          type: 'free',
          milestone: null,
          completed: false,
          order: 1,
        },
        {
          id: generateId(),
          title: '???',
          description: '',
          type: 'locked',
          milestone: null,
          completed: false,
          order: 2,
        },
      ],
    };

    onSphereCreated(newSphere);
  }

  return (
    <div className="onboarding__content" key="step-2">
      <h2 className="onboarding__step-title">Створи свою першу сферу</h2>
      <div className="onboarding__wizard-wrap">
        <div className="add-sphere-form">
          <div className="wizard-indicator">
            Крок {wizardStep} з 2
          </div>

          {wizardStep === 1 && (
            <form className="wizard-step" onSubmit={handleNext}>
              <label className="wizard-label">Де ти зараз?</label>
              <input
                type="text"
                placeholder="Назва сфери (напр. Здоров'я, Фінанси...)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <input
                type="text"
                placeholder="Опиши свій поточний стан"
                value={currentState}
                onChange={(e) => setCurrentState(e.target.value)}
              />
              <div className="add-step-form__actions">
                <button type="submit">Далі</button>
              </div>
            </form>
          )}

          {wizardStep === 2 && (
            <form className="wizard-step" onSubmit={handleCreate}>
              <label className="wizard-label">Що ти можеш зробити безкоштовно?</label>
              <input
                type="text"
                placeholder="Один безкоштовний крок який ти можеш зробити"
                value={firstStep}
                onChange={(e) => setFirstStep(e.target.value)}
                autoFocus
              />
              <div className="add-step-form__actions">
                <button type="submit">Створити</button>
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="btn-cancel"
                >
                  Назад
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <button className="onboarding__skip" onClick={onSkip}>
        Пропустити
      </button>
    </div>
  );
}

/**
 * Step 3: Show the newly created sphere and prompt user to complete first step.
 * After the first step is completed, show the "Done!" button.
 */
function CompleteStepStep({ sphere, onSphereUpdate, onDone, onSkip }) {
  const hasCompletedFirstAction = sphere.steps.filter((s) => s.completed).length >= 2;

  const handleUpdate = useCallback(
    (updated) => {
      onSphereUpdate(updated);
    },
    [onSphereUpdate]
  );

  /* no-op for delete in onboarding context */
  const handleDelete = useCallback(() => {}, []);

  return (
    <div className="onboarding__content" key="step-3">
      <h2 className="onboarding__step-title">Виконай перший крок</h2>
      {!hasCompletedFirstAction && (
        <p className="onboarding__hint">
          Натисни на зелену точку щоб виконати крок
        </p>
      )}
      <div className="onboarding__sphere-wrap">
        <Sphere
          sphere={sphere}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
      {hasCompletedFirstAction && (
        <div className="onboarding__done-wrap">
          <p className="onboarding__congrats">
            Бачиш? Нове з'явилось! Це і є Step Next.
          </p>
          <button className="onboarding__btn-primary" onClick={onDone}>
            Готово!
          </button>
        </div>
      )}
      {!hasCompletedFirstAction && (
        <button className="onboarding__skip" onClick={onSkip}>
          Пропустити
        </button>
      )}
    </div>
  );
}

/**
 * Onboarding -- 3-step interactive introduction for new users.
 *
 * Props:
 *   onComplete(userSphere) -- called when onboarding finishes.
 *     userSphere is the sphere created during onboarding (or null if skipped).
 */
export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [userSphere, setUserSphere] = useState(null);

  function markComplete(sphere) {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    onComplete(sphere);
  }

  function handleSkip() {
    markComplete(null);
  }

  function handleSphereCreated(sphere) {
    setUserSphere(sphere);
    setStep(3);
  }

  function handleSphereUpdate(updated) {
    setUserSphere(updated);
  }

  function handleDone() {
    markComplete(userSphere);
  }

  return (
    <div className="onboarding">
      <StepDots currentStep={step} />

      {step === 1 && (
        <WelcomeStep
          onNext={() => setStep(2)}
          onSkip={handleSkip}
        />
      )}

      {step === 2 && (
        <CreateSphereStep
          onSphereCreated={handleSphereCreated}
          onSkip={handleSkip}
        />
      )}

      {step === 3 && userSphere && (
        <CompleteStepStep
          sphere={userSphere}
          onSphereUpdate={handleSphereUpdate}
          onDone={handleDone}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
}
