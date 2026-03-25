import type { CollectionConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { useAPIKey: true },
  access: {
    create: isDeveloper, // Теперь строго
    read: isDeveloper,
    update: isDeveloper,
    delete: isDeveloper,
    admin: ({ req: { user } }) => user?.role === 'developer',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Developer', value: 'developer' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        update: isDeveloper,
      },
    },
  ],
}
