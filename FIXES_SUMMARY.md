# ✅ Сводка исправлений

## 1. Отображение услуг на главной

**Проблема:** Показывался fallback "Услуги временно недоступны"

**Исправление:** 
- Убран `.catch(() => ({ docs: [] }))` для `getServices()`
- Теперь при ошибке API используется fallback из `lib/api.ts`
- Обновлены `fallbackServices` с полями `price`, `image`, `gallery`

**Файлы:**
- `apps/web/src/app/page.tsx`
- `apps/web/src/lib/fallback-data.ts`

---

## 2. Отображение отзывов

**Проблема:** Пустая секция отзывов, хотя отзыв есть в CMS

**Исправление:**
- Убран `.catch(() => ({ docs: [] }))` для `getReviews()`
- Добавлено логирование для отладки

**Файлы:**
- `apps/web/src/app/page.tsx`

---

## 3. БЭМ классы для секции отзывов

**Проблема:** Нет специфичного класса у section для отзывов

**Исправление:**
- `ReviewSlider` теперь возвращает `<section className="reviews-section">`
- Добавлены БЭМ элементы: `__container`, `__title`, `__slider`, `__empty`
- Убрана лишняя обёртка section в `page.tsx`

**Файлы:**
- `apps/web/src/components/ReviewSlider.tsx`
- `apps/web/src/components/ReviewSlider.module.css`
- `apps/web/src/app/page.tsx`

---

## Итоговая структура HTML

```html
<!-- Reviews Section -->
<section class="reviews-section">
  <div class="reviews-section__container">
    <h2 class="reviews-section__title">Отзывы клиентов</h2>
    <div class="reviews-section__slider">
      <!-- Slider content -->
    </div>
  </div>
</section>
```

---

## Запуск после исправлений

```bash
pnpm dev
```

### Ожидаемые логи:
```
[HomePage] Services loaded: 3 (API)  # или (Fallback)
[HomePage] Reviews loaded: 1 (API)   # или (Fallback/Empty)
[ReviewSlider] Rendering with 1 reviews
```

---

## Проверка через DevTools

1. Откройте http://localhost:3002
2. Найдите секцию отзывов
3. Проверьте что у `<section>` есть класс `reviews-section`
4. Проверьте что у `<div>` внутри есть классы (`reviews-section__*`)
5. Не должно быть `<div>` без классов внутри секции
