import { useState } from 'react';

export default function AddStepForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('free');
  const [milestone, setMilestone] = useState('');
  const [open, setOpen] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: '',
      type,
      milestone: type === 'milestone' ? milestone.trim() : null,
    });

    setTitle('');
    setType('free');
    setMilestone('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button className="add-step-btn" onClick={() => setOpen(true)}>
        + Додати крок
      </button>
    );
  }

  return (
    <form className="add-step-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Що зробити?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <div className="add-step-form__type-row">
        <label>
          <input
            type="radio"
            name="type"
            value="current"
            checked={type === 'current'}
            onChange={() => setType('current')}
          />
          <span className="type-label type-label--current">Зараз</span>
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="free"
            checked={type === 'free'}
            onChange={() => setType('free')}
          />
          <span className="type-label type-label--free">Безкоштовно</span>
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="milestone"
            checked={type === 'milestone'}
            onChange={() => setType('milestone')}
          />
          <span className="type-label type-label--milestone">Milestone</span>
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="locked"
            checked={type === 'locked'}
            onChange={() => setType('locked')}
          />
          <span className="type-label type-label--locked">Заблоковано</span>
        </label>
      </div>
      {type === 'milestone' && (
        <input
          type="text"
          placeholder="Що потрібно? (напр. Зарплата 7к)"
          value={milestone}
          onChange={(e) => setMilestone(e.target.value)}
        />
      )}
      <div className="add-step-form__actions">
        <button type="submit">Додати</button>
        <button type="button" onClick={() => setOpen(false)} className="btn-cancel">
          Скасувати
        </button>
      </div>
    </form>
  );
}
