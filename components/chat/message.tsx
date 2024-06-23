"use client";
import React, { createContext, useContext } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type MessageProps = {
  align: "left" | "right";
  message: string;
  secondary?: boolean;
  username: string;
  children: React.ReactNode;
};

const MessageContext = createContext<Omit<MessageProps, "children">>({
  message: "",
  username: "",
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

export const Username = () => {
  const { username } = useMessage();
  return (
    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{username[0].toUpperCase()}</TooltipTrigger>
          <TooltipContent>
            <p>{username}</p>
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
      {message}
    </div>
  );
};

const Message = ({
  align = "left",
  message,
  username,
  secondary = false,
  children,
}: MessageProps) => {
  return (
    <MessageContext.Provider value={{ username, message, secondary, align }}>
      <div
        className={`m-2 flex gap-2 w-fit items-center justify-center ${
          align === "left" ? "mr-auto" : "ml-auto"
        }`}
      >
        {children}
      </div>
    </MessageContext.Provider>
  );
};

export default Message;
