# ИТЕРАЦИЯ 5: Globals — Checkpoint

## ✅ Verification (Checkpoint 5)

### Шаг 1: Перезапуск и Type Check

```bash
cd apps/cms
pkill -f "next dev" || true
pnpm dev &

# В другом терминале
pnpm type-check
```

**Ожидаемый результат:**
- 0 TypeScript ошибок
- Сервер запущен

### Шаг 2: Проверка Globals

1. Войти как `dev@service.center`
2. Проверить что видны:
   - **Theme Settings** (в меню System)

**Ожидаемый результат:**
- Globals → Theme Settings доступен

### Шаг 3: Изменение темы

1. Перейти в **Theme Settings**
2. Изменить:
   - Primary Color: `#ff0000`
   - Layout Type: `sidebar`
3. Сохранить

**Ожидаемый результат:**
- Настройки сохранены
- API возвращает новые значения

### Шаг 4: Создание Navigation

1. Перейти в коллекцию **Navigation**
2. Создать пункты:
   - Title: `Главная`, URL: `/`, Position: `header`, Order: `0`
   - Title: `Услуги`, URL: `/services`, Position: `header`, Order: `1`
   - Title: `Контакты`, URL: `/contacts`, Position: `footer`, Order: `0`

**Ожидаемый результат:**
- Пункты навигации созданы
- Видны в списке Navigation

### Шаг 5: API тесты

```bash
# Theme Settings
curl http://localhost:3001/api/globals/theme-settings

# Navigation
curl http://localhost:3001/api/navigation
```

**Ожидаемый результат:**
```json
// Theme Settings
{
  "global": {
    "layoutType": "sidebar",
    "primaryColor": "#ff0000"
  }
}

// Navigation
{
  "docs": [
    { "title": "Главная", "url": "/", "position": "header" },
    { "title": "Услуги", "url": "/services", "position": "header" }
  ]
}
```

## 📋 Чек-лист

- [ ] 0 TypeScript ошибок
- [ ] Theme Settings доступен
- [ ] Цвет темы изменен на #ff0000
- [ ] Navigation создано с 2+ пунктами
- [ ] API возвращает данные

---

**Если все галочки отмечены → ФАЗА 1 ЗАВЕРШЕНА!**
