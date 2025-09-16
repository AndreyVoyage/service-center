// apps/cms/src/collections/Categories.ts
import { CollectionConfig } from 'payload'

import { isStaff, isAdmin, isDeveloper } from '../access/isStaff'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
  read: isStaff,
  create: isStaff,
  update: isAdmin,
  delete: isDeveloper
},
  fields: [
    { name: 'title', type: 'text', required: true },
  ]
}