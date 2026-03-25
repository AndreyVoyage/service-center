Service Center CMS — Core Infrastructure (Production-Ready)
🎯 МЕТОДОЛОГИЯ: "Defensive Deployment"
Золотое правило: Если итерация N не прошла проверку — останавливаемся и чиним. Никакого "пойдем дальше, потом разберемся".
Self-Healing Policy: Любая команда может падать. При падении → анализ → фикс → повтор (макс 10 попыток).
⚠️ КРИТИЧЕСКИЕ ПРАВИЛА (Прочитать перед стартом)
После изменения любой коллекции или payload.config.ts → ОБЯЗАТЕЛЬНО перезапустить pnpm dev
Если порт занят → автоматически менять на следующий (3001→3002→3003)
Всегда создавать папки перед файлами (mkdir -p)
Root package.json обязателен — без него workspaces не работают
ИТЕРАЦИЯ 0: Infrastructure (Foundation)
Цель: Работающая PostgreSQL + Root конфигурация монорепозитория.
Pre-conditions
bash
Copy
# Создаем структуру
mkdir -p service-center/{apps/cms/src/{access,collections,globals,app/{(payload)/admin/[[...segments]],(payload)}},packages/config,apps/cms/media}
cd service-center
Файл: package.json (Root) — ОБЯЗАТЕЛЕН
JSON
Copy
{
  "name": "service-center",
  "private": true,
  "type": "module",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "type-check": "turbo run type-check",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0"
  },
  "packageManager": "pnpm@9.0.0"
}
Файл: turbo.json
JSON
Copy
{
  "$schema": "https://turbo.build/schema.json",
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
Файл: docker-compose.yml
yaml
Copy
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
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
Verification (Checkpoint 0)
bash
Copy
docker-compose up -d
sleep 5
docker exec sc_postgres pg_isready -U postgres
Success Criteria: accepting connections
Fallback Strategy
Если порт 5432 занят → изменить на 5433:5432 в docker-compose.yml и далее использовать postgresql://postgres:postgres@localhost:5433/payload
Если Docker не запущен → сообщить ошибку и остановиться
ИТЕРАЦИЯ 1: Payload Minimal (Bootstrap)
Цель: Payload запускается с ОДНОЙ коллекцией Users без RBAC (чтобы не заблокировать себя).
Важно
На этом этапе create: () => true (любой может создать пользователя). RBAC включим позже.
Файл: apps/cms/package.json
JSON
Copy
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
JSON
Copy
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
env
Copy
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/payload
PAYLOAD_SECRET=dev-secret-key-min-32-characters-long
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
Файл: apps/cms/src/collections/Users.ts (Bootstrap версия — без RBAC!)
TypeScript
Copy
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    // ВАЖНО: На первом этапе разрешаем всё, чтобы создать первого пользователя
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'email',
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
      defaultValue: 'developer', // Первый пользователь — сразу developer
      options: [
        { label: 'Developer', value: 'developer' },
        { label: 'Admin', value: 'admin' },
      ],
    },
  ],
}
Файл: apps/cms/src/payload.config.ts (Minimal)
TypeScript
Copy
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
  admin: {
    autoLogin: {
      email: 'dev@service.center',
      password: 'password',
      prefillOnly: true,
    },
  },
})
Файл: apps/cms/next.config.mjs
JavaScript
Copy
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

export default withPayload(nextConfig)
Файл: apps/cms/src/app/layout.tsx
TypeScript
Copy
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
Файл: apps/cms/src/app/(payload)/layout.tsx
TypeScript
Copy
import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import '@payloadcms/next/css'

export default RootLayout
Файл: apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx
TypeScript
Copy
import { RootPage } from '@payloadcms/next/views'
import config from '@payload-config'

export default RootPage
Verification (Checkpoint 1)
bash
Copy
# 1. Установка зависимостей из ROOT (важно!)
cd service-center
pnpm install

