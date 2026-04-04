import { GlobalConfig } from 'payload'
import { isStaff } from '../access/isStaff'

export const ContactForm: GlobalConfig = {
  slug: 'contactForm',
  label: { singular: 'Contact Form', plural: 'Contact Form' },
  access: { read: () => true, update: isStaff },

  fields: [
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Форма активна',
      defaultValue: true,
    },
    // === ЛЕВЫЙ БЛОК: Информация перед формой ===
    {
      name: 'leftBlock',
      type: 'group',
      label: 'Левый блок (информация)',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          defaultValue: 'Оставить заявку',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Описание',
          defaultValue: 'Заполните форму, и мы перезвоним вам в течение 15 минут для уточнения деталей и согласования времени выезда мастера.',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Преимущества (список)',
          minRows: 1,
          maxRows: 6,
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка',
              defaultValue: 'check',
              options: [
                { label: '✓ Галочка', value: 'check' },
                { label: '★ Звезда', value: 'star' },
                { label: '🛡 Щит', value: 'shield' },
                { label: '🕐 Часы', value: 'clock' },
                { label: '📞 Телефон', value: 'phone' },
                { label: '🔧 Инструмент', value: 'tool' },
              ],
            },
            {
              name: 'text',
              type: 'text',
              label: 'Текст',
              required: true,
            },
          ],
          defaultValue: [
            { icon: 'check', text: 'Бесплатная диагностика при ремонте' },
            { icon: 'check', text: 'Прозрачное ценообразование' },
            { icon: 'check', text: 'Официальный договор' },
          ],
        },
      ],
    },
    // === ПРАВЫЙ БЛОК: Настройки формы ===
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок формы (над полями)',
      defaultValue: 'Оставить заявку',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Подзаголовок формы',
      defaultValue: 'Заполните форму и мы свяжемся с вами в ближайшее время',
    },
    {
      name: 'fields',
      type: 'array',
      label: 'Поля формы',
      interfaceName: 'FormField',
      fields: [
        {
          name: 'fieldType',
          type: 'select',
          label: 'Тип поля',
          required: true,
          defaultValue: 'text',
          options: [
            { label: 'Текст', value: 'text' },
            { label: 'Телефон', value: 'phone' },
            { label: 'Email', value: 'email' },
            { label: 'Сообщение', value: 'message' },
            { label: 'Список', value: 'select' },
            { label: 'Чекбокс', value: 'checkbox' },
          ],
        },
        {
          name: 'name',
          type: 'text',
          label: 'Имя поля (name)',
          required: true,
          admin: {
            description: 'Техническое имя поля, используется в коде',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Подпись (label)',
          required: true,
        },
        {
          name: 'placeholder',
          type: 'text',
          label: 'Placeholder',
        },
        {
          name: 'required',
          type: 'checkbox',
          label: 'Обязательное поле',
          defaultValue: false,
        },
        {
          name: 'options',
          type: 'array',
          label: 'Опции (для выпадающего списка)',
          admin: {
            condition: (data) => data.fieldType === 'select',
          },
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Значение',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              label: 'Отображаемый текст',
              required: true,
            },
          ],
        },
        {
          name: 'order',
          type: 'number',
          label: 'Порядок отображения',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'submitButtonText',
      type: 'text',
      label: 'Текст кнопки отправки',
      defaultValue: 'Вызвать мастера',
    },
    {
      name: 'successMessage',
      type: 'textarea',
      label: 'Сообщение об успешной отправке',
      defaultValue: 'Спасибо! Мы перезвоним вам в ближайшее время.',
    },
    {
      name: 'notifications',
      type: 'group',
      label: 'Уведомления',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email для уведомлений',
          defaultValue: 'info@coldservice.ru',
        },
        {
          name: 'telegramChatId',
          type: 'text',
          label: 'Telegram Chat ID',
          admin: {
            description: 'ID чата для отправки уведомлений в Telegram (опционально)',
          },
        },
        {
          name: 'sendTelegram',
          type: 'checkbox',
          label: 'Отправлять в Telegram',
          defaultValue: false,
        },
      ],
    },
  ],
}
