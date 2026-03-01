import { useState, useEffect } from 'react';
import { loadData, saveData, generateId } from './utils/storage';
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
        <button className="app__reset" onClick={handleReset}>
          Скинути до демо-даних
        </button>
      </div>
    </div>
  );
}

export default App;
