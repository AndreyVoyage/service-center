import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'developer',
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 200, crop: 'center' },
      { name: 'card', width: 600, height: 400 },
      { name: 'full', width: 1200 },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
