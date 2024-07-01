import { Friendship, User } from '@prisma/client'

export interface FriendshipProps extends Friendship  {
  user: User
  friend: User
}
