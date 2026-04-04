// Singleton pattern для Payload instance
// Предотвращает пересоздание инстанса при каждом запросе

import { getPayload } from 'payload'
import configPromise from '@payload-config'

let payloadInstance: any = null
let initPromise: Promise<any> | null = null
let initTime: number = 0

export const getPayloadInstance = async () => {
  // Если инстанс есть и он свежий (менее 5 минут), возвращаем его
  const now = Date.now()
  if (payloadInstance && (now - initTime) < 5 * 60 * 1000) {
    return payloadInstance
  }
  
  if (!initPromise) {
    initPromise = getPayload({ config: configPromise }).then(instance => {
      payloadInstance = instance
      initTime = Date.now()
      console.log('[Payload] Instance created at', new Date().toISOString())
      return instance
    }).catch(error => {
      console.error('[Payload] Failed to create instance:', error)
      initPromise = null
      throw error
    })
  }
  
  return initPromise
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Payload] Graceful shutdown...')
  payloadInstance = null
  initPromise = null
  initTime = 0
})

process.on('SIGINT', () => {
  console.log('[Payload] Graceful shutdown...')
  payloadInstance = null
  initPromise = null
  initTime = 0
})
