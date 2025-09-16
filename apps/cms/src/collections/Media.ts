// apps/cms/src/collections/Media.ts
import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
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