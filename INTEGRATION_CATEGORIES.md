# 🔧 Интеграция категорий CMS в форму заявки

## Что сделано

### 1. Backend (CMS)

**Файл:** `apps/cms/src/globals/ContactForm.ts`

- Добавлен новый тип поля `categorySelect` в `fieldType`
- Поле `options` скрывается при выборе `categorySelect` (через `admin.condition`)
- Добавлен UI компонент `CategorySelectInfo` с пояснением

**Файл:** `apps/cms/src/components/CategorySelectInfo.tsx`

- Компонент для админки с информацией об автоматической подгрузке категорий

### 2. Frontend

**Файл:** `apps/web/src/lib/api.ts`

- Обновлен тип `FormField` - добавлен `'categorySelect'`
- Обновлен `FormSubmission` - заменен `equipmentType` на `category`

**Файл:** `apps/web/src/components/RequestForm.tsx`

- Убран проп `equipmentTypes`
- Добавлена загрузка категорий через `useEffect` при наличии поля `categorySelect`
- Добавлен рендер для полей типа `categorySelect` с загрузкой из API
- Убрана статичная секция "Тип оборудования"

**Файлы:**
- `apps/web/src/components/ContactSection.tsx` - убран `equipmentTypes`
- `apps/web/src/components/ContactFormWrapper.tsx` - убран `equipmentTypes`
- `apps/web/src/app/page.tsx` - убран массив `equipmentTypes`

## Как использовать

### В админке (CMS):

1. Откройте **Globals** → **Contact Form**
2. В разделе **Поля формы** нажмите **Add Field**
3. Выберите **Тип поля** = "Выбор категории (авто)"
4. Заполните:
   - **Имя поля** (например: `serviceCategory`)
   - **Подпись** (например: "Выберите тип услуги")
   - **Обязательное поле** (по желанию)
5. Сохраните

При выборе типа "Выбор категории" будет показано информационное сообщение:
> "Опции для этого поля будут загружены автоматически из раздела Категории"

### Управление категориями:

1. Перейдите в **Collections** → **Категории**
2. Добавьте/отредактируйте категории:
   - **Название** (отображается в селекте)
   - **URL-идентификатор** (slug, сохраняется в форме)
3. Категории автоматически появятся в форме на сайте

## Структура данных

### API Response (CMS):

```json
{
  "fields": [
    {
      "fieldType": "categorySelect",
      "name": "serviceCategory",
      "label": "Выберите тип услуги",
      "required": true
    }
  ]
}
```

### Categories API:

```json
{
  "docs": [
    {
      "id": "1",
      "title": "Ремонт холодильников",
      "slug": "refrigerator-repair"
    }
  ]
}
```

### Form Submission:

```json
{
  "name": "Иван Иванов",
  "phone": "+7 999 123-45-67",
  "message": "Не работает холодильник",
  "service": "emergency-repair",
  "category": "refrigerator-repair"
}
```

## Проверка

```bash
# 1. Проверить API категорий
curl http://localhost:3001/api/categories

# 2. Проверить форму
curl http://localhost:3001/api/globals/contactForm?depth=2

# 3. Проверить что категории загружаются на фронте
# Откройте сайт и посмотрите в Network → категории должны загружаться
```

## Обратная совместимость

- Старые поля с `fieldType: 'select'` продолжают работать с ручными опциями
- Новые поля с `fieldType: 'categorySelect'` автоматически подгружают категории
- Можно использовать оба типа полей одновременно

## Fallback

Если API категорий недоступен:
- Селект показывает "Ошибка загрузки" 
- Поле становится disabled
- Форма не ломается
