// Автоматический прогрев Payload при старте
// Устраняет 14s cold-start задержку

import { getPayload } from 'payload'
import configPromise from '@payload-config'

let isWarmed = false
let warmingPromise: Promise<void> | null = null

export const autoWarmup = async (): Promise<void> => {
  if (isWarmed) return
  
  if (warmingPromise) {
    return warmingPromise
  }
  
  warmingPromise = (async () => {
    console.log('[AutoWarmup] Starting...')
    const start = Date.now()
    
    try {
      const payload = await getPayload({ config: configPromise })
      
      // Параллельный прогрев всех globals
      await Promise.all([
        payload.findGlobal({ slug: 'hero' }).catch(() => null),
        payload.findGlobal({ slug: 'footer' }).catch(() => null),
        payload.findGlobal({ slug: 'contactForm' }).catch(() => null),
        payload.findGlobal({ slug: 'themeSettings' }).catch(() => null),
        payload.findGlobal({ slug: 'notifications' }).catch(() => null),
      ])
      
      // Прогрев коллекций
      await Promise.all([
        payload.find({ collection: 'services', limit: 1 }).catch(() => ({ docs: [] })),
        payload.find({ collection: 'reviews', limit: 1 }).catch(() => ({ docs: [] })),
        payload.find({ collection: 'users', limit: 1 }).catch(() => ({ docs: [] })),
      ])
      
      isWarmed = true
      console.log(`[AutoWarmup] ✅ Completed in ${Date.now() - start}ms`)
    } catch (error) {
      console.error('[AutoWarmup] ❌ Failed:', error)
      // Не бросаем ошибку — система работает с fallback
    }
  })()
  
  return warmingPromise
}

// Проверка статуса
export const isWarmupComplete = () => isWarmed
