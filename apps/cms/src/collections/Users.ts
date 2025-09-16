/* Users.ts –– расширяем стандартную коллекцию */
import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: true,
  access: {
    read: ({ req: { user } }) => {
      // менеджер и выше видят всех, гость – никого
      if (!user) return false
      return true
    },
    create: ({ req: { user } }) =>
      ['admin', 'developer'].includes(user?.role as string),
    update: ({ req: { user } }) =>
      ['admin', 'developer'].includes(user?.role as string),
    delete: ({ req: { user } }) => user?.role === 'developer'
  },
  fields: [
    { name: 'fullname', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'manager',
      options: [
        { label: 'Developer', value: 'developer' },
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' }
      ]
    }
  ]
}