import type { CollectionConfig } from 'payload'
import { isStaff, isDeveloper } from '../access/roles'

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isDeveloper,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'shortDesc',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'customData',
      type: 'json',
      label: 'Additional Fields (JSON)',
      admin: {
        description: 'Data from Field Builder',
      },
    },
  ],
}
