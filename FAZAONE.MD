# ТЕХНИЧЕСКОЕ ЗАДАНИЕ: ФАЗА 1 (One-Shot Execution)
## Service Center CMS - Core Infrastructure

ПРАВИЛО: Создавай файлы строго в порядке номеров (1.1 → 1.2 → 2.1...). 
Проверка TypeScript после каждого раздела. 
ГЛАВНОЕ ПРАВИЛО:
АГЕНТ ОБЯЗАН САМОСТОЯТЕЛЬНО ИСПРАВЛЯТЬ ОШИБКИ

ЦИКЛ РАБОТЫ ДЛЯ КАЖДОГО ШАГА:

1. Реализация
2. Запуск теста
3. ЕСЛИ ошибка:
   - проанализировать лог
   - исправить причину
   - повторить тест
4. Повторять до:
   - тест прошёл успешно ИЛИ
   - достигнут лимит 15 попыток

ЕСЛИ 15 попыток не помогли → СТОП.

---

### ШАГ 1: Инфраструктура (Корень)

#### 1.1 Создать папки:
```bash
mkdir -p service-center/{apps/cms/src/{access,collections,globals,app/{(payload)/admin/[[...segments]],(payload)/layout},components},packages/config}
cd service-center

1.2 Файл: package.json
{
  "name": "service-center",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0" 
    },

  "packageManager": "pnpm@9.0.0"
  }

1.3 Файл: turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**"] },
    "dev": { "cache": false, "persistent": true },
    "type-check": { "cache": false }
  }
}

1.4 Файл: docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
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
      interval: 5s
      retries: 5
volumes:
  postgres_data:

  ПРОВЕРКА 1: Запустить docker-compose up -d и убедиться, что PostgreSQL работает (5 секунд).
ШАГ 2: Базовые утилиты доступа (Без зависимостей)
2.1 Файл: apps/cms/src/access/roles.ts
import { Access } from 'payload'

export const isDeveloper: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'developer')

export const isAdmin: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'admin')

export const isStaff: Access = ({ req: { user } }) => 
  Boolean(['admin', 'developer'].includes(user?.role))

ШАГ 3: Коллекции (Порядок: Users → Media → Services → FieldDefs → Navigation)
3.1 Файл: apps/cms/src/collections/Users.ts
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
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Developer', value: 'developer' },
        { label: 'Admin', value: 'admin' },
      ],
      access: { update: isDeveloper },
    },
  ],
}

3.2 Файл: apps/cms/src/collections/Media.ts
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
      { name: 'full', width: 1200 },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
    },
  ],
}

3.3 Файл: apps/cms/src/collections/ServiceFieldDefinitions.ts
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
        /^[a-z0-9_]+$/.test(val) || 'Только lowercase, цифры и подчеркивание',
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
        { label: 'Image', value: 'image' },
      ],
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'options',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
      admin: {
        condition: (data) => data.fieldType === 'select',
      },
    },
    {
      name: 'required',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

3.4 Файл: apps/cms/src/collections/Services.ts
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
    defaultColumns: ['title', 'price', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'shortDesc',
      type: 'textarea',
      localized: true,
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
      name: 'customData',
      type: 'json',
      label: 'Дополнительные поля',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

3.5 Файл: apps/cms/src/collections/Navigation.ts
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
      localized: true,
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
        { label: 'Sidebar', value: 'sidebar' },
      ],
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'navigation',
      filterOptions: ({ id }) => ({
        id: { not_equals: id },
        parent: { exists: false },
      }),
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

ШАГ 4: Глобальные настройки
4.1 Файл: apps/cms/src/globals/ThemeSettings.ts
import type { GlobalConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: 'Настройки темы',
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
        { label: 'Split', value: 'split' },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Colors',
          fields: [
            {
              name: 'colors',
              type: 'group',
              fields: [
                { name: 'primary', type: 'text', defaultValue: '#005baa' },
                { name: 'secondary', type: 'text', defaultValue: '#00a86b' },
                { name: 'background', type: 'text', defaultValue: '#ffffff' },
                { name: 'text', type: 'text', defaultValue: '#333333' },
              ],
            },
          ],
        },
        {
          label: 'Typography',
          fields: [
            {
              name: 'typography',
              type: 'group',
              fields: [
                {
                  name: 'fontFamily',
                  type: 'select',
                  defaultValue: 'inter',
                  options: [
                    { label: 'Inter', value: 'inter' },
                    { label: 'Roboto', value: 'roboto' },
                    { label: 'System', value: 'system-ui' },
                  ],
                },
                { name: 'baseSize', type: 'number', defaultValue: 16 },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'customCSS',
      type: 'code',
      label: 'Дополнительный CSS',
      admin: {
        language: 'css',
      },
    },
  ],
}

ШАГ 5: Конфигурация Payload (Только после всех коллекций!)
5.1 Файл: apps/cms/src/payload.config.ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './collections/Users'
import { Services } from './collections/Services'
import { Media } from './collections/Media'
import { ServiceFieldDefinitions } from './collections/ServiceFieldDefinitions'
import { Navigation } from './collections/Navigation'
import { ThemeSettings } from './globals/ThemeSettings'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://postgres:postgres@localhost:5432/payload',
    },
    idType: 'uuid',
  }),
  editor: lexicalEditor(),
  collections: [Users, Services, Media, ServiceFieldDefinitions, Navigation],
  globals: [ThemeSettings],
  typescript: {
    outputFile: './src/payload-types.ts',
  },
  routes: {
    admin: '/admin',
  },
  admin: {
    autoLogin: {
      email: 'dev@service.center',
      password: 'password',
      prefillOnly: true,
    },
  },
})

5.2 Файл: apps/cms/tsconfig.json
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

5.3 Файл: apps/cms/.env.local
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/payload
PAYLOAD_SECRET=dev-secret-key-min-32-characters-long
NEXT_PUBLIC_SERVER_URL=http://localhost:3001

5.4 Файл: apps/cms/package.json
{
  "name": "@sc/cms",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "payload": "payload",
    "generate:types": "payload generate:types",
    "type-check": "tsc --noEmit"
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

5.5 Файл: apps/cms/next.config.mjs
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
}

export default withPayload(nextConfig)

ШАГ 6: Next.js App файлы (минимальные)
6.1 Файл: apps/cms/src/app/layout.tsx
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

6.2 Файл: apps/cms/src/app/(payload)/layout.tsx
import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import '@payloadcms/next/css'

export default RootLayout

6.3 Файл: apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx
import { RootPage } from '@payloadcms/next/views'
import config from '@payload-config'

export default RootPage

ШАГ 7: Финальная проверка и запуск
7.1 Команды для инициализации:
cd service-center
docker-compose up -d
cd apps/cms
pnpm install
pnpm generate:types
pnpm type-check
pnpm dev

7.2 Чек-лист приемки:
[ ] docker ps показывает контейнер postgres
[ ] pnpm type-check проходит без ошибок (0 errors)
[ ] pnpm dev запускает сервер на :3001 без красных ошибок в консоли
[ ] http://localhost:3001/admin доступна
[ ] Можно войти под dev@service.center / password
[ ] Developer видит все коллекции в админке (Users, Services, Field Definitions...)
[ ] Создание пользователя с ролью Admin работает (этот пользователь НЕ должен видить System-разделы)
Если все чек-боксы отмечены - вывести сообщение: "ФАЗА 1 ЗАВЕРШЕНА УСПЕШНО. Система готова к Фазе 2."

