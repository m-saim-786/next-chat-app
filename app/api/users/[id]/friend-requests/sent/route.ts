import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const userId = parseInt(id, 10)

  if (!userId) {
    return new NextResponse('Invalid request', { status: 400 })
  }

  try {
    const sentFriendRequests = await prisma.friendship.findMany({
      where: { user_id: userId, status: 'pending' },
      select: { id: true, friend: true },
    })

    return NextResponse.json({ data: sentFriendRequests }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch received friend requests' }, { status: 500 })
  }
}
