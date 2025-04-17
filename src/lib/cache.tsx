import { SWRConfig } from 'swr';
import { QueryClient, QueryClientProvider } from 'react-query';

// Create a client for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      retry: 1,
    },
  },
});

export function CacheProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SWRConfig
        value={{
          fetcher: (url) => fetch(url).then((res) => res.json()),
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          dedupingInterval: 5 * 60 * 1000, // 5 minutes
        }}
      >
        {children}
      </SWRConfig>
    </QueryClientProvider>
  );
}

// Custom hook for using SWR with a cache key
export function useSWRCache(key, fetcher, options = {}) {
  const { useSWR } = require('swr');
  return useSWR(key, fetcher, {
    ...options,
  });
}

// Custom hook for using react-query with a cache key
export function useQueryCache(key, queryFn, options = {}) {
  const { useQuery } = require('react-query');
  return useQuery(key, queryFn, {
    ...options,
  });
}

// Mutation hook for react-query
export function useMutationCache(mutationFn, options = {}) {
  const { useMutation } = require('react-query');
  return useMutation(mutationFn, {
    ...options,
  });
}

// Function to prefetch data
export function prefetchQuery(key, queryFn) {
  return queryClient.prefetchQuery(key, queryFn);
}

// Function to invalidate queries
export function invalidateQueries(key) {
  return queryClient.invalidateQueries(key);
}

// Function to clear cache
export function clearCache() {
  queryClient.clear();
}
