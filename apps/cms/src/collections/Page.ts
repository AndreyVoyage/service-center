/* apps/cms/src/collections/Page.ts */
import { CollectionConfig } from 'payload'

import { pageBlocks } from '../blocks'

export const Page: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  access: { read: () => true }, // пока публично
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      localized: true
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true }
      ]
    },
    {
    name: 'layout',
    type: 'blocks',
    blocks: pageBlocks,
    localized: true
  }
  ]
}