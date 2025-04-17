"use client";
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import DefaultErrorFallback from './index';
import { AuthProvider } from '../components/Auth/AuthContext';
import { AnalyticsProvider } from '../lib/analytics';
import { CacheProvider } from '../lib/cache';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={
        <DefaultErrorFallback 
          error={null} 
          resetErrorBoundary={() => window.location.reload()} 
        />
      }
      onError={(error, errorInfo) => {
        // Log to error monitoring service
        console.error('Root level error:', error, errorInfo);
      }}
    >
      <CacheProvider>
        <AnalyticsProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AnalyticsProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}
