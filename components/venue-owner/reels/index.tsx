"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReelsList from "./reels-list";
import ReelDetails from "./reel-details";

const CreateEditReelDialog = dynamic(() => import("./create-edit-reel-dialog"), { ssr: false });

const VenueOwnerReelsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editReelId, setEditReelId] = useState<string | undefined>(undefined);
  const [detailsReelId, setDetailsReelId] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8">
      <nav className="text-sm mb-6" aria-label="Breadcrumb">
        <ol className="list-reset flex text-gray-500">
          <li>
            <Link href="/venue-owner" className="hover:underline text-gray-700">Venue Owner</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="text-black font-medium">Reels</li>
        </ol>
      </nav>
      <div className="mb-8" />
      {detailsReelId && (
        <React.Suspense fallback={<div>Loading details...</div>}>
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 relative max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <Button className="absolute top-2 right-2" size="icon" variant="outline" onClick={() => setDetailsReelId(null)}>
                ✕
              </Button>
              <ReelDetails reelId={detailsReelId} />
            </div>
          </div>
        </React.Suspense>
      )}
      <div className="mb-8" />
      <ReelsList
        onCreate={() => { setEditReelId(undefined); setOpen(true); }}
        onEdit={(id: string) => { setEditReelId(id); setOpen(true); }}
        onView={(id: string) => { setDetailsReelId(id); }}
      />
      <CreateEditReelDialog open={open} onClose={() => setOpen(false)} reelId={editReelId} />
    </div>
  );
};

export default VenueOwnerReelsPage;
