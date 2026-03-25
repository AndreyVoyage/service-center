import type { GlobalConfig } from 'payload'
import { isDeveloper } from '../access/roles'

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  access: {
    read: isDeveloper,
    update: isDeveloper,
  },
  admin: {
    group: 'System',
  },
  fields: [
    {
      name: 'layoutType',
      type: 'select',
      defaultValue: 'topnav',
      options: [
        { label: 'Top Navigation', value: 'topnav' },
        { label: 'Sidebar', value: 'sidebar' },
      ],
    },
    {
      name: 'primaryColor',
      type: 'text',
      defaultValue: '#005baa',
    },
    {
      name: 'customCSS',
      type: 'code',
      language: 'css',
    },
  ],
}
