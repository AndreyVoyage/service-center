# ✅ Реализация: Интеграция категорий CMS в форму заявки

## Выполненные изменения

### 1. Backend (CMS)

#### `apps/cms/src/globals/ContactForm.ts`
- ✅ Добавлен новый тип поля `'categorySelect'` в `fieldType` options
- ✅ Обновлено условие отображения поля `options` - скрывается для `categorySelect`
- ✅ Добавлен UI компонент `CategorySelectInfo` для отображения подсказки в админке

#### `apps/cms/src/components/CategorySelectInfo.tsx` (новый файл)
- ✅ Компонент с информацией об автоматической подгрузке категорий
- ✅ Ссылка на раздел управления категориями

### 2. Frontend

#### `apps/web/src/lib/api.ts`
- ✅ Обновлен тип `FormField` - добавлен `'categorySelect'`
- ✅ Обновлен `FormSubmission` - заменен `equipmentType` на `category`

#### `apps/web/src/components/RequestForm.tsx`
- ✅ Убран проп `equipmentTypes`
- ✅ Добавлена загрузка категорий через `useEffect` при наличии поля `categorySelect`
- ✅ Добавлен рендер для полей типа `categorySelect` с динамической загрузкой из API
- ✅ Убрана статичная секция "Тип оборудования"
- ✅ Добавлена обработка ошибок загрузки категорий

#### `apps/web/src/components/ContactSection.tsx`
- ✅ Убран проп `equipmentTypes`
- ✅ Убран `defaultEquipmentTypes`

#### `apps/web/src/components/ContactFormWrapper.tsx`
- ✅ Убран проп `equipmentTypes`

#### `apps/web/src/app/page.tsx`
- ✅ Убран массив `equipmentTypes`
- ✅ Убрана передача `equipmentTypes` в `ContactSection`

### 3. Тесты

#### `apps/cms/tests/int/api.categories.spec.ts` (новый файл)
- ✅ Интеграционные тесты для API категорий

#### `apps/web/test-request-form.spec.ts` (новый файл)
- ✅ E2E тесты для формы с категориями

### 4. Документация

#### `INTEGRATION_CATEGORIES.md` (новый файл)
- ✅ Инструкция по использованию новой функциональности
- ✅ Примеры API запросов
- ✅ Описание структуры данных

## Как это работает

### В админке (CMS):

```typescript
// Добавление поля категории
{
  fieldType: 'categorySelect',
  name: 'serviceCategory',
  label: 'Выберите тип услуги',
  required: true
}
```

При выборе типа "Выбор категории (авто)" показывается сообщение:
> "Опции для этого поля будут загружены автоматически из раздела Категории"

### На фронтенде:

```typescript
// Загрузка категорий при наличии поля categorySelect
useEffect(() => {
  if (hasCategorySelect) {
    getCategories().then(res => setCategories(res.docs))
  }
}, [hasCategorySelect])

// Рендер селекта с категориями
<select name="category">
  {categories.map(cat => (
    <option value={cat.slug}>{cat.title}</option>
  ))}
</select>
```

### Отправка формы:

```json
{
  "name": "Иван Иванов",
  "phone": "+7 999 123-45-67",
  "category": "refrigerator-repair"
}
```

## Обратная совместимость

- ✅ Старые поля с `fieldType: 'select'` продолжают работать с ручными опциями
- ✅ Новые поля с `fieldType: 'categorySelect'` автоматически подгружают категории
- ✅ Можно использовать оба типа полей одновременно

## Что удалено

- ❌ Статичный массив `equipmentTypes` (холодильники, морозилки и т.д.)
- ❌ Поле `equipmentType` из формы и API
- ❌ Ручное управление опциями через код

## Следующие шаги

1. **Перезапустить CMS** для применения изменений схемы:
   ```bash
   pnpm dev:cms
   ```

2. **Сгенерировать типы** (опционально):
   ```bash
   pnpm payload generate:types
   ```

3. **Настроить поле в админке**:
   - Открыть `/admin/globals/contactForm`
   - Добавить поле с типом "Выбор категории (авто)"
   - Сохранить

4. **Проверить на сайте**:
   - Открыть главную страницу
   - Убедиться что категории загружаются в форму

## Проверка работоспособности

```bash
# 1. API категорий доступно
curl http://localhost:3001/api/categories

# 2. Форма возвращает поля
curl http://localhost:3001/api/globals/contactForm?depth=2

# 3. На сайте нет equipmentType
# Откройте DevTools → Elements, поиск по "equipmentType" должен быть пустым
```

## Возможные проблемы

| Проблема | Решение |
|----------|---------|
| Поле categorySelect не появляется в админке | Перезапустить CMS |
| Категории не загружаются на фронте | Проверить API `/api/categories` |
| Ошибка типов | Запустить `pnpm payload generate:types` |

---

**Готово к тестированию!** 🎉
