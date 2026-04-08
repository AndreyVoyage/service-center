# Структура проекта: service-center

**Репозиторий:** https://github.com/AndreyVoyage/service-center  
**Ветка:** `fix/local-errors`  
**Сгенерировано:** 08.04.2026, 21:38:33

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
│   │   │   ├── 14.9 Как сделать аккордеон.pdf
│   │   │   ├── ЗАГРАН ПАСПОРТ.pdf
│   │   │   ├── Программист тест.docx
│   │   │   └── doc-2Анкета в формате pdf.pdf
│   │   ├── media/
│   │   │   ├── DoA2tffNbDg-1-1200x900.jpg
│   │   │   ├── DoA2tffNbDg-1-300x200.jpg
│   │   │   ├── DoA2tffNbDg-1-600x400.jpg
│   │   │   ├── DoA2tffNbDg-1.jpg
│   │   │   ├── DoA2tffNbDg.jpg
│   │   │   ├── Gemini_Generated_Image_9m2qxl9m2qxl9m2q.png
│   │   │   ├── Gemini_Generated_Image_wyp3oxwyp3oxwyp3-1-1200x655.png
│   │   │   ├── Gemini_Generated_Image_wyp3oxwyp3oxwyp3-1-300x200.png
│   │   │   ├── Gemini_Generated_Image_wyp3oxwyp3oxwyp3-1-600x400.png
│   │   │   ├── Gemini_Generated_Image_wyp3oxwyp3oxwyp3-1.png
│   │   │   ├── Gemini_Generated_Image_wyp3oxwyp3oxwyp3.png
│   │   │   ├── iiii-1-300x200.jpg
│   │   │   ├── iiii-1-600x400.jpg
│   │   │   ├── iiii-1.jpg
│   │   │   ├── iiii.jpg
│   │   │   ├── NFdb2OSROqI-1-1200x1769.jpg
│   │   │   ├── NFdb2OSROqI-1-300x200.jpg
│   │   │   ├── NFdb2OSROqI-1-600x400.jpg
│   │   │   ├── NFdb2OSROqI-1.jpg
│   │   │   ├── NFdb2OSROqI-1200x1769.jpg
│   │   │   ├── NFdb2OSROqI-300x200.jpg
│   │   │   ├── NFdb2OSROqI-600x400.jpg
│   │   │   ├── NFdb2OSROqI.jpg
│   │   │   ├── photo_2023-12-12_19-02-54.jpg
│   │   │   ├── photo_2023-12-12_19-02-55-300x200.jpg
│   │   │   ├── photo_2023-12-12_19-02-55-600x400.jpg
│   │   │   ├── photo_2023-12-12_19-02-55.jpg
│   │   │   ├── photo_2023-12-12_19-09-10-300x200.jpg
│   │   │   ├── photo_2023-12-12_19-09-10-600x400.jpg
│   │   │   ├── photo_2023-12-12_19-09-10.jpg
│   │   │   ├── photo_2026-02-18_14-49-53.jpg
│   │   │   ├── photo_2026-02-18_14-49-54-300x200.jpg
│   │   │   ├── photo_2026-02-18_14-49-54-600x400.jpg
│   │   │   ├── photo_2026-02-18_14-49-54.jpg
│   │   │   ├── photo_2026-02-18_14-49-55-300x200.jpg
│   │   │   ├── photo_2026-02-18_14-49-55-600x400.jpg
│   │   │   ├── photo_2026-02-18_14-49-55.jpg
│   │   │   ├── photo_2026-02-18_14-49-56-300x200.jpg
│   │   │   ├── photo_2026-02-18_14-49-56-600x400.jpg
│   │   │   ├── photo_2026-02-18_14-49-56.jpg
│   │   │   ├── zzzzzzzzzzzz-1-300x200.jpg
│   │   │   ├── zzzzzzzzzzzz-1-600x400.jpg
│   │   │   ├── zzzzzzzzzzzz-1.jpg
│   │   │   ├── zzzzzzzzzzzz-2-300x200.jpg
│   │   │   ├── zzzzzzzzzzzz-2-600x400.jpg
│   │   │   ├── zzzzzzzzzzzz-2.jpg
│   │   │   └── zzzzzzzzzzzz.jpg
│   │   ├── src/
│   │   │   ├── access/
│   │   │   │   ├── isAdmin.ts
│   │   │   │   ├── isStaff.ts
│   │   │   │   ├── roles.ts
│   │   │   │   └── siteAccess.ts
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
│   │   │   │   ├── FormBuilder.ts
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
│   │   │   │   ├── CategorySelectInfo.tsx
│   │   │   │   ├── ExportCSV.tsx
│   │   │   │   └── FormFieldRowLabel.tsx
│   │   │   ├── globals/
│   │   │   │   ├── ContactForm.ts
│   │   │   │   ├── Footer.ts
│   │   │   │   ├── Hero.ts
│   │   │   │   ├── Notifications.ts
│   │   │   │   └── ThemeSettings.ts
│   │   │   ├── lib/
│   │   │   │   ├── auto-warmup.ts
│   │   │   │   ├── notifyManagers.ts
│   │   │   │   ├── payload-singleton.ts
│   │   │   │   ├── sites.ts
│   │   │   │   └── telegram.ts
│   │   │   ├── middleware.ts
│   │   │   ├── payload-types.ts
│   │   │   └── payload.config.ts
│   │   ├── tests/
│   │   │   ├── e2e/
│   │   │   │   └── frontend.e2e.spec.ts
│   │   │   └── int/
│   │   │       ├── api.categories.spec.ts
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
│   │   ├── fix-migration.sql
│   │   ├── migrate-fix.js
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
│       │   │   │   ├── page.tsx
│       │   │   │   └── ServicesClient.tsx
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   ├── page.module.css
│       │   │   └── page.tsx
│       │   ├── components/
│       │   │   ├── ContactFormWrapper.tsx
│       │   │   ├── ContactSection.module.css
│       │   │   ├── ContactSection.tsx
│       │   │   ├── Footer.Module.css
│       │   │   ├── Footer.tsx
│       │   │   ├── FormBuilder.module.css
│       │   │   ├── FormBuilder.tsx
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
│       │       ├── api.test.ts
│       │       ├── api.ts
│       │       ├── check-hero.ts
│       │       └── fallback-data.ts
│       ├── .env.local.txt
│       ├── .env.txt
│       ├── Dockerfile.prod
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── package.json
│       ├── test-request-form.spec.ts
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
├── apply-migration.ps1
├── check-health.bat
├── check-system.ps1
├── ContactForm.simple.ts
├── create-database-full.sql
├── CRITICAL_FIXES_APPLIED.md
├── CRITICAL-FIX-APPLIED.md
├── debug-services.mjs
├── docker-compose.yml
├── EMERGENCY-RECOVERY.bat
├── EMERGENCY-RECOVERY.ps1
├── eslint.config.js
├── FAZAONE.MD
├── FAZAONEB.MD
├── FAZAONEC.MD
├── FINAL-SETUP.md
├── FIX_DATABASE.md
├── FIX_IMPORTMAP.md
├── FIX_MIGRATION.md
├── FIX_NOW.md
├── FIX_REVIEWS_DISPLAY.md
├── FIX_SELECT_OPTIONS.md
├── FIX_SERVICES_DISPLAY.md
├── fix-all-manual.sql
├── fix-db.js
├── FIX-MIGRATION-README.md
├── fix-migration.sql
├── FIXES_SUMMARY.md
├── generate-structure.js
├── HERO_CACHE_FIX.md
├── HERO_SETUP.md
├── IMPLEMENTATION_SUMMARY.md
├── INTEGRATION_CATEGORIES.md
├── ITERATION_0_CHECKPOINT.md
├── ITERATION_1_CHECKPOINT.md
├── ITERATION_2A_CHECKPOINT.md
├── ITERATION_2B_CHECKPOINT.md
├── ITERATION_3_CHECKPOINT.md
├── ITERATION_4_CHECKPOINT.md
├── ITERATION_5_CHECKPOINT.md
├── launch-with-wait.bat
├── launch-with-wait.ps1
├── MANUAL_FIX_GUIDE.md
├── manual-fix.sql
├── migrate-select-options.sql
├── MIGRATION_FIX.sql
├── OPTIMIZATION-SUMMARY.md
├── Ordrer to Provision Gdansk 13.12.2025.xlsx
├── package.json
├── perf-test.ps1
├── performance-test.spec.ts
├── PHASE_1_FINAL_CHECKLIST.md
├── photo_2025-12-18_22-11-47.jpg
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── PROJECT-STATUS.md
├── QUICKSTART.md
├── RECOVERY-GUIDE.md
├── RESET_MIGRATIONS.md
├── restart-and-fix.sh
├── restart-dev.sh
├── run-sql.cmd
├── SETUP_DATABASE.md
├── start-and-verify.ps1
├── start-optimized.bat
├── start-optimized.ps1
├── STARTUP_GUIDE.md
├── tsconfig.json
├── turbo.json
├── tz.md
├── UNBLOCK_NOW.bat
├── VERIFY_SERVICES.md
├── verify-connection.bat
├── verify-connection.mjs
├── verify-select-options.mjs
├── verify-setup.cjs
└── warmup.ps1
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
- [CRITICAL_FIXES_APPLIED.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/CRITICAL_FIXES_APPLIED.md)
- [CRITICAL-FIX-APPLIED.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/CRITICAL-FIX-APPLIED.md)
- [docker-compose.yml](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/docker-compose.yml)
- [FAZAONE.MD](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FAZAONE.MD)
- [FAZAONEB.MD](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FAZAONEB.MD)
- [FAZAONEC.MD](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FAZAONEC.MD)
- [FINAL-SETUP.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FINAL-SETUP.md)
- [FIX_DATABASE.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FIX_DATABASE.md)
- [FIX_IMPORTMAP.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FIX_IMPORTMAP.md)
- [FIX_MIGRATION.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FIX_MIGRATION.md)
- [FIX_NOW.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FIX_NOW.md)
- [FIX_REVIEWS_DISPLAY.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FIX_REVIEWS_DISPLAY.md)
- [FIX_SELECT_OPTIONS.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FIX_SELECT_OPTIONS.md)
- [FIX_SERVICES_DISPLAY.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FIX_SERVICES_DISPLAY.md)
- [FIX-MIGRATION-README.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FIX-MIGRATION-README.md)
- [FIXES_SUMMARY.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/FIXES_SUMMARY.md)
- [HERO_CACHE_FIX.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/HERO_CACHE_FIX.md)
- [HERO_SETUP.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/HERO_SETUP.md)
- [IMPLEMENTATION_SUMMARY.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/IMPLEMENTATION_SUMMARY.md)
- [INTEGRATION_CATEGORIES.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/INTEGRATION_CATEGORIES.md)
- [ITERATION_0_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_0_CHECKPOINT.md)
- [ITERATION_1_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_1_CHECKPOINT.md)
- [ITERATION_2A_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_2A_CHECKPOINT.md)
- [ITERATION_2B_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_2B_CHECKPOINT.md)
- [ITERATION_3_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_3_CHECKPOINT.md)
- [ITERATION_4_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_4_CHECKPOINT.md)
- [ITERATION_5_CHECKPOINT.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ITERATION_5_CHECKPOINT.md)
- [MANUAL_FIX_GUIDE.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/MANUAL_FIX_GUIDE.md)
- [OPTIMIZATION-SUMMARY.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/OPTIMIZATION-SUMMARY.md)
- [package.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/package.json)
- [PHASE_1_FINAL_CHECKLIST.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/PHASE_1_FINAL_CHECKLIST.md)
- [PROJECT-STATUS.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/PROJECT-STATUS.md)
- [QUICKSTART.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/QUICKSTART.md)
- [RECOVERY-GUIDE.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/RECOVERY-GUIDE.md)
- [RESET_MIGRATIONS.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/RESET_MIGRATIONS.md)
- [SETUP_DATABASE.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/SETUP_DATABASE.md)
- [STARTUP_GUIDE.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/STARTUP_GUIDE.md)
- [tz.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/tz.md)
- [VERIFY_SERVICES.md](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/VERIFY_SERVICES.md)

