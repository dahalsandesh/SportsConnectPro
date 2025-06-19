'use client';
import React from 'react';
import { useGetPublicReelsQuery } from '@/redux/api/publicApi';
import Link from 'next/link';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReelCardProps {
  reel: any;
  isActive: boolean;
  onClick: () => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, isActive, onClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.7 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => { if (cardRef.current) observer.unobserve(cardRef.current); };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isIntersecting && isActive) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isIntersecting, isActive]);

  return (
    <div ref={cardRef} className="relative group block w-full rounded-2xl overflow-hidden shadow-lg bg-background cursor-pointer" onClick={onClick}>
      <video
        ref={videoRef}
        src={reel.video_url}
        controls
        loop
        className="w-full h-[65vw] md:h-[60vh] object-cover bg-black"
        style={{ maxHeight: 520 }}
      />
      {/* Overlayed title and caption */}
      <div className="absolute bottom-0 left-0 w-full px-4 pb-6 pt-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent">
        <div className="text-lg font-bold text-white mb-1 drop-shadow-md line-clamp-1">{reel.title}</div>
        <div className="text-base text-white/90 drop-shadow-md line-clamp-2">{reel.description}</div>
      </div>
    </div>
  );
};

const PublicReelsPage = () => {
  const { data: reels, isLoading, error } = useGetPublicReelsQuery();
  const [currentlyActiveReelIndex, setCurrentlyActiveReelIndex] = useState(0);
  const router = useRouter();

  const handleReelClick = (reelId: string) => {
    router.push(`/public-reels/${reelId}`);
  };

  useEffect(() => {
    const onScroll = () => {
      const cards = document.querySelectorAll('.reel-card');
      let found = 0;
      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          found = idx;
        }
      });
      setCurrentlyActiveReelIndex(found);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isLoading) return <div className="text-center py-8">Loading reels...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Failed to load reels.</div>;

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background py-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white text-gray-900">Latest Reels</h1>
      <div className="flex flex-col gap-10 w-full max-w-md mx-auto">
        {reels && reels.length > 0 ? reels.map((reel, idx) => (
          <ReelCard key={reel.reelId} reel={reel} isActive={currentlyActiveReelIndex === idx} onClick={() => handleReelClick(reel.reelId)} />
        )) : (
          <div className="text-gray-400 dark:text-gray-400 text-center">No reels found.</div>
        )}
      </div>
    </div>
  );
};

export default PublicReelsPage;
