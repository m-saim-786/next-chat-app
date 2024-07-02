import { prisma } from '@/lib/prisma'

export const POST = async (request: Request) => {
  const body = await request.json()
  const { userId, otherUserId } = body

  if (!userId || !otherUserId) {
    return new Response('Invalid request', { status: 400 })
  }

  if (userId === otherUserId) {
    return new Response('Invalid request', { status: 400 })
  }

  const existingConversation = await prisma.conversation.findFirst({
    where: {
      conversation_type: 'personal',
      users: {
        every: {
          user_id: {
            in: [userId, otherUserId],
          },
        },
      },
    },
  })

  if (existingConversation) {
    return Response.json(existingConversation)
  }

  const conversation = await prisma.conversation.create({
    data: { conversation_type: 'personal' },
  })

  await prisma.conversationUser.createMany({
    data: [
      { user_id: userId, conversation_id: conversation.id },
      { user_id: otherUserId, conversation_id: conversation.id },
    ],
  })

  return Response.json(conversation)
}

