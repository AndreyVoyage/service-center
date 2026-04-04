import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startTime = Date.now()
  
  try {
    // Проверка доступности CMS
    const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'
    const cmsResponse = await fetch(`${cmsUrl}/api/health`, {
      cache: 'no-store',
    }).catch(() => null)
    
    const cmsHealthy = cmsResponse?.ok || false
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      latency: Date.now() - startTime,
      services: {
        web: 'ok',
        cms: cmsHealthy ? 'connected' : 'disconnected',
      },
    }, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 503 })
  }
}
