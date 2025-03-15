"use client"

import { useState } from "react"
import type { CareerPlan } from "@/types/career-planner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ShareIcon, CopyIcon, CheckIcon, MailIcon, LinkIcon, GlobeIcon, LockIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SharePlanProps {
  plan: CareerPlan | null
}

export function SharePlan({ plan }: SharePlanProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [email, setEmail] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const { toast } = useToast()

  if (!plan) return null

  // Generate share URL
  const shareUrl = `${window.location.origin}/career-planner/shared/${plan.id}`

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  // Handle email share
  const handleEmailShare = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive",
      })
      return
    }

    setIsSharing(true)

    try {
      const response = await fetch("/api/career-plans/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: plan.id,
          email,
          isPublic,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to share plan")
      }

      toast({
        title: "Success",
        description: `Plan shared with ${email}`,
      })

      setEmail("")
      setIsDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to share plan",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  // Handle public/private toggle
  const handleVisibilityChange = async (value: boolean) => {
    setIsPublic(value)

    try {
      const response = await fetch(`/api/career-plans/${plan.id}/visibility`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublic: value,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update plan visibility")
      }

      toast({
        title: "Visibility Updated",
        description: value ? "Plan is now public" : "Plan is now private",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update plan visibility",
        variant: "destructive",
      })
      setIsPublic(!value) // Revert the switch if the API call fails
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <ShareIcon className="h-4 w-4 mr-2" />
          Share Plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Career Plan</DialogTitle>
          <DialogDescription>Share your career plan with others or make it public.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Visibility toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                {isPublic ? (
                  <GlobeIcon className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <LockIcon className="h-4 w-4 mr-2 text-gray-500" />
                )}
                <Label htmlFor="public-toggle">{isPublic ? "Public" : "Private"}</Label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isPublic ? "Anyone with the link can view this plan" : "Only people you share with can view this plan"}
              </p>
            </div>
            <Switch id="public-toggle" checked={isPublic} onCheckedChange={handleVisibilityChange} />
          </div>

          {/* Share link */}
          <div className="space-y-2">
            <Label htmlFor="share-link">Share Link</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input id="share-link" value={shareUrl} readOnly className="pl-8" />
              </div>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {isCopied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Email share */}
          <div className="space-y-2">
            <Label htmlFor="share-email">Share via Email</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <MailIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="share-email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={handleEmailShare} disabled={isSharing}>
                {isSharing ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

