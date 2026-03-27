// apps/cms/src/app/api/health/route.ts
// Health check endpoint для Docker и мониторинга

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version: string
  services: {
    database: 'connected' | 'disconnected'
    api: 'ok' | 'error'
  }
  uptime: number
}

export async function GET(): Promise<NextResponse> {
  const startTime = Date.now()

  try {
    // Проверка подключения к БД (если есть глобальный доступ к payload)
    let dbStatus: 'connected' | 'disconnected' = 'connected'

    try {
      // Здесь можно добавить реальную проверку БД
      // const result = await payload.find({ collection: 'users', limit: 1 })
      dbStatus = 'connected'
    } catch {
      dbStatus = 'disconnected'
    }

    const health: HealthStatus = {
      status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: dbStatus,
        api: 'ok',
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