# 2. Запуск
cd apps/cms
pnpm dev
Success Criteria:
Консоль без красных ошибок
localhost:3001/admin открывается
Можно создать первого пользователя (email: dev@service.center, role: developer)
Fallback Strategy
Если порт 3001 занят → изменить в package.json на 3002 и в .env.local NEXT_PUBLIC_SERVER_URL=http://localhost:3002
Если ошибка "Cannot find module" → удалить node_modules и pnpm install заново
Если ошибка с Payload config → проверить, что файл next.config.mjs импортирует правильно
ИТЕРАЦИЯ 2: RBAC Implementation (Security Layer)
Цель: Включить разделение ролей Developer/Admin БЕЗ блокировки себя.
⚠️ ВАЖНО: Миграция существующего пользователя
Сначала нужно изменить коллекцию Users, но оставить create: () => true временно, чтобы создать admin пользователя, а потом включить строгий RBAC.
Шаг 2.1: Добавляем access control (мягкий переход)
Файл: apps/cms/src/access/roles.ts (создать)
TypeScript
Copy
import { Access } from 'payload'

export const isDeveloper: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'developer')

export const isStaff: Access = ({ req: { user } }) => 
  Boolean(['admin', 'developer'].includes(user?.role))
Шаг 2.2: Обновляем Users коллекцию (промежуточная версия)
Стратегия: Сначала обновляем с create: () => true, создаем admin пользователя, потом перезапускаем со строгим create: isDeveloper.
Файл: apps/cms/src/collections/Users.ts (Итерация 2 — промежуточная)
TypeScript
Copy
import type { CollectionConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { useAPIKey: true },
  access: {
    // Пока оставляем create открытым, чтобы создать admin
    create: () => true,
    read: isDeveloper,
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
        update: isDeveloper, // Только developer может менять роли
      },
    },
  ],
}
Verification 2A
Перезапустить pnpm dev (ОБЯЗАТЕЛЬНО после изменения коллекции)
Войти как dev@service.center (developer)
Создать второго пользователя: admin@service.center с ролью admin
Шаг 2.3: Включаем строгий RBAC (финальная версия)
После создания admin пользователя — меняем create:
Файл: apps/cms/src/collections/Users.ts (Финальная версия Итерации 2)
TypeScript
Copy
import type { CollectionConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { useAPIKey: true },
  access: {
    create: isDeveloper, // Теперь строго
    read: isDeveloper,
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
Verification (Checkpoint 2)
Перезапустить pnpm dev
Тест Developer: Войти как dev@service.center → видит меню Users, может создать пользователя
Тест Admin: Войти в инкогнито как admin@service.center → НЕ видит коллекцию Users (видит только свои данные)
Fallback Strategy
Если admin заблокирован → вернуться к create: () => true, создать developer, вернуться к строгому режиму
Если не видит разделы → проверить access: { admin: ... } возвращает boolean
ИТЕРАЦИЯ 3: Core Collections (Services + Media)
Цель: CRUD услуг и загрузка медиа.
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
      { name: 'full', width: 1200 },
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
Файл: apps/cms/src/collections/Services.ts (Базовая)
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
    defaultColumns: ['title', 'price', 'updatedAt'],
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
Добавить импорты и обновить collections массив:
TypeScript
Copy
import { Services } from './collections/Services'
import { Media } from './collections/Media'

// Внутри buildConfig:
collections: [Users, Services, Media],
Verification (Checkpoint 3)
Перезапустить pnpm dev
Developer создает Media (загружает картинку в папку apps/cms/media/)
Developer создает Service с картинкой
Admin может редактировать Service, но не видит коллекцию Users
Fallback Strategy
Если "relation does not exist" → остановить pnpm dev, удалить .next папку, запустить снова (пересоздание таблиц)
Если не загружается картинка → проверить что папка apps/cms/media существует и доступна для записи
ИТЕРАЦИЯ 4: Field Builder (JSON Schema)
Цель: Динамические поля через отдельную коллекцию.
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
Copy
{
  name: 'customData',
  type: 'json',
  label: 'Additional Fields (JSON)',
  admin: {
    description: 'Data from Field Builder',
  },
}
Модификация: apps/cms/src/payload.config.ts
Добавить в collections:
TypeScript
Copy
import { ServiceFieldDefinitions } from './collections/ServiceFieldDefinitions'

collections: [Users, Services, Media, ServiceFieldDefinitions],
Verification (Checkpoint 4)
Перезапустить pnpm dev
Developer создает поле "freon_type" (select: R134a, R410a) в Field Definitions
Developer создает Service и заполняет customData: {"freon_type": "R134a"}
Проверить API: curl http://localhost:3001/api/services возвращает customData
Fallback Strategy
Если JSON поле не сохраняется → проверить тип в БД (должно быть JSONB)
Если generate:types падает на JSON поле → пропустить (не критично для dev)
ИТЕРАЦИЯ 5: Globals (Theme + Navigation)
Цель: Глобальные настройки.
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
    {
      name: 'customCSS',
      type: 'code',
      language: 'css',
    },
  ],
}
Файл: apps/cms/src/collections/Navigation.ts (Упрощенная, без parent)
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
Copy
import { ThemeSettings } from './globals/ThemeSettings'
import { Navigation } from './collections/Navigation'

