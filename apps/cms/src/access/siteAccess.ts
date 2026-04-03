import { Access } from 'payload'
import { SiteSlug } from '../lib/sites'

/**
 * Проверка доступа с фильтрацией по сайту
 */
export const siteAccess = (options?: {
  allowedSites?: SiteSlug[]
  allowDeveloper?: boolean
}): Access => {
  return ({ req }) => {
    const user = req.user
    const site = (req.headers['x-site'] as SiteSlug) || 'main'

    // Developer имеет полный доступ
    if (options?.allowDeveloper !== false && user?.role === 'developer') {
      return true
    }

    // Admin видит только свой назначенный сайт
    if (user?.role === 'admin') {
      const userSite = user.assignedSite as SiteSlug
      if (!userSite || userSite !== site) {
        return false
      }
    }

    // Проверка разрешенных сайтов
    if (options?.allowedSites && !options.allowedSites.includes(site)) {
      return false
    }

    // Возвращаем фильтр по сайту
    return {
      site: {
        equals: site,
      },
    }
  }
}

/**
 * Только для developer
 */
export const developerOnly: Access = ({ req }) => {
  return req.user?.role === 'developer'
}

/**
 * Для staff (developer + admin своего сайта)
 */
export const siteStaff: Access = siteAccess()
