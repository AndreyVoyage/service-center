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
import { Notifications } from './globals/Notifications'
import { Hero } from './globals/Hero'

import sharp from 'sharp'
import path from 'path'

console.log('>>> LOADING payload.config.ts')

const config = buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  admin: { 
    user: 'users',
    importMap: {
      baseDir: path.resolve(process.cwd(), 'src/app/(payload)'),
    },
  },
  collections: [Users, Page, Categories, Service, Media, Documents, Review, FormSubmission],
  globals: [Notifications, Hero],
  sharp,
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI! }
  }),
  typescript: { outputFile: './src/payload-types.ts' }
})

console.log('>>> CONFIG CREATED:', typeof config)

export default config