"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  useGetVenuePostsQuery,
  useCreateVenuePostMutation,
  useUpdateVenuePostMutation,
  useDeleteVenuePostMutation,
} from "@/redux/api/venue-owner/postApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, ImageIcon, Video, FileText, Edit, Trash2, Eye } from "lucide-react"
import { useGetSportCategoriesQuery } from "@/redux/api/venue-owner/sportCategoryApi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface SportCategory {
  sportCategoryId: string
  sportCategory: string
}

interface VenuePostFormProps {
  initialData?: any
  onSubmit: (form: FormData) => void
  loading: boolean
  onCancel: () => void
  type: "post" | "reel" | "news"
  categories: SportCategory[]
  userId: string
}

const VenuePostForm: React.FC<VenuePostFormProps> = ({
  initialData,
  onSubmit,
  loading,
  onCancel,
  type,
  categories = [],
  userId,
}) => {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [categoryId, setCategoryId] = useState(initialData?.sportCategoryId || "")
  const [mediaFile, setMediaFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("categoryId", categoryId)
    formData.append("userId", userId)
    if (mediaFile) formData.append("postImage", mediaFile)
    if (initialData?.postId) formData.append("postId", initialData.postId)
    console.log("Submitting form data:", Object.fromEntries(formData.entries()))
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sportCategoryId">Sport Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger id="sportCategoryId">
            <SelectValue placeholder="Select a sport" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.sportCategoryId} value={category.sportCategoryId}>
                {category.sportCategory}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="media">{type === "post" ? "Image" : type === "reel" ? "Video" : "Media"}</Label>
        <Input
          id="media"
          type="file"
          accept={type === "reel" ? "video/*" : "image/*"}
          onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
          required={!initialData}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {initialData ? "Update" : "Create"} {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </DialogFooter>
    </form>
  )
}

const VenueNewsMedia: React.FC = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [editingPost, setEditingPost] = useState<any | null>(null)
  const [viewingPost, setViewingPost] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<"post" | "reel" | "news">("post")
  const { toast } = useToast()

  // Get user ID from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          const user = JSON.parse(userData)
          const userId = user?.id || user?.userId || user?.user_id || null
          setCurrentUserId(userId)
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error)
        }
      }
    }
  }, [])

  const {
    data: posts,
    isLoading,
    error: postsError,
    refetch,
  } = useGetVenuePostsQuery({ userId: currentUserId || "" }, { skip: !currentUserId })

  const [createVenuePost, { isLoading: isCreating }] = useCreateVenuePostMutation()
  const [updateVenuePost, { isLoading: isUpdating }] = useUpdateVenuePostMutation()
  const [deleteVenuePost, { isLoading: isDeleting }] = useDeleteVenuePostMutation()

  const { data: categories = [], isLoading: isLoadingCategories } = useGetSportCategoriesQuery()

  const handleCreate = async (form: FormData) => {
    try {
      await createVenuePost(form).unwrap()
      setShowCreateDialog(false)
      await refetch()
      toast({
        title: "Success",
        description: "Post created successfully",
      })
    } catch (err) {
      console.error("Error creating post:", err)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (form: FormData) => {
    try {
      await updateVenuePost(form).unwrap()
      setShowEditDialog(false)
      setEditingPost(null)
      await refetch()
      toast({
        title: "Success",
        description: "Post updated successfully",
      })
    } catch (err) {
      console.error("Error updating post:", err)
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteVenuePost({ postId, userId: currentUserId || "" }).unwrap()
        await refetch()
        toast({
          title: "Success",
          description: "Post deleted successfully",
        })
      } catch (err) {
        console.error("Error deleting post:", err)
        toast({
          title: "Error",
          description: "Failed to delete post. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleView = (post: any) => {
    setViewingPost(post)
    setShowViewDialog(true)
  }

  const handleEdit = (post: any) => {
    setEditingPost(post)
    setShowEditDialog(true)
  }

  if (!currentUserId) {
    return <div>Loading user data...</div>
  }

  if (isLoading) return <div>Loading...</div>
  if (postsError) return <div>Error loading content. Please try again later.</div>

  const filteredPosts =
    posts?.filter((post: any) => {
      if (activeTab === "post") return post.type === "post" || !post.type
      if (activeTab === "reel") return post.type === "reel"
      if (activeTab === "news") return post.type === "news"
      return true
    }) || []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Venue News & Media</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</DialogTitle>
              <DialogDescription>Create a new {activeTab} for your venue.</DialogDescription>
            </DialogHeader>
            <VenuePostForm
              onSubmit={handleCreate}
              loading={isCreating}
              onCancel={() => setShowCreateDialog(false)}
              type={activeTab}
              categories={categories}
              userId={currentUserId}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="post" onValueChange={(value) => setActiveTab(value as "post" | "reel" | "news")}>
        <TabsList>
          <TabsTrigger value="post">
            <ImageIcon className="h-4 w-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="news">
            <FileText className="h-4 w-4 mr-2" />
            News
          </TabsTrigger>
          <TabsTrigger value="reel">
            <Video className="h-4 w-4 mr-2" />
            Reels
          </TabsTrigger>
        </TabsList>

        <TabsContent value="post" className="mt-6">
          <PostsGrid
            posts={filteredPosts}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </TabsContent>
        <TabsContent value="reel" className="mt-6">
          <PostsGrid
            posts={filteredPosts}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </TabsContent>
        <TabsContent value="news" className="mt-6">
          <PostsGrid
            posts={filteredPosts}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</DialogTitle>
            <DialogDescription>Update your {activeTab} content.</DialogDescription>
          </DialogHeader>
          {editingPost && (
            <VenuePostForm
              initialData={editingPost}
              onSubmit={handleUpdate}
              loading={isUpdating}
              onCancel={() => {
                setShowEditDialog(false)
                setEditingPost(null)
              }}
              type={activeTab}
              categories={categories}
              userId={currentUserId}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingPost?.title}</DialogTitle>
          </DialogHeader>
          {viewingPost && (
            <div className="space-y-4">
              {viewingPost.mediaUrl && (
                <div className="aspect-video overflow-hidden rounded-lg">
                  {viewingPost.type === "reel" ? (
                    <video src={viewingPost.mediaUrl} controls className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={viewingPost.mediaUrl || "/placeholder.svg"}
                      alt={viewingPost.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{viewingPost.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <p className="text-muted-foreground">{viewingPost.sportCategory}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface PostsGridProps {
  posts: any[]
  onView: (post: any) => void
  onEdit: (post: any) => void
  onDelete: (postId: string) => void
  isDeleting: boolean
}

const PostsGrid: React.FC<PostsGridProps> = ({ posts, onView, onEdit, onDelete, isDeleting }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No content found. Create your first post to get started.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post: any) => (
        <Card key={post.postID}>
          <CardContent className="p-4">
            {post.mediaUrl && (
              <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                {post.type === "reel" ? (
                  <video src={post.mediaUrl} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={post.mediaUrl || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
            <h3 className="font-semibold mb-2">{post.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.description}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(post)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(post.postID)} disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default VenueNewsMedia
