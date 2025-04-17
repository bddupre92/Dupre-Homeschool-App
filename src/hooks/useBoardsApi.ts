import { useSWRCache, useMutationCache, invalidateQueries } from '../../../lib/cache';

// API client for boards with caching
export function useBoardsApi() {
  // Fetch all boards for the current user
  const useBoards = () => {
    return useSWRCache('/api/boards', async () => {
      const response = await fetch('/api/boards');
      if (!response.ok) {
        throw new Error('Failed to fetch boards');
      }
      return response.json();
    });
  };
  
  // Fetch a single board by ID with its posts
  const useBoard = (id) => {
    return useSWRCache(id ? `/api/boards/${id}` : null, async () => {
      const response = await fetch(`/api/boards/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch board');
      }
      return response.json();
    });
  };
  
  // Create a new board with mutation
  const useCreateBoard = () => {
    return useMutationCache(
      async (boardData) => {
        const response = await fetch('/api/boards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(boardData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create board');
        }
        
        return response.json();
      },
      {
        onSuccess: () => {
          // Invalidate boards cache to refresh the list
          invalidateQueries('/api/boards');
        },
      }
    );
  };
  
  // Update a board with mutation
  const useUpdateBoard = (id) => {
    return useMutationCache(
      async (boardData) => {
        const response = await fetch(`/api/boards/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(boardData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update board');
        }
        
        return response.json();
      },
      {
        onSuccess: () => {
          // Invalidate specific board and boards list cache
          invalidateQueries(`/api/boards/${id}`);
          invalidateQueries('/api/boards');
        },
      }
    );
  };
  
  // Delete a board with mutation
  const useDeleteBoard = () => {
    return useMutationCache(
      async (id) => {
        const response = await fetch(`/api/boards/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete board');
        }
        
        return response.json();
      },
      {
        onSuccess: (_, id) => {
          // Invalidate boards cache to refresh the list
          invalidateQueries('/api/boards');
          invalidateQueries(`/api/boards/${id}`);
        },
      }
    );
  };
  
  // Save post to board with mutation
  const useSavePostToBoard = (boardId) => {
    return useMutationCache(
      async ({ postId, note }) => {
        const response = await fetch(`/api/boards/${boardId}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId, note }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save post to board');
        }
        
        return response.json();
      },
      {
        onSuccess: () => {
          // Invalidate specific board cache
          invalidateQueries(`/api/boards/${boardId}`);
        },
      }
    );
  };
  
  // Remove post from board with mutation
  const useRemovePostFromBoard = (boardId) => {
    return useMutationCache(
      async (postId) => {
        const response = await fetch(`/api/boards/${boardId}/posts/${postId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to remove post from board');
        }
        
        return response.json();
      },
      {
        onSuccess: () => {
          // Invalidate specific board cache
          invalidateQueries(`/api/boards/${boardId}`);
        },
      }
    );
  };
  
  return {
    useBoards,
    useBoard,
    useCreateBoard,
    useUpdateBoard,
    useDeleteBoard,
    useSavePostToBoard,
    useRemovePostFromBoard,
  };
}

// Hook to prefetch boards for improved performance
export function usePrefetchBoards() {
  const { useBoards } = useBoardsApi();
  
  // Trigger the fetch but don't use the results directly
  useBoards();
  
  return null;
}
