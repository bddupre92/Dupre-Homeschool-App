import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface ErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4 max-w-xl mx-auto">
      <div className="flex items-center mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-red-500 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      </div>
      
      <p className="text-red-700 mb-4">
        We're sorry, but we encountered an unexpected error. Our team has been notified.
      </p>
      
      <details className="mb-4">
        <summary className="text-red-700 cursor-pointer">Error details</summary>
        <pre className="mt-2 p-2 bg-red-100 rounded text-red-900 text-sm overflow-auto">
          {error?.toString()}
        </pre>
      </details>
      
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

interface WithErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  { fallback, onError }: Omit<WithErrorBoundaryProps, 'children'> = {}
) => {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent = (props: P) => {
    const [error, setError] = React.useState<Error | null>(null);
    
    const handleReset = () => {
      setError(null);
    };
    
    const customFallback = fallback || (
      <DefaultErrorFallback 
        error={error} 
        resetErrorBoundary={handleReset} 
      />
    );
    
    return (
      <ErrorBoundary 
        fallback={customFallback}
        onError={(err, info) => {
          setError(err);
          if (onError) onError(err, info);
        }}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  return WrappedComponent;
};

export default DefaultErrorFallback;