// Добавить:
globals: [ThemeSettings],

// Обновить collections:
collections: [Users, Services, Media, ServiceFieldDefinitions, Navigation],
Финальная Verification (Checkpoint 5)
bash
Copy
# 1. Перезапуск (ОБЯЗАТЕЛЬНО после добавления коллекций)
pkill -f "next dev" || true
pnpm dev &

# 2. Type Check
pnpm type-check

# 3. Generate types (если падает — не критично)
pnpm generate:types || echo "Types generation skipped"
Success Criteria:
0 TypeScript ошибок
Developer видит в админке: Users, Services, Media, Field Definitions, Navigation, Theme Settings
Admin видит только: Services, Media (и свои данные)
Developer меняет цвет в Theme Settings на #ff0000 — сохраняется
🎯 ФИНАЛЬНЫЙ ЧЕКЛИСТ (Упрощенный)
[ ] Iter 0: docker ps показывает postgres, root package.json создан
[ ] Iter 1: localhost:3001/admin работает, первый пользователь (developer) создан
[ ] Iter 2: RBAC работает: admin НЕ видит Users коллекцию
[ ] Iter 3: Создана услуга с картинкой (через админку)
[ ] Iter 4: Создано поле "power" в Field Builder, заполнено в услуге через customData
[ ] Iter 5: Изменен цвет темы на #ff0000, Navigation создано с 2 пунктами
Если все галочки: Вывести "✅ ФАЗА 1 ЗАВЕРШЕНА УСПЕШНО. Система готова к Фазе 2 (Frontend)."
Если нет: Указать на какой итерации упало и остановиться.
🆘 EMERGENCY PROTOCOLS (На случай поломки)
Проблема: "Cannot find module '@payload-config'"
Решение: Проверить что tsconfig.json содержит "@payload-config": ["./src/payload.config.ts"]
Проблема: "Port 3001 already in use"
Решение: Автоматически меняем на 3002 в package.json и .env.local
Проблема: Database connection error
Решение: Проверить docker ps, если нет контейнера — docker-compose up -d
Проблема: Access denied для Developer
Решение: Временно вернуть create: () => true в Users, создать нового developer, вернуть строгий доступ
Проблема: TypeScript errors после изменений
Решение: rm -rf apps/cms/.next apps/cms/node_modules/.cache и перезапуск


# ТЕХНИЧЕСКОЕ ЗАДАНИЕ: ФАЗА 1 — ИТЕРАТИВНАЯ РАЗРАБОТКА v3.0 (Исправленное)
## Service Center CMS — Core Infrastructure (Production-Ready)

### 🎯 МЕТОДОЛОГИЯ: "Defensive Deployment"
**Золотое правило:** Если итерация N не прошла проверку — останавливаемся и чиним. Никакого "пойдем дальше, потом разберемся".

