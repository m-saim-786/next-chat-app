import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string; requestId: string } }) {
  const { id, requestId } = params
  const userId = parseInt(id, 10)
  const friendRequestId = parseInt(requestId, 10)

  if (!userId || !friendRequestId) {
    return new NextResponse('Invalid request', { status: 400 })
  }

  try {
    const friendRequest = await prisma.friendship.findUnique({
      where: { id: friendRequestId },
    })

    if (!friendRequest) {
      return new NextResponse('Friend request not found', { status: 404 })
    }

    if (friendRequest.friend_id !== userId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    await prisma.friendship.delete({
      where: { id: friendRequestId },
    })

    return new NextResponse('Friend request declined', { status: 200 })
  } catch (error) {
    console.error('Error declining friend request:', error)
    return new NextResponse('Failed to decline friend request', { status: 500 })
  }
}
