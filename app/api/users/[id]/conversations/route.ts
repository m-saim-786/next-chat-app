import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params

  if (!id) {
    return new Response('Invalid request', { status: 400 })
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      conversation_type: 'personal',
      users: {
        some: {
          user_id: +id,
        },
      },
    },
    include: {
      users: { select: { user: true } },
    },
  })

  const result = conversations.map((conversation) => ({
    id: conversation.id,
    title: conversation.users.find((user) => user.user.id !== +id)?.user
      .name,
  }))

  return Response.json({ conversations: result })
}
