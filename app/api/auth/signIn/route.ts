import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'
import * as z from 'zod'

const SignInSchema = z.object({
  email: z.string().email(),
}) satisfies z.Schema<Omit<User, 'id' | 'name'>>

export const POST = async (request: Request) => {
  const { email } = SignInSchema.parse(await request.json())
  
  const user = await prisma.user.findFirst({ where: { email } })

  if (!user) {
    return new Response('User not found', { status: 404 })
  }

  return Response.json(user)
}

