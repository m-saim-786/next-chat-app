"use client";
import React, { Suspense } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import Conversation from "./Conversation";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import useConversations from "@/hooks/useConversations";

const Conversations = () => {
  const { user } = useAuth();
  const router = useRouter();

  const { conversations } = useConversations({ userId: user?.id });

  // const createConversation = async (id: number) => {
  //   try {
  //     const conversation = await fetch("/api/conversations", {
  //       method: "POST",
  //       body: JSON.stringify({ userId: user?.id, otherUserId: id }),
  //     }).then((res) => res.json());
  //     router.push(`/chat/${conversation.id}`);
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Something went wrong.",
  //       variant: "destructive",
  //     })
  //     router.push(`/chat`);
  //     console.error(error);
  //   }
  // };

  const handleClick = async (id: number) => {
    // await createConversation(id)
    router.push(`/chat/${id}`);
  };

  return (
    <Card className="w-[30rem] rounded-none">
      <CardHeader className="bg-slate-100 flex flex-row justify-between align-bottom">
        <span>Conversations</span>
        <PencilIcon
          size={16}
          onClick={() => {}}
          className="cursor-pointer hover:text-slate-500"
        />
      </CardHeader>
      {conversations.map((conversation) => (
        <Conversation
          key={conversation.id}
          title={conversation.title}
          onClick={() => handleClick(conversation.id)}
        />
      ))}
    </Card>
  );
};

export default Conversations;
