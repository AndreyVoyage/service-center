import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Категория',
    plural: 'Категории',
  },
  // ✅ ДОБАВЬТЕ ДОСТУП ДЛЯ ЧТЕНИЯ БЕЗ АВТОРИЗАЦИИ:
  access: {
    read: () => true, // Публичный доступ для чтения
    create: ({ req }) => !!req.user, // Только авторизованные
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL-идентификатор',
    },
    // ... остальные поля
  ],
}