import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectSite } from './lib/sites'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const site = detectSite(host)

  // Добавляем site в headers для использования в API
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-site', site)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
