"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { ToastAction } from "@/components/ui/toast"
import { ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  title: string
  message: string
  type: "success" | "error" | "info" | "warning"
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  showNotification: (notification: Notification) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()

  const showNotification = (notification: Notification) => {
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "error" ? "destructive" : "default",
      action: notification.action ? (
        <ToastAction altText={notification.action.label} onClick={notification.action.onClick}>
          {notification.action.label}
        </ToastAction>
      ) : undefined,
    })
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <ToastViewport />
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

