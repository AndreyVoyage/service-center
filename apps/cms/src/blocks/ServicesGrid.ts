// apps/cms/src/blocks/ServicesGrid.ts
import { Block } from 'payload'
import type { Config } from '../payload-types'

type CollectionSlug = keyof Config['collections'] // ✅ "users" | "pages" | "payload-locked-documents" | ...

export const ServicesGrid: Block = {
  slug: 'servicesGrid',
  labels: { singular: 'Services Grid', plural: 'Services Grid' },
  fields: [
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories' as CollectionSlug,
      hasMany: false
    },
    {
      name: 'columns',
      type: 'select',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' }
      ],
      defaultValue: '3'
    }
  ]
}