import { Access } from 'payload'

export const isDeveloper: Access = ({ req: { user } }) => 
  Boolean(user?.role === 'developer')

export const isStaff: Access = ({ req: { user } }) => 
  Boolean(['admin', 'developer'].includes(user?.role))
