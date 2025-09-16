import { GlobalConfig } from 'payload'
import { isStaff } from '../access/isStaff'
import { isAdmin } from '../access/isAdmin'

export const Notifications: GlobalConfig = {
  slug: 'notifications',
  label: { singular: 'Уведомления', plural: 'Уведомления' },
  access: { read: isStaff, update: isAdmin },

  fields: [
    {
      name: 'channels',
      type: 'group',
      fields: [
        /* Email */
        {
          name: 'email',
          type: 'group',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true },
            { name: 'smtpHost', type: 'text', defaultValue: 'smtp.gmail.com' },
            { name: 'smtpPort', type: 'number', defaultValue: 465 },
            { name: 'secure', type: 'checkbox', defaultValue: true },
            { name: 'user', type: 'text' },
            { name: 'pass', type: 'text', admin: { style: { WebkitTextSecurity: 'disc' } as any } },
            { name: 'recipient', type: 'text' }
          ]
        },
        /* Telegram */
        {
          name: 'telegram',
          type: 'group',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true },
            { name: 'botToken', type: 'text' },
            { name: 'chatId', type: 'text' }
          ]
        },
        /* WhatsApp */
        {
          name: 'whatsapp',
          type: 'group',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: false },
            { name: 'apiUrl', type: 'text' },
            { name: 'phone', type: 'text' }
          ]
        }
      ]
    }
  ]
}