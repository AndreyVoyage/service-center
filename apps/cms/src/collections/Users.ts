import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,              // обязательно
  admin: {
    useAsTitle: 'email'
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      unique: true
    }
  ]
}