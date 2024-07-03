'use client'
import { useAuth } from '@/hooks/useAuth'
import { UsersRound, UserRoundPlus, Router } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

const GroupDetails = ({ conversationId }: { conversationId: string }) => {
  const [groupDetails, setGroupDetails] = useState<any>()
  const [isAdmin, setIsAdmin] = useState(false)
  const { user: loggedInUser } = useAuth()
  const router = useRouter()


  useEffect(() => {
    fetchGroupDetails()
  }, [])

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/details`)
      const parsedResponse = await response.json()
      setGroupDetails(parsedResponse.data)
      if(loggedInUser) {
        const user = parsedResponse.data.users.find((u: any) => u.user_id === loggedInUser.id)
        if (user && user.user_role === 'admin') {
          setIsAdmin(true)
        }
      }
    } catch (error) {
      console.error('Error fetching Group Details:', error)
    }
  }

  const handleLeaveGroup = async () => {
    // TODO: Handle leaving group
  }

  const handleRemoveUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/users/${userId}/remove`, {
        method: 'DELETE',
      })

      toast({
        title: 'Error',
        description: 'User removed successfully.',
        variant: 'destructive'
      })
    
      if (response.ok) {
        fetchGroupDetails()
      }
    } catch (error) {
      console.error('Error removing user:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong while removing user.',
        variant: 'destructive'
      })
    }
  }

  if (!groupDetails) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-md">
      <div className="flex flex-col items-center mb-6">
        {groupDetails.image ? (
          <img src={groupDetails.image} alt={groupDetails.name} className="w-24 h-24 rounded-full mr-4" />
        ) : (
          <div className="bg-secondary w-24 h-24 mr-4 rounded-full flex items-center justify-center">
            <UsersRound className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">{groupDetails.name}</h2>
          <p className="text-gray-600">{groupDetails.description}</p>
        </div>
      </div>
      <hr />
      <div className='mt-4'>
        <div className='flex items-center justify-between'>
          <h3 className="text-xl font-semibold mb-4">Group Members</h3>
          <UserRoundPlus className='mr-4' onClick={() => router.push(`/chat/${conversationId}/add_users`)} />
        </div>
        <ul className="space-y-4">
          {groupDetails.users.map((user: any) => (
            <li key={user.user_id} className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
              <div>
                <p className="font-medium">{user.user.name}</p>
                <p className="text-sm text-gray-600">{user.user_role}</p>
              </div>
              {isAdmin && 
                <div>
                  <button className="px-4 py-2 bg-destructive text-white rounded-md" onClick={() => handleRemoveUser(user.user_id)}>Remove</button>
                </div>
              }
            </li>
          ))}
        </ul>
      </div>
      <div className='mt-4'>
        <button className="px-4 py-2 bg-info text-white rounded-md">Leave Group</button>
      </div>
    </div>
  )
}

export default GroupDetails