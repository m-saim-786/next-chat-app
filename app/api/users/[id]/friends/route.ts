// /pages/api/users/[id]/non-friends.js

import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const userId = parseInt(id, 10)

  if (!userId) {
    return new NextResponse('Invalid request', { status: 400 })
  }

  try {
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { user_id: userId, status: 'accepted' },
          { friend_id: userId, status: 'accepted' },
        ],
      },
      select: { user: true, friend: true },
    })

    const friendUsers = friends.map(friendship => 
      friendship.user.id === userId ? friendship.friend : friendship.user
    )

    return NextResponse.json({ data: friendUsers }, { status: 200 })
  } catch (error) {
    console.error('Error fetching friends:', error)
    return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 })
  }
}
