// apps/web/src/app/api/health/route.ts
// Health check endpoint для Docker и мониторинга

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version: string
  services: {
    cms: 'connected' | 'disconnected'
    web: 'ok' | 'error'
  }
  uptime: number
}

export async function GET(): Promise<NextResponse> {
  const startTime = Date.now()
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

  try {
    // Проверка подключения к CMS
    let cmsStatus: 'connected' | 'disconnected' = 'disconnected'

    try {
      const cmsResponse = await fetch(`${cmsUrl}/api/health`, {
        cache: 'no-store',
        next: { revalidate: 0 },
      })
      cmsStatus = cmsResponse.ok ? 'connected' : 'disconnected'
    } catch {
      cmsStatus = 'disconnected'
    }

    const health: HealthStatus = {
      status: cmsStatus === 'connected' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        cms: cmsStatus,
        web: 'ok',
      },
      uptime: process.uptime(),
    }

    const statusCode = health.status === 'healthy' ? 200 : 503

    return NextResponse.json(health, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