**Self-Healing Policy:** Любая команда может падать. При падении → анализ → фикс → повтор (макс 10 попыток).

---

## ⚠️ КРИТИЧЕСКИЕ ПРАВИЛА (Прочитать перед стартом)

1. **После изменения любой коллекции или payload.config.ts → ОБЯЗАТЕЛЬНО перезапустить `pnpm dev`**
2. **Если порт занят → автоматически менять на следующий (3001→3002→3003)**
3. **Всегда создавать папки перед файлами (mkdir -p)**
4. **Root package.json обязателен — без него workspaces не работают**

---

## ИТЕРАЦИЯ 0: Infrastructure (Foundation)

**Цель:** Работающая PostgreSQL + Root конфигурация монорепозитория.

### Pre-conditions
```bash
# Создаем структуру
mkdir -p service-center/{apps/cms/src/{access,collections,globals,app/{(payload)/admin/[[...segments]],(payload)}},packages/config,apps/cms/media}
cd service-center
```

### Файл: package.json (Root) — ОБЯЗАТЕЛЕН
```json
{
  "name": "service-center",
  "private": true,
  "type": "module",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "type-check": "turbo run type-check",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

### Файл: turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
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
```

### Файл: docker-compose.yml
```yaml
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
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
```

### Verification (Checkpoint 0)
```bash
docker-compose up -d
sleep 5
docker exec sc_postgres pg_isready -U postgres
```
**Success Criteria:** `accepting connections`

### Fallback Strategy
- Если порт 5432 занят → изменить на `5433:5432` в docker-compose.yml и далее использовать `postgresql://postgres:postgres@localhost:5433/payload`
- Если Docker не запущен → сообщить ошибку и остановиться

---

## ИТЕРАЦИЯ 1: Payload Minimal (Bootstrap)

**Цель:** Payload запускается с ОДНОЙ коллекцией Users без RBAC (чтобы не заблокировать себя).

### Важно
**На этом этапе create: () => true (любой может создать пользователя). RBAC включим позже.**

### Файл: apps/cms/package.json
```json
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
```

### Файл: apps/cms/tsconfig.json
```json
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
```

### Файл: apps/cms/.env.local
```env
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/payload
PAYLOAD_SECRET=dev-secret-key-min-32-characters-long
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

### Файл: apps/cms/src/collections/Users.ts (Bootstrap версия — без RBAC!)
```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    // ВАЖНО: На первом этапе разрешаем всё, чтобы создать первого пользователя
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'email',
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
      defaultValue: 'developer', // Первый пользователь — сразу developer
      options: [
        { label: 'Developer', value: 'developer' },
        { label: 'Admin', value: 'admin' },
      ],
    },
  ],
}
```

### Файл: apps/cms/src/payload.config.ts (Minimal)
```typescript
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
  admin: {
    autoLogin: {
      email: 'dev@service.center',
      password: 'password',
      prefillOnly: true,
    },
  },
})
```

### Файл: apps/cms/next.config.mjs
```javascript
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

export default withPayload(nextConfig)
```

### Файл: apps/cms/src/app/layout.tsx
```typescript
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
```

### Файл: apps/cms/src/app/(payload)/layout.tsx
```typescript
import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import '@payloadcms/next/css'

export default RootLayout
```

### Файл: apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx
```typescript
import { RootPage } from '@payloadcms/next/views'
import config from '@payload-config'

export default RootPage
```

### Verification (Checkpoint 1)
```bash
# 1. Установка зависимостей из ROOT (важно!)
cd service-center
pnpm install

# 2. Запуск
cd apps/cms
pnpm dev
```

**Success Criteria:**
- Консоль без красных ошибок
- `localhost:3001/admin` открывается
- Можно создать первого пользователя (email: dev@service.center, role: developer)

### Fallback Strategy
- Если порт 3001 занят → изменить в package.json на `3002` и в .env.local `NEXT_PUBLIC_SERVER_URL=http://localhost:3002`
- Если ошибка "Cannot find module" → удалить `node_modules` и `pnpm install` заново
- Если ошибка с Payload config → проверить, что файл `next.config.mjs` импортирует правильно

