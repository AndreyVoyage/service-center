/* apps/cms/src/collections/FormSubmission.ts */
import { CollectionConfig } from 'payload'
import { notifyManagers } from '../lib/notifyManagers'

export const FormSubmission: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'formType',
    defaultColumns: ['formType', 'createdAt', 'data']
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: () => false,
    delete: ({ req: { user } }) => user?.role === 'developer'
  },
  fields: [
    { name: 'formType', type: 'select', options: ['repair', 'diagnostics', 'cooperation'], required: true },
    { name: 'data', type: 'json', required: true },
    { name: 'createdAt', type: 'date', admin: { readOnly: true } }
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          await notifyManagers(doc, req.payload) // ← передаём инстанс
        }
      }
    ]
  }
}