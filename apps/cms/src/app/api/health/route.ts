import { NextResponse } from 'next/server'
import { getPayloadInstance } from '@/lib/payload-singleton'
import { autoWarmup, isWarmupComplete } from '@/lib/auto-warmup'

// Авто-прогрев при старте
autoWarmup().catch(console.error)

export const dynamic = 'force-dynamic'

// In-memory кэш для прогретых данных
let warmedUpData: any = null
let warmUpTime = 0
const WARMUP_TTL = 300000 // 5 минут

export async function GET() {
  const start = Date.now()
  
  try {
    const payload = await getPayloadInstance()
    
    // Если данные прогреты и свежие, используем их
    if (warmedUpData && (Date.now() - warmUpTime) < WARMUP_TTL) {
      return NextResponse.json({
        status: 'ok',
        warmed: true,
        responseTime: Date.now() - start,
        timestamp: new Date().toISOString(),
      })
    }
    
    // Прогрев всех globals (параллельно)
    const [hero, footer, contactForm] = await Promise.all([
      payload.findGlobal({ slug: 'hero' }).catch(() => null),
      payload.findGlobal({ slug: 'footer' }).catch(() => null),
      payload.findGlobal({ slug: 'contactForm' }).catch(() => null),
    ])
    
    // Прогрев коллекций (параллельно)
    const [services, reviews] = await Promise.all([
      payload.find({ collection: 'services', limit: 1 }).catch(() => ({ docs: [] })),
      payload.find({ collection: 'reviews', limit: 1 }).catch(() => ({ docs: [] })),
    ])
    
    warmedUpData = { hero, footer, contactForm, services, reviews }
    warmUpTime = Date.now()
    
    const totalTime = Date.now() - start
    
    return NextResponse.json({
      status: 'ok',
      warmed: isWarmupComplete(),
      warmUpTime: totalTime,
      timestamp: new Date().toISOString(),
      data: {
        hero: !!hero,
        footer: !!footer,
        contactForm: !!contactForm,
        servicesCount: services.docs.length,
        reviewsCount: reviews.docs.length,
      }
    })
  } catch (error) {
    console.error('[Health] Error:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - start,
      },
      { status: 500 }
    )
  }
}
