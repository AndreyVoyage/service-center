/**
 * Упрощённая версия ContactForm без array полей
 * Использовать если nested array продолжает давать проблемы с БД
 */

import { GlobalConfig } from 'payload'

export const ContactForm: GlobalConfig = {
  slug: 'contactForm',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Активна',
    },
    
    // === LEFT BLOCK (упрощённый) ===
    {
      name: 'leftTitle',
      type: 'text',
      defaultValue: 'Оставить заявку',
      label: 'Заголовок левого блока',
    },
    {
      name: 'leftDescription',
      type: 'textarea',
      defaultValue: 'Заполните форму, и мы перезвоним вам в течение 15 минут для уточнения деталей и согласования времени выезда мастера.',
      label: 'Описание левого блока',
    },
    // Features как JSON вместо array
    {
      name: 'leftFeaturesJson',
      type: 'code',
      label: 'Преимущества (JSON)',
      defaultValue: JSON.stringify([
        { icon: 'check', text: 'Бесплатная диагностика при ремонте' },
        { icon: 'check', text: 'Прозрачное ценообразование' },
        { icon: 'check', text: 'Официальный договор' },
      ], null, 2),
      admin: {
        language: 'json',
        description: 'Формат: [{"icon":"check","text":"..."}, ...]. Доступные иконки: check, star, shield, clock, phone, tool',
      },
    },

    // === RIGHT BLOCK (форма) ===
    {
      name: 'formTitle',
      type: 'text',
      defaultValue: 'Оставить заявку',
      label: 'Заголовок формы',
    },
    {
      name: 'formSubtitle',
      type: 'text',
      defaultValue: 'Заполните форму и мы свяжемся с вами',
      label: 'Подзаголовок формы',
    },
    {
      name: 'submitButtonText',
      type: 'text',
      defaultValue: 'Вызвать мастера',
      label: 'Текст кнопки отправки',
    },
    {
      name: 'successMessage',
      type: 'textarea',
      defaultValue: 'Спасибо! Мы перезвоним вам в ближайшее время.',
      label: 'Сообщение об успешной отправке',
    },
    
    // === NOTIFICATIONS ===
    {
      name: 'notifications',
      type: 'group',
      label: 'Уведомления',
      fields: [
        {
          name: 'emailEnabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Отправлять email',
        },
        {
          name: 'telegramEnabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Отправлять в Telegram',
        },
      ],
    },
  ],
}
