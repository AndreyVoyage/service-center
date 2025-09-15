// apps/cms/src/payload.config.ts
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Users } from './collections/Users';

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  admin: { user: 'users' },
  collections: [Users],
  globals: [],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI! }
  }),
  typescript: { outputFile: './src/payload-types.ts' }
});

/* временный лог */
console.log('>>> PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET);
console.log('>>> DATABASE_URI :', process.env.DATABASE_URI);