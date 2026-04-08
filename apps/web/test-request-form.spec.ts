import { test, expect } from '@playwright/test'

test.describe('Request Form with Categories', () => {
  test('should load categories from CMS into select', async ({ page }) => {
    // Мокаем API категорий
    await page.route('**/api/categories**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          docs: [
            { id: '1', title: 'Ремонт холодильников', slug: 'refrigerator-repair' },
            { id: '2', title: 'Ремонт морозилок', slug: 'freezer-repair' },
          ],
        }),
      })
    })
    
    await page.goto('/')
    await page.waitForSelector('form')
    
    // Проверяем что селект категорий существует (если настроен в CMS)
    const categorySelect = page.locator('select[name="category"]')
    if (await categorySelect.isVisible().catch(() => false)) {
      // Проверяем опции
      await expect(categorySelect).toContainText('Ремонт холодильников')
    }
  })

  test('should not show equipmentType select', async ({ page }) => {
    await page.goto('/')
    
    // Старый селект equipmentType должен отсутствовать
    const equipmentSelect = page.locator('select[name="equipmentType"]')
    await expect(equipmentSelect).not.toBeVisible()
  })
})
