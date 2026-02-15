import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function TargetsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'AREA_MANAGER') {
    redirect('/dashboard')
  }

  // Get AM's stores
  const stores = await prisma.store.findMany({
    where: { areaManagerId: session.user.id, active: true }
  })

  // Get KPIs
  const kpis = await prisma.kpi.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { category: { sortOrder: 'asc' } }
  })

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Set Monthly Targets</h1>
        <div className="text-sm text-slate-500">
          {now.toLocaleString('default', { month: 'long' })} {currentYear}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800">
          <strong>Instructions:</strong> Set targets for each KPI for your stores. 
          Targets should be challenging but achievable. Store Managers will be graded against these targets.
        </p>
      </div>

      {stores.map((store) => (
        <div key={store.id} className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-900">{store.name}</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="border border-slate-200 rounded-md p-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {kpi.name}
                  </label>
                  <p className="text-xs text-slate-500 mb-2">{kpi.category.name}</p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      defaultValue={kpi.targetDefault || ''}
                      className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                      placeholder={`Target ${kpi.unit}`}
                    />
                    <span className="ml-2 text-sm text-slate-500">{kpi.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800">
                Save Targets for {store.name}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
