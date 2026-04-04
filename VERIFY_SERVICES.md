# ✅ Проверка отображения услуг

## Быстрая проверка (после запуска)

```bash
# 1. Проверить API услуг
node debug-services.mjs

# 2. Открыть сайт
curl http://localhost:3002 | grep -o "Услуги временно недоступны\|Срочный ремонт"
```

## Ожидаемый результат

### Если API работает:
```
[HomePage] Services loaded: 3
[HomePage] Services data source: API
```
И на сайте отображаются реальные услуги из CMS.

### Если API не работает (fallback):
```
[HomePage] Services loaded: 3
[HomePage] Services data source: Fallback/Empty
```
И на сайте отображаются fallback услуги:
- Срочный ремонт холодильного оборудования
- Диагностика неисправностей
- Заправка фреоном

## Исправлено

1. ✅ Убран `.catch(() => ({ docs: [] }))` в page.tsx
2. ✅ Обновлены fallbackServices с полями image/gallery
3. ✅ Добавлено логирование для отладки

## Запуск

```bash
pnpm dev
```

Смотрите в консоль Web на наличие логов `[HomePage] Services loaded:`.
