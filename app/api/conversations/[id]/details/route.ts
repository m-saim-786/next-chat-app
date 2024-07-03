import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const conversationId = parseInt(id, 10)

  if (!conversationId) {
    return new NextResponse('Invalid request', { status: 400 })
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: {
          include: {
            user: true
          },
        },
      },
    })

    return NextResponse.json({ data: conversation }, { status: 200 })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return new NextResponse('Failed to fetch conversation', { status: 500 })
  }
}
