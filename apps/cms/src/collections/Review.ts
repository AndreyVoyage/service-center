import { CollectionConfig } from 'payload'
import type { Config } from '../payload-types'

import { isStaff, isAdmin, isDeveloper } from '../access/isStaff'

type CollectionSlug = keyof Config['collections']

export const Review: CollectionConfig = {
  slug: 'reviews',
  access: {
  read: isStaff,
  create: isStaff,
  update: isAdmin,
  delete: isDeveloper
},
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'rating', type: 'select', required: true, options: [
        { label: '5', value: '5' },
        { label: '4', value: '4' },
        { label: '3', value: '3' },
        { label: '2', value: '2' },
        { label: '1', value: '1' }
    ]},
    { name: 'text', type: 'textarea', required: true, localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' as CollectionSlug },
    { name: 'isPublished', type: 'checkbox', defaultValue: false },
    { name: 'createdAt', type: 'date', admin: { readOnly: true } }
  ],
  hooks: { /* ... */ }
}

