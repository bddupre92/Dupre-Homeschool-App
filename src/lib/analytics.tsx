import React from 'react';
import { Analytics, track } from '@vercel/analytics/react';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}

// Custom event tracking
export function trackEvent(eventName, properties = {}) {
  track(eventName, properties);
  console.log('Analytics event:', eventName, properties);
}

// Page view tracking
export function trackPageView(url) {
  console.log('Analytics pageview:', url);
}

// User identification
export function identifyUser(userId, userProperties = {}) {
  console.log('Analytics identify:', userId, userProperties);
  // Note: Client-side identify might require a different approach
}

// Analytics hook for components
export function useAnalytics() {
  return {
    trackEvent,
    trackPageView,
    identifyUser
  };
}
