"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth';
import { User } from '@prisma/client';

type Friendship = {
  id: number;
  user_id: number;
  friend_id: number;
  status: string;
  user: User;
  friend: User;
};

const RecievedFriendRequestList = () => {
  const [receivedRequests, setReceivedRequests] = useState<Friendship[]>([]);
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    if (loggedInUser) {
      fetchReceivedRequests(loggedInUser.id);
    }
  }, [loggedInUser]);

  const fetchReceivedRequests = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}/friend-requests/recieved`);
      const parsedResponse = await response.json();
      setReceivedRequests(parsedResponse.data);
    } catch (error) {
      console.error('Error fetching received requests:', error);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const response = await fetch(`/api/users/${loggedInUser?.id}/friend-requests/${requestId}/accept`, {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    try {
      const response = await fetch(`/api/users/${loggedInUser?.id}/friend-requests/${requestId}/decline`, {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  }

  if(receivedRequests.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Sent Friend Requests</h2>
        <p>No sent friend requests</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Received Friend Requests</h2>
      <div className="space-y-2">
        {receivedRequests.map((request) => (
          <div key={request.id} className="bg-gray-200 p-2 rounded flex justify-between items-center">
            <span>{request.user.name}</span>
            <div className="flex justify-end">
              <button className="bg-success text-white px-4 py-2 rounded mx-2" onClick={() => handleAcceptRequest(request.id)}>Accept</button>
              <button className="bg-danger text-white px-4 py-2 rounded mx-2" onClick={() => handleDeclineRequest(request.id)}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecievedFriendRequestList