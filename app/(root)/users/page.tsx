import NonFriendsList from "@/components/users/NonFriendsList"
import RecievedFriendRequestList from "@/components/users/RecievedFriendRequestList"
import SentFriendRequestList from "@/components/users/SentFriendRequestList"

const Users = async () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-1/3 bg-white p-4 shadow-md flex flex-col space-y-4">
        <RecievedFriendRequestList />
        <hr />
        <SentFriendRequestList />
      </div>
      <NonFriendsList />
    </div>
  )
}

export default Users
