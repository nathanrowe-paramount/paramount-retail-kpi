import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Overview', roles: ['GM', 'OPS_MANAGER', 'AREA_MANAGER', 'STORE_MANAGER'] },
    { href: '/dashboard/stores', label: 'Stores', roles: ['GM', 'OPS_MANAGER'] },
    { href: '/dashboard/targets', label: 'Set Targets', roles: ['AREA_MANAGER'] },
    { href: '/dashboard/reviews', label: 'Reviews', roles: ['GM', 'OPS_MANAGER', 'AREA_MANAGER'] },
    { href: '/dashboard/leaderboard', label: 'Leaderboard', roles: ['GM', 'OPS_MANAGER', 'AREA_MANAGER', 'STORE_MANAGER'] },
  ]

  const userNavItems = navItems.filter(item => 
    item.roles.includes(session.user.role)
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white">
        <div className="p-6">
          <h1 className="text-xl font-bold">Paramount KPI</h1>
          <p className="text-sm text-slate-400 mt-1">{session.user.role}</p>
        </div>
        
        <nav className="mt-6">
          {userNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-6 py-3 text-sm hover:bg-slate-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-sm text-slate-400">{session.user.email}</p>
          <Link 
            href="/api/auth/signout"
            className="text-sm text-red-400 hover:text-red-300 mt-2 block"
          >
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
