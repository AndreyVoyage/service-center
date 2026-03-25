ПРОВЕРЯЙ ПОСЛЕ КАЖДОЙ ЗАДАЧИ:
□ TypeScript: tsc --noEmit (0 ошибок)
□ Линтинг: pnpm lint (0 ошибок)
□ Тесты: pnpm test (все green)
□ БЭМ: классы формата block__element--modifier
□ Доступ: проверь роли (developer/admin)

СТРУКТУРА ПРОЕКТА:
apps/cms - Payload CMS 3.0 (порт 3001)
apps/web - Next.js 15 (порт 3000)  
apps/docs - React SPA документация (порт 3003)
packages/shared-types - общие TypeScript типы

БАЗА ДАННЫХ:
- PostgreSQL (НЕ MongoDB)
- Каждый клиент = отдельная БД
- UUID для id (не ObjectId)  

ТЕХНИЧЕСКОЕ ЗАДАНИЕ: Multi-Instance CMS для Service Center
Версия: 1.0
Архитектура: Multi-Instance (отдельный репозиторий + БД на клиента)
БД: PostgreSQL (миграция с MongoDB)
Стек: Payload CMS 3.0 + Next.js 15 + TypeScript Strict

1. АРХИТЕКТУРНЫЙ МАНИФЕСТ

1.1 Концепция Multi-Instance
Каждый клиент = независимый репозиторий (fork от template)
Отдельная БД PostgreSQL на клиента
Код общий (через git upstream), данные изолированы
Обновления: только критичные баги (frozen versions)

1.2 Роли доступа (RBAC)
Developer (role: 'developer'):
Доступ ко всем коллекциям (Users, Services, Pages, ThemeSettings, FieldBuilder, Navigation)
Видит системные настройки
Может менять код/CSS напрямую
Admin (role: 'admin'):
Только контентные коллекции: Services, Pages (только content, не layout), FormSubmissions, Media
Нет доступа к: ThemeSettings, FieldBuilder, Users, System Globals
UI админки скрывает недоступные разделы

1.3 Структура репозитория   service-center-template/ (золотой мастер)
├── apps/
│   ├── cms/                 # Payload 3.0 + PostgreSQL
│   ├── web/                 # Next.js 15 (PWA-ready)
│   └── docs/                # React SPA документация
├── packages/
│   ├── shared-types/        # TypeScript types (Payload + Web)
│   ├── ui-components/       # Shared React components
│   └── eslint-config/
├── scripts/
│   ├── migrate-mongo-to-pg.ts # Миграция demo-data
│   ├── create-client.sh     # Клонирование для нового клиента
│   └── setup-fields.ts      # Seed field builder
└── docker-compose.prod.yml  # [DRAFT] Production template  

Базовая инфраструктура PostgreSQL
Задача: Настроить Payload CMS 3.0 с PostgreSQL адаптером вместо MongoDB.
Конфигурация:

// apps/cms/src/payload.config.ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI, // postgres://user:pass@localhost:5432/dbname
    },
    // Важно: idType: 'uuid' для совместимости
    idType: 'uuid',
  }),
  // ... остальная конфигурация
})

SQL скрипт инициализации (для нового клиента):

-- scripts/init-client-db.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Payload создаст таблицы автоматически, но права нужны
CREATE USER client_admin WITH PASSWORD 'temp_password';
CREATE DATABASE client_db OWNER client_admin;
GRANT ALL PRIVILEGES ON DATABASE client_db TO client_admin;

ТЕСТ (Definition of Done):
[ ] pnpm dev в apps/cms запускается без ошибок подключения к PostgreSQL
[ ] В логах: Connected to PostgreSQL successfully
[ ] Таблицы создаются автоматически (проверить через \dt в psql)
2.2 Система ролей (RBAC)
Задача: Реализовать разделение Developer vs Admin.
Код доступа: 

// apps/cms/src/access/roles.ts
import { Access } from 'payload'

export const isDeveloper: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'developer')

export const isAdmin: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'admin')

export const isAdminOrDeveloper: Access = ({ req: { user } }) => 
  Boolean(['admin', 'developer'].includes(user?.role))

