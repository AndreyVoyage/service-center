import { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) =>
  Boolean(user && ['admin', 'developer'].includes(user.role as string))