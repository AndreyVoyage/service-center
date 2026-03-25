import type { CollectionConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const Navigation: CollectionConfig = {
  slug: 'navigation',
  access: {
    read: isDeveloper,
    create: isDeveloper,
    update: isDeveloper,
    delete: isDeveloper,
  },
  admin: {
    useAsTitle: 'title',
    group: 'System',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'select',
      required: true,
      defaultValue: 'header',
      options: [
        { label: 'Header', value: 'header' },
        { label: 'Footer', value: 'footer' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
