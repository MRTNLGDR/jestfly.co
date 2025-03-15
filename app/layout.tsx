import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { PlayerProvider } from "@/contexts/player-context"
import { CartProvider } from "@/contexts/cart-context"
import { MusicPlayer } from "@/components/player/music-player"
import { NextAuthProvider } from "@/components/next-auth-provider"
import { DailyLoginReward } from "@/components/jestcoins/daily-login-reward"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jestfly - Artist Fan Platform",
  description: "Connect with your favorite artists through exclusive content and experiences.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AuthProvider>
              <NotificationProvider>
                <PlayerProvider>
                  <CartProvider>
                    {children}
                    <MusicPlayer />
                    <DailyLoginReward />
                  </CartProvider>
                </PlayerProvider>
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}



import './globals.css'