import { useSWRCache } from '../../../lib/cache';
import { useEffect } from 'react';

// API client for posts with caching
export function usePostsApi() {
  // Fetch all posts with optional filtering
  const usePosts = (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.grades?.length) {
      queryParams.append('grades', JSON.stringify(filters.grades));
    }
    
    if (filters.subjects?.length) {
      queryParams.append('subjects', JSON.stringify(filters.subjects));
    }
    
    if (filters.approaches?.length) {
      queryParams.append('approaches', JSON.stringify(filters.approaches));
    }
    
    const queryString = queryParams.toString();
    const url = `/api/posts${queryString ? `?${queryString}` : ''}`;
    
    return useSWRCache(url, async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    });
  };
  
  // Fetch a single post by ID
  const usePost = (id) => {
    return useSWRCache(id ? `/api/posts/${id}` : null, async () => {
      const response = await fetch(`/api/posts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      return response.json();
    });
  };
  
  // Create a new post
  const createPost = async (postData) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    
    return response.json();
  };
  
  // Update a post
  const updatePost = async (id, postData) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    
    return response.json();
  };
  
  // Delete a post
  const deletePost = async (id) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
    
    return response.json();
  };
  
  return {
    usePosts,
    usePost,
    createPost,
    updatePost,
    deletePost,
  };
}

// Hook to prefetch posts for improved performance
export function usePrefetchPosts(filters = {}) {
  const { usePosts } = usePostsApi();
  
  // Trigger the fetch but don't use the results directly
  usePosts(filters);
  
  return null;
}
