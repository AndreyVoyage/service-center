// apps/cms/src/globals/Hero.ts
import { GlobalConfig } from 'payload'
import { isStaff } from '../access/isStaff'
import { isAdmin } from '../access/isAdmin'

export const Hero: GlobalConfig = {
  slug: 'hero',
  label: { singular: 'Hero', plural: 'Hero' },
  access: { read: () => true, update: isAdmin },

  fields: [
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Показывать Hero блок',
      defaultValue: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Ремонт промышленных холодильников',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Подзаголовок',
      defaultValue: 'Срочный выезд мастера в день обращения. Ремонт любой сложности с гарантией до 12 месяцев.',
    },
    {
      name: 'backgroundType',
      type: 'select',
      label: 'Тип фона',
      options: [
        { label: 'Изображение', value: 'image' },
        { label: 'Цвет', value: 'color' },
      ],
      defaultValue: 'color',
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'relationship',
      label: 'Фоновое изображение',
      relationTo: 'media',
      admin: {
        condition: (data) => data.backgroundType === 'image',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Цвет фона',
      options: [
        { label: 'Синий (градиент)', value: 'blue' },
        { label: 'Тёмный', value: 'dark' },
        { label: 'Белый', value: 'white' },
      ],
      defaultValue: 'blue',
      admin: {
        condition: (data) => data.backgroundType === 'color',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Текст кнопки',
      defaultValue: 'Вызвать мастера',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Ссылка кнопки',
      defaultValue: '/#form',
    },
    {
      name: 'showSecondaryLink',
      type: 'checkbox',
      label: 'Показывать вторичную ссылку',
      defaultValue: true,
    },
    {
      name: 'secondaryLinkText',
      type: 'text',
      label: 'Текст вторичной ссылки',
      defaultValue: 'Все услуги →',
      admin: {
        condition: (data) => data.showSecondaryLink,
      },
    },
    {
      name: 'secondaryLinkHref',
      type: 'text',
      label: 'Ссылка вторичной ссылки',
      defaultValue: '/services',
      admin: {
        condition: (data) => data.showSecondaryLink,
      },
    },
  ],
}
