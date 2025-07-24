'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGetPublicReelByIdQuery } from '@/redux/api/publicApi';
import { getImageUrl } from '@/lib/image-utils';
import { useParams } from 'next/navigation';

const PublicReelDetailPage = () => {
  // All hooks must be called at the top level, before any conditional returns
  const videoRef = useRef<HTMLVideoElement>(null);
  const params = useParams();
  const reelId = Array.isArray(params.reelId) ? params.reelId[0] : params.reelId;
  const [isClient, setIsClient] = useState(false);
  const { data: reel, isLoading, error } = useGetPublicReelByIdQuery(reelId || '', { skip: !reelId });

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle video loading and autoplay
  useEffect(() => {
    if (!reel?.video_url) return;
    
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      // Try to autoplay and mute if needed
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Autoplay prevented:', error);
          video.muted = true;
          video.play().catch(e => console.log('Muted autoplay failed:', e));
        });
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [reel?.video_url]);

  // Loading and error states
  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error || !reel) return <div className="text-center py-8 text-red-500">Reel not found.</div>;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black dark:bg-black p-4">
      {reel.video_url && (
        <video
          ref={videoRef}
          src={getImageUrl(reel.video_url)}
          controls
          autoPlay
          loop
          playsInline
          muted
          className="w-full h-[70vh] md:h-[80vh] object-contain rounded-xl shadow-lg bg-black"
          style={{ maxWidth: 420 }}
          poster={reel.thumbnail ? getImageUrl(reel.thumbnail) : undefined}
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
