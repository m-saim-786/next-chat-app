import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest, { params }: { params: { id: string; userId: string } }) {
  const { id, userId } = params
  const conversationid = parseInt(id, 10)
  const removedUserId = parseInt(userId, 10)

  if (!conversationid || !removedUserId) {
    return new NextResponse('Invalid request', { status: 400 })
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationid },
  })

  if (!conversation) {
    return new NextResponse('Conversation not found', { status: 404 })
  }

  const removedUser = await prisma.user.findUnique({
    where: { id: removedUserId },
  })

  if (!removedUser) {
    return new NextResponse('User not found', { status: 404 })
  }

  try {
    await prisma.conversationUser.delete({
      where: {
        user_id_conversation_id: {
          user_id: removedUserId,
          conversation_id: conversationid,
        },
      },
    })

    await prisma.message.create({
      data: {
        conversation_id: conversationid,
        text: `${removedUser.name} has been removed from ${conversation.name}`,
        message_actor_type: 'system',
        user_id: removedUser.id,
      }
    })
    // TODO: Update the user_id to be the user who removed the user from the conversation when we add the JWT

    return new NextResponse('User removed from conversation', { status: 200 })
  } catch (error) {
    console.error('Error declining friend request:', error)
    return new NextResponse('Error removing user from conversation', { status: 500 })
  }
}
