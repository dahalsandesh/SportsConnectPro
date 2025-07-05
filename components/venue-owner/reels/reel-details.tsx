"use client";

import React from "react";
import { useGetReelDetailsQuery } from "@/redux/api/venue-owner/reelApi";

interface ReelDetailsProps {
  reelId: string;
}

const ReelDetails: React.FC<ReelDetailsProps> = ({ reelId }) => {
  const { data, isLoading, error } = useGetReelDetailsQuery(reelId);
  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Failed to load reel details.</div>;
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{data.title}</h2>
      <p className="mb-2">{data.description}</p>
      <div className="mb-2"><b>Category:</b> {data.category}</div>
      <div className="mb-2"><b>Date:</b> {data.date} <b>Time:</b> {data.time}</div>
      <video src={data.postImage || data.video} controls className="w-full max-w-md" />
    </div>
  );
};

export default ReelDetails;
