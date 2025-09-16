import { Access } from 'payload'

export const isStaff: Access = ({ req: { user } }) =>
  Boolean(user && ['admin', 'manager', 'developer'].includes(user.role))

export const isAdmin: Access = ({ req: { user } }) =>
  Boolean(user && ['admin', 'developer'].includes(user.role))

export const isDeveloper: Access = ({ req: { user } }) =>
  Boolean(user && user.role === 'developer')