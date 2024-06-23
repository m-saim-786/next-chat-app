import Chat from "@/components/chat/Chat";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const conversation = await prisma.conversation.findFirst({
    where: { id: +id },
    include: {
      messages: {
        select: {
          id: true,
          text: true,
          created_at: true,
          user: { select: { name: true } },
        },
      },
      users: { select: { user: true } },
    },
  });

  if (!conversation) {
    redirect("/");
  }

  const messages = conversation.messages.map((message) => ({
    id: message.id,
    username: message.user.name,
    message: message.text,
    createdAt: message.created_at,
  }));

  return (
    <Chat
      messages={messages}
      titles={conversation.users.map((user) => ({
        id: user.user.id,
        title: user.user.name,
      }))}
      roomId={conversation.id}
    />
  );
};

export default page;
