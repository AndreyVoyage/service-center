import type { CollectionConfig, FieldAccess } from 'payload'

// Тип для функций доступа возвращающих boolean
type BooleanAccess = ({ req }: { req: any }) => boolean | Promise<boolean>

const isDeveloper: BooleanAccess = ({ req: { user } }) => {
  return user?.role === 'developer'
}

const canAccessAdmin: BooleanAccess = ({ req: { user } }) => {
  return user?.role === 'admin' || user?.role === 'developer'
}

// Чтение: admin видит всех, обычный user только себя
const readAccess: BooleanAccess = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'developer' || user.role === 'admin') return true
  return false
}

// Создание: асинхронная функция проверяет количество пользователей
const createAccess = async ({ req }: { req: any }) => {
  const users = await req.payload.find({
    collection: 'users',
    limit: 1,
  })
  if (users.totalDocs === 0) return true
  return isDeveloper({ req })
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { useAPIKey: true },
  access: {
    create: createAccess as any, // Payload принимает и async функции
    read: readAccess,
    update: isDeveloper,
    delete: isDeveloper,
    admin: canAccessAdmin, // Теперь возвращает boolean
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
        update: isDeveloper as FieldAccess,
      },
    },
  ],
}