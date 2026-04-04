// Fallback данные для использования при недоступности CMS

export const fallbackFooter = {
  logo: null,
  companyName: 'ColdService',
  description: 'Профессиональный ремонт промышленного холодильного оборудования с 2014 года',
  contacts: {
    email: 'info@coldservice.ru',
    phone: '+7 (495) 123-45-67',
    address: 'г. Москва, ул. Примерная, д. 123',
  },
  socialLinks: [],
  navigationColumns: [
    {
      title: 'Навигация',
      links: [
        { label: 'Главная', href: '/', isActive: true },
        { label: 'Услуги', href: '/services', isActive: true },
      ],
    },
  ],
  copyright: 'ColdService. Все права защищены.',
  showLegalLinks: false,
  legalLinks: [],
}

export const fallbackHero = {
  isActive: true,
  title: 'Ремонт промышленных холодильников 24/7',
  subtitle: 'Срочный выезд мастера в день обращения. Ремонт любой сложности с гарантией до 12 месяцев.',
  backgroundType: 'color' as const,
  backgroundColor: 'blue' as const,
  ctaText: 'Вызвать мастера',
  ctaLink: '/#form',
  showSecondaryLink: true,
  secondaryLinkText: 'Все услуги →',
  secondaryLinkHref: '/services',
}

export const fallbackServices = [
  {
    id: '1',
    title: 'Срочный ремонт холодильного оборудования',
    slug: 'emergency-repair',
    description: 'Быстрый выезд мастера в течение 2 часов',
    shortDescription: 'Выезд мастера в течение 2 часов',
    icon: '🚨',
  },
  {
    id: '2',
    title: 'Диагностика неисправностей',
    slug: 'diagnostics',
    description: 'Полная диагностика оборудования с выездом на объект',
    shortDescription: 'Полная диагностика с выездом',
    icon: '🔍',
  },
  {
    id: '3',
    title: 'Заправка фреоном',
    slug: 'refrigerant',
    description: 'Заправка холодильного оборудования фреоном всех типов',
    shortDescription: 'Заправка фреоном всех типов',
    icon: '❄️',
  },
]

export const fallbackReviews = [
  {
    id: '1',
    name: 'Александр',
    text: 'Отличный сервис! Мастер приехал через час, быстро нашёл неисправность и починил. Рекомендую!',
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Мария',
    text: 'Второй раз обращаюсь, всегда качественно и быстро. Цены адекватные, гарантия даёт уверенность.',
    rating: 5,
    createdAt: new Date().toISOString(),
  },
]

export const fallbackContactForm = {
  isActive: true,
  title: 'Оставить заявку',
  subtitle: 'Заполните форму и мы свяжемся с вами в ближайшее время',
  fields: [
    { fieldType: 'name', name: 'name', label: 'Ваше имя', placeholder: 'Иван Иванов', required: true, order: 1 },
    { fieldType: 'phone', name: 'phone', label: 'Телефон', placeholder: '+7 (999) 123-45-67', required: true, order: 2 },
    { fieldType: 'message', name: 'message', label: 'Описание проблемы', placeholder: 'Опишите неисправность...', required: false, order: 3 },
  ],
  submitButtonText: 'Вызвать мастера',
  successMessage: 'Спасибо! Мы перезвоним вам в ближайшее время.',
  notifications: {
    email: 'info@coldservice.ru',
    sendTelegram: false,
  },
}