---

## ИТЕРАЦИЯ 2: RBAC Implementation (Security Layer)

**Цель:** Включить разделение ролей Developer/Admin БЕЗ блокировки себя.

### ⚠️ ВАЖНО: Миграция существующего пользователя
**Сначала нужно изменить коллекцию Users, но оставить create: () => true временно, чтобы создать admin пользователя, а потом включить строгий RBAC.**

### Шаг 2.1: Добавляем access control (мягкий переход)

### Файл: apps/cms/src/access/roles.ts (создать)
```typescript
import { Access } from 'payload'

export const isDeveloper: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'developer')

export const isStaff: Access = ({ req: { user } }) => 
  Boolean(['admin', 'developer'].includes(user?.role))
```

### Шаг 2.2: Обновляем Users коллекцию (промежуточная версия)

**Стратегия:** Сначала обновляем с `create: () => true`, создаем admin пользователя, потом перезапускаем со строгим `create: isDeveloper`.

### Файл: apps/cms/src/collections/Users.ts (Итерация 2 — промежуточная)
```typescript
import type { CollectionConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { useAPIKey: true },
  access: {
    // Пока оставляем create открытым, чтобы создать admin
    create: () => true,
    read: isDeveloper,
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
        update: isDeveloper, // Только developer может менять роли
      },
    },
  ],
}
```

### Verification 2A
1. Перезапустить `pnpm dev` (ОБЯЗАТЕЛЬНО после изменения коллекции)
2. Войти как dev@service.center (developer)
3. Создать второго пользователя: admin@service.center с ролью **admin**

### Шаг 2.3: Включаем строгий RBAC (финальная версия)

После создания admin пользователя — меняем create:

### Файл: apps/cms/src/collections/Users.ts (Финальная версия Итерации 2)
```typescript
import type { CollectionConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { useAPIKey: true },
  access: {
    create: isDeveloper, // Теперь строго
    read: isDeveloper,
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
```

### Verification (Checkpoint 2)
1. Перезапустить `pnpm dev`
2. **Тест Developer:** Войти как dev@service.center → видит меню Users, может создать пользователя
3. **Тест Admin:** Войти в инкогнито как admin@service.center → НЕ видит коллекцию Users (видит только свои данные)

### Fallback Strategy
- Если admin заблокирован → вернуться к `create: () => true`, создать developer, вернуться к строгому режиму
- Если не видит разделы → проверить `access: { admin: ... }` возвращает boolean

---

## ИТЕРАЦИЯ 3: Core Collections (Services + Media)

**Цель:** CRUD услуг и загрузка медиа.

### Файл: apps/cms/src/collections/Media.ts
```typescript
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
    },
  ],
}
```

### Файл: apps/cms/src/collections/Services.ts (Базовая)
```typescript
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
```

### Модификация: apps/cms/src/payload.config.ts
**Добавить импорты и обновить collections массив:**

```typescript
import { Services } from './collections/Services'
import { Media } from './collections/Media'

// Внутри buildConfig:
collections: [Users, Services, Media],
```

### Verification (Checkpoint 3)
1. Перезапустить `pnpm dev`
2. Developer создает Media (загружает картинку в папку apps/cms/media/)
3. Developer создает Service с картинкой
4. Admin может редактировать Service, но не видит коллекцию Users

### Fallback Strategy
- Если "relation does not exist" → остановить `pnpm dev`, удалить `.next` папку, запустить снова (пересоздание таблиц)
- Если не загружается картинка → проверить что папка `apps/cms/media` существует и доступна для записи

---

## ИТЕРАЦИЯ 4: Field Builder (JSON Schema)

**Цель:** Динамические поля через отдельную коллекцию.

### Файл: apps/cms/src/collections/ServiceFieldDefinitions.ts
```typescript
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
```

### Модификация: apps/cms/src/collections/Services.ts
**Добавить поле в fields массив:**

