import type { CollectionConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const ServiceFieldDefinitions: CollectionConfig = {
  slug: 'service-field-definitions',
  access: {
    read: isDeveloper,
    create: isDeveloper,
    update: isDeveloper,
    delete: isDeveloper,
  },
  admin: {
    useAsTitle: 'fieldName',
    group: 'System',
  },
  fields: [
    {
      name: 'fieldName',
      type: 'text',
      required: true,
      unique: true,
      validate: (val: string) => 
        /^[a-z0-9_]+$/.test(val) || 'Only lowercase, numbers, underscore',
    },
    {
      name: 'fieldType',
      type: 'select',
      required: true,
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Number', value: 'number' },
        { label: 'Select', value: 'select' },
        { label: 'Checkbox', value: 'checkbox' },
      ],
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'options',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
      admin: {
        condition: (data) => data.fieldType === 'select',
      },
    },
  ],
}
