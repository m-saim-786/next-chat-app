'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@prisma/client'
import useFriends from '@/store/userFriendsStore'


const SentFriendRequestList = () => {
  const { sentRequests, setSentRequests } = useFriends()
  const { user: loggedInUser } = useAuth()

  useEffect(() => {
    if (loggedInUser) {
      fetchSentFriends(loggedInUser.id)
    }
  }, [loggedInUser])

  const fetchSentFriends = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}/friend-requests/sent`)
      const parsedResponse = await response.json()
      setSentRequests(parsedResponse.data)
    } catch (error) {
      console.error('Error fetching pending friends:', error)
    }
  }

  if(sentRequests.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Sent Friend Requests</h2>
        <p>No sent friend requests</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Sent Friend Requests</h2>
      <div className="space-y-2">
        {sentRequests.map((request) => (
          <div key={request.id} className="bg-gray-200 p-2 rounded flex justify-between items-center">
            <span>{request.friend.name}</span>
            <span className="bg-warning text-white px-4 py-2 rounded mx-2">Pending</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SentFriendRequestList