### ⚙️ Backend / API

- [apps/cms/src/access/isAdmin.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/access/isAdmin.ts)
- [apps/cms/src/access/isStaff.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/access/isStaff.ts)
- [apps/cms/src/access/roles.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/access/roles.ts)
- [apps/cms/src/access/siteAccess.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/access/siteAccess.ts)
- [apps/cms/src/app/(payload)/admin/importMap.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/admin/importMap.js)
- [apps/cms/src/app/(payload)/api/[...slug]/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/api/[...slug]/route.ts)
- [apps/cms/src/app/(payload)/api/graphql/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/api/graphql/route.ts)
- [apps/cms/src/app/(payload)/api/graphql-playground/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/api/graphql-playground/route.ts)
- [apps/cms/src/app/api/health/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/api/health/route.ts)
- [apps/cms/src/app/my-route/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/my-route/route.ts)
- [apps/cms/src/blocks/FormBuilder.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/blocks/FormBuilder.ts)
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
- [apps/cms/src/globals/ContactForm.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/globals/ContactForm.ts)
- [apps/cms/src/globals/Footer.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/globals/Footer.ts)
- [apps/cms/src/globals/Hero.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/globals/Hero.ts)
- [apps/cms/src/globals/Notifications.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/globals/Notifications.ts)
- [apps/cms/src/globals/ThemeSettings.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/globals/ThemeSettings.ts)
- [apps/cms/src/lib/auto-warmup.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/lib/auto-warmup.ts)
- [apps/cms/src/lib/notifyManagers.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/lib/notifyManagers.ts)
- [apps/cms/src/lib/payload-singleton.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/lib/payload-singleton.ts)
- [apps/cms/src/lib/sites.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/lib/sites.ts)
- [apps/cms/src/lib/telegram.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/lib/telegram.ts)
- [apps/cms/src/middleware.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/middleware.ts)
- [apps/cms/src/payload-types.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/payload-types.ts)
- [apps/cms/src/payload.config.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/payload.config.ts)
- [apps/cms/tests/e2e/frontend.e2e.spec.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/tests/e2e/frontend.e2e.spec.ts)
- [apps/cms/tests/int/api.categories.spec.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/tests/int/api.categories.spec.ts)
- [apps/cms/tests/int/api.int.spec.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/tests/int/api.int.spec.ts)
- [apps/cms/migrate-fix.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/migrate-fix.js)
- [apps/cms/next-env.d.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/next-env.d.ts)
- [apps/cms/playwright.config.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/playwright.config.ts)
- [apps/cms/vitest.setup.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/vitest.setup.ts)
- [apps/web/src/app/api/health/route.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/api/health/route.ts)
- [apps/web/src/lib/api.test.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/lib/api.test.ts)
- [apps/web/src/lib/api.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/lib/api.ts)
- [apps/web/src/lib/check-hero.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/lib/check-hero.ts)
- [apps/web/src/lib/fallback-data.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/lib/fallback-data.ts)
- [apps/web/next-env.d.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/next-env.d.ts)
- [apps/web/next.config.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/next.config.js)
- [apps/web/test-request-form.spec.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/test-request-form.spec.ts)

