'use client';
import React from 'react';
import { useGetPublicReelByIdQuery } from '@/redux/api/publicApi';

interface PublicReelDetailPageProps {
  params: { reelId: string };
}

const PublicReelDetailPage = ({ params }: PublicReelDetailPageProps) => {
  const { reelId } = params;
  const { data: reel, isLoading, error } = useGetPublicReelByIdQuery(reelId, { skip: !reelId });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error || !reel) return <div className="text-center py-8 text-red-500">Reel not found.</div>;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black dark:bg-black">
      {reel.video_url && (
        <video
          src={reel.video_url}
          controls
          autoPlay
          loop
          className="w-full h-[70vh] md:h-[80vh] object-cover rounded-xl shadow-lg bg-black"
          style={{ maxWidth: 420 }}
        />
      )}
      {/* Overlayed caption and info */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col px-4 pb-8 text-white bg-gradient-to-t from-black/80 via-black/30 to-transparent">
        <div className="text-lg font-bold mb-2 drop-shadow-md">{reel.title}</div>
        <div className="text-base mb-1 drop-shadow-md">{reel.description}</div>
        <div className="flex items-center gap-4 text-sm opacity-80">
          <span>{reel.category}</span>
          <span>{reel.date}</span>
        </div>
      </div>
    </div>
  );
};

export default PublicReelDetailPage;
