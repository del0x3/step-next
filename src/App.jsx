import { useState, useEffect, useRef } from 'react';
import { loadData, saveData, generateId, exportData, validateImportData } from './utils/storage';
import Sphere from './components/Sphere';
import AddSphereForm from './components/AddSphereForm';
import './App.css';

function App() {
  const [data, setData] = useState(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  function handleUpdateSphere(updated) {
    setData((prev) => ({
      ...prev,
      spheres: prev.spheres.map((s) => (s.id === updated.id ? updated : s)),
    }));
  }

  function handleDeleteSphere(id) {
    setData((prev) => ({
      ...prev,
      spheres: prev.spheres.filter((s) => s.id !== id),
    }));
  }

  function handleAddSphere({ name, currentState, firstStep }) {
    const newSphere = {
      id: generateId(),
      name,
      level: 1,
      steps: [
        {
          id: generateId(),
          title: currentState || 'Поточний стан',
          description: '',
          type: 'current',
          milestone: null,
          completed: true,
          order: 0,
        },
        {
          id: generateId(),
          title: firstStep,
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
    setData((prev) => ({
      ...prev,
      spheres: [...prev.spheres, newSphere],
    }));
  }

  const fileInputRef = useRef(null);
  const [importError, setImportError] = useState('');

  function handleExport() {
    exportData();
  }

  function handleImportClick() {
    setImportError('');
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = validateImportData(event.target.result);
      if (!result.valid) {
        setImportError(result.error);
        return;
      }

      const confirmed = window.confirm(
        'Це замінить всі поточні дані. Продовжити?'
      );
      if (!confirmed) return;

      saveData(result.data);
      setData(result.data);
      setImportError('');
    };
    reader.onerror = () => {
      setImportError('Не вдалося прочитати файл.');
    };
    reader.readAsText(file);
  }

  function handleReset() {
    localStorage.removeItem('step-next-data');
    setData(loadData());
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Step Next</h1>
        <p className="app__subtitle">Намалюй лінію — постав точки — дійди до наступного кроку</p>
      </header>

      <div className="app__spheres">
        {data.spheres.map((sphere) => (
          <Sphere
            key={sphere.id}
            sphere={sphere}
            onUpdate={handleUpdateSphere}
            onDelete={handleDeleteSphere}
          />
        ))}
      </div>

      <div className="app__footer">
        <AddSphereForm onAdd={handleAddSphere} />

        <div className="app__data-section">
          <span className="app__data-label">Дані</span>
          <div className="app__data-buttons">
            <button className="app__data-btn" onClick={handleExport}>
              Експорт даних
            </button>
            <button className="app__data-btn" onClick={handleImportClick}>
              Імпорт даних
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="app__file-input"
              onChange={handleFileChange}
            />
          </div>
          {importError && (
            <p className="app__import-error">{importError}</p>
          )}
        </div>

        <button className="app__reset" onClick={handleReset}>
          Скинути до демо-даних
        </button>
      </div>
    </div>
  );
}

export default App;
