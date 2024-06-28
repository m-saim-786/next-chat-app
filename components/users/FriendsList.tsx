'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { toast } from '../ui/use-toast'

const FriendsList = () => {
  const router = useRouter()
  const { user: loggedInUser } = useAuth()
  const [friends, setFriends] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    if (loggedInUser) {
      fetchFriends(loggedInUser.id)
    }
  }, [loggedInUser])

  const fetchFriends = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}/friends`)
      const parsedResponse = await response.json()
      setFriends(parsedResponse.data)
    } catch (error) {
      console.error('Error fetching non-friends:', error)
    }
  }

  const filteredFriends = friends.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewConversation = async (id: number) => {
    try {
      const conversation = await fetch('/api/conversations', {
        method: 'POST',
        body: JSON.stringify({ userId: loggedInUser?.id, otherUserId: id }),
      }).then((res) => res.json())
      router.push(`/chat/${conversation.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      })
      router.push('/chat')
      console.error(error)
    }
  }

  return (
    <div className="w-2/3 p-4">
      <h2 className="text-xl font-semibold mb-4">Friends</h2>
      <input
        type="text"
        className="w-full p-2 mb-4 border rounded"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="grid grid-cols-1 gap-4">
        {filteredFriends.map((user) => (
          <div onClick={() => handleNewConversation(user.id)} key={user.id} className="bg-white p-4 rounded shadow-md cursor-pointer mb-4">
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendsList