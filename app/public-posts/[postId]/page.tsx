'use client';
import React from 'react';
import { useGetPublicPostByIdQuery, useGetRecommendedPostsQuery } from '@/redux/api/publicApi';
import Link from 'next/link';
import Image from 'next/image';

interface PublicPostDetailPageProps {
  params: { postId: string };
}

interface RecommendedPost {
  id: string;
  title: string;
  desc: string;
  category: string;
  img: string;
}

const PublicPostDetailPage = ({ params }: PublicPostDetailPageProps) => {
  const { postId } = params;
  const { data: post, isLoading, isError } = useGetPublicPostByIdQuery(postId, { skip: !postId });
  const { data: recommendedPosts = [], isLoading: isLoadingRecommendations } = useGetRecommendedPostsQuery(postId, {
    skip: !postId,
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError || !post) return <div className="text-center py-8 text-red-500">Post not found.</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:gap-16">
        {/* Main Post Content */}
        <div className="lg:w-2/3">
          {/* Post Meta - Above Title */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{post.category}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>
          
          {/* Post Title */}
          <h1 className="text-4xl font-bold mb-6 dark:text-white text-gray-900 leading-tight">
            {post.title}
          </h1>
          
          {/* Featured Image - Full Width */}
          {post.postImage && (
            <div className="w-full h-96 relative mb-8 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={post.postImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
            </div>
          )}
          
          {/* Post Content */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
              {post.description.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Posts Sidebar */}
        <div className="lg:w-1/3 space-y-8 lg:pt-[4.5rem]">
          <div className="sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 mb-6">
              Recommended for you
            </h2>
          
          {isLoadingRecommendations ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : recommendedPosts.length > 0 ? (
            <div className="space-y-4">
              {recommendedPosts.slice(0, 5).map((recPost: RecommendedPost) => (
                <Link 
                  href={`/public-posts/${recPost.id}`} 
                  key={recPost.id}
                  className="block group"
                >
                  <div className="flex gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                    <div className="w-20 h-16 relative flex-shrink-0">
                      <Image
                        src={`http://localhost:8000/media/${recPost.img}`}
                        alt={recPost.title}
                        fill
                        className="object-cover rounded-md"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                        {recPost.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {recPost.desc}
                      </p>
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {recPost.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No recommendations available at the moment.</p>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPostDetailPage;
