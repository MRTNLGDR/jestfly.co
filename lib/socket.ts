import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { NextApiResponse } from "next"

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

export const initSocket = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server)

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id)

      // Join a room based on event ID
      socket.on("join-event", (eventId: string) => {
        socket.join(`event-${eventId}`)
        console.log(`Socket ${socket.id} joined event-${eventId}`)

        // Notify others that someone joined
        socket.to(`event-${eventId}`).emit("user-joined", {
          id: socket.id,
          timestamp: new Date(),
        })
      })

      // Handle chat messages
      socket.on("send-message", (data: { eventId: string; message: any }) => {
        const { eventId, message } = data

        // Broadcast the message to everyone in the event room
        io.to(`event-${eventId}`).emit("new-message", {
          ...message,
          timestamp: new Date(),
        })
      })

      // Handle reactions (likes, emojis, etc.)
      socket.on("send-reaction", (data: { eventId: string; reaction: string }) => {
        const { eventId, reaction } = data

        // Broadcast the reaction to everyone in the event room
        io.to(`event-${eventId}`).emit("new-reaction", {
          id: socket.id,
          reaction,
          timestamp: new Date(),
        })
      })

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id)
      })
    })

    res.socket.server.io = io
  }

  return res.socket.server.io
}

