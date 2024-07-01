import { FriendshipProps } from '@/types/schemaTypes';
import { User } from '@prisma/client';
import { create } from 'zustand';

type UserFriendsState = {
  friends: User[]
  nonFriends: User[]
  receivedRequests: FriendshipProps[]
  sentRequests: FriendshipProps[]
  setFriends: (friends: User[]) => void
  setNonFriends: (nonFriends: User[]) => void
  setReceivedRequests: (receivedRequests: FriendshipProps[]) => void
  setSentRequests: (sentRequests: FriendshipProps[]) => void
  addFriend: (friend: User) => void
  sendFriendRequest: (friendShip: FriendshipProps) => void
  acceptFriendRequest: (friendShip: FriendshipProps) => void
  declineFriendRequest: (requestId: number) => void
}

const useFriends = create<UserFriendsState>((set) => ({
  friends: [],
  nonFriends: [],
  receivedRequests: [],
  sentRequests: [],
  setFriends: (friends: User[]) => set({ friends }),
  setNonFriends: (nonFriends: User[]) => set({ nonFriends }),
  setReceivedRequests: (receivedRequests: FriendshipProps[]) => set({ receivedRequests }),
  setSentRequests: (sentRequests: FriendshipProps[]) => set({ sentRequests }),
  addFriend: (friend: User) => set((state) => ({ friends: [...state.friends, friend] })),
  sendFriendRequest: (friendShip: FriendshipProps) => set((state) => ({
    nonFriends: state.nonFriends.filter((nonFriend) => nonFriend.id !== friendShip.friend.id),
    sentRequests: [...state.sentRequests, friendShip],
  })),
  acceptFriendRequest: (friendShip: FriendshipProps) => set((state) => ({
    friends: [...state.friends, friendShip.user],
    receivedRequests: state.receivedRequests.filter((request) => request.id !== friendShip.id),
  })),
  declineFriendRequest: (requestId: number) => set((state) => ({
    receivedRequests: state.receivedRequests.filter((request) => request.id !== requestId),
  })),
}))

export default useFriends;
