"use client"

import { useState, useEffect, useCallback } from "react"
import { io, type Socket } from "socket.io-client"
import { useAuth } from "@/contexts/auth-context"

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  userImage?: string
  content: string
  timestamp: Date
}

export function useLiveChat(eventId: string, isLive: boolean) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const { user, isAuthenticated } = useAuth()

  // Initialize socket connection
  useEffect(() => {
    if (!isLive) return

    // Initialize the socket connection
    const initializeSocket = async () => {
      // Make sure the socket endpoint is initialized
      await fetch("/api/socket")

      const socketInstance = io({
        path: "/api/socket",
      })

      socketInstance.on("connect", () => {
        console.log("Socket connected")
        setConnected(true)

        // Join the event room
        socketInstance.emit("join-event", eventId)

        // Add initial system message
        setMessages([
          {
            id: `system-${Date.now()}`,
            userId: "system",
            userName: "System",
            content: "Welcome to the live chat! Please be respectful to others.",
            timestamp: new Date(),
          },
        ])
      })

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected")
        setConnected(false)
      })

      socketInstance.on("new-message", (message) => {
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            timestamp: new Date(message.timestamp),
          },
        ])
      })

      socketInstance.on("user-joined", (data) => {
        // Add a system message when a user joins
        setMessages((prev) => [
          ...prev,
          {
            id: `system-${Date.now()}`,
            userId: "system",
            userName: "System",
            content: "A new user has joined the chat",
            timestamp: new Date(data.timestamp),
          },
        ])
      })

      setSocket(socketInstance)

      // Cleanup on unmount
      return () => {
        socketInstance.disconnect()
      }
    }

    initializeSocket()
  }, [eventId, isLive])

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !connected || !isAuthenticated || !content.trim()) return false

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: user?.id || "unknown",
        userName: user?.name || "Anonymous",
        userImage: user?.image,
        content: content.trim(),
        timestamp: new Date(),
      }

      // Send the message through the socket
      socket.emit("send-message", {
        eventId,
        message: userMessage,
      })

      return true
    },
    [socket, connected, isAuthenticated, user, eventId],
  )

  const sendReaction = useCallback(
    (reaction: string) => {
      if (!socket || !connected || !isAuthenticated) return false

      socket.emit("send-reaction", {
        eventId,
        reaction,
      })

      return true
    },
    [socket, connected, isAuthenticated, eventId],
  )

  return {
    messages,
    connected,
    sendMessage,
    sendReaction,
  }
}

