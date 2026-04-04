import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Page } from './collections/Page'
import { Users } from './collections/Users'
import { Categories } from './collections/Categories'
import { Service } from './collections/Service'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
import { Review } from './collections/Review'
import { FormSubmission } from './collections/FormSubmission'
import { Navigation } from './collections/Navigation'
import { ServiceFieldDefinitions } from './collections/ServiceFieldDefinitions'
import { Notifications } from './globals/Notifications'
import { Hero } from './globals/Hero'
import { ThemeSettings } from './globals/ThemeSettings'
import { Footer } from './globals/Footer'
import { ContactForm } from './globals/ContactForm'

import sharp from 'sharp'
import path from 'path'

const config = buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  admin: { 
    user: 'users',
    importMap: {
      baseDir: path.resolve(process.cwd(), 'src/app/(payload)'),
    },
  },
  collections: [Users, Page, Categories, Service, Media, Documents, Review, FormSubmission, Navigation, ServiceFieldDefinitions],
  globals: [Notifications, Hero, ThemeSettings, Footer, ContactForm],
  sharp,
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: { 
      connectionString: process.env.DATABASE_URI!,
      // Минимальные настройки для экономии памяти
      max: 5,  // Максимум 5 соединений
      min: 1,  // Минимум 1 соединение
      acquireTimeoutMillis: 5000,
      createTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
    },
    // Отключаем auto-push
    push: false,
  }),
  typescript: { 
    outputFile: './src/payload-types.ts',
    // Отключаем строгую проверку
    declare: { noEmit: false }
  }
})

export default config