// Для контентных коллекций (видят и Admin и Developer)
export const isStaff: Access = ({ req: { user } }) => 
  Boolean(['admin', 'developer'].includes(user?.role))

  // apps/cms/src/access/roles.ts
import { Access } from 'payload'

export const isDeveloper: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'developer')

export const isAdmin: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'admin')

export const isAdminOrDeveloper: Access = ({ req: { user } }) => 
  Boolean(['admin', 'developer'].includes(user?.role))

// Для контентных коллекций (видят и Admin и Developer)
export const isStaff: Access = ({ req: { user } }) => 
  Boolean(['admin', 'developer'].includes(user?.role))

  Коллекция Users (модифицировать):

  // apps/cms/src/collections/Users.ts
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    read: isDeveloper, // Только разработчик видит список пользователей
    create: isDeveloper,
    update: isDeveloper,
    delete: isDeveloper,
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
      access: {
        update: isDeveloper, // Admin не может поменять себе роль на Developer
      }
    },
    // ... остальные поля
  ]
}

Скрытие UI для Admin:

// apps/cms/src/collections/ThemeSettings.ts (пример)
export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  access: {
    read: isDeveloper,
    update: isDeveloper,
  },
  // Admin вообще не видит эту коллекцию в sidebar благодаря access: read
}

ТЕСТ:
[ ] Developer видит меню "Users", "Theme Settings", "Field Builder"
[ ] Admin НЕ видит эти разделы в админке Payload
[ ] Admin может создавать/редактировать Services
[ ] При попытке Admin зайти по прямой URL (/admin/collections/theme-settings) - 403 Forbidden
2.3 Field Builder (Гибкие поля услуг)
Задача: Система кастомных полей для Services через JSONB.
Архитектура:
Таблица services имеет поле customFields: jsonb (хранит значения)
Отдельная коллекция service-field-definitions (хранит схему полей)
UI в админке для создания полей (только Developer)
Коллекция определений полей:

// apps/cms/src/collections/ServiceFieldDefinitions.ts
export const ServiceFieldDefinitions: CollectionConfig = {
  slug: 'service-field-definitions',
  access: {
    read: isDeveloper,
    create: isDeveloper,
    update: isDeveloper,
    delete: isDeveloper,
  },
  fields: [
    {
      name: 'fieldName',
      type: 'text',
      required: true,
      unique: true,
      validate: (val) => /^[a-z0-9_]+$/.test(val) || 'Только lowercase, цифры и подчеркивание'
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
        { label: 'File', value: 'file' },
      ]
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      localized: true, // Мультиязычность названия поля
    },
    {
      name: 'options',
      type: 'array', // Для type: 'select'
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text', localized: true }
      ],
      admin: {
        condition: (data) => data.fieldType === 'select'
      }
    },
    {
      name: 'required',
      type: 'checkbox',
      defaultValue: false,
    }
  ]
}

Модификация коллекции Services:

// apps/cms/src/collections/Service.ts - добавить поле
{
  name: 'customData',
  type: 'json',
  label: 'Дополнительные поля',
  // Здесь хранятся значения { freon_type: "R134a", power: 2500 }
}

Компонент UI для ввода кастомных полей:

// apps/cms/src/components/CustomFieldsBuilder.tsx
// React-компонент, который:
// 1. Загружает список field definitions из API
// 2. Рендерит соответствующие инпуты (text, number, select)
// 3. Сохраняет как JSON в поле customData

ТЕСТ:
[ ] Developer создает поле "freon_type" (select: R134a, R410a)
[ ] Developer создает поле "power" (number)
[ ] В форме редактирования Service появляются эти поля
[ ] API возвращает: { id: "123", title: "Ремонт", customData: { freon_type: "R134a", power: 2500 } }
[ ] TypeScript генерирует типы для customData (unknown или Record<string, any> временно)
2.4 Theme System (3 базовых шаблона)
Задача: Глобальные настройки темы с CSS Variables.
Global Config:

