/* apps/cms/src/collections/FormSubmission.ts */
import { CollectionConfig } from 'payload'
import { notifyManagers } from '../lib/notifyManagers'

export const FormSubmission: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'formType',
    defaultColumns: ['formType', 'status', 'createdAt', 'sourcePage']
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'developer'
  },
  fields: [
    { 
      name: 'formType', 
      type: 'select', 
      options: ['repair', 'diagnostics', 'cooperation', 'formBuilder'], 
      required: true 
    },
    { 
      name: 'sourcePage', 
      type: 'relationship', 
      relationTo: 'pages',
      admin: { description: 'Страница, с которой отправлена форма' }
    },
    { 
      name: 'sourceBlockId', 
      type: 'text',
      admin: { description: 'ID блока формы' }
    },
    { name: 'formData', type: 'json', required: true },
    { 
      name: 'metadata', 
      type: 'group',
      fields: [
        { name: 'ipAddress', type: 'text', label: 'IP адрес' },
        { name: 'userAgent', type: 'text', label: 'User Agent' },
        { name: 'submittedAt', type: 'date', label: 'Время отправки' },
      ]
    },
    { 
      name: 'status', 
      type: 'select', 
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В обработке', value: 'processing' },
        { label: 'Обработана', value: 'processed' },
        { label: 'Архив', value: 'archived' },
      ],
      defaultValue: 'new',
      admin: { position: 'sidebar' }
    },
    { 
      name: 'notes', 
      type: 'textarea', 
      label: 'Заметки менеджера',
      admin: { description: 'Внутние заметки по заявке' }
    },
    { name: 'createdAt', type: 'date', admin: { readOnly: true } }
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' && doc.formType !== 'formBuilder') {
          await notifyManagers(doc, req.payload)
        }
      }
    ]
  }
}