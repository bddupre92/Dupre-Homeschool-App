import React, { useEffect } from 'react';
import { useAuth } from '../../components/Auth/AuthContext';
import { useAnalytics } from '../../lib/analytics';

export function AnalyticsPageTracker() {
  const { trackPageView, identifyUser } = useAnalytics();
  const { user } = useAuth();
  
  useEffect(() => {
    // Track page view on initial load
    const path = window.location.pathname;
    trackPageView(path);
    
    // Identify user if logged in
    if (user) {
      identifyUser(user.uid, {
        email: user.email,
        displayName: user.displayName
      });
    }
    
    // Set up navigation tracking for client-side navigation
    const handleRouteChange = (url) => {
      trackPageView(url);
    };
    
    // Clean up function
    return () => {
      // Any cleanup if needed
    };
  }, [trackPageView, identifyUser, user]);
  
  return null; // This component doesn't render anything
}