### 🎨 Frontend

- [apps/cms/src/app/(frontend)/layout.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(frontend)/layout.tsx)
- [apps/cms/src/app/(frontend)/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(frontend)/page.tsx)
- [apps/cms/src/app/(frontend)/styles.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(frontend)/styles.css)
- [apps/cms/src/app/(payload)/admin/[[...segments]]/not-found.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/admin/[[...segments]]/not-found.tsx)
- [apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/admin/[[...segments]]/page.tsx)
- [apps/cms/src/app/(payload)/layout.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/app/(payload)/layout.tsx)
- [apps/cms/src/components/CategorySelectInfo.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/components/CategorySelectInfo.tsx)
- [apps/cms/src/components/ExportCSV.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/components/ExportCSV.tsx)
- [apps/cms/src/components/FormFieldRowLabel.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/src/components/FormFieldRowLabel.tsx)
- [apps/web/src/app/services/[slug]/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/services/[slug]/page.tsx)
- [apps/web/src/app/services/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/services/page.tsx)
- [apps/web/src/app/services/ServicesClient.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/services/ServicesClient.tsx)
- [apps/web/src/app/layout.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/layout.tsx)
- [apps/web/src/app/page.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/app/page.tsx)
- [apps/web/src/components/ContactFormWrapper.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/ContactFormWrapper.tsx)
- [apps/web/src/components/ContactSection.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/ContactSection.module.css)
- [apps/web/src/components/ContactSection.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/ContactSection.tsx)
- [apps/web/src/components/Footer.Module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/Footer.Module.css)
- [apps/web/src/components/Footer.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/Footer.tsx)
- [apps/web/src/components/FormBuilder.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/FormBuilder.module.css)
- [apps/web/src/components/FormBuilder.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/FormBuilder.tsx)
- [apps/web/src/components/Header.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/Header.module.css)
- [apps/web/src/components/Header.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/Header.tsx)
- [apps/web/src/components/Hero.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/Hero.tsx)
- [apps/web/src/components/RequestForm.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/RequestForm.module.css)
- [apps/web/src/components/RequestForm.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/RequestForm.tsx)
- [apps/web/src/components/ReviewSlider.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/ReviewSlider.module.css)
- [apps/web/src/components/ReviewSlider.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/ReviewSlider.tsx)
- [apps/web/src/components/ServiceCard.module.css](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/ServiceCard.module.css)
- [apps/web/src/components/ServiceCard.tsx](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/web/src/components/ServiceCard.tsx)

### 🗄️ База данных / Миграции

- [apps/cms/fix-migration.sql](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apps/cms/fix-migration.sql)
- [create-database-full.sql](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/create-database-full.sql)
- [fix-all-manual.sql](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/fix-all-manual.sql)
- [fix-db.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/fix-db.js)
- [fix-migration.sql](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/fix-migration.sql)
- [manual-fix.sql](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/manual-fix.sql)
- [migrate-select-options.sql](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/migrate-select-options.sql)
- [MIGRATION_FIX.sql](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/MIGRATION_FIX.sql)

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
- [apply-migration.ps1](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/apply-migration.ps1)
- [check-health.bat](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/check-health.bat)
- [check-system.ps1](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/check-system.ps1)
- [ContactForm.simple.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/ContactForm.simple.ts)
- [debug-services.mjs](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/debug-services.mjs)
- [EMERGENCY-RECOVERY.bat](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/EMERGENCY-RECOVERY.bat)
- [EMERGENCY-RECOVERY.ps1](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/EMERGENCY-RECOVERY.ps1)
- [eslint.config.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/eslint.config.js)
- [generate-structure.js](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/generate-structure.js)
- [launch-with-wait.bat](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/launch-with-wait.bat)
- [launch-with-wait.ps1](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/launch-with-wait.ps1)
- [perf-test.ps1](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/perf-test.ps1)
- [performance-test.spec.ts](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/performance-test.spec.ts)
- [pnpm-lock.yaml](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/pnpm-lock.yaml)
- [pnpm-workspace.yaml](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/pnpm-workspace.yaml)
- [restart-and-fix.sh](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/restart-and-fix.sh)
- [restart-dev.sh](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/restart-dev.sh)
- [run-sql.cmd](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/run-sql.cmd)
- [start-and-verify.ps1](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/start-and-verify.ps1)
- [start-optimized.bat](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/start-optimized.bat)
- [start-optimized.ps1](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/start-optimized.ps1)
- [tsconfig.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/tsconfig.json)
- [turbo.json](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/turbo.json)
- [UNBLOCK_NOW.bat](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/UNBLOCK_NOW.bat)
- [verify-connection.bat](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/verify-connection.bat)
- [verify-connection.mjs](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/verify-connection.mjs)
- [verify-select-options.mjs](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/verify-select-options.mjs)
- [verify-setup.cjs](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/verify-setup.cjs)
- [warmup.ps1](https://raw.githubusercontent.com/AndreyVoyage/service-center/fix/local-errors/warmup.ps1)

### 🔴 Бинарные файлы (пропущены)

- apps/cms/docs/14.9 Как сделать аккордеон.pdf (binary)
- apps/cms/docs/ЗАГРАН ПАСПОРТ.pdf (binary)
- apps/cms/docs/Программист тест.docx (binary)
- apps/cms/media/DoA2tffNbDg-1-1200x900.jpg (binary)
- apps/cms/media/DoA2tffNbDg-1-300x200.jpg (binary)
- apps/cms/media/DoA2tffNbDg-1-600x400.jpg (binary)
- apps/cms/media/DoA2tffNbDg-1.jpg (binary)
- apps/cms/media/DoA2tffNbDg.jpg (binary)
- apps/cms/media/Gemini_Generated_Image_9m2qxl9m2qxl9m2q.png (binary)
- apps/cms/media/Gemini_Generated_Image_wyp3oxwyp3oxwyp3-1-1200x655.png (binary)
- apps/cms/media/Gemini_Generated_Image_wyp3oxwyp3oxwyp3-1-300x200.png (binary)
- apps/cms/media/Gemini_Generated_Image_wyp3oxwyp3oxwyp3-1-600x400.png (binary)
- apps/cms/media/Gemini_Generated_Image_wyp3oxwyp3oxwyp3-1.png (binary)
- apps/cms/media/Gemini_Generated_Image_wyp3oxwyp3oxwyp3.png (binary)
- apps/cms/media/iiii-1-300x200.jpg (binary)
- apps/cms/media/iiii-1-600x400.jpg (binary)
- apps/cms/media/iiii-1.jpg (binary)
- apps/cms/media/iiii.jpg (binary)
- apps/cms/media/NFdb2OSROqI-1-1200x1769.jpg (binary)
- apps/cms/media/NFdb2OSROqI-1-300x200.jpg (binary)
- apps/cms/media/NFdb2OSROqI-1-600x400.jpg (binary)
- apps/cms/media/NFdb2OSROqI-1.jpg (binary)
- apps/cms/media/NFdb2OSROqI-1200x1769.jpg (binary)
- apps/cms/media/NFdb2OSROqI-300x200.jpg (binary)
- apps/cms/media/NFdb2OSROqI-600x400.jpg (binary)
- apps/cms/media/NFdb2OSROqI.jpg (binary)
- apps/cms/media/photo_2023-12-12_19-02-54.jpg (binary)
- apps/cms/media/photo_2023-12-12_19-02-55-300x200.jpg (binary)
- apps/cms/media/photo_2023-12-12_19-02-55-600x400.jpg (binary)
- apps/cms/media/photo_2023-12-12_19-02-55.jpg (binary)
- apps/cms/media/photo_2023-12-12_19-09-10-300x200.jpg (binary)
- apps/cms/media/photo_2023-12-12_19-09-10-600x400.jpg (binary)
- apps/cms/media/photo_2023-12-12_19-09-10.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-53.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-54-300x200.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-54-600x400.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-54.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-55-300x200.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-55-600x400.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-55.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-56-300x200.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-56-600x400.jpg (binary)
- apps/cms/media/photo_2026-02-18_14-49-56.jpg (binary)
- apps/cms/media/zzzzzzzzzzzz-1-300x200.jpg (binary)
- apps/cms/media/zzzzzzzzzzzz-1-600x400.jpg (binary)
- apps/cms/media/zzzzzzzzzzzz-1.jpg (binary)
- apps/cms/media/zzzzzzzzzzzz-2-300x200.jpg (binary)
- apps/cms/media/zzzzzzzzzzzz-2-600x400.jpg (binary)
- apps/cms/media/zzzzzzzzzzzz-2.jpg (binary)
- apps/cms/media/zzzzzzzzzzzz.jpg (binary)
- Ordrer to Provision Gdansk 13.12.2025.xlsx (binary)
- photo_2025-12-18_22-11-47.jpg (binary)

---

💡 **Как использовать:**
1. Открой этот файл на GitHub
2. Найди нужные файлы в разделах выше
3. Скопируй raw-ссылку и отправь AI с вопросом "Проанализируй этот файл"