"use client";
import { Card, CardHeader } from "../ui/card";
import Conversation from "./Conversation";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import useConversations from "@/hooks/useConversations";

const Conversations = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { conversations } = useConversations({ userId: user?.id });

  return (
    <Card className="w-[30rem] rounded-none">
      <CardHeader className="bg-slate-100 flex flex-row justify-between align-bottom">
        <span>Conversations</span>
        <PencilIcon
          size={16}
          className="cursor-pointer hover:text-slate-500"
          onClick={() => router.push("/chat/new")}
        />
      </CardHeader>
      {conversations.map((conversation) => (
        <Conversation
          key={conversation.id}
          title={conversation.title}
          onClick={() => router.push(`/chat/${conversation.id}`)}
        />
      ))}
    </Card>
  );
};

export default Conversations;
