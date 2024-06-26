"use client";
import React, { createContext, useContext, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type MessageType = {
  message: string;
  username: string;
  createdAt: Date;
};

type MessageProps = {
  align: "left" | "right";
  message: MessageType;
  secondary?: boolean;
  showTime?: boolean;
  children: React.ReactNode;
};

const MessageContext = createContext<Omit<MessageProps, "children">>({
  message: {
    message: "",
    username: "",
    createdAt: new Date(),
  },
  secondary: false,
  align: "left",
});

const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};

const Timestamp = () => {
  const { message } = useMessage();

  return (
    <p className="text-xs text-slate-500">
      {message.createdAt.toLocaleTimeString()}
    </p>
  );
};

export const Username = () => {
  const { message } = useMessage();
  return (
    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{message.username[0].toUpperCase()}</TooltipTrigger>
          <TooltipContent>
            <p>{message.username}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const MessageContent = () => {
  const { message, secondary } = useMessage();
  return (
    <div
      className={`rounded-md px-4 py-2 ${
        secondary ? "bg-slate-100" : "bg-primary text-white"
      }`}
    >
      {message.message}
    </div>
  );
};

const Message = ({
  align = "left",
  message,
  secondary = false,
  children,
  showTime = true,
}: MessageProps) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <MessageContext.Provider
      value={{ message, secondary, align, showTime }}
    >
      <div
        onClick={() => setIsClicked((prev) => !prev)}
        className={`m-2 flex gap-2 justify-center items-center w-fit ${
          align === "left" ? "mr-auto" : "ml-auto"
        }`}
      >
        {children}
      </div>
      <div className={`${ align === "left" ? "text-left ml-12" : "text-right mr-12" }`}>
        {showTime && isClicked && <Timestamp />}
      </div>
    </MessageContext.Provider>
  );
};

export default Message;
