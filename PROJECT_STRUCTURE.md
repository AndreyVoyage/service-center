# Структура проекта: service-center

**Репозиторий:** https://github.com/AndreyVoyage/service-center  
**Ветка:** `main`  
**Сгенерировано:** 20.03.2026, 23:01:51

## 📂 Дерево файлов

```
📦 service-center/
├── apps/
│   ├── cms/
│   │   ├── .vscode/
│   │   │   ├── extensions.json
│   │   │   ├── launch.json
│   │   │   └── settings.json
│   │   ├── docs/
│   │   │   └── doc-2Анкета в формате pdf.pdf
│   │   ├── media/
│   │   │   ├── Gemini_Generated_Image_9m2qxl9m2qxl9m2q.png
│   │   │   ├── Gemini_Generated_Image_wyp3oxwyp3oxwyp3.png
│   │   │   ├── iiii.jpg
│   │   │   └── zzzzzzzzzzzz.jpg
│   │   ├── src/
│   │   │   ├── access/
│   │   │   │   ├── isAdmin.ts
│   │   │   │   └── isStaff.ts
│   │   │   ├── app/
│   │   │   │   ├── (frontend)/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── styles.css
│   │   │   │   ├── (payload)/
│   │   │   │   │   ├── admin/
│   │   │   │   │   │   ├── [[...segments]]/
│   │   │   │   │   │   │   ├── not-found.tsx
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── importMap.js
│   │   │   │   │   ├── api/
│   │   │   │   │   │   ├── [...slug]/
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   ├── graphql/
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   └── graphql-playground/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   ├── custom.scss
│   │   │   │   │   └── layout.tsx
│   │   │   │   └── my-route/
│   │   │   │       └── route.ts
│   │   │   ├── blocks/
│   │   │   │   ├── Hero.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── ReviewsSlider.ts
│   │   │   │   └── ServicesGrid.ts
│   │   │   ├── collections/
│   │   │   │   ├── Categories.ts
│   │   │   │   ├── Documents.ts
│   │   │   │   ├── FormSubmission.ts
│   │   │   │   ├── Media.ts
│   │   │   │   ├── Page.ts
│   │   │   │   ├── Review.ts
│   │   │   │   ├── Service.ts
│   │   │   │   └── Users.ts
│   │   │   ├── components/
│   │   │   │   └── ExportCSV.tsx
│   │   │   ├── globals/
│   │   │   │   └── Notifications.ts
│   │   │   ├── lib/
│   │   │   │   ├── notifyManagers.ts
│   │   │   │   └── telegram.ts
│   │   │   ├── index.ts
│   │   │   ├── payload-types.ts
│   │   │   └── payload.config.ts
│   │   ├── tests/
│   │   │   ├── e2e/
│   │   │   │   └── frontend.e2e.spec.ts
│   │   │   └── int/
│   │   │       └── api.int.spec.ts
│   │   ├── .env.example
│   │   ├── .gitignore
│   │   ├── .npmrc
│   │   ├── .prettierrc.json
│   │   ├── .yarnrc
│   │   ├── docker-compose.yml
│   │   ├── Dockerfile
│   │   ├── eslint.config.mjs
│   │   ├── next-env.d.ts
│   │   ├── next.config.mjs
│   │   ├── package.json
│   │   ├── playwright.config.ts
│   │   ├── README.md
│   │   ├── test.env
│   │   ├── tsconfig.json
│   │   ├── vitest.config.mts
│   │   └── vitest.setup.ts
│   └── web/
│       ├── src/
│       │   ├── api/
│       │   │   └── form/
│       │   │       └── route.ts
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   └── components/
│       │       ├── Hero.tsx
│       │       └── RepairForm.tsx
│       ├── eslint.config.js
│       ├── next-env.d.ts
│       ├── next.config.mjs
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── config/
│   │   ├── eslint/
│   │   │   └── index.ts
│   │   ├── prettier/
│   │   │   └── index.json
│   │   ├── src/
│   │   │   └── FormSchema.ts
│   │   ├── tsconfig/
│   │   │   └── base.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── ui/
│       └── src/
│           ├── index.ts
│           └── package.json
├── .gitignore
├── eslint.config.js
├── generate-structure.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```

## 🔗 Raw-ссылки для AI-анализа

Копируй эти ссылки и отправляй AI для просмотра содержимого файлов:

### 📋 Конфигурация и документация

- [apps/cms/docker-compose.yml](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/docker-compose.yml)
- [apps/cms/Dockerfile](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/Dockerfile)
- [apps/cms/package.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/package.json)
- [apps/cms/README.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/README.md)
- [apps/web/package.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/web/package.json)
- [packages/config/package.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/packages/config/package.json)
- [packages/ui/src/package.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/packages/ui/src/package.json)
- [package.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/package.json)

### ⚙️ Backend / API

- [apps/cms/src/access/isAdmin.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/access/isAdmin.ts)
- [apps/cms/src/access/isStaff.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/access/isStaff.ts)
- [apps/cms/src/app/(payload)/admin/importMap.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/(payload)/admin/importMap.js)
- [apps/cms/src/app/(payload)/api/[...slug]/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/(payload)/api/[...slug]/route.ts)
- [apps/cms/src/app/(payload)/api/graphql/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/(payload)/api/graphql/route.ts)
- [apps/cms/src/app/(payload)/api/graphql-playground/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/(payload)/api/graphql-playground/route.ts)
- [apps/cms/src/app/my-route/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/my-route/route.ts)
- [apps/cms/src/blocks/Hero.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/blocks/Hero.ts)
- [apps/cms/src/blocks/index.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/blocks/index.ts)
- [apps/cms/src/blocks/ReviewsSlider.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/blocks/ReviewsSlider.ts)
- [apps/cms/src/blocks/ServicesGrid.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/blocks/ServicesGrid.ts)
- [apps/cms/src/collections/Categories.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/collections/Categories.ts)
- [apps/cms/src/collections/Documents.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/collections/Documents.ts)
- [apps/cms/src/collections/FormSubmission.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/collections/FormSubmission.ts)
- [apps/cms/src/collections/Media.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/collections/Media.ts)
- [apps/cms/src/collections/Page.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/collections/Page.ts)
- [apps/cms/src/collections/Review.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/collections/Review.ts)
- [apps/cms/src/collections/Service.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/collections/Service.ts)
- [apps/cms/src/collections/Users.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/collections/Users.ts)
- [apps/cms/src/globals/Notifications.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/globals/Notifications.ts)
- [apps/cms/src/lib/notifyManagers.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/lib/notifyManagers.ts)
- [apps/cms/src/lib/telegram.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/lib/telegram.ts)
- [apps/cms/src/index.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/index.ts)
- [apps/cms/src/payload-types.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/payload-types.ts)
- [apps/cms/src/payload.config.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/payload.config.ts)
- [apps/cms/tests/e2e/frontend.e2e.spec.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/tests/e2e/frontend.e2e.spec.ts)
- [apps/cms/tests/int/api.int.spec.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/tests/int/api.int.spec.ts)
- [apps/cms/next-env.d.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/next-env.d.ts)
- [apps/cms/playwright.config.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/playwright.config.ts)
- [apps/cms/vitest.setup.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/vitest.setup.ts)
- [apps/web/src/api/form/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/web/src/api/form/route.ts)
- [apps/web/eslint.config.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/web/eslint.config.js)
- [apps/web/next-env.d.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/web/next-env.d.ts)

### 🎨 Frontend

- [apps/cms/src/app/(frontend)/layout.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/(frontend)/layout.tsx)
- [apps/cms/src/app/(frontend)/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/(frontend)/page.tsx)
- [apps/cms/src/app/(frontend)/styles.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/(frontend)/styles.css)
- [apps/cms/src/app/(payload)/admin/[[...segments]]/not-found.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/(payload)/admin/[[...segments]]/not-found.tsx)
- [apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx)
- [apps/cms/src/app/(payload)/layout.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/(payload)/layout.tsx)
- [apps/cms/src/components/ExportCSV.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/components/ExportCSV.tsx)
- [apps/web/src/app/layout.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/web/src/app/layout.tsx)
- [apps/web/src/app/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/web/src/app/page.tsx)
- [apps/web/src/components/Hero.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/web/src/components/Hero.tsx)
- [apps/web/src/components/RepairForm.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/web/src/components/RepairForm.tsx)

### 🗄️ База данных / Миграции

- [packages/config/src/FormSchema.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/packages/config/src/FormSchema.ts)

### 📄 Прочие файлы

- [apps/cms/.vscode/extensions.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/.vscode/extensions.json)
- [apps/cms/.vscode/launch.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/.vscode/launch.json)
- [apps/cms/.vscode/settings.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/.vscode/settings.json)
- [apps/cms/docs/doc-2Анкета в формате pdf.pdf](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/docs/doc-2Анкета в формате pdf.pdf)
- [apps/cms/src/app/(payload)/custom.scss](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/src/app/(payload)/custom.scss)
- [apps/cms/.env.example](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/.env.example)
- [apps/cms/.gitignore](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/.gitignore)
- [apps/cms/.npmrc](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/.npmrc)
- [apps/cms/.prettierrc.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/.prettierrc.json)
- [apps/cms/.yarnrc](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/.yarnrc)
- [apps/cms/eslint.config.mjs](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/eslint.config.mjs)
- [apps/cms/next.config.mjs](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/next.config.mjs)
- [apps/cms/test.env](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/test.env)
- [apps/cms/tsconfig.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/tsconfig.json)
- [apps/cms/vitest.config.mts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/cms/vitest.config.mts)
- [apps/web/next.config.mjs](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/web/next.config.mjs)
- [apps/web/tsconfig.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/apps/web/tsconfig.json)
- [packages/config/eslint/index.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/packages/config/eslint/index.ts)
- [packages/config/prettier/index.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/packages/config/prettier/index.json)
- [packages/config/tsconfig/base.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/packages/config/tsconfig/base.json)
- [packages/config/tsconfig.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/packages/config/tsconfig.json)
- [packages/ui/src/index.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/packages/ui/src/index.ts)
- [.gitignore](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/.gitignore)
- [eslint.config.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/eslint.config.js)
- [generate-structure.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/generate-structure.js)
- [pnpm-lock.yaml](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/pnpm-lock.yaml)
- [pnpm-workspace.yaml](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/pnpm-workspace.yaml)
- [tsconfig.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/main/tsconfig.json)

### 🔴 Бинарные файлы (пропущены)

- apps/cms/media/Gemini_Generated_Image_9m2qxl9m2qxl9m2q.png (binary)
- apps/cms/media/Gemini_Generated_Image_wyp3oxwyp3oxwyp3.png (binary)
- apps/cms/media/iiii.jpg (binary)
- apps/cms/media/zzzzzzzzzzzz.jpg (binary)

---

💡 **Как использовать:**
1. Открой этот файл на GitHub
2. Найди нужные файлы в разделах выше
3. Скопируй raw-ссылку и отправь AI с вопросом "Проанализируй этот файл"