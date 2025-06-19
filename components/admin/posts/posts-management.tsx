"use client";

import { useState } from "react";
import {
  useGetAdminPostsQuery,
  useDeleteAdminPostMutation,
  useCreateAdminPostMutation,
} from "@/redux/api/admin/postsApi";
import { useGetSportCategoriesQuery } from "@/redux/api/admin/sportCategoriesApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash, Edit, Plus, Eye, Loader2, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CreatePostDialog } from "./create-post-dialog";
import { EditPostDialog } from "./edit-post-dialog";
import { ViewPostDialog } from "./view-post-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PostsManagement() {
  const { data: posts, isLoading, isError } = useGetAdminPostsQuery();
  const { data: categories } = useGetSportCategoriesQuery();
  const [deletePost, { isLoading: isDeleting }] = useDeleteAdminPostMutation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { toast } = useToast();

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setIsEditDialogOpen(true);
  };

  const handleView = (post: any) => {
    setSelectedPost(post);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      await deletePost({ postId: selectedPost.postID }).unwrap();
      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully.",
        variant: "success",
      });
      setIsDeleteDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (post: any) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">
          Error loading posts. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Posts & News Management
          </CardTitle>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <TableRow key={post.postID} className="hover:bg-muted/50">
                      <TableCell>
                        <Avatar className="h-12 w-12 rounded-md">
                          <AvatarImage
                            src={post.postImage || "/placeholder.svg"}
                            alt={post.title}
                          />
                          <AvatarFallback className="rounded-md">
                            <ImageIcon className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {post.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{post.category}</Badge>
                      </TableCell>
                      <TableCell>{post.date}</TableCell>
                      <TableCell>{post.time}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(post)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(post)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(post)}
                            disabled={isDeleting}>
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No posts found</p>
                        <Button
                          onClick={() => setIsCreateDialogOpen(true)}
                          variant="outline">
                          Create your first post
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        categories={categories || []}
      />

      {/* Edit Post Dialog */}
      {selectedPost && (
        <EditPostDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          post={selectedPost}
          categories={categories || []}
        />
      )}

      {/* View Post Dialog */}
      {selectedPost && (
        <ViewPostDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          post={selectedPost}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              post
              <span className="font-semibold">
                {" "}
                "{selectedPost?.title}"
              </span>{" "}
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPost(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
