/**
 * Domain Template Library -- Pre-built sphere templates for quick start.
 *
 * Each template defines a realistic step progression in Ukrainian.
 * The first step (order: 0) is always type 'current' and will be auto-completed
 * when the user creates a sphere from the template (endowed progress).
 *
 * Step types: 'current', 'free', 'milestone', 'locked'
 */

export const TEMPLATES = [
  {
    id: 'sleep',
    name: 'Сон',
    icon: '\ud83c\udf19',
    description: 'Покращення якості сну крок за кроком',
    steps: [
      { title: 'Просто лягаю спати без режиму', type: 'current', order: 0 },
      { title: 'Встановити будильник на однаковий час', type: 'free', order: 1 },
      { title: 'Блокування телефону після 22:00', type: 'free', order: 2 },
      { title: 'Купити маску для сну', type: 'milestone', milestone: "Бюджет на здоров'я", order: 3 },
      { title: 'Спробувати мелатонін тиждень', type: 'free', order: 4 },
      { title: 'Стабільний режим 23:00-07:00', type: 'free', order: 5 },
    ],
  },
  {
    id: 'morning-routine',
    name: 'Ранковий ритуал',
    icon: '\u2600\ufe0f',
    description: 'Побудова продуктивного ранку',
    steps: [
      { title: 'Прокидаюсь і одразу в телефон', type: 'current', order: 0 },
      { title: 'Склянка води одразу після підйому', type: 'free', order: 1 },
      { title: '5 хвилин розтяжки', type: 'free', order: 2 },
      { title: 'Сніданок без телефону', type: 'free', order: 3 },
      { title: 'Планування 3 справ на день', type: 'free', order: 4 },
      { title: 'Повний ранковий ритуал 30 хвилин', type: 'free', order: 5 },
    ],
  },
  {
    id: 'fitness',
    name: 'Фітнес для початківців',
    icon: '\ud83c\udfcb\ufe0f',
    description: 'Від дивану до регулярних тренувань',
    steps: [
      { title: 'Не займаюсь спортом', type: 'current', order: 0 },
      { title: '15 хвилин прогулянки щодня', type: 'free', order: 1 },
      { title: 'Зарядка вранці -- 10 хвилин', type: 'free', order: 2 },
      { title: 'Купити спортивний килимок', type: 'milestone', milestone: 'Перша покупка', order: 3 },
      { title: 'YouTube тренування 20 хвилин 3 рази на тиждень', type: 'free', order: 4 },
      { title: 'Пробне заняття в залі', type: 'milestone', milestone: 'Абонемент', order: 5 },
      { title: 'Регулярні тренування 3 рази на тиждень', type: 'free', order: 6 },
    ],
  },
  {
    id: 'finance',
    name: 'Фінансова база',
    icon: '\ud83d\udcb0',
    description: 'Контроль над грошима з нуля',
    steps: [
      { title: 'Не веду бюджет', type: 'current', order: 0 },
      { title: 'Записати витрати за тиждень', type: 'free', order: 1 },
      { title: 'Встановити додаток для бюджету', type: 'free', order: 2 },
      { title: 'Створити фонд на екстрені витрати', type: 'milestone', milestone: 'Перша 1000 грн', order: 3 },
      { title: 'Автоматичне відкладання 10% з доходу', type: 'free', order: 4 },
      { title: 'Місяць без імпульсивних покупок', type: 'free', order: 5 },
    ],
  },
  {
    id: 'reading',
    name: 'Звичка читати',
    icon: '\ud83d\udcda',
    description: 'Від нуля до регулярного читання',
    steps: [
      { title: 'Не читаю книжок', type: 'current', order: 0 },
      { title: 'Читати 5 сторінок перед сном', type: 'free', order: 1 },
      { title: 'Завести список книжок для читання', type: 'free', order: 2 },
      { title: 'Прочитати першу книгу повністю', type: 'milestone', milestone: 'Перша книга', order: 3 },
      { title: 'Читати 20 хвилин щодня', type: 'free', order: 4 },
    ],
  },
  {
    id: 'social',
    name: 'Соціальні навички',
    icon: '\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1',
    description: "Розвиток спілкування та зв'язків",
    steps: [
      { title: 'Рідко спілкуюсь з людьми', type: 'current', order: 0 },
      { title: 'Написати одному старому другу', type: 'free', order: 1 },
      { title: 'Сходити на одну подію або зустріч', type: 'free', order: 2 },
      { title: 'Запросити когось на каву', type: 'free', order: 3 },
      { title: 'Регулярні зустрічі раз на тиждень', type: 'free', order: 4 },
    ],
  },
];
