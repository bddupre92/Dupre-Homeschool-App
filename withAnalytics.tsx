import React from 'react';
import { useAnalytics } from '../../lib/analytics';

// Higher-order component to add analytics tracking to any component
export function withAnalytics(
  Component,
  componentName = 'UnnamedComponent'
) {
  const WithAnalyticsComponent = (props) => {
    const { trackEvent } = useAnalytics();
    
    // Track component mount
    React.useEffect(() => {
      trackEvent('component_view', {
        component: componentName
      });
    }, [trackEvent]);
    
    // Create wrapped handlers that track events before calling the original handlers
    const wrapWithTracking = (handler, eventName, additionalProps = {}) => {
      if (!handler) return undefined;
      
      return (...args) => {
        trackEvent(eventName, {
          component: componentName,
          ...additionalProps
        });
        return handler(...args);
      };
    };
    
    // Create a new props object with wrapped handlers
    const enhancedProps = Object.keys(props).reduce((acc, key) => {
      const prop = props[key];
      
      // If the prop is a function and starts with 'on', assume it's an event handler
      if (typeof prop === 'function' && key.startsWith('on')) {
        const eventName = `${componentName}_${key.substring(2).toLowerCase()}`;
        acc[key] = wrapWithTracking(prop, eventName);
      } else {
        acc[key] = prop;
      }
      
      return acc;
    }, {});
    
    return <Component {...enhancedProps} />;
  };
  
  WithAnalyticsComponent.displayName = `withAnalytics(${componentName})`;
  return WithAnalyticsComponent;
}
