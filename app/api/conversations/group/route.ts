import { prisma } from '@/lib/prisma'

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const { userIds, creatorId, name, description }: { userIds: number[]; creatorId: number; name: string; description: string } = body

    if (!userIds || !creatorId || !name || !description) {
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

    const conversation = await prisma.conversation.create({
      data: {
        conversation_type: 'group',
        name,
        description
      },
    })

    await prisma.conversationUser.create({
      data: { user_id: creatorId, conversation_id: conversation.id, user_role: 'admin' }
    })

    await prisma.conversationUser.createMany({
      data: userIds.map(userId => ({ user_id: userId, conversation_id: conversation.id }))
    })

    await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        text: `${admin.name} created ${conversation.name}`,
        message_actor_type: 'system',
        user_id: creatorId
      }
    })

    await Promise.all(users.map(user => {
      return prisma.message.create({
        data: {
          conversation_id: conversation.id,
          text: `${admin.name} added ${user.name}`,
          message_actor_type: 'system',
          user_id: creatorId
        }
      })
    }))

    return new Response(JSON.stringify(conversation), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
