import { useQueryCache, useMutationCache, invalidateQueries } from '../lib/cache';

// API client for user authentication with caching
export function useAuthApi() {
  // Get current user profile with caching
  const useUserProfile = (userId) => {
    return useQueryCache(
      ['userProfile', userId],
      async () => {
        if (!userId) return null;
        
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        return response.json();
      },
      {
        // Don't refetch on window focus for user profile
        refetchOnWindowFocus: false,
        // Keep the data fresh for 10 minutes
        staleTime: 10 * 60 * 1000,
        // Don't fetch if no userId is provided
        enabled: !!userId,
      }
    );
  };
  
  // Update user profile with mutation
  const useUpdateProfile = () => {
    return useMutationCache(
      async ({ userId, profileData }) => {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update profile');
        }
        
        return response.json();
      },
      {
        onSuccess: (_, { userId }) => {
          // Invalidate user profile cache to refresh the data
          invalidateQueries(['userProfile', userId]);
        },
      }
    );
  };
  
  return {
    useUserProfile,
    useUpdateProfile,
  };
}
