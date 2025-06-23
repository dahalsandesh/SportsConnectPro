"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  useGetAdminPostsQuery, 
  useDeleteAdminPostMutation, 
  useGetAdminPostDetailsQuery 
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
import { Trash, Edit, Plus, Eye, Loader2, ImageIcon, Search } from "lucide-react";
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
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface Post {
  postID: string;
  title: string;
  description: string;
  category: string;
  postImage?: string;
  date: string;
  time: string;
  isPublished?: boolean;
  userId?: string;
  createdAt?: string; // For backward compatibility
  updatedAt?: string; // For backward compatibility
}

export function PostsManagement() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast = useToast() } = useToast();
  
  // State for UI
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // API Calls
  console.log('Current user:', user);
  const userId = user?.userId || '';
  console.log('Using userId for API call:', userId);
  
  const { 
    data: allPosts = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetAdminPostsQuery(userId, {
    // Force refetch on mount to ensure we have the latest data
    refetchOnMountOrArgChange: true,
    // Don't retry on error to avoid spamming the server
    retry: false,
    // Skip the query if userId is not available
    skip: !user?.userId
  });
  
  console.log('API response - allPosts:', allPosts);
  console.log('API error:', error);

  const { data: categories = [] } = useGetSportCategoriesQuery();
  const [deletePost, { isLoading: isDeleting }] = useDeleteAdminPostMutation();

  // Get post details query - only enable when view dialog is open
  const { data: postDetails } = useGetAdminPostDetailsQuery(
    { 
      postId: selectedPost?.postID || '', 
      userId: user?.userId || '' 
    },
    { 
      skip: !selectedPost?.postID || !isViewDialogOpen 
    }
  );

  // Filter posts based on active tab and search query
  const filteredPosts = useMemo(() => {
    if (!allPosts) return [];
    
    return allPosts.filter(post => {
      // Filter by active tab (all or mine)
      // TODO: Re-enable user filtering when API includes userId
      const matchesTab = activeTab !== 'mine' || true;
      
      // Filter by search query
      const search = searchQuery.toLowerCase();
      const matchesSearch = 
        post.title.toLowerCase().includes(search) ||
        (post.description?.toLowerCase().includes(search) ?? false) ||
        (post.category?.toLowerCase().includes(search) ?? false);
      
      return matchesTab && matchesSearch;
    });
  }, [allPosts, activeTab, searchQuery]);

  // Debug logs
  console.log('Current user ID:', user?.id);
  console.log('Active tab:', activeTab);
  console.log('All posts:', allPosts);
  console.log('Filtered posts:', filteredPosts);
  console.log('API Error:', error);

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setIsEditDialogOpen(true);
  };

  // Handle view
  const handleView = (post: Post) => {
    setSelectedPost({
      ...post,
      // Map the API response to match the expected format
      createdAt: post.date,
      category: post.category || 'Uncategorized',
      isPublished: true // All posts are considered published by default
    });
    setIsViewDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPost || !user?.userId) return;

    try {
      await deletePost({ 
        postId: selectedPost.postID,
        userId: user.userId 
      }).unwrap();
      
      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully.",
        variant: "success",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedPost(null);
      refetch();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border">
          <Skeleton className="h-12 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full border-t" />
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
        <p>Error loading posts. Please try again later.</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => refetch()}
        >
          Retry
        </Button>
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
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-8 w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "all" | "mine")}
              className="ml-4"
            >
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="mine">My Posts</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </div>
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => {
                    // Safely parse the date and handle invalid dates
                    const dateString = post.date && post.time 
                      ? `${post.date}T${post.time.split('.')[0]}` // Remove milliseconds if present
                      : post.createdAt || '';
                    const postDate = dateString ? new Date(dateString) : null;
                    const formattedDate = postDate && !isNaN(postDate.getTime()) 
                      ? format(postDate, 'MMM d, yyyy')
                      : post.date || 'N/A'; // Fallback to raw date if available
                      
                    return (
                      <TableRow key={post.postID} className="hover:bg-muted/50">
                        <TableCell>
                          <Avatar className="h-12 w-12 rounded-md">
                            <AvatarImage
                              src={post.postImage || "/placeholder.svg"}
                              alt={post.title}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-md bg-muted">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="line-clamp-2">{post.title}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {post.category || 'Uncategorized'}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formattedDate}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            Published
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(post)}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(post)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => confirmDelete(post)}
                              className="text-destructive hover:text-destructive"
                              title="Delete"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No posts found.
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
        onSuccess={() => {
          refetch();
          setIsCreateDialogOpen(false);
        }}
        categories={categories}
      />

      {/* Edit Post Dialog */}
      {selectedPost && (
        <EditPostDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          post={selectedPost}
          onSuccess={() => {
            refetch();
            setIsEditDialogOpen(false);
            setSelectedPost(null);
          }}
          categories={categories}
        />
      )}

      {/* View Post Dialog */}
      {selectedPost && (
        <ViewPostDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          post={{
            ...(postDetails || selectedPost), // Use postDetails if available, fallback to selectedPost
            // Ensure we have the latest data
            createdAt: postDetails?.date || selectedPost.date,
            category: postDetails?.category || selectedPost.category || 'Uncategorized',
            isPublished: true // All posts are considered published by default
          }}
          isLoading={!postDetails && isViewDialogOpen}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Post'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
