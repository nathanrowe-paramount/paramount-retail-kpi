import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stores = await prisma.store.findMany({
      where: session.user.role === 'AREA_MANAGER' 
        ? { areaManagerId: session.user.id, active: true }
        : { active: true },
      include: { areaManager: true }
    })

    return NextResponse.json(stores)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
  }
}
