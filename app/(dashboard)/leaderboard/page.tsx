import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Get all stores with mock scores for now
  const stores = await prisma.store.findMany({
    where: { active: true },
    include: { managers: { include: { user: true } } }
  })

  // Mock data - replace with actual scoring logic
  const storeScores = stores.map((store, index) => ({
    ...store,
    overallScore: 85 - (index * 3), // Mock descending scores
    grade: index < 4 ? 'Exceeds' : index < 14 ? 'Meets' : 'Below',
    trend: Math.random() > 0.5 ? 'up' : 'down'
  })).sort((a, b) => b.overallScore - a.overallScore)

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Leaderboard</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Store Rankings</h2>
          <p className="text-sm text-slate-500">March 2026</p>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Store</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Overall Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {storeScores.map((store, index) => {
              const isCurrentUserStore = store.managers.some(m => m.userId === session.user.id)
              return (
                <tr 
                  key={store.id} 
                  className={isCurrentUserStore ? 'bg-blue-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    #{index + 1}
                    {index < 3 && <span className="ml-2">🏆</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {store.name}
                    {isCurrentUserStore && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold">
                    {store.overallScore}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      store.grade === 'Exceeds' ? 'bg-green-100 text-green-800' :
                      store.grade === 'Meets' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {store.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {store.trend === 'up' ? '↑' : '↓'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-900">Top Performer</h3>
          <p className="text-2xl font-bold text-green-800 mt-2">{storeScores[0]?.name}</p>
          <p className="text-green-700">{storeScores[0]?.overallScore}% overall score</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900">Most Improved</h3>
          <p className="text-2xl font-bold text-blue-800 mt-2">Alexandria</p>
          <p className="text-blue-700">+12% vs last month</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Network Average</h3>
          <p className="text-2xl font-bold text-slate-800 mt-2">78%</p>
          <p className="text-slate-700">Across all 20 stores</p>
        </div>
      </div>
    </div>
  )
}
