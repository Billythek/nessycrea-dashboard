import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Serve site HTML directly at root
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/site/index.html'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
