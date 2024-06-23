"use client";

import { useEffect, useState } from "react";

type ConversationType = {
  id: number;
  title: string;
};

const useConversations = ({ userId }: { userId?: number }) => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/conversations`);
        const { conversations }: { conversations: ConversationType[] } = await response.json();
        setConversations(conversations);
      } catch (e) {
        console.error(e);
      }
    };
    fetchConversations();
  }, [userId]);

  return {
    conversations,
  };
};

export default useConversations;
