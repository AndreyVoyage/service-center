import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './collections/Users'
import { Services } from './collections/Services'
import { Media } from './collections/Media'
import { ServiceFieldDefinitions } from './collections/ServiceFieldDefinitions'
import { Navigation } from './collections/Navigation'
import { ThemeSettings } from './globals/ThemeSettings'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
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