# 🔧 Исправление отображения отзывов и БЭМ-классов

## Проблемы
1. На сайте пустая секция отзывов, хотя в CMS есть отзыв
2. Нет БЭМ-класса у section для отзывов

## Исправления

### 1. Убран блокирующий .catch() для отзывов

**Файл:** `apps/web/src/app/page.tsx`

```typescript
// Было:
getMemoized('reviews', () => getReviews().catch(() => ({ docs: [] })))

// Стало:
getMemoized('reviews', () => getReviews())
```

### 2. Добавлено логирование

```typescript
console.log('[HomePage] Reviews loaded:', reviews.length, reviewsData.docs.length > 0 ? '(API)' : '(Fallback/Empty)');
console.log('[ReviewSlider] Rendering with', reviews.length, 'reviews');
```

### 3. Добавлены БЭМ классы

**Компонент:** `ReviewSlider.tsx`
- Добавлен `<section className={styles['reviews-section']}>`
- Добавлены элементы: `__container`, `__title`, `__slider`, `__empty`

**CSS:** `ReviewSlider.module.css`
- Добавлены стили для БЭМ классов

## Структура HTML после исправления

```html
<section class="reviews-section">
  <div class="reviews-section__container">
    <h2 class="reviews-section__title">Отзывы клиентов</h2>
    
    <div class="reviews-section__slider">
      <!-- Slider content -->
    </div>
  </div>
</section>
```

## Проверка после запуска

```bash
# Запустить
pnpm dev

# В консоли должно быть:
[HomePage] Reviews loaded: 1 (API)  # или (Fallback/Empty)
[ReviewSlider] Rendering with 1 reviews
```

## Отладка API

```bash
# Проверить API напрямую
curl "http://localhost:3001/api/reviews?limit=10&sort=-createdAt&depth=1&where[isPublished][equals]=true"
```

## Если отзыв всё ещё не отображается

1. Проверьте в CMS что отзыв имеет `isPublished: true`
2. Проверьте логи CMS на ошибки БД
3. Выполните запрос к API вручную через `curl` или браузер
