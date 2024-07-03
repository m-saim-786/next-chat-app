import GroupDetails from '@/components/chat/GroupDetails'

const RoomDetail = ({ params }: { params: { id: string } }) => {
  
  return (
    <GroupDetails conversationId={params.id} />
  )
}

export default RoomDetail