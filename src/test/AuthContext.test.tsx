import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../components/Auth/AuthContext';

// Mock Firebase auth
jest.mock('../../../lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
  }
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, signOut } = useAuth();
  return (
    <div>
      <div data-testid="loading-state">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user-state">{user ? 'User Logged In' : 'No User'}</div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('provides initial loading state', () => {
    const { auth } = require('../../../lib/firebase');
    // Don't immediately call the callback to simulate loading
    auth.onAuthStateChanged.mockImplementationOnce(() => {
      return jest.fn(); // Return unsubscribe function
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Check if loading state is true
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading');
  });
  
  it('updates state when auth state changes to logged in', async () => {
    const { auth } = require('../../../lib/firebase');
    const mockUser = { uid: 'user1', email: 'test@example.com' };
    
    // Simulate auth state change to logged in
    auth.onAuthStateChanged.mockImplementationOnce((callback) => {
      callback(mockUser);
      return jest.fn(); // Return unsubscribe function
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Check if loading state is false and user state is logged in
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
      expect(screen.getByTestId('user-state')).toHaveTextContent('User Logged In');
    });
  });
  
  it('updates state when auth state changes to logged out', async () => {
    const { auth } = require('../../../lib/firebase');
    
    // Simulate auth state change to logged out
    auth.onAuthStateChanged.mockImplementationOnce((callback) => {
      callback(null);
      return jest.fn(); // Return unsubscribe function
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Check if loading state is false and user state is logged out
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
      expect(screen.getByTestId('user-state')).toHaveTextContent('No User');
    });
  });
  
  it('calls signOut when sign out button is clicked', async () => {
    const { auth } = require('../../../lib/firebase');
    const mockUser = { uid: 'user1', email: 'test@example.com' };
    
    // Simulate auth state change to logged in
    auth.onAuthStateChanged.mockImplementationOnce((callback) => {
      callback(mockUser);
      return jest.fn(); // Return unsubscribe function
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click sign out button
    fireEvent.click(screen.getByText('Sign Out'));
    
    // Check if signOut was called
    expect(auth.signOut).toHaveBeenCalled();
  });
  
  it('unsubscribes from auth state changes on unmount', () => {
    const { auth } = require('../../../lib/firebase');
    const unsubscribeMock = jest.fn();
    
    // Set up mock to return unsubscribe function
    auth.onAuthStateChanged.mockImplementationOnce(() => unsubscribeMock);
    
    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Unmount component
    unmount();
    
    // Check if unsubscribe was called
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
