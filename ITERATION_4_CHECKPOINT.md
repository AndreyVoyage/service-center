# ИТЕРАЦИЯ 4: Field Builder — Checkpoint

## ✅ Verification (Checkpoint 4)

### Шаг 1: Перезапустить `pnpm dev`

```bash
cd apps/cms
pkill -f "next dev" || true
pnpm dev
```

**Ожидаемый результат:** Сервер перезапущен без ошибок

### Шаг 2: Developer создает поле в Field Definitions

1. Войти как `dev@service.center`
2. Перейти в коллекцию **Service Field Definitions**
3. Нажать "Create New"
4. Заполнить:
   - Field Name: `freon_type`
   - Field Type: **Select**
   - Label: `Тип фреона`
   - Options:
     - value: `r134a`, label: `R134a`
     - value: `r410a`, label: `R410a`
5. Сохранить

**Ожидаемый результат:**
- Поле создано
- Видно в списке Field Definitions

### Шаг 3: Заполнить customData в Service

1. Перейти в коллекцию **Services**
2. Открыть созданную услугу
3. В поле **Additional Fields (JSON)** ввести:
```json
{
  "freon_type": "R134a"
}
```
4. Сохранить

**Ожидаемый результат:**
- Данные сохранены
- Поле customData содержит JSON

### Шаг 4: API тест

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
    "customData": {
      "freon_type": "R134a"
    }
  }]
}
```

## 📋 Чек-лист

- [ ] Перезапущен `pnpm dev`
- [ ] Создано поле `freon_type` в Field Definitions
- [ ] Заполнено `customData` в Service
- [ ] API возвращает customData

## 🆘 Fallback Strategy

**Проблема:** JSON поле не сохраняется
**Решение:** Проверить тип в БД (должно быть JSONB)

**Проблема:** generate:types падает на JSON поле
**Решение:** Пропустить (не критично для dev)

---

**Если все галочки отмечены → переходим к ИТЕРАЦИИ 5 (Globals)**
