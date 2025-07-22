'use client';
import React, { useState, useEffect } from 'react';
import { useGetPublicPostsQuery } from '@/redux/api/publicApi';
import Link from 'next/link';

const PublicPostsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginatedPosts, setPaginatedPosts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  const { data: posts = [], isLoading, error } = useGetPublicPostsQuery();

  useEffect(() => {
    if (posts && posts.length > 0) {
      const filteredPosts = posts.filter(post => post.postId);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedData = filteredPosts.slice(startIndex, startIndex + itemsPerPage);
      setPaginatedPosts(paginatedData);
      setTotalPages(Math.ceil(filteredPosts.length / itemsPerPage));
    }
  }, [posts, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return <div className="text-center py-8">Loading posts...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Failed to load posts.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold dark:text-white text-gray-900">Latest News & Posts</h1>
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-600 dark:text-gray-300">
            Show:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm py-1 pl-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-300">per page</span>
        </div>
      </div>
      
      {/* Posts Grid */}
      <div className="grid gap-6 mb-8">
        {paginatedPosts.length > 0 ? paginatedPosts.map(post => (
          <Link 
            key={post.postId} 
            href={`/public-posts/${post.postId}`}
            className="block rounded-lg shadow bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition p-4"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {post.postImage && (
                <div className="w-full md:w-40 h-28 flex-shrink-0">
                  <img 
                    src={post.postImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover rounded-md" 
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold dark:text-white text-gray-900">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{post.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{post.date} • {post.author}</span>
                </div>
              </div>
            </div>
          </Link>
        )) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No posts found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show first page, last page, and pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {totalPages}
              </button>
            )}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default PublicPostsPage;
