const STORAGE_KEY = 'step-next-data';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const DEMO_DATA = {
  spheres: [
    {
      id: generateId(),
      name: 'Сон',
      level: 1,
      steps: [
        {
          id: generateId(),
          title: 'Просто лягаю спати',
          description: 'Поточний стан — без будь-яких покращень',
          type: 'current',
          milestone: null,
          completed: true,
          order: 0,
        },
        {
          id: generateId(),
          title: 'Налаштувати блокування телефону після 22:00',
          description: 'Безкоштовно — просто налаштувати в телефоні',
          type: 'free',
          milestone: null,
          completed: false,
          order: 1,
        },
        {
          id: generateId(),
          title: 'Купити маску для сну',
          description: 'Потрібна зарплата щоб купити',
          type: 'milestone',
          milestone: 'Зарплата 7к',
          completed: false,
          order: 2,
        },
        {
          id: generateId(),
          title: '???',
          description: '',
          type: 'locked',
          milestone: null,
          completed: false,
          order: 3,
        },
      ],
    },
  ],
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // corrupted data — reset
  }
  saveData(DEMO_DATA);
  return DEMO_DATA;
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export { generateId };
