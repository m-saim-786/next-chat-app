'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@prisma/client'

const NonFriendsList = () => {
  const { user: loggedInUser } = useAuth()
  const [nonFriends, setNonFriends] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    if (loggedInUser) {
      fetchNonFriends(loggedInUser.id)
    }
  }, [loggedInUser])

  const fetchNonFriends = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}/non-friends`)
      const parsedResponse = await response.json()
      setNonFriends(parsedResponse.data)
    } catch (error) {
      console.error('Error fetching non-friends:', error)
    }
  }

  const filteredNonFriends = nonFriends.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendRequest = async (friendId: number) => {
    try {
      const response = await fetch(`/api/users/${loggedInUser?.id}/friend-requests`, {
        method: 'POST',
        body: JSON.stringify({ friend_id: friendId }),
      })
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Error sending friend request:', error)
    }
  }

  return (
    <div className="w-2/3 p-4">
      <h2 className="text-xl font-semibold mb-4">Non-Friend Users</h2>
      <input
        type="text"
        className="w-full p-2 mb-4 border rounded"
        placeholder="Search for users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="grid grid-cols-1 gap-4">
        {filteredNonFriends.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded shadow-md flex items-center justify-between">
            <span>{user.name}</span>
            <button className="bg-info text-white px-4 py-2 rounded" onClick={() => handleSendRequest(user.id)}>Send Request</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NonFriendsList