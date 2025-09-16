// apps/cms/src/collections/Documents.ts
import { CollectionConfig } from 'payload'

import { isStaff, isAdmin, isDeveloper } from '../access/isStaff'

export const Documents: CollectionConfig = {
  slug: 'documents',
  access: {
  read: isStaff,
  create: isStaff,
  update: isAdmin,
  delete: isDeveloper
},
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