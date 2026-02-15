import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Basic auth check - will be handled by NextAuth session in pages
  // This middleware just ensures we're on the right paths
  
  const path = req.nextUrl.pathname
  
  // Allow API routes and static files
  if (path.startsWith('/api') || 
      path.startsWith('/_next') || 
      path.startsWith('/favicon') ||
      path === '/login') {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)']
}
