import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Role-based access control
    if (path.startsWith('/stores') || path.startsWith('/kpis')) {
      if (token?.role !== 'GM' && token?.role !== 'OPS_MANAGER') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (!token) return false
        return true
      }
    }
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)']
}
