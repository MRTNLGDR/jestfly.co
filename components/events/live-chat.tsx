"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { SendIcon } from "lucide-react"
import { useLiveChat } from "@/hooks/use-live-chat"

interface LiveChatProps {
  eventId: string
  isLive: boolean
}

export function LiveChat({ eventId, isLive }: LiveChatProps) {
  const [newMessage, setNewMessage] = useState("")
  const { isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { messages, connected, sendMessage } = useLiveChat(eventId, isLive)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      showNotification({
        title: "Authentication Required",
        message: "Please sign in to participate in the chat.",
        type: "warning",
      })
      return
    }

    if (sendMessage(newMessage)) {
      setNewMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Live Chat
          {connected ? (
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Connected</span>
          ) : (
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">Disconnected</span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow p-0 relative">
        <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.userImage || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback>{message.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{message.userName}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-3 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder={isAuthenticated ? "Type a message..." : "Sign in to chat"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isAuthenticated || !isLive || !connected}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!isAuthenticated || !isLive || !connected || !newMessage.trim()}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

