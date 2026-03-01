import { useState } from 'react';

export default function AddSphereForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Step 1 fields
  const [name, setName] = useState('');
  const [currentState, setCurrentState] = useState('');

  // Step 2 fields
  const [firstStep, setFirstStep] = useState('');

  function resetForm() {
    setName('');
    setCurrentState('');
    setFirstStep('');
    setWizardStep(1);
    setOpen(false);
  }

  function handleNext(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setWizardStep(2);
  }

  function handleBack() {
    setWizardStep(1);
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!firstStep.trim()) return;
    onAdd({
      name: name.trim(),
      currentState: currentState.trim(),
      firstStep: firstStep.trim(),
    });
    resetForm();
  }

  if (!open) {
    return (
      <button className="add-sphere-btn" onClick={() => setOpen(true)}>
        + Нова сфера
      </button>
    );
  }

  return (
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
            <button type="button" onClick={resetForm} className="btn-cancel">
              Скасувати
            </button>
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
            <button type="button" onClick={handleBack} className="btn-cancel">
              Назад
            </button>
            <button type="button" onClick={resetForm} className="btn-cancel">
              Скасувати
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
