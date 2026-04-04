import { GlobalConfig } from 'payload'
import { isStaff } from '../access/isStaff'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: { singular: 'Footer', plural: 'Footer' },
  access: { read: () => true, update: isStaff },

  fields: [
    {
      name: 'logo',
      type: 'upload',
      label: 'Логотип',
      relationTo: 'media',
    },
    {
      name: 'companyName',
      type: 'text',
      label: 'Название компании',
      defaultValue: 'ColdService',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание компании',
      defaultValue: 'Профессиональный ремонт промышленного холодильного оборудования с 2014 года',
    },
    {
      name: 'contacts',
      type: 'group',
      label: 'Контактная информация',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          defaultValue: 'info@coldservice.ru',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Телефон',
          defaultValue: '+7 (495) 123-45-67',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Адрес',
          defaultValue: 'г. Москва, ул. Примерная, д. 123',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Социальные сети',
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Платформа',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Telegram', value: 'telegram' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'VK', value: 'vk' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка',
          required: true,
        },
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Активна',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'navigationColumns',
      type: 'array',
      label: 'Колонки навигации',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок колонки',
          defaultValue: 'Навигация',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Ссылки',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Текст ссылки',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              label: 'URL',
              required: true,
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Активна',
              defaultValue: true,
            },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Текст копирайта',
      defaultValue: 'ColdService. Все права защищены.',
    },
    {
      name: 'showLegalLinks',
      type: 'checkbox',
      label: 'Показывать юридические ссылки',
      defaultValue: false,
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Юридические ссылки',
      admin: {
        condition: (data) => data.showLegalLinks,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Текст',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
    },
  ],
}
