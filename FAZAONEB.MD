# ТЕХНИЧЕСКОЕ ЗАДАНИЕ: ФАЗА 1 — ИТЕРАТИВНАЯ РАЗРАБОТКА
## Service Center CMS — Core Infrastructure v2.0

### МЕТОДОЛОГИЯ: "Checkpoint-based Deployment"
Каждая итерация = независимый рабочий прототип. Если итерация падает — откатываемся к предыдущей, не теряя всё.

### ПРАВИЛА ДЛЯ АГЕНТА:
1. **Никакого "сложить всё в кучу"** — только последовательные итерации
2. **После каждой итерации обязательная проверка** (если падает — фиксишь здесь, идешь дальше)
3. **Fallback стратегия** для каждой точки отказа
4. **No cascade** — если итерация N не работает, итерация N+1 не начинается

---

## ИТЕРАЦИЯ 0: Инфраструктура (Zero-Code Checkpoint)

**Цель:** Работающая PostgreSQL без приложения.

### Действия:
```bash
mkdir -p service-center/{apps/cms/src/{access,collections,globals,app},packages/config}
cd service-center

Файл: docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: sc_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: payload
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 3s
      timeout: 3s
      retries: 10

volumes:
  postgres_data:

  Проверка (Checkpoint 0):
  docker-compose up -d
sleep 5
docker exec sc_postgres pg_isready -U postgres

Ожидаемый результат: accepting connections
Fallback:
Если порт 5432 занят → меняем на 5433 в docker-compose и далее везде
Если Docker не запущен → выводим ошибку "Требуется Docker Desktop"
ИТЕРАЦИЯ 1: Payload Minimal (Hello World Checkpoint)
Цель: Payload запускается с одной коллекцией Users (без RBAC сложностей).

Файл: apps/cms/package.json
{
  "name": "@sc/cms",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "type-check": "tsc --noEmit",
    "generate:types": "payload generate:types"
  },
  "dependencies": {
    "@payloadcms/db-postgres": "3.55.1",
    "@payloadcms/next": "3.55.1",
    "@payloadcms/richtext-lexical": "3.55.1",
    "next": "15.2.0",
    "payload": "3.55.1",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "sharp": "0.33.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5"
  }
}

Файл: apps/cms/tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./src/payload.config.ts"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}

Файл: apps/cms/.env.local
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/payload
PAYLOAD_SECRET=dev-secret-key-min-32-characters-long
NEXT_PUBLIC_SERVER_URL=http://localhost:3001

Файл: apps/cms/src/collections/Users.ts (Минимальная версия)
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
  ],
}

Файл: apps/cms/src/payload.config.ts (Минимальная версия)
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './collections/Users'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    idType: 'uuid',
  }),
  editor: lexicalEditor(),
  collections: [Users],
  typescript: {
    outputFile: './src/payload-types.ts',
  },
  routes: {
    admin: '/admin',
  },
})

Файл: apps/cms/next.config.mjs
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

export default withPayload(nextConfig)

Файл: apps/cms/src/app/layout.tsx
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

Файл: apps/cms/src/app/(payload)/layout.tsx
import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import '@payloadcms/next/css'

export default RootLayout

Файл: apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx
import { RootPage } from '@payloadcms/next/views'
import config from '@payload-config'

export default RootPage

Проверка (Checkpoint 1):
cd apps/cms
pnpm install
pnpm dev

Ожидаемый результат:
Консоль без красных ошибок
localhost:3001/admin открывается
Можно создать первого пользователя через UI
Fallback:
Если payload generate:types падает → пропускаем (не критично для dev)
Если порт 3001 занят → меняем на 3002 в .env.local и package.json
Если ошибка "Cannot find module" → проверяем pnpm install, делаем rm -rf node_modules && pnpm install
ИТЕРАЦИЯ 2: RBAC (Role-Based Access Control)
Цель: Работает разделение Developer vs Admin.
Файл: apps/cms/src/access/roles.ts
TypeScript
Copy
import { Access } from 'payload'

export const isDeveloper: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'developer')

export const isStaff: Access = ({ req: { user } }) => 
  Boolean(['admin', 'developer'].includes(user?.role))
Модификация: apps/cms/src/collections/Users.ts (ЗАМЕНИТЬ полностью)
TypeScript
Copy
import type { CollectionConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { useAPIKey: true },
  access: {
    read: isDeveloper,
    create: isDeveloper,
    update: isDeveloper,
    delete: isDeveloper,
    admin: ({ req: { user } }) => user?.role === 'developer',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Developer', value: 'developer' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        update: isDeveloper,
      },
    },
  ],
}
Проверка (Checkpoint 2):
Перезапускаем pnpm dev
Заходим под существующим пользователем (созданным в Итерации 1)
Редактируем его роль на developer через БД (или создаем нового сразу с developer)
Создаем пользователя с ролью admin
Тест: Входим под admin → не должно быть видно меню Users (только если developer показывает)
Fallback:
Если access control не работает (видит всё) → проверяем, что isDeveloper возвращает boolean, не undefined
Если не может обновить роль → проверяем access: { update: isDeveloper } на поле role
ИТЕРАЦИЯ 3: Core Collections (Services + Media)
Цель: CRUD услуг работает, загрузка изображений работает.
Файл: apps/cms/src/collections/Media.ts
TypeScript
Copy
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'developer',
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 200, crop: 'center' },
      { name: 'card', width: 600, height: 400 },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
Файл: apps/cms/src/collections/Services.ts (Базовая версия, без customData)
TypeScript
Copy
import type { CollectionConfig } from 'payload'
import { isStaff, isDeveloper } from '../access/roles'

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isDeveloper,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'shortDesc',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
Модификация: apps/cms/src/payload.config.ts
Добавить импорты и в массив collections:
TypeScript

import { Services } from './collections/Services'
import { Media } from './collections/Media'

// Внутри buildConfig:
collections: [Users, Services, Media], // Заменить [Users] на это
Проверка (Checkpoint 3):
pnpm dev запускается без ошибок
Developer может создать Media (загрузить картинку)
Developer может создать Service с картинкой
Admin может редактировать Service, но не видит коллекцию Users
Fallback:
Если ошибка "relation does not exist" → останавливаем Payload, удаляем папку .next, перезапускаем (пересоздание таблиц)
Если не загружается картинка → проверяем права на папку media/
ИТЕРАЦИЯ 4: Field Builder (JSON Fields)
Цель: Динамические поля через JSONB.
Файл: apps/cms/src/collections/ServiceFieldDefinitions.ts
TypeScript
Copy
import type { CollectionConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const ServiceFieldDefinitions: CollectionConfig = {
  slug: 'service-field-definitions',
  access: {
    read: isDeveloper,
    create: isDeveloper,
    update: isDeveloper,
    delete: isDeveloper,
  },
  admin: {
    useAsTitle: 'fieldName',
    group: 'System',
  },
  fields: [
    {
      name: 'fieldName',
      type: 'text',
      required: true,
      unique: true,
      validate: (val: string) => 
        /^[a-z0-9_]+$/.test(val) || 'Only lowercase, numbers, underscore',
    },
    {
      name: 'fieldType',
      type: 'select',
      required: true,
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Number', value: 'number' },
        { label: 'Select', value: 'select' },
        { label: 'Checkbox', value: 'checkbox' },
      ],
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'options',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
      admin: {
        condition: (data) => data.fieldType === 'select',
      },
    },
  ],
}
Модификация: apps/cms/src/collections/Services.ts
Добавить поле в fields массив:
TypeScript

{
  name: 'customData',
  type: 'json',
  label: 'Additional Fields (JSON)',
  admin: {
    description: 'Data from Field Builder',
  },
}
Модификация: apps/cms/src/payload.config.ts
Добавить в collections: ServiceFieldDefinitions
Проверка (Checkpoint 4):
Developer создает поле "freon_type" (select: R134a, R410a) в Field Definitions
Developer создает Service и заполняет customData: {"freon_type": "R134a"}
API возвращает это поле при запросе /api/services
ИТЕРАЦИЯ 5: Globals (Theme + Navigation)
Цель: Настройки темы и меню работают.
Файл: apps/cms/src/globals/ThemeSettings.ts
TypeScript
Copy
import type { GlobalConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  access: {
    read: isDeveloper,
    update: isDeveloper,
  },
  admin: {
    group: 'System',
  },
  fields: [
    {
      name: 'layoutType',
      type: 'select',
      defaultValue: 'topnav',
      options: [
        { label: 'Top Navigation', value: 'topnav' },
        { label: 'Sidebar', value: 'sidebar' },
      ],
    },
    {
      name: 'primaryColor',
      type: 'text',
      defaultValue: '#005baa',
    },
  ],
}
Файл: apps/cms/src/collections/Navigation.ts (Упрощенная, без parent для Фазы 1)
TypeScript
Copy
import type { CollectionConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const Navigation: CollectionConfig = {
  slug: 'navigation',
  access: {
    read: isDeveloper,
    create: isDeveloper,
    update: isDeveloper,
    delete: isDeveloper,
  },
  admin: {
    useAsTitle: 'title',
    group: 'System',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'select',
      required: true,
      defaultValue: 'header',
      options: [
        { label: 'Header', value: 'header' },
        { label: 'Footer', value: 'footer' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
Модификация: apps/cms/src/payload.config.ts
TypeScript

import { ThemeSettings } from './globals/ThemeSettings'
// ...
globals: [ThemeSettings],
collections: [Users, Services, Media, ServiceFieldDefinitions, Navigation],
Финальная проверка (Checkpoint 5):
bash

pnpm type-check
pnpm generate:types
Ожидаемый результат:
0 TypeScript ошибок
payload-types.ts сгенерирован со всеми типами
ФИНАЛЬНЫЙ ЧЕКЛИСТ ФАЗЫ 1 (Упрощенный)
[ ] Iter 0: docker ps показывает postgres
[ ] Iter 1: localhost:3001/admin открывается (без ошибок консоли)
[ ] Iter 2: Созданы 2 пользователя: dev (видит всё) и admin (видит только Content)
[ ] Iter 3: Создана услуга с картинкой (через админку)
[ ] Iter 4: Создано поле "power" в Field Builder, заполнено в услуге
[ ] Iter 5: Изменен цвет темы на #ff0000 (сохраняется в БД)
Если все галочки: ФАЗА 1 ЗАВЕРШЕНА. Можно приступать к Фазе 2 (Frontend).
Если что-то не работает: Откатись к последней рабочей Итерации и зафиксируй там.

