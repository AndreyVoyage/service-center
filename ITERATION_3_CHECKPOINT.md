# ИТЕРАЦИЯ 3: Core Collections — Checkpoint

## ✅ Verification (Checkpoint 3)

### Шаг 1: Перезапустить `pnpm dev`

```bash
cd apps/cms
pkill -f "next dev" || true
pnpm dev
```

**Ожидаемый результат:** Сервер перезапущен без ошибок

### Шаг 2: Developer создает Media

1. Войти как `dev@service.center`
2. Перейти в коллекцию **Media**
3. Загрузить картинку (JPEG/PNG/WebP)

**Ожидаемый результат:**
- Картинка загружена
- Файл появился в папке `apps/cms/media/`
- Видны размеры: thumbnail, card, full

### Шаг 3: Developer создает Service

1. Перейти в коллекцию **Services**
2. Нажать "Create New"
3. Заполнить:
   - Title: `Ремонт холодильников`
   - Slug: `remont-holodilnikov`
   - ShortDesc: `Профессиональный ремонт`
   - Price: `5000`
   - Image: выбрать загруженную картинку
   - IsActive: ✅
4. Сохранить

**Ожидаемый результат:**
- Услуга создана
- Видна в списке Services

### Шаг 4: Admin тест

1. Войти как `admin@service.center`
2. Проверить доступ

**Ожидаемый результат:**
- ✅ Видит Services (может редактировать)
- ✅ Видит Media (может загружать)
- ❌ НЕ видит Users

### Шаг 5: API тест

```bash
curl http://localhost:3001/api/services
```

**Ожидаемый результат:**
```json
{
  "docs": [{
    "title": "Ремонт холодильников",
    "slug": "remont-holodilnikov",
    "price": 5000,
    "isActive": true
  }]
}
```

## 📋 Чек-лист

- [ ] Перезапущен `pnpm dev`
- [ ] Media загружено (картинка в папке media/)
- [ ] Service создана с картинкой
- [ ] Admin видит Services и Media
- [ ] Admin НЕ видит Users
- [ ] API возвращает данные

## 🆘 Fallback Strategy

**Проблема:** "relation does not exist"
**Решение:** Остановить `pnpm dev`, удалить `.next` папку, запустить снова

**Проблема:** Не загружается картинка
**Решение:** Проверить что папка `apps/cms/media` существует и доступна для записи

---

**Если все галочки отмечены → переходим к ИТЕРАЦИИ 4 (Field Builder)**
