"use client";

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

// Define a fallback component to show when an error occurs
function DefaultErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-boundary-fallback">
      <h2>Something went wrong.</h2>
      <details>
        <summary>Error details</summary>
        <pre>{error.message}</pre>
      </details>
      <button onClick={resetErrorBoundary} className="error-boundary-retry-button">
        Try again
      </button>
    </div>
  );
}

// Define the props for our wrapper ErrorBoundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, info: { componentStack: string }) => void;
  fallback?: React.ReactNode; // Allow custom fallback
}

// Create our ErrorBoundary component using the library
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  children, 
  onError = (error, info) => { // Default onError logging
    console.error("Caught error:", error, info);
  },
  fallback 
}) => {
  // Create a fallback render function that either returns the custom fallback
  // or the default error component
  const renderFallback = ({ error, resetErrorBoundary }) => {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <DefaultErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />;
  };

  return (
    <ReactErrorBoundary
      fallbackRender={renderFallback}
      onError={onError}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
