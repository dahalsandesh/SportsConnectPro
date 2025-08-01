"use client";

import React, { useState } from "react";
import { useGetReelsQuery, useDeleteReelMutation } from "@/redux/api/venue-owner/reelApi";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Pencil, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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

interface ReelsListProps {
  onCreate: () => void;
  onEdit: (reelId: string) => void;
}

const ReelsList: React.FC<ReelsListProps> = ({ onCreate, onEdit }) => {
  const { user } = useAuth();
  const { data: reels = [], isLoading, error } = useGetReelsQuery(user?.userId || '');
  const [deleteReel, { isLoading: isDeleting }] = useDeleteReelMutation();
  const [detailsReelId, setDetailsReelId] = React.useState<string | null>(null);
  const ReelDetails = React.useMemo(() => React.lazy(() => import("./reel-details")), []);

  const [reelToDelete, setReelToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (reelId: string) => {
    setReelToDelete(reelId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (reelToDelete) {
      await deleteReel({ reelId: reelToDelete }).unwrap();
      setIsDeleteDialogOpen(false);
      setReelToDelete(null);
    }
  };

  if (isLoading) return <div>Loading reels...</div>;
  if (error) return <div>Error loading reels</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reels</h2>
        <Button variant="default" onClick={onCreate}>Create Reel</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Video</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reels && reels.length > 0 ? (
              reels.map((reel) => (
                <tr key={reel.reelId}>
                  <td className="px-4 py-2">{reel.title}</td>
                  <td className="px-4 py-2">{reel.description}</td>
                  <td className="px-4 py-2">{reel.category}</td>
                  <td className="px-4 py-2">{reel.date}</td>
                  <td className="px-4 py-2">
                    <video src={reel.video} controls className="w-32 h-20 object-cover" />
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => onEdit(reel.reelId)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="secondary" onClick={() => setDetailsReelId(reel.reelId)}>Details</Button>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      onClick={() => handleDeleteClick(reel.reelId)} 
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">No reels found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {detailsReelId && (
        <React.Suspense fallback={<div>Loading details...</div>}>
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 relative max-w-lg w-full">
              <Button className="absolute top-2 right-2" size="icon" variant="outline" onClick={() => setDetailsReelId(null)}>
                ✕
              </Button>
              <ReelDetails reelId={detailsReelId} />
            </div>
          </div>
        </React.Suspense>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the reel and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReelsList;
