// apps/cms/src/collections/Service.ts
import { CollectionConfig } from 'payload'
import type { Config } from '../payload-types'

type CollectionSlug = keyof Config['collections']

export const Service: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'price', 'category'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, localized: true },
    { name: 'shortDesc', type: 'textarea', localized: true },
    { name: 'price', type: 'number', min: 0 },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories' as CollectionSlug,
      hasMany: false,
      required: true
    },
    {
      name: 'gallery',
      type: 'array',
      maxRows: 8,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media' as CollectionSlug,
          required: true
        },
        { name: 'alt', type: 'text', localized: true }
      ]
    },
    {
      name: 'documents',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', localized: true },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'documents' as CollectionSlug
        }
      ]
    }
  ]
}