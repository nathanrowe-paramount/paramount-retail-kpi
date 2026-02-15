import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Get stores based on role
  let stores: any[] = []
  
  if (session.user.role === 'GM' || session.user.role === 'OPS_MANAGER') {
    stores = await prisma.store.findMany({
      where: { active: true },
      include: { areaManager: true }
    })
  } else if (session.user.role === 'AREA_MANAGER') {
    stores = await prisma.store.findMany({
      where: { areaManagerId: session.user.id, active: true }
    })
  } else {
    // Store Manager - find their store
    const manager = await prisma.manager.findFirst({
      where: { userId: session.user.id },
      include: { store: true }
    })
    if (manager) {
      stores = [manager.store]
    }
  }

  // Get current month
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-500">Total Stores</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stores.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-500">Current Period</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{now.toLocaleString('default', { month: 'long' })} {currentYear}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-slate-500">Pending Reviews</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">-</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Your Stores</h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Store</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">State</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Area Manager</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {store.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {store.state}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {store.areaManager?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <Link href={`/dashboard/stores/${store.id}`} className="text-blue-600 hover:text-blue-900">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
