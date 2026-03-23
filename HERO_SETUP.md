# Hero Block Setup Instructions

## Что было сделано

### 1. Создан Global "Hero" в `apps/cms/src/globals/Hero.ts`

Поля:
- `isActive` (checkbox) - показывать ли блок
- `title` (text) - заголовок, по умолчанию "Ремонт промышленных холодильников"
- `subtitle` (text) - подзаголовок
- `backgroundType` (select) - тип фона: изображение или цвет
- `backgroundImage` (relationship к Media) - фоновое изображение
- `backgroundColor` (select: blue, dark, white) - цвет фона
- `ctaText` (text) - текст кнопки, по умолчанию "Вызвать мастера"
- `ctaLink` (text) - ссылка кнопки, по умолчанию "/#form"
- `showSecondaryLink` (checkbox) - показывать вторичную ссылку
- `secondaryLinkText` (text) - текст вторичной ссылки
- `secondaryLinkHref` (text) - ссылка вторичной ссылки

### 2. Обновлён `apps/cms/src/payload.config.ts`

Добавлен `Hero` в массив `globals`.

### 3. Обновлён `apps/web/src/app/page.tsx`

- Добавлена функция `getHero()` для получения данных из API
- Создан компонент `DynamicHero` для динамического отображения
- Создан компонент `DefaultHero` для резервного отображения при ошибке API
- Добавлены вспомогательные функции для определения фона

### 4. Обновлён `apps/web/src/lib/api.ts`

- Добавлен интерфейс `HeroData`
- Добавлена функция `getHero()` для запроса к API

### 5. Обновлён `apps/web/src/app/page.module.css`

Добавлены классы:
- `.hero-bg-blue` - синий градиент
- `.hero-bg-dark` - тёмный фон
- `.hero-bg-white` - белый фон с тёмным текстом

## Инструкция по запуску

### Шаг 1: Запустить CMS

```bash
cd apps/cms
pnpm install
pnpm dev
```

CMS будет доступен по адресу: http://localhost:3001

### Шаг 2: Сгенерировать типы (опционально)

```bash
cd apps/cms
pnpm payload generate:types
```

### Шаг 3: Запустить Web

```bash
cd apps/web
pnpm install
pnpm dev
```

Web будет доступен по адресу: http://localhost:3000

## Проверка функциональности

### 1. Проверка админки

1. Откройте http://localhost:3001/admin
2. Войдите в систему
3. В боковом меню должен появиться раздел **Globals → Hero**

### 2. Настройка Hero

1. Перейдите в Globals → Hero
2. Установите:
   - **isActive**: ✓ (включено)
   - **title**: "Ремонт промышленных холодильников 24/7"
   - **subtitle**: "Срочный выезд мастера в день обращения"
   - **backgroundType**: "Цвет" или "Изображение"
   - **backgroundColor**: "Синий (градиент)" (если выбран цвет)
   - **ctaText**: "Вызвать мастера"
   - **ctaLink**: "/#form"
   - **showSecondaryLink**: ✓
   - **secondaryLinkText**: "Все услуги →"
   - **secondaryLinkHref**: "/services"
3. Нажмите "Save"

### 3. Проверка на фронтенде

1. Откройте http://localhost:3000
2. Hero блок должен отображаться с настроенными данными
3. Проверьте:
   - Заголовок соответствует настройкам
   - Подзаголовок отображается
   - Кнопка имеет правильный текст
   - Фон соответствует выбранному цвету

### 4. Проверка фонового изображения

1. В админке загрузите изображение в разделе Media
2. В Hero выберите **backgroundType**: "Изображение"
3. Выберите загруженное изображение в **backgroundImage**
4. Сохраните и проверьте на фронтенде

### 5. Проверка отключения Hero

1. В админке установите **isActive**: ✗ (выключено)
2. Сохраните
3. На фронтенде Hero блок должен исчезнуть

## API Endpoints

### Получить Hero данные

```bash
curl http://localhost:3001/api/globals/hero
```

Ответ:
```json
{
  "hero": {
    "isActive": true,
    "title": "Ремонт промышленных холодильников 24/7",
    "subtitle": "Срочный выезд мастера...",
    "backgroundType": "color",
    "backgroundColor": "blue",
    "ctaText": "Вызвать мастера",
    "ctaLink": "/#form",
    "showSecondaryLink": true,
    "secondaryLinkText": "Все услуги →",
    "secondaryLinkHref": "/services"
  }
}
```

## Переменные окружения

Для Web приложения (apps/web/.env.local):

```env
NEXT_PUBLIC_CMS_URL=http://localhost:3001
```

## Структура файлов

```
apps/
├── cms/
│   └── src/
│       ├── globals/
│       │   ├── Hero.ts          # ← Новый файл
│       │   └── Notifications.ts
│       ├── payload.config.ts    # ← Обновлён
│       └── payload-types.ts     # ← Сгенерировать
└── web/
    └── src/
        ├── app/
        │   ├── page.tsx         # ← Обновлён
        │   └── page.module.css  # ← Обновлён
        └── lib/
            └── api.ts           # ← Обновлён
```

## Устранение неполадок

### Ошибка: "Cannot find module '@/lib/api'"

Убедитесь, что tsconfig.json настроен правильно с alias `@/*`.

### Ошибка: "Failed to fetch hero"

Проверьте:
1. CMS запущен на http://localhost:3001
2. API endpoint доступен: http://localhost:3001/api/globals/hero

### Hero не отображается

Проверьте:
1. В админке `isActive` включен
2. В консоли браузера нет ошибок
3. API возвращает данные

### Фоновое изображение не отображается

Проверьте:
1. `NEXT_PUBLIC_CMS_URL` установлен правильно
2. Изображение загружено в Media
3. URL изображения доступен
