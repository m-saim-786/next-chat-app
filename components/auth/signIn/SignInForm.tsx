'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@prisma/client'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from 'zod'

const SignInSchema = z.object({
  email: z.string().email(),
})

const SignInForm = () => {
  const [email, setEmail] = useState('')

  const { handleLogin } = useAuth()

  const signIn = async (data: { email: string }) => {
    try {
      const user: User = await fetch('/api/auth/signIn', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((res) => res.json())
      handleLogin(user)
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      })
      console.error(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = SignInSchema.parse({ email })
    await signIn(data)
  }

  return (
    <Card className="w-[30rem] p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-center">Sign In</h3>
        <Input
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
      <div className="mt-3">
        {'Don\'t have an account yet? '} <Link href="/signUp">Sign Up</Link>
      </div>
    </Card>
  )
}

export default SignInForm
