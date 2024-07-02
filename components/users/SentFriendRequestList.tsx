'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import useFriends from '@/store/userFriendsStore'
import { FriendshipProps } from '@/types/schemaTypes'
import { toast } from '../ui/use-toast'


const SentFriendRequestList = () => {
  const { sentRequests, setSentRequests, cancelFriendRequest } = useFriends()
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
      toast({
        title: 'Error',
        description: 'Something went wrong while fetching pending friend requests.',
        variant: 'destructive'
      })
    }
  }

  const handleCancelRequest = async (request: FriendshipProps) => {
    try {
      await fetch(`/api/users/${request.friend.id}/friend-requests/${request.id}/decline`, {
        method: 'GET',
      })
      cancelFriendRequest(request)
      toast({
        title: 'Success',
        description: 'Friend request cancelled successfully.',
        variant: 'destructive'
      })
    } catch (error) {
      console.error('Error declining friend request:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong while cancelling friend request.',
        variant: 'destructive'
      })
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
            <div>
              <span className="bg-warning text-white px-4 py-2 rounded mx-2">Pending</span>
              <button className="bg-danger text-white px-4 py-2 rounded mx-2" onClick={() => handleCancelRequest(request)}>Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SentFriendRequestList
