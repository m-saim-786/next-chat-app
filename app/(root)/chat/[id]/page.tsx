import { MAX_MESSAGE_LIMIT } from '@/app/api/conversations/[id]/messages/route'
import Chat from '@/components/chat/Chat'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params

  const conversation = await prisma.conversation.findFirst({
    where: { id: +id },
    include: {
      users: { select: { user: true } },
    },
  })

  if (!conversation) {
    redirect('/')
  }

  const messageCount = await prisma.message.count({
    where: { conversation_id: +id },
  })

  const messageRecords = await prisma.message.findMany({
    where: { conversation_id: +id },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { created_at: 'asc' },
    take: MAX_MESSAGE_LIMIT,
    skip: Math.max(messageCount - MAX_MESSAGE_LIMIT, 0),
  })

  const messages = messageRecords.map((message) => ({
    id: message.id,
    username: message.user.name,
    message: message.text,
    createdAt: message.created_at,
  }))

  return (
    <Chat
      messages={messages}
      titles={conversation.users.map((user) => ({
        id: user.user.id,
        title: user.user.name,
      }))}
      roomId={conversation.id}
    />
  )
}

export default page
