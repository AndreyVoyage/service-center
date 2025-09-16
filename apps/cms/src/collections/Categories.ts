// apps/cms/src/collections/Categories.ts
import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  fields: [
    { name: 'title', type: 'text', required: true }
  ]
}