"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { MessageSquareIcon, TrashIcon, PencilIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { awardJestCoins, JESTCOIN_REWARDS } from "@/lib/jestcoins"

interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    image?: string
  }
}

interface CommentsProps {
  entityType: string
  entityId: string
}

export function CommentsSection({ entityType, entityId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?entityType=${entityType}&entityId=${entityId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch comments")
        }

        const data = await response.json()
        setComments(data)
      } catch (error: any) {
        showNotification({
          title: "Error",
          message: error.message || "Failed to fetch comments",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [entityType, entityId, showNotification])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      showNotification({
        title: "Authentication Required",
        message: "Please sign in to leave a comment",
        type: "info",
      })
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          entityType,
          entityId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to post comment")
      }

      const data = await response.json()
      setComments([data, ...comments])
      setNewComment("")

      // Award JestCoins for posting a comment
      const coinResult = await awardJestCoins(JESTCOIN_REWARDS.POST_COMMENT, `Posted a comment on ${entityType}`)

      if (coinResult?.success) {
        showNotification({
          title: "Comment Posted",
          message: `Comment posted successfully! You earned ${JESTCOIN_REWARDS.POST_COMMENT} JestCoins.`,
          type: "success",
        })
      } else {
        showNotification({
          title: "Success",
          message: "Comment posted successfully",
          type: "success",
        })
      }
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to post comment",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete comment")
      }

      setComments(comments.filter((comment) => comment.id !== commentId))

      showNotification({
        title: "Success",
        message: "Comment deleted successfully",
        type: "success",
      })
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to delete comment",
        type: "error",
      })
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) {
      setEditingComment(null)
      return
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update comment")
      }

      const updatedComment = await response.json()

      setComments(comments.map((comment) => (comment.id === commentId ? updatedComment : comment)))

      setEditingComment(null)

      showNotification({
        title: "Success",
        message: "Comment updated successfully",
        type: "success",
      })
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to update comment",
        type: "error",
      })
    }
  }

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "some time ago"
    }
  }

  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <MessageSquareIcon className="h-5 w-5 mr-2" />
        Comments
      </h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment..."
            className="bg-transparent border-white/20 focus:border-white/40 resize-none mb-2"
            rows={3}
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      ) : (
        <div className="mb-6 p-4 border border-white/10 rounded-md text-center">
          <p className="text-muted-foreground mb-2">Sign in to leave a comment</p>
          <Button
            className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">
          <p>Loading comments...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-white/10 pb-4 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                    <Image
                      src={comment.user.image || "/placeholder.svg?height=32&width=32"}
                      alt={comment.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{comment.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                      {comment.updatedAt !== comment.createdAt && " (edited)"}
                    </p>
                  </div>
                </div>

                {user?.id === comment.user.id && (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-white"
                      onClick={() => startEditing(comment)}
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white">
                          <TrashIcon className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteComment(comment.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>

              {editingComment === comment.id ? (
                <div className="mt-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="bg-transparent border-white/20 focus:border-white/40 resize-none mb-2"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 hover:border-white/40"
                      onClick={() => setEditingComment(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 whitespace-pre-line">{comment.content}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 border border-white/10 rounded-md">
          <MessageSquareIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </GlassCard>
  )
}

