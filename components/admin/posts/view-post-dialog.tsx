"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { format } from "date-fns"

interface ViewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    postID: string;
    title: string;
    description: string;
    category: string;
    postImage?: string;
    date?: string;
    time?: string;
    isPublished?: boolean;
  };
  isLoading?: boolean;
}

export function ViewPostDialog({ open, onOpenChange, post, isLoading = false }: ViewPostDialogProps) {
  // Use date and time from post, or fallback to current date
  const postDate = post?.date ? new Date(`${post.date}T${post.time || '00:00:00'}`) : null;
  const formattedDate = postDate && !isNaN(postDate.getTime()) 
    ? format(postDate, 'MMM d, yyyy h:mm a')
    : post?.date || 'N/A';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View Post</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
        <div className="space-y-6">
          {post?.postImage ? (
            <div className="relative w-full h-64 rounded-md overflow-hidden bg-muted">
              <img
                src={post.postImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-muted rounded-md">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Title</h3>
              <p className="text-gray-600 mt-1">{post?.title || 'No title'}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-600 mt-1 whitespace-pre-line">
                {post?.description || 'No description'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                <p>{post?.category || 'Uncategorized'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post?.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post?.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p>{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
        )}
        <div className="flex justify-end pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="px-6"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
