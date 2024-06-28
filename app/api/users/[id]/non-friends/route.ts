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
          { user_id: userId },
          { friend_id: userId },
        ],
      },
      select: { user_id: true, friend_id: true },
    })

    const friendIds = new Set(
      friends.flatMap(f => [f.user_id, f.friend_id]).filter(id => id !== userId)
    )

    const nonFriends = await prisma.user.findMany({
      where: {
        id: {
          notIn: Array.from(friendIds),
          not: userId,
        },
      },
    })

    return NextResponse.json({ data: nonFriends }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch non-friends' }, { status: 500 })
  }
}
