"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface ApplicationDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  application: any
}

export function ApplicationDetailDialog({ isOpen, onOpenChange, application }: ApplicationDetailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Venue Application Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">User Information</h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> {application?.user?.name}</p>
                <p><strong>Email:</strong> {application?.user?.email}</p>
                <p><strong>Phone:</strong> {application?.user?.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Application Details</h3>
              <div className="space-y-2">
                <p><strong>Status:</strong> {application?.status}</p>
                <p><strong>Applied On:</strong> {format(new Date(application?.createdAt), 'PPp')}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Venue Information</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {application?.venue?.name}</p>
              <p><strong>Location:</strong> {application?.venue?.location}</p>
              <p><strong>Category:</strong> {application?.venue?.category}</p>
            </div>
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
