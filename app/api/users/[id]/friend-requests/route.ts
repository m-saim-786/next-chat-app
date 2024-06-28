import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const user_id = parseInt(id, 10)

  if (!user_id) {
    return new NextResponse('Invalid request', { status: 400 })
  }

  let body
  try {
    body = await request.json()
  } catch (error) {
    return new NextResponse('Invalid JSON', { status: 400 })
  }

  const { friend_id } = body
  if (!friend_id) {
    return new NextResponse('Friend ID is required', { status: 400 })
  }

  try {
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user_id: user_id, friend_id: friend_id },
          { user_id: friend_id, friend_id: user_id },
        ],
      },
    })

    if (existingFriendship) {
      return new NextResponse('Friend request already exists', { status: 400 })
    }

    const newFriendship = await prisma.friendship.create({
      data: {
        user_id,
        friend_id,
        status: 'pending',
      },
    })

    return NextResponse.json({ data: newFriendship }, { status: 201 })
  } catch (error) {
    console.error('Error creating friend request:', error)
    return new NextResponse('Failed to create friend request', { status: 500 })
  }
}
