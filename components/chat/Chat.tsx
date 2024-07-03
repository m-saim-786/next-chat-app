'use client'
import { useEffect, useRef, useState } from 'react'

import { useAuth } from '@/hooks/useAuth'
import { socket } from '@/socket'
import { useRouter } from 'next/navigation'
import { Message as MessageSchema } from '@prisma/client'

import Message, { MessageContent, Username } from '@/components/chat/message'
import TypingIndicator from '@/components/chat/TypingIndicator'
import { useToast } from '@/components/ui/use-toast'
import InputForm from '@/components/chat/InputForm'

type MessageData = {
  username: string;
  message: string;
  createdAt: Date;
  actor: string;
};

type ChatProps = {
  messages: MessageData[];
  users: { id: number; title: string }[];
  roomId: number;
  conversationName: string | null;
};

const Chat = ({ messages, users, roomId, conversationName }: ChatProps) => {
  const [messageList, setMessageList] = useState<MessageData[]>(messages)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const messageSound = new Audio('/message.mp3')
  const messagesRef = useRef<HTMLDivElement>(null)
  
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const onConnect = () => socket.emit('join-room', roomId)
  const onDisconnect = () => socket.emit('leave-room', roomId)
  const onTypingStarted = () => setIsTyping(true)
  const onTypingStopped = () => setIsTyping(false)

  const onSendMessage = (messageData: MessageData) => {
    setMessageList((prev) => [
      ...prev,
      { ...messageData, createdAt: new Date(messageData.createdAt) },
    ])
    messageSound.play()
    toast({
      title: `New Message from ${messageData.username}`,
      description: messageData.message,
    })

    scrollToBottom()
  }

  useEffect(() => {
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('send-message', onSendMessage)
    socket.on('typing-started', onTypingStarted)
    socket.on('typing-stopped', onTypingStopped)

    scrollToBottom()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('send-message', onSendMessage)
      socket.off('typing-started', onTypingStarted)
      socket.off('typing-stopped', onTypingStopped)
    }
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      socket.emit('typing-stopped', { roomId, username: user?.name || '' })
    }, 3000)

    return () => clearTimeout(delayDebounceFn)
  }, [message])

  const sendMessage = async ({ message }: { message: string }) => {
    const data = {
      userId: user?.id,
      message,
    }
    try {
      const message = await fetch(`/api/conversations/${roomId}/messages`, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((res) => res.json())
      return message
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = {
      message,
      username: user?.name || '',
      actor: 'user',
    }

    setMessage('')
    const newMessage: MessageSchema = await sendMessage(data)
    const { created_at, text, message_actor_type } = newMessage

    const messageData = {
      createdAt: new Date(created_at),
      message: text,
      username: user?.name || '',
      actor: message_actor_type,
    }

    socket.emit('message', { roomId, message: messageData })
    setMessageList((prev) => [...prev, { ...messageData }])
    scrollToBottom()
  }

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    socket.emit('typing-started', { roomId, username: user?.name || '' })
  }

  return (
    <div className="flex flex-col h-full w-full">
      <header className="p-4 bg-slate-100 justify-between flex">
        <h1 className='cursor-pointer' onClick={() => conversationName && router.push(`/chat/${roomId}/details`)}>{ conversationName || users.find((u) => u.id !== user?.id)?.title}</h1>
      </header>

      <div className="flex-grow overflow-y-auto p-5" ref={messagesRef}>
        {messageList.map((message, index) => (
          <Message
            key={index}
            message={message}
            align={message.actor === 'system' ? 'center' : user?.name === message.username ? 'right' : 'left'}
            secondary={message.actor === 'system' || user?.name !== message.username}
          >
            {message.actor !== 'system' && message.username !== user?.name && <Username />}
            <MessageContent />
            {message.actor !== 'system' && message.username === user?.name && <Username />}
          </Message>
        ))}
      </div>

      <div className="p-4 pt-0">
        {isTyping && <TypingIndicator />}
        <InputForm
          handleSubmit={handleSubmit}
          message={message}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default Chat
