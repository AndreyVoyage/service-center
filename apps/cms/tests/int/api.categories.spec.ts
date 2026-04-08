import { describe, it, expect } from 'vitest'
import { getPayload } from 'payload'
import config from '@/payload.config'

describe('Categories API', () => {
  it('should return categories for public users', async () => {
    const payload = await getPayload({ config })
    
    const result = await payload.find({
      collection: 'categories',
      limit: 100,
    })
    
    expect(result).toBeDefined()
    expect(Array.isArray(result.docs)).toBe(true)
  })

  it('should have required fields', async () => {
    const payload = await getPayload({ config })
    
    const result = await payload.find({
      collection: 'categories',
      limit: 1,
    })
    
    if (result.docs.length > 0) {
      const category = result.docs[0]
      expect(category.title).toBeDefined()
      expect(category.slug).toBeDefined()
      expect(typeof category.title).toBe('string')
      expect(typeof category.slug).toBe('string')
    }
  })
})
