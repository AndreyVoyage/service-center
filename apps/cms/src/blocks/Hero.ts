/* apps/cms/src/blocks/Hero.ts */
import { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'text', type: 'textarea', localized: true },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 2,
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'url', type: 'text' }
      ]
    },
    { name: 'backgroundColor', type: 'text', defaultValue: '#005baa' },
    { name: 'anchorId', type: 'text' }
  ]
}