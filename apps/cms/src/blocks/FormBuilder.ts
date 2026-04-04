/* apps/cms/src/blocks/FormBuilder.ts */
import { Block } from 'payload'

export const FormBuilder: Block = {
  slug: 'formBuilder',
  labels: { singular: 'Form Builder', plural: 'Form Builders' },
  
  fields: [
    // === КОНТЕНТ БЛОКА ===
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок формы',
      localized: true,
      defaultValue: 'Оставить заявку',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Подзаголовок / Описание',
      localized: true,
    },
    {
      name: 'submitButtonText',
      type: 'text',
      label: 'Текст кнопки отправки',
      localized: true,
      defaultValue: 'Отправить',
    },
    {
      name: 'successMessage',
      type: 'textarea',
      label: 'Сообщение после успешной отправки',
      localized: true,
      defaultValue: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
    },

    // === НАСТРОЙКИ ПОЛЕЙ ===
    {
      name: 'fields',
      type: 'array',
      label: 'Поля формы',
      admin: {
        description: 'Перетащите поля для изменения порядка. Используйте переключатель для включения/выключения.',
        components: {
          RowLabel: '/components/FormFieldRowLabel#FormFieldRowLabel',
        },
      },
      fields: [
        {
          name: 'fieldType',
          type: 'select',
          label: 'Тип поля',
          required: true,
          defaultValue: 'name',
          options: [
            { label: 'Имя', value: 'name' },
            { label: 'Телефон', value: 'phone' },
            { label: 'Email', value: 'email' },
            { label: 'Сообщение', value: 'message' },
            { label: 'Кастомное поле', value: 'custom' },
          ],
        },
        {
          name: 'isEnabled',
          type: 'checkbox',
          label: 'Поле включено',
          defaultValue: true,
        },
        {
          name: 'isRequired',
          type: 'checkbox',
          label: 'Обязательное поле',
          defaultValue: false,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Подпись (Label)',
          localized: true,
          required: true,
        },
        {
          name: 'placeholder',
          type: 'text',
          label: 'Placeholder',
          localized: true,
        },
        {
          name: 'defaultValue',
          type: 'text',
          label: 'Значение по умолчанию',
          localized: true,
        },
        // Валидация
        {
          name: 'validation',
          type: 'group',
          label: 'Валидация',
          fields: [
            {
              name: 'minLength',
              type: 'number',
              label: 'Минимальная длина',
            },
            {
              name: 'maxLength',
              type: 'number',
              label: 'Максимальная длина',
            },
            {
              name: 'pattern',
              type: 'text',
              label: 'Regex паттерн',
              admin: {
                description: 'Например: ^[+]?[0-9\\s\\-\\(\\)]+$ для телефона',
              },
            },
            {
              name: 'errorMessage',
              type: 'text',
              label: 'Сообщение об ошибке',
              localized: true,
              defaultValue: 'Поле заполнено некорректно',
            },
          ],
        },
        // Ширина поля
        {
          name: 'width',
          type: 'select',
          label: 'Ширина поля',
          defaultValue: 'full',
          options: [
            { label: '100% (полная)', value: 'full' },
            { label: '50% (половина)', value: 'half' },
            { label: '33% (треть)', value: 'third' },
          ],
        },
        // Кастомные поля (только для fieldType: 'custom')
        {
          name: 'customType',
          type: 'select',
          label: 'Тип кастомного поля',
          admin: {
            condition: (data) => data.fieldType === 'custom',
          },
          options: [
            { label: 'Текст', value: 'text' },
            { label: 'Число', value: 'number' },
            { label: 'Дата', value: 'date' },
            { label: 'Выпадающий список', value: 'select' },
            { label: 'Чекбокс', value: 'checkbox' },
            { label: 'Большое текстовое поле', value: 'textarea' },
          ],
        },
        // Опции для select
        {
          name: 'options',
          type: 'array',
          label: 'Опции списка',
          admin: {
            condition: (data) => data.fieldType === 'custom' && data.customType === 'select',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Отображаемый текст',
              required: true,
              localized: true,
            },
            {
              name: 'value',
              type: 'text',
              label: 'Значение',
              required: true,
            },
          ],
        },
      ],
    },

    // === НАСТРОЙКИ УВЕДОМЛЕНИЙ ===
    {
      name: 'notifications',
      type: 'group',
      label: 'Уведомления',
      fields: [
        {
          name: 'emailRecipients',
          type: 'array',
          label: 'Email получателей',
          fields: [
            {
              name: 'email',
              type: 'email',
              label: 'Email',
              required: true,
            },
          ],
        },
        {
          name: 'sendToTelegram',
          type: 'checkbox',
          label: 'Отправлять в Telegram',
          defaultValue: false,
        },
        {
          name: 'telegramChatId',
          type: 'text',
          label: 'Telegram Chat ID',
          admin: {
            condition: (data) => data.notifications?.sendToTelegram,
            description: 'ID чата или @username канала',
          },
        },
        {
          name: 'telegramTemplate',
          type: 'textarea',
          label: 'Шаблон Telegram сообщения',
          admin: {
            condition: (data) => data.notifications?.sendToTelegram,
            description: 'Используйте {{fieldName}} для подстановки значений',
          },
          defaultValue: '🔔 <b>Новая заявка</b>\n\n👤 Имя: {{name}}\n📞 Телефон: {{phone}}\n✉️ Email: {{email}}',
        },
        {
          name: 'saveToDatabase',
          type: 'checkbox',
          label: 'Сохранять в базу данных',
          defaultValue: true,
        },
      ],
    },

    // === ЗАЩИТА ОТ СПАМА ===
    {
      name: 'spamProtection',
      type: 'group',
      label: 'Защита от спама',
      fields: [
        {
          name: 'honeypot',
          type: 'text',
          label: 'Honeypot поле',
          admin: {
            description: 'Название скрытого поля. Если бот заполнит — форма отклонится.',
          },
        },
        {
          name: 'recaptcha',
          type: 'checkbox',
          label: 'Включить reCAPTCHA v2',
          defaultValue: false,
        },
      ],
    },
  ],
}
