// Определение типов сайтов
export const SITE_DOMAINS = {
  'localhost:3001': 'main',
  'site.com': 'main',
  'www.site.com': 'main',

  'localhost:3002': 'promo',
  'promo.localhost:3001': 'promo',
  'promo.site.com': 'promo',
} as const

export type SiteSlug = 'main' | 'promo'

/**
 * Определяет сайт по заголовку Host
 */
export function getSiteFromHost(host: string): SiteSlug {
  return (SITE_DOMAINS as Record<string, SiteSlug>)[host] || 'main'
}

/**
 * Извлекает поддомен из host
 */
export function getSubdomain(host: string): string | null {
  const parts = host.split('.')
  if (parts.length > 2) {
    return parts[0]
  }
  return null
}

/**
 * Fallback определение сайта
 */
export function detectSite(host: string): SiteSlug {
  // Сначала проверяем точное совпадение
  if ((SITE_DOMAINS as Record<string, SiteSlug>)[host]) {
    return (SITE_DOMAINS as Record<string, SiteSlug>)[host]
  }

  // Затем проверяем поддомен
  const subdomain = getSubdomain(host)
  if (subdomain === 'promo') return 'promo'

  return 'main'
}
