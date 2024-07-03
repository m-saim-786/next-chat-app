import FriendsList from '@/components/users/FriendsList'
import React from 'react'

const AddUsersToGroup = ({ params }: { params: { id: string } }) => {
  return (
    <FriendsList title="Add Users to Group" createGroup={false} isGroup={true} groupId={params.id} />
  )
}

export default AddUsersToGroup