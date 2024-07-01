import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const userId = parseInt(id, 10)

  if (!userId) {
    return new NextResponse('Invalid request', { status: 400 })
  }

  try {
    const receivedFriendRequests = await prisma.friendship.findMany({
      where: { friend_id: userId, status: 'pending' },
      select: { id: true, user: true }
    })

    return NextResponse.json({ data: receivedFriendRequests }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch received friend requests' }, { status: 500 })
  }
}