```typescript
{
  name: 'customData',
  type: 'json',
  label: 'Additional Fields (JSON)',
  admin: {
    description: 'Data from Field Builder',
  },
}
```

### Модификация: apps/cms/src/payload.config.ts
**Добавить в collections:**
```typescript
import { ServiceFieldDefinitions } from './collections/ServiceFieldDefinitions'

collections: [Users, Services, Media, ServiceFieldDefinitions],
```

### Verification (Checkpoint 4)
1. Перезапустить `pnpm dev`
2. Developer создает поле "freon_type" (select: R134a, R410a) в Field Definitions
3. Developer создает Service и заполняет customData: `{"freon_type": "R134a"}`
4. Проверить API: `curl http://localhost:3001/api/services` возвращает customData

### Fallback Strategy
- Если JSON поле не сохраняется → проверить тип в БД (должно быть JSONB)
- Если generate:types падает на JSON поле → пропустить (не критично для dev)

---

## ИТЕРАЦИЯ 5: Globals (Theme + Navigation)

**Цель:** Глобальные настройки.

### Файл: apps/cms/src/globals/ThemeSettings.ts
```typescript
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
    {
      name: 'customCSS',
      type: 'code',
      language: 'css',
    },
  ],
}
```

### Файл: apps/cms/src/collections/Navigation.ts (Упрощенная, без parent)
```typescript
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
```

### Модификация: apps/cms/src/payload.config.ts
```typescript
import { ThemeSettings } from './globals/ThemeSettings'
import { Navigation } from './collections/Navigation'

// Добавить:
globals: [ThemeSettings],

// Обновить collections:
collections: [Users, Services, Media, ServiceFieldDefinitions, Navigation],
```

### Финальная Verification (Checkpoint 5)
```bash
# 1. Перезапуск (ОБЯЗАТЕЛЬНО после добавления коллекций)
pkill -f "next dev" || true
pnpm dev &

# 2. Type Check
pnpm type-check

# 3. Generate types (если падает — не критично)
pnpm generate:types || echo "Types generation skipped"
```

**Success Criteria:**
- 0 TypeScript ошибок
- Developer видит в админке: Users, Services, Media, Field Definitions, Navigation, Theme Settings
- Admin видит только: Services, Media (и свои данные)
- Developer меняет цвет в Theme Settings на #ff0000 — сохраняется

---

## 🎯 ФИНАЛЬНЫЙ ЧЕКЛИСТ (Упрощенный)

- [ ] **Iter 0:** `docker ps` показывает postgres, root package.json создан
- [ ] **Iter 1:** `localhost:3001/admin` работает, первый пользователь (developer) создан
- [ ] **Iter 2:** RBAC работает: admin НЕ видит Users коллекцию
- [ ] **Iter 3:** Создана услуга с картинкой (через админку)
- [ ] **Iter 4:** Создано поле "power" в Field Builder, заполнено в услуге через customData
- [ ] **Iter 5:** Изменен цвет темы на #ff0000, Navigation создано с 2 пунктами

**Если все галочки:** Вывести "✅ ФАЗА 1 ЗАВЕРШЕНА УСПЕШНО. Система готова к Фазе 2 (Frontend)."

**Если нет:** Указать на какой итерации упало и остановиться.

---

## 🆘 EMERGENCY PROTOCOLS (На случай поломки)

**Проблема:** "Cannot find module '@payload-config'"
**Решение:** Проверить что tsconfig.json содержит `"@payload-config": ["./src/payload.config.ts"]`

**Проблема:** "Port 3001 already in use"
**Решение:** Автоматически меняем на 3002 в package.json и .env.local

**Проблема:** Database connection error
**Решение:** Проверить `docker ps`, если нет контейнера — `docker-compose up -d`

**Проблема:** Access denied для Developer
**Решение:** Временно вернуть `create: () => true` в Users, создать нового developer, вернуть строгий доступ

**Проблема:** TypeScript errors после изменений
**Решение:** `rm -rf apps/cms/.next apps/cms/node_modules/.cache` и перезапуск