'use client';
import React from 'react';
import { useGetPublicPostByIdQuery } from '@/redux/api/publicApi';

interface PublicPostDetailPageProps {
  params: { postId: string };
}

const PublicPostDetailPage = ({ params }: PublicPostDetailPageProps) => {
  const { postId } = params;
  const { data: post, isLoading, error } = useGetPublicPostByIdQuery(postId, { skip: !postId });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error || !post) return <div className="text-center py-8 text-red-500">Post not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 dark:text-white text-gray-900">{post.title}</h1>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {post.postImage && (
          <img src={post.postImage} alt={post.title} className="w-full md:w-72 h-48 object-cover rounded-md" />
        )}
        <div className="flex-1">
          <div className="text-gray-400 dark:text-gray-300 text-sm mb-1">{post.date} &middot; {post.author}</div>
          <div className="text-base text-gray-700 dark:text-gray-200 mb-2">{post.category}</div>
        </div>
      </div>
      <p className="text-lg text-gray-800 dark:text-gray-100 whitespace-pre-line">{post.description}</p>
    </div>
  );
};

export default PublicPostDetailPage;
