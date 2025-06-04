"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ViewPostDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  post: any
}

export function ViewPostDialog({ isOpen, onOpenChange, post }: ViewPostDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Title</h3>
            <p className="text-gray-600">{post?.title}</p>
          </div>
          <div>
            <h3 className="font-semibold">Content</h3>
            <div className="text-gray-600 whitespace-pre-wrap">{post?.content}</div>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
