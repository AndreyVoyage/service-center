import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import dotenv from 'dotenv'
import { Users } from './collections/Users'   // ← импортируем

dotenv.config({ path: '../../.env' })

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  admin: { user: 'users' },   // ← теперь такая коллекция есть
  collections: [Users],       // ← передаём
  globals: [],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' }
  }),
  typescript: { outputFile: './src/payload-types.ts' }
})