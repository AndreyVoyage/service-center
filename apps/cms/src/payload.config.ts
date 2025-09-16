// apps/cms/src/payload.config.ts
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

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  admin: { user: 'users' },
  collections: [Users, Page, Categories, Service, Media, Documents, Review, FormSubmission],
  globals: [Notifications],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI! }
  }),
  typescript: { outputFile: './src/payload-types.ts' }
})

/* временный лог */
console.log('>>> PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET)
console.log('>>> DATABASE_URI :', process.env.DATABASE_URI)