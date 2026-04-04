import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('homepage should load under 5 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('http://localhost:3002')
    const duration = Date.now() - start
    
    console.log(`[Perf] Homepage loaded in ${duration}ms`)
    expect(duration).toBeLessThan(5000)
    
    // Проверить что основные секции отобразились
    await expect(page.locator('h1')).toBeVisible()
  })

  test('CMS API should respond under 2 seconds after warmup', async ({ request }) => {
    // Сначала прогрев
    const warmupStart = Date.now()
    const warmupResponse = await request.get('http://localhost:3001/api/health')
    const warmupDuration = Date.now() - warmupStart
    
    console.log(`[Perf] Warmup took ${warmupDuration}ms`)
    expect(warmupResponse.status()).toBe(200)
    
    // Последующие запросы должны быть быстрыми
    for (let i = 0; i < 3; i++) {
      const start = Date.now()
      const response = await request.get('http://localhost:3001/api/globals/hero')
      const duration = Date.now() - start
      
      console.log(`[Perf] Hero request ${i + 1} took ${duration}ms`)
      expect(response.status()).toBe(200)
      expect(duration).toBeLessThan(2000)
    }
  })
})
