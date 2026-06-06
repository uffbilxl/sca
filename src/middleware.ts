import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, verifySessionCookie } from '@/lib/adminAuth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isLoginPage = pathname === '/admin/login'
  const isLoginApi = pathname === '/api/admin/login'

  if (!isLoginPage && !isLoginApi) {
    const cookie = request.cookies.get(ADMIN_COOKIE)
    if (!cookie?.value || !(await verifySessionCookie(cookie.value))) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