// apps/cms/src/globals/ThemeSettings.ts
export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  access: { read: isDeveloper, update: isDeveloper },
  fields: [
    {
      name: 'layoutType',
      type: 'select',
      defaultValue: 'topnav',
      options: [
        { label: 'Top Navigation', value: 'topnav' },
        { label: 'Sidebar', value: 'sidebar' },
        { label: 'Split', value: 'split' },
      ]
    },
    {
      name: 'colors',
      type: 'group',
      fields: [
        { name: 'primary', type: 'text', defaultValue: '#005baa' },
        { name: 'secondary', type: 'text', defaultValue: '#00a86b' },
        { name: 'background', type: 'text', defaultValue: '#ffffff' },
        { name: 'text', type: 'text', defaultValue: '#333333' },
      ]
    },
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
          ]
        },
        { name: 'baseSize', type: 'number', defaultValue: 16 },
      ]
    },
    {
      name: 'cssVariables',
      type: 'textarea',
      admin: {
        description: 'Дополнительные CSS переменные (для Developer)'
      }
    }
  ]
}

Генерация CSS на фронтенде:

// apps/web/src/app/layout.tsx (Server Component)
import { getThemeSettings } from '@/lib/api'

export default async function RootLayout({ children }) {
  const theme = await getThemeSettings()
  
  return (
    <html lang="ru">
      <head>
        <style>{`
          :root {
            --color-primary: ${theme.colors.primary};
            --color-secondary: ${theme.colors.secondary};
            --font-main: ${theme.typography.fontFamily};
            --layout-type: ${theme.layoutType};
            ${theme.cssVariables}
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}

Layout компоненты:
// apps/web/src/layouts/TopNavLayout.tsx
// apps/web/src/layouts/SidebarLayout.tsx
// apps/web/src/layouts/SplitLayout.tsx

// Выбор layout в зависимости от theme.layoutType

ТЕСТ:
[ ] Смена layoutType на 'sidebar' меняет структуру HTML (nav сбоку)
[ ] Смена primaryColor на #ff0000 меняет цвет кнопок (через CSS vars)
[ ] БЭМ классы присутствуют: .layout-sidebar__nav, .layout-sidebar__content
[ ] CSS без вложенности > 2 уровней
2.5 Menu Builder
Задача: Drag-and-drop навигация с поддержкой вложенности (3 уровня).
Коллекция Navigation:

// apps/cms/src/collections/Navigation.ts
export const Navigation: CollectionConfig = {
  slug: 'navigation',
  access: { read: isDeveloper, write: isDeveloper },
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
      options: [
        { label: 'Header', value: 'header' },
        { label: 'Footer', value: 'footer' },
        { label: 'Sidebar', value: 'sidebar' },
      ]
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'navigation',
      filterOptions: ({ data }) => ({
        // Не позволяем выбрать себя или детей (предотвращение циклов)
        id: { not_equals: data.id },
        parent: { exists: false }, // Только 2 уровня вложенности max
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
      required: false,
    }
  ],
  // Важно: Использовать плагин или кастомный UI для drag-and-drop сортировки
  // Payload не имеет встроенного drag-and-drop для списков
}

Компоненты фронтенда:

// apps/web/src/components/Navigation/NavHeader.tsx
// Рекурсивный рендеринг с поддержкой 3 уровней
// БЭМ: .nav-header, .nav-header__item, .nav-header__link, .nav-header__submenu--level-1

// apps/web/src/components/Navigation/NavFooter.tsx
// apps/web/src/components/Navigation/NavSidebar.tsx

ТЕСТ:
[ ] Создано меню: Главная | Услуги (подменю: Ремонт, Заправка) | Контакты
[ ] Подменю отображается при наведении (hover) или клике на mobile
[ ] API возвращает дерево с depth=2
[ ] БЭМ валидация пройдена (регулярка ^[a-z]+(-[a-z]+)*(__[a-z]+)?(--[a-z]+)?$)



1. Инициализация
Команды для старта mkdir service-center && cd service-center
pnpm init
pnpm add -D turbo typescript @types/node  . Файл: package.json (root)   {
  "name": "service-center",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0"
  },
  "packageManager": "pnpm@9.0.0"
}    Файл: turbo.json {
  "$schema": "https://turbo.build/schema.json ",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "type-check": {
      "cache": false
    }
  }
} 
Файл: docker-compose.yml (только для dev) version: '3.8'
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
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:                            
  
  2. Payload CMS (apps/cms) Команды mkdir -p apps/cms && cd apps/cms
pnpm init
pnpm add payload@3.55.1 @payloadcms/next@3.55.1 @payloadcms/db-postgres@3.55.1 next@15.2.0 react@19 react-dom@19
pnpm add -D typescript @types/node @types/react @types/react-dom Файл: apps/cms/package.json {
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
Файл: apps/cms/.env.local 
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/payload
PAYLOAD_SECRET=your-secret-key-here-change-in-production
NEXT_PUBLIC_SERVER_URL=http://localhost:3001    

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

Файл: apps/cms/src/payload.config.ts 

import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Services } from './collections/Services'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ServiceFieldDefinitions } from './collections/ServiceFieldDefinitions'
import { Navigation } from './collections/Navigation'
import { ThemeSettings } from './globals/ThemeSettings'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
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

Файл: apps/cms/src/access/roles.ts

import { Access } from 'payload'

export const isDeveloper: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'developer')

export const isAdmin: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'admin')

export const isStaff: Access = ({ req: { user } }) => 
  Boolean(['admin', 'developer'].includes(user?.role))

  Файл: apps/cms/src/collections/Users.ts

  import type { CollectionConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  },
  access: {
    read: isDeveloper,
    create: isDeveloper,
    update: isDeveloper,
    delete: isDeveloper,
    admin: ({ req: { user } }) => user?.role === 'developer',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'createdAt'],
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
      access: {
        update: isDeveloper,
      },
    },
  ],
}

Файл: apps/cms/src/collections/ServiceFieldDefinitions.ts

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
    {
      name: 'showInList',
      type: 'checkbox',
      defaultValue: false,
      label: 'Показывать в списке услуг',
    },
  ],
}

Файл: apps/cms/src/collections/Services.ts
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
      name: 'description',
      type: 'richText',
      localized: true,
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
      label: 'Дополнительные поля (настраиваются в Field Builder)',
      admin: {
        description: 'Здесь хранятся данные из кастомных полей',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

Файл: apps/cms/src/collections/Media.ts
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
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
    },
  ],
}

Файл: apps/cms/src/collections/Navigation.ts
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
    description: 'Структура меню (drag-and-drop через ordering)',
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
        // Ограничиваем вложенность: родитель не должен иметь своего родителя (только 2 уровня)
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
      required: false,
    },
    {
      name: 'opensInNewTab',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

Файл: apps/cms/src/globals/ThemeSettings.ts
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
                { name: 'accent', type: 'text', defaultValue: '#ff6b00' },
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
                { name: 'scale', type: 'number', defaultValue: 1.25 },
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
        description: 'Будет вставлен в <head> сайта',
      },
    },
  ],
}

Файл: apps/cms/src/app/layout.tsx
import React from 'react'
import './styles.css'

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

export const metadata = {
  description: 'Service Center CMS',
  title: 'Service Center Admin',
}

Файл: apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx
import { RootPage } from '@payloadcms/next/views'
import config from '@payload-config'

export default RootPage

export const generateMetadata = async () => ({
  description: 'Payload Admin',
  title: 'Admin',
})

Файл: apps/cms/next.config.mjs
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

3. Чек-лист приемки Фазы 1
Проверьте перед переходом к Фазе 2:
[ ] docker-compose up -d запускает PostgreSQL без ошибок
[ ] cd apps/cms && pnpm dev запускает Payload на http://localhost:3001
[ ] Миграции автоматические прошли (таблицы созданы)
[ ] Можно войти в админку под dev@service.center / password
[ ] Developer видит все коллекции (Users, Services, Theme Settings, Field Definitions, Navigation)
[ ] Создан пользователь с ролью Admin - он НЕ видит System-разделы (Users, Theme Settings)
[ ] Создано поле "freon_type" (select) в Field Builder - оно появляется в форме редактирования Service
[ ] Создана услуга с заполненным customData (JSON)
[ ] Изменение Theme Settings (цвета) сохраняется
[ ] Создано меню в Navigation с вложенностью (родитель + дочерний)
[ ] TypeScript компилируется без ошибок: pnpm type-check
[ ] Генерация типов работает: pnpm generate:types создает payload-types.ts
