import { describe, it, expect, vi } from 'vitest'
import { getHero, getFooter, fetchWithTimeout, fetchWithRetry } from './api'

describe('API Client', () => {
  it('getHero should return fallback on timeout', async () => {
    // Мокаем fetch с задержкой
    global.fetch = vi.fn(() => 
      new Promise(resolve => setTimeout(() => resolve(new Response('{}')), 10000))
    )
    
    const hero = await getHero()
    expect(hero).toHaveProperty('title')
    expect(hero?.isActive).toBe(true)
  })
  
  it('fetchWithTimeout should throw on timeout', async () => {
    global.fetch = vi.fn(() => 
      new Promise(resolve => setTimeout(resolve, 10000))
    )
    
    await expect(
      fetchWithTimeout('http://test', {}, 100)
    ).rejects.toThrow('timeout')
  })

  it('fetchWithRetry should retry on failure', async () => {
    let attempts = 0
    global.fetch = vi.fn(() => {
      attempts++
      if (attempts < 2) {
        return Promise.reject(new Error('Network error'))
      }
      return Promise.resolve(new Response('{"success": true}'))
    })

    const result = await fetchWithRetry('http://test', {})
    expect(result).toEqual({ success: true })
    expect(attempts).toBe(2)
  })
})
