import React from 'react';
import { Analytics } from '@vercel/analytics/react';

export function AnalyticsProvider({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}

// Custom event tracking
export function trackEvent(eventName, properties = {}) {
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', {
      name: eventName,
      ...properties
    });
  } else {
    console.log('Analytics event:', eventName, properties);
  }
}

// Page view tracking
export function trackPageView(url) {
  if (typeof window !== 'undefined' && window.va) {
    window.va('pageview', { url });
  } else {
    console.log('Analytics pageview:', url);
  }
}

// User identification
export function identifyUser(userId, userProperties = {}) {
  if (typeof window !== 'undefined' && window.va) {
    window.va('identify', {
      userId,
      ...userProperties
    });
  } else {
    console.log('Analytics identify:', userId, userProperties);
  }
}

// Analytics hook for components
export function useAnalytics() {
  return {
    trackEvent,
    trackPageView,
    identifyUser
  };
}
