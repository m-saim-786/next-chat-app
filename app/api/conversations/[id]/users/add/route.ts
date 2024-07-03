import { prisma } from '@/lib/prisma'

export const POST = async (request: Request, { params }: { params: { id: string; userId: string } }) => {
  const { id } = params
  const conversationId = parseInt(id, 10)

  if (!conversationId) {
    return new Response('Invalid request', { status: 400 })
  }

  try {
    const body = await request.json()
    const { userIds, creatorId }: { userIds: number[]; creatorId: number; name: string; description: string } = body

    if (!userIds || !creatorId) {
      return new Response('Invalid request', { status: 400 })
    }

    const admin = await prisma.user.findFirst({ where: { id: creatorId } })

    if (!admin) {
      return new Response('Creator not found', { status: 400 })
    }

    const users = await prisma.user.findMany({ where: { id: { in: userIds } } })

    if (users.length !== userIds.length) {
      return new Response('One or more users not found', { status: 400 })
    }

    const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } })

    if (!conversation) {
      return new Response('Conversation not found', { status: 404 })
    }

    // Fetch existing users in the conversation
    const existingUsers = await prisma.conversationUser.findMany({
      where: { conversation_id: conversationId },
      select: { user_id: true },
    })

    const existingUserIds = existingUsers.map((cu) => cu.user_id)

    // Filter out users who are already in the conversation
    const newUserIds = userIds.filter((userId) => !existingUserIds.includes(userId))

    if (newUserIds.length === 0) {
      return new Response('All users are already part of the conversation', { status: 400 })
    }

    await prisma.conversationUser.createMany({
      data: newUserIds.map((userId) => ({ user_id: userId, conversation_id: conversation.id })),
    })

    await Promise.all(
      newUserIds.map((userId) => {
        const user = users.find((u) => u.id === userId)
        return prisma.message.create({
          data: {
            conversation_id: conversation.id,
            text: `${admin.name} added ${user?.name}`,
            message_actor_type: 'system',
            user_id: creatorId,
          },
        })
      })
    )

    return new Response(JSON.stringify(conversation), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
