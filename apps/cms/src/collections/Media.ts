// apps/cms/src/collections/Media.ts
import { CollectionConfig } from 'payload'

import { isStaff, isAdmin, isDeveloper } from '../access/isStaff'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
  read: isStaff,
  create: isStaff,
  update: isAdmin,
  delete: isDeveloper
},
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'card', width: 640, height: 384 },
      { name: 'thumb', width: 320, height: 320 }
    ],
    adminThumbnail: 'thumb',
    mimeTypes: ['image/*']
  },
  fields: [
    { name: 'alt', type: 'text', localized: true },
    { name: 'caption', type: 'text', localized: true }
  ]
}