"use client";
import { useEffect, useState } from "react";

import { socket } from "../../socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Message, { MessageContent, Username } from "@/components/chat/message";
import InputForm from "@/components/chat/InputForm";
import { useAuth } from "@/hooks/useAuth";

type MessageData = {
  username: string;
  message: string;
};

type ChatProps = {
  messages: MessageData[];
  titles: { id: number; title: string }[];
  roomId: number;
};

const Chat = ({ messages, titles, roomId }: ChatProps) => {
  const [messageList, setMessageList] = useState<MessageData[]>(messages);
  const { user } = useAuth();

  const messageSound = new Audio("/message.mp3");

  const [message, setMessage] = useState("");

  const { toast } = useToast();

  const onConnect = () => {
    socket.emit("join-room", roomId);
    console.log("Connected to the server");
  };

  const onDisconnect = () => {
    socket.emit("leave-room", roomId);
    console.log("Disconnected from the server");
  };

  const onSendMessage = (messageData: MessageData) => {
    setMessageList((prev) => [...prev, { ...messageData }]);
    messageSound.play();
    toast({
      title: `New Message from ${messageData.username}`,
      description: messageData.message,
    });
  };


  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("send-message", onSendMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("send-message", onSendMessage);
    };
  }, []);

  const sendMessage = async ({ message }: { message: string }) => {
    const data = {
      userId: user?.id,
      message,
    };
    try {
      const message = await fetch(`/api/conversations/${roomId}/messages`, {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.json());
      return message;
    } catch (error) {
      console.error(error);
    }
  };

  const  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const messageData = {
      message,
      username: user?.name || '',
    };

    setMessage("");
    await sendMessage(messageData);
    socket.emit("message", { roomId, message: messageData });

    setMessageList((prev) => [...prev, { ...messageData }]);
  }

  return (
    <div className="flex flex-col h-full w-full">
      <header className="p-4 bg-slate-100 justify-between flex">
        <h1>{titles.find((title) => title.id !== user?.id)?.title}</h1>
        {/* <Button onClick={() => setMessages([])}>Clear chat</Button> */}
      </header>

      <div className="flex-grow overflow-y-auto p-5">
        {messageList.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            username={message.username}
            align={user?.name === message.username ? "right" : "left"}
            secondary={user?.name !== message.username}
          >
            {message.username !== user?.name && <Username />}
            <MessageContent />
            {message.username === user?.name && <Username />}
          </Message>
        ))}
      </div>

      <div className="p-4">
        <div className="mt-5">
          <InputForm
            handleSubmit={handleSubmit}
            message={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
