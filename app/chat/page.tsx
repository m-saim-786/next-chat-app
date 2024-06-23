"use client";
import { useEffect, useState } from "react";

import { socket } from "../../socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Message, { MessageContent, Username } from "@/components/chat/message";
import InputForm from "@/components/chat/InputForm";

type MessageData = {
  username: string;
  message: string;
};


const Page = () => {
  const messageSound = new Audio("/message.mp3");

  const [username, setUsername] = useState(() => {
    const storedUsername = localStorage.getItem("username");
    return storedUsername || "";
  });

  const [messages, setMessages] = useState<MessageData[]>(() => {
    const storedMessages = localStorage.getItem("messages");
    return storedMessages ? JSON.parse(storedMessages) : [];
  });

  const [message, setMessage] = useState("");

  const { toast } = useToast();

  const onConnect = () => {
    console.log("Connected to the server");
  };

  const onDisconnect = () => {
    console.log("Disconnected from the server");
  };

  const onSendMessage = (message: MessageData) => {
    setMessages((prev) => [...prev, { ...message }]);
    messageSound.play();
    toast({
      title: `New Message from ${message.username}`,
      description: message.message,
    });
  };

  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      username,
      message,
    };

    socket.emit("message", data);

    setMessage("");
    setMessages((prev) => [...prev, { ...data }]);
  }

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 bg-slate-100 justify-between flex">
        <h1>Chat app</h1>
        <Button onClick={() => setMessages([])}>Clear chat</Button>
      </header>

      <div className="flex-grow overflow-y-auto p-5">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            username={message.username}
            align={username === message.username ? "right" : "left"}
            secondary={username !== message.username}
          >
            {message.username !== username && <Username />}
            <MessageContent />
            {message.username === username && <Username />}
          </Message>
        ))}
      </div>

      <div className="p-4">
        <div>
          <h1>Enter a username</h1>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
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

export default Page;
