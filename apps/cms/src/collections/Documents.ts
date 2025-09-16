// apps/cms/src/collections/Documents.ts
import { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  upload: {
    staticDir: 'docs',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  },
  fields: [{ name: 'title', type: 'text', localized: true }]
}