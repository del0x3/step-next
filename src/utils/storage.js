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
          completed: true,
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
          title: 'Спробувати мелатонін',
          description: 'Купити в аптеці та випробувати тиждень',
          type: 'free',
          milestone: null,
          completed: false,
          order: 3,
        },
        {
          id: generateId(),
          title: '???',
          description: '',
          type: 'locked',
          milestone: null,
          completed: false,
          order: 4,
        },
      ],
    },
    {
      id: generateId(),
      name: 'Фітнес',
      level: 1,
      steps: [
        {
          id: generateId(),
          title: 'Не займаюсь спортом',
          description: 'Сидячий спосіб життя',
          type: 'current',
          milestone: null,
          completed: true,
          order: 0,
        },
        {
          id: generateId(),
          title: '15 хвилин прогулянки щодня',
          description: 'Безкоштовно — просто вийти на вулицю',
          type: 'free',
          milestone: null,
          completed: false,
          order: 1,
        },
        {
          id: generateId(),
          title: 'Зарядка вранці — 10 хвилин',
          description: 'YouTube відео для початківців',
          type: 'free',
          milestone: null,
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
    {
      id: generateId(),
      name: 'Фінанси',
      level: 1,
      steps: [
        {
          id: generateId(),
          title: 'Не веду бюджет',
          description: 'Гроші витрачаю без плану',
          type: 'current',
          milestone: null,
          completed: false,
          order: 0,
        },
        {
          id: generateId(),
          title: 'Записати витрати за тиждень',
          description: 'Просто нотатки в телефоні',
          type: 'free',
          milestone: null,
          completed: false,
          order: 1,
        },
        {
          id: generateId(),
          title: 'Встановити додаток для бюджету',
          description: 'Monobank, Toshl або простий Excel',
          type: 'free',
          milestone: null,
          completed: false,
          order: 2,
        },
        {
          id: generateId(),
          title: 'Створити фонд на екстрені витрати',
          description: 'Відкласти першу 1000 грн',
          type: 'milestone',
          milestone: 'Зарплата',
          completed: false,
          order: 3,
        },
        {
          id: generateId(),
          title: 'Автоматичне відкладання 10%',
          description: 'Налаштувати автопереказ після зарплати',
          type: 'free',
          milestone: null,
          completed: false,
          order: 4,
        },
        {
          id: generateId(),
          title: '???',
          description: '',
          type: 'locked',
          milestone: null,
          completed: false,
          order: 5,
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

/**
 * Returns the demo data object.
 * Used by onboarding flow to load demo data after completion/skip.
 */
export function getDemoData() {
  return DEMO_DATA;
}

export { generateId };
