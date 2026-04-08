import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectSite } from './lib/sites'

// CORS headers для публичных API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Публичные API endpoints (доступны без CORS ограничений)
const PUBLIC_API_PATHS = [
  '/api/categories',
  '/api/services',
  '/api/reviews',
  '/api/globals/hero',
  '/api/globals/footer',
  '/api/globals/contactForm',
]

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const site = detectSite(host)

  // Проверяем, является ли запрос публичным API
  const isPublicApi = PUBLIC_API_PATHS.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Обработка preflight (OPTIONS) запросов для CORS
  if (request.method === 'OPTIONS' && isPublicApi) {
    return new NextResponse(null, { 
      status: 200,
      headers: corsHeaders,
    })
  }

  // Добавляем site в headers для использования в API
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-site', site)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Добавляем CORS headers для публичных API
  if (isPublicApi) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }

  return response
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
