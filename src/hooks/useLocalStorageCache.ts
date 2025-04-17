import { useSWRCache } from '../lib/cache';

// API client for local storage caching
export function useLocalStorageCache() {
  // Get data from local storage with a fallback value
  const getItem = (key, fallbackValue = null) => {
    if (typeof window === 'undefined') return fallbackValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallbackValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return fallbackValue;
    }
  };
  
  // Set data in local storage
  const setItem = (key, value) => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };
  
  // Remove data from local storage
  const removeItem = (key) => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  };
  
  // Use SWR with localStorage for offline-first caching
  const useLocalStorage = (key, fetcher, options = {}) => {
    return useSWRCache(
      key,
      async () => {
        // Try to get from localStorage first
        const cachedData = getItem(key);
        
        if (cachedData) {
          // If we have cached data, return it immediately
          // and update in the background if fetcher is provided
          if (fetcher) {
            fetcher().then(freshData => {
              setItem(key, freshData);
            }).catch(error => {
              console.error(`Error updating ${key} cache:`, error);
            });
          }
          return cachedData;
        }
        
        // If no cached data and we have a fetcher, use it
        if (fetcher) {
          const data = await fetcher();
          setItem(key, data);
          return data;
        }
        
        // No cached data and no fetcher
        return null;
      },
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        ...options
      }
    );
  };
  
  return {
    getItem,
    setItem,
    removeItem,
    useLocalStorage
  };
}
