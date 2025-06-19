'use client';
import React from 'react';
import { useGetPublicPostsQuery } from '@/redux/api/publicApi';
import Link from 'next/link';

const PublicPostsPage = () => {
  const { data: posts, isLoading, error } = useGetPublicPostsQuery();

  if (isLoading) return <div className="text-center py-8">Loading posts...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Failed to load posts.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white text-gray-900">Latest News & Posts</h1>
      <div className="grid gap-6">
        {posts && posts.length > 0 ? posts.filter(post => post.postId).map(post => (
          <Link key={post.postId} href={`/public-posts/${post.postId}`}
            className="block rounded-lg shadow bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {post.postImage && (
                <img src={post.postImage} alt={post.title} className="w-32 h-24 object-cover rounded-md" />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold dark:text-white text-gray-900">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{post.description}</p>
                <div className="text-xs text-gray-400 mt-1">{post.date} &middot; {post.author}</div>
              </div>
            </div>
          </Link>
        )) : (
          <div className="text-gray-500 dark:text-gray-400">No posts found.</div>
        )}
      </div>
    </div>
  );
};

export default PublicPostsPage;
