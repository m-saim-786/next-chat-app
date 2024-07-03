'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from '../ui/use-toast'
import useFriends from '@/store/userFriendsStore'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { group } from 'console'

type FriendsListProps = { 
  createGroup?: boolean,
  title: string 
  isGroup?: boolean
  groupId?: number | string
}

const FriendsList = ({ createGroup = false, isGroup = false, title, groupId }: FriendsListProps) => {
  const router = useRouter()
  const { friends, setFriends } = useFriends()
  const { user: loggedInUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [groupName, setGroupName] = useState<string>('')
  const [groupDescription, setGroupDescription] = useState<string>('')

  useEffect(() => {
    if (loggedInUser) {
      fetchFriends(loggedInUser.id)
    }

    if(isGroup && !createGroup && groupId) {
      fetchGroupDetails()
    }
  }, [loggedInUser])

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`/api/conversations/${groupId}/details`)
      const parsedResponse = await response.json()  
      console.log(parsedResponse.data)   
      setGroupName(parsedResponse.data.name)
      setGroupDescription(parsedResponse.data.description) 
      setSelectedUsers(parsedResponse.data.users.map((user: any) => user.user_id).filter((id: number) => id !== loggedInUser?.id))
    } catch (error) {
      console.error('Error fetching Group Details:', error)
    }
  }

  const fetchFriends = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}/friends`)
      const parsedResponse = await response.json()
      setFriends(parsedResponse.data)
    } catch (error) {
      console.error('Error fetching non-friends:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong while fetching friends.',
        variant: 'destructive'
      })
    }
  }

  const filteredFriends = useMemo(() => {
    return friends.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [friends, searchQuery])

  const handleNewConversation = async (id: number) => {
    try {
      const conversation = await fetch('/api/conversations/chat', {
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

  const handleCheckboxChange = (userId: number) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId)
      } else {
        return [...prevSelected, userId]
      }
    })
  }

  const handleCreateGroup = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one friend.',
        variant: 'destructive',
      })
      return
    }

    try {
      const conversation = await fetch('/api/conversations/group', {
        method: 'POST',
        body: JSON.stringify({ 
          userIds: selectedUsers,
          creatorId: loggedInUser?.id,
          name: groupName,
          description: groupDescription
        }),
      }).then((res) => res.json())
      router.push(`/chat/${conversation.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      })
      router.push('/chat/new/group')
      console.error(error)
    }
  }

  const handleAddusersToGroup = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one friend.',
        variant: 'destructive',
      })
      return
    }
      
    try {
      const conversation = await fetch(`/api/conversations/${groupId}/users/add`, {
        method: 'POST',
        body: JSON.stringify({ 
          userIds: selectedUsers,
          creatorId: loggedInUser?.id
        }),
      }).then((res) => res.json())
      router.push(`/chat/${conversation.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      })
      router.push(`/chat/${groupId}/details`)
      console.error(error)
    }
  }

  return (
    <div className="w-2/3 p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Input
        type="text"
        className="w-full p-2 mb-4 border rounded"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isGroup && createGroup &&(
        <div className='flex items-center space-x-2'>
          <Input
            type="text"
            className="p-2 mb-4 border rounded"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Input
            type="text"
            className="p-2 mb-4 border rounded"
            placeholder="Group Description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {filteredFriends.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded shadow-md cursor-pointer mb-4 flex items-center">
            {isGroup ? (
              <div className='flex items-center'>
                <Checkbox 
                  id={`checkbox-${user.id}`}
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => handleCheckboxChange(user.id)} 
                />
                <label
                  htmlFor={`checkbox-${user.id}`}
                  className="ml-2 cursor-pointer peer-disabled:opacity-70"
                >
                  {user.name}
                </label>
              </div>
            ) : <span onClick={() => handleNewConversation(user.id)}>{user.name}</span>}
          </div>
        ))}
      </div>
      {
        isGroup && (
          createGroup ? 
            (<button onClick={handleCreateGroup} className="bg-blue-500 text-white p-2 rounded mt-4">
          Create Group
            </button>) : (
              <button onClick={handleAddusersToGroup} className="bg-blue-500 text-white p-2 rounded mt-4">
          Add Users
              </button>)
        )}
    </div>
  )
}

export default FriendsList