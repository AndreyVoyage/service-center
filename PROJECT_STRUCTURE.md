# Структура проекта: service-center

**Репозиторий:** https://github.com/AndreyVoyage/service-center  
**Ветка:** `fix/local-errors`  
**Сгенерировано:** 28.03.2026, 00:21:23

## 📂 Дерево файлов

```
📦 service-center/
├── .github/
│   └── workflows/
│       └── docker-build.yml
├── .turbo/
│   └── cache/
├── apps/
│   ├── cms/
│   │   ├── .vscode/
│   │   │   ├── extensions.json
│   │   │   ├── launch.json
│   │   │   └── settings.json
│   │   ├── docs/
│   │   │   ├── ЗАГРАН ПАСПОРТ.pdf
│   │   │   └── doc-2Анкета в формате pdf.pdf
│   │   ├── media/
│   │   │   ├── DoA2tffNbDg.jpg
│   │   │   ├── Gemini_Generated_Image_9m2qxl9m2qxl9m2q.png
│   │   │   ├── Gemini_Generated_Image_wyp3oxwyp3oxwyp3.png
│   │   │   ├── iiii.jpg
│   │   │   ├── photo_2023-12-12_19-02-54.jpg
│   │   │   ├── photo_2026-02-18_14-49-53.jpg
│   │   │   ├── photo_2026-02-18_14-49-54-300x200.jpg
│   │   │   ├── photo_2026-02-18_14-49-54-600x400.jpg
│   │   │   ├── photo_2026-02-18_14-49-54.jpg
│   │   │   └── zzzzzzzzzzzz.jpg
│   │   ├── src/
│   │   │   ├── access/
│   │   │   │   ├── isAdmin.ts
│   │   │   │   ├── isStaff.ts
│   │   │   │   └── roles.ts
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
│   │   │   │   ├── api/
│   │   │   │   │   └── health/
│   │   │   │   │       └── route.ts
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
│   │   │   │   ├── Navigation.ts
│   │   │   │   ├── Page.ts
│   │   │   │   ├── Review.ts
│   │   │   │   ├── Service.ts
│   │   │   │   ├── ServiceFieldDefinitions.ts
│   │   │   │   ├── Services.ts
│   │   │   │   └── Users.ts
│   │   │   ├── components/
│   │   │   │   └── ExportCSV.tsx
│   │   │   ├── globals/
│   │   │   │   ├── Hero.ts
│   │   │   │   ├── Notifications.ts
│   │   │   │   └── ThemeSettings.ts
│   │   │   ├── lib/
│   │   │   │   ├── notifyManagers.ts
│   │   │   │   └── telegram.ts
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
│   │   ├── Dockerfile.prod
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
│       │   ├── app/
│       │   │   ├── api/
│       │   │   │   └── health/
│       │   │   │       └── route.ts
│       │   │   ├── services/
│       │   │   │   ├── [slug]/
│       │   │   │   │   ├── page.module.css
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── page.module.css
│       │   │   │   └── page.tsx
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   ├── page.module.css
│       │   │   └── page.tsx
│       │   ├── components/
│       │   │   ├── Footer.Module.css
│       │   │   ├── Footer.tsx
│       │   │   ├── Header.module.css
│       │   │   ├── Header.tsx
│       │   │   ├── Hero.tsx
│       │   │   ├── RequestForm.module.css
│       │   │   ├── RequestForm.tsx
│       │   │   ├── ReviewSlider.module.css
│       │   │   ├── ReviewSlider.tsx
│       │   │   ├── ServiceCard.module.css
│       │   │   └── ServiceCard.tsx
│       │   └── lib/
│       │       ├── api.ts
│       │       └── check-hero.ts
│       ├── .env.local.txt
│       ├── .env.txt
│       ├── Dockerfile.prod
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── package.json
│       └── tsconfig.json
├── docker/
│   ├── nginx/
│   │   ├── conf.d/
│   │   │   └── default.conf.template
│   │   └── nginx.conf
│   ├── scripts/
│   │   ├── generate-nginx-config.sh
│   │   ├── setup-docker.sh
│   │   └── update-all-clients.sh
│   ├── .env.example
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   ├── Makefile
│   ├── PHASE_1_1_TESTS.md
│   └── README.md
├── packages/
│   ├── config/
│   │   ├── eslint/
│   │   │   └── index.ts
│   │   ├── prettier/
│   │   │   └── index.json
│   │   ├── tsconfig/
│   │   │   └── base.json
│   │   └── package.json
│   └── ui/
│       └── src/
│           ├── index.ts
│           └── package.json
├── .gitignore
├── docker-compose.yml
├── eslint.config.js
├── FAZAONE.MD
├── FAZAONEB.MD
├── FAZAONEC.MD
├── generate-structure.js
├── HERO_CACHE_FIX.md
├── HERO_SETUP.md
├── ITERATION_0_CHECKPOINT.md
├── ITERATION_1_CHECKPOINT.md
├── ITERATION_2A_CHECKPOINT.md
├── ITERATION_2B_CHECKPOINT.md
├── ITERATION_3_CHECKPOINT.md
├── ITERATION_4_CHECKPOINT.md
├── ITERATION_5_CHECKPOINT.md
├── Ordrer to Provision Gdansk 13.12.2025.xlsx
├── package.json
├── PHASE_1_FINAL_CHECKLIST.md
├── photo_2025-12-18_22-11-47.jpg
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
├── turbo.json
└── tz.md
```

## 🔗 Raw-ссылки для AI-анализа

Копируй эти ссылки и отправляй AI для просмотра содержимого файлов:

### 📋 Конфигурация и документация

- [apps/cms/docker-compose.yml](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/docker-compose.yml)
- [apps/cms/Dockerfile](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/Dockerfile)
- [apps/cms/Dockerfile.prod](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/Dockerfile.prod)
- [apps/cms/package.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/package.json)
- [apps/cms/README.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/README.md)
- [apps/web/Dockerfile.prod](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/Dockerfile.prod)
- [apps/web/package.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/package.json)
- [docker/docker-compose.dev.yml](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker/docker-compose.dev.yml)
- [docker/docker-compose.prod.yml](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker/docker-compose.prod.yml)
- [docker/PHASE_1_1_TESTS.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker/PHASE_1_1_TESTS.md)
- [docker/README.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker/README.md)
- [packages/config/package.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/packages/config/package.json)
- [packages/ui/src/package.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/packages/ui/src/package.json)
- [docker-compose.yml](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker-compose.yml)
- [FAZAONE.MD](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FAZAONE.MD)
- [FAZAONEB.MD](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FAZAONEB.MD)
- [FAZAONEC.MD](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FAZAONEC.MD)
- [HERO_CACHE_FIX.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/HERO_CACHE_FIX.md)
- [HERO_SETUP.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/HERO_SETUP.md)
- [ITERATION_0_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_0_CHECKPOINT.md)
- [ITERATION_1_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_1_CHECKPOINT.md)
- [ITERATION_2A_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_2A_CHECKPOINT.md)
- [ITERATION_2B_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_2B_CHECKPOINT.md)
- [ITERATION_3_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_3_CHECKPOINT.md)
- [ITERATION_4_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_4_CHECKPOINT.md)
- [ITERATION_5_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_5_CHECKPOINT.md)
- [package.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/package.json)
- [PHASE_1_FINAL_CHECKLIST.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/PHASE_1_FINAL_CHECKLIST.md)
- [tz.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/tz.md)

### ⚙️ Backend / API

- [apps/cms/src/access/isAdmin.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/access/isAdmin.ts)
- [apps/cms/src/access/isStaff.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/access/isStaff.ts)
- [apps/cms/src/access/roles.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/access/roles.ts)
- [apps/cms/src/app/(payload)/admin/importMap.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/admin/importMap.js)
- [apps/cms/src/app/(payload)/api/[...slug]/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/api/[...slug]/route.ts)
- [apps/cms/src/app/(payload)/api/graphql/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/api/graphql/route.ts)
- [apps/cms/src/app/(payload)/api/graphql-playground/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/api/graphql-playground/route.ts)
- [apps/cms/src/app/api/health/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/api/health/route.ts)
- [apps/cms/src/app/my-route/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/my-route/route.ts)
- [apps/cms/src/blocks/Hero.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/blocks/Hero.ts)
- [apps/cms/src/blocks/index.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/blocks/index.ts)
- [apps/cms/src/blocks/ReviewsSlider.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/blocks/ReviewsSlider.ts)
- [apps/cms/src/blocks/ServicesGrid.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/blocks/ServicesGrid.ts)
- [apps/cms/src/collections/Categories.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/collections/Categories.ts)
- [apps/cms/src/collections/Documents.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/collections/Documents.ts)
- [apps/cms/src/collections/FormSubmission.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/collections/FormSubmission.ts)
- [apps/cms/src/collections/Media.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/collections/Media.ts)
- [apps/cms/src/collections/Navigation.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/collections/Navigation.ts)
- [apps/cms/src/collections/Page.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/collections/Page.ts)
- [apps/cms/src/collections/Review.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/collections/Review.ts)
- [apps/cms/src/collections/Service.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/collections/Service.ts)
- [apps/cms/src/collections/ServiceFieldDefinitions.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/collections/ServiceFieldDefinitions.ts)
- [apps/cms/src/collections/Services.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/collections/Services.ts)
- [apps/cms/src/collections/Users.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/collections/Users.ts)
- [apps/cms/src/globals/Hero.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/globals/Hero.ts)
- [apps/cms/src/globals/Notifications.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/globals/Notifications.ts)
- [apps/cms/src/globals/ThemeSettings.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/globals/ThemeSettings.ts)
- [apps/cms/src/lib/notifyManagers.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/lib/notifyManagers.ts)
- [apps/cms/src/lib/telegram.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/lib/telegram.ts)
- [apps/cms/src/payload-types.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/payload-types.ts)
- [apps/cms/src/payload.config.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/payload.config.ts)
- [apps/cms/tests/e2e/frontend.e2e.spec.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/tests/e2e/frontend.e2e.spec.ts)
- [apps/cms/tests/int/api.int.spec.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/tests/int/api.int.spec.ts)
- [apps/cms/next-env.d.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/next-env.d.ts)
- [apps/cms/playwright.config.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/playwright.config.ts)
- [apps/cms/vitest.setup.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/vitest.setup.ts)
- [apps/web/src/app/api/health/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/api/health/route.ts)
- [apps/web/src/lib/api.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/lib/api.ts)
- [apps/web/src/lib/check-hero.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/lib/check-hero.ts)
- [apps/web/next-env.d.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/next-env.d.ts)
- [apps/web/next.config.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/next.config.js)

### 🎨 Frontend

- [apps/cms/src/app/(frontend)/layout.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(frontend)/layout.tsx)
- [apps/cms/src/app/(frontend)/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(frontend)/page.tsx)
- [apps/cms/src/app/(frontend)/styles.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(frontend)/styles.css)
- [apps/cms/src/app/(payload)/admin/[[...segments]]/not-found.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/admin/[[...segments]]/not-found.tsx)
- [apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx)
- [apps/cms/src/app/(payload)/layout.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/layout.tsx)
- [apps/cms/src/components/ExportCSV.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/components/ExportCSV.tsx)
- [apps/web/src/app/services/[slug]/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/services/[slug]/page.tsx)
- [apps/web/src/app/services/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/services/page.tsx)
- [apps/web/src/app/layout.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/layout.tsx)
- [apps/web/src/app/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/page.tsx)
- [apps/web/src/components/Footer.Module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/Footer.Module.css)
- [apps/web/src/components/Footer.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/Footer.tsx)
- [apps/web/src/components/Header.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/Header.module.css)
- [apps/web/src/components/Header.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/Header.tsx)
- [apps/web/src/components/Hero.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/Hero.tsx)
- [apps/web/src/components/RequestForm.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/RequestForm.module.css)
- [apps/web/src/components/RequestForm.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/RequestForm.tsx)
- [apps/web/src/components/ReviewSlider.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/ReviewSlider.module.css)
- [apps/web/src/components/ReviewSlider.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/ReviewSlider.tsx)
- [apps/web/src/components/ServiceCard.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/ServiceCard.module.css)
- [apps/web/src/components/ServiceCard.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/ServiceCard.tsx)

### 📄 Прочие файлы

- [.github/workflows/docker-build.yml](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/.github/workflows/docker-build.yml)
- [apps/cms/.vscode/extensions.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/.vscode/extensions.json)
- [apps/cms/.vscode/launch.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/.vscode/launch.json)
- [apps/cms/.vscode/settings.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/.vscode/settings.json)
- [apps/cms/docs/doc-2Анкета в формате pdf.pdf](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/docs/doc-2Анкета в формате pdf.pdf)
- [apps/cms/src/app/(payload)/custom.scss](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/custom.scss)
- [apps/cms/.env.example](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/.env.example)
- [apps/cms/.gitignore](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/.gitignore)
- [apps/cms/.npmrc](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/.npmrc)
- [apps/cms/.prettierrc.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/.prettierrc.json)
- [apps/cms/.yarnrc](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/.yarnrc)
- [apps/cms/eslint.config.mjs](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/eslint.config.mjs)
- [apps/cms/next.config.mjs](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/next.config.mjs)
- [apps/cms/test.env](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/test.env)
- [apps/cms/tsconfig.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/tsconfig.json)
- [apps/cms/vitest.config.mts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/vitest.config.mts)
- [apps/web/src/app/services/[slug]/page.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/services/[slug]/page.module.css)
- [apps/web/src/app/services/page.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/services/page.module.css)
- [apps/web/src/app/globals.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/globals.css)
- [apps/web/src/app/page.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/page.module.css)
- [apps/web/.env.local.txt](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/.env.local.txt)
- [apps/web/.env.txt](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/.env.txt)
- [apps/web/tsconfig.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/tsconfig.json)
- [docker/nginx/conf.d/default.conf.template](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker/nginx/conf.d/default.conf.template)
- [docker/nginx/nginx.conf](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker/nginx/nginx.conf)
- [docker/scripts/generate-nginx-config.sh](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker/scripts/generate-nginx-config.sh)
- [docker/scripts/setup-docker.sh](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker/scripts/setup-docker.sh)
- [docker/scripts/update-all-clients.sh](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker/scripts/update-all-clients.sh)
- [docker/.env.example](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker/.env.example)
- [docker/Makefile](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker/Makefile)
- [packages/config/eslint/index.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/packages/config/eslint/index.ts)
- [packages/config/prettier/index.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/packages/config/prettier/index.json)
- [packages/config/tsconfig/base.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/packages/config/tsconfig/base.json)
- [packages/ui/src/index.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/packages/ui/src/index.ts)
- [.gitignore](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/.gitignore)
- [eslint.config.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/eslint.config.js)
- [generate-structure.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/generate-structure.js)
- [pnpm-lock.yaml](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/pnpm-lock.yaml)
- [pnpm-workspace.yaml](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/pnpm-workspace.yaml)
- [tsconfig.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/tsconfig.json)
- [turbo.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/turbo.json)

### 🔴 Бинарные файлы (пропущены)

- apps/cms/docs/ЗАГРАН ПАСПОРТ.pdf (binary)
- apps/cms/media/DoA2tffNbDg.jpg (binary)
- apps/cms/media/Gemini_Generated_Image_9m2qxl9m2qxl9m2q.png (binary)
- apps/cms/media/Gemini_Generated_Image_wyp3oxwyp3oxwyp3.png (binary)
- apps/cms/media/iiii.jpg (binary)
- apps/cms/media/photo_2023-12-12_19-02-54.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-53.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-54-300x200.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-54-600x400.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-54.jpg (binary)
- apps/cms/media/zzzzzzzzzzzz.jpg (binary)
- Ordrer to Provision Gdansk 13.12.2025.xlsx (binary)
- photo_2025-12-18_22-11-47.jpg (binary)

---

💡 **Как использовать:**
1. Открой этот файл на GitHub
2. Найди нужные файлы в разделах выше
3. Скопируй raw-ссылку и отправь AI с вопросом "Проанализируй этот файл"