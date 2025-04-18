import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../components/Auth/LoginForm';

// Mock the Firebase auth functions
jest.mock('../../../lib/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
  }
}));

describe('LoginForm Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnSignupClick = jest.fn();
  const mockOnForgotPassword = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the login form correctly', () => {
    render(
      <LoginForm 
        onSuccess={mockOnSuccess} 
        onSignupClick={mockOnSignupClick} 
        onForgotPassword={mockOnForgotPassword} 
      />
    );
    
    // Check if the form elements are rendered
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
  
  it('validates form inputs', async () => {
    render(
      <LoginForm 
        onSuccess={mockOnSuccess} 
        onSignupClick={mockOnSignupClick} 
        onForgotPassword={mockOnForgotPassword} 
      />
    );
    
    // Try to submit with empty fields
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
    
    // Fill in invalid email
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    
    // Check for email validation error
    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });
  });
  
  it('calls signInWithEmailAndPassword when form is valid', async () => {
    const { auth } = require('../../../lib/firebase');
    auth.signInWithEmailAndPassword.mockResolvedValueOnce({});
    
    render(
      <LoginForm 
        onSuccess={mockOnSuccess} 
        onSignupClick={mockOnSignupClick} 
        onForgotPassword={mockOnForgotPassword} 
      />
    );
    
    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    
    // Check if Firebase auth function was called with correct arguments
    await waitFor(() => {
      expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
  
  it('handles authentication errors', async () => {
    const { auth } = require('../../../lib/firebase');
    auth.signInWithEmailAndPassword.mockRejectedValueOnce({ 
      code: 'auth/wrong-password' 
    });
    
    render(
      <LoginForm 
        onSuccess={mockOnSuccess} 
        onSignupClick={mockOnSignupClick} 
        onForgotPassword={mockOnForgotPassword} 
      />
    );
    
    // Fill in form data
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
  
  it('navigates to signup when signup link is clicked', () => {
    render(
      <LoginForm 
        onSuccess={mockOnSuccess} 
        onSignupClick={mockOnSignupClick} 
        onForgotPassword={mockOnForgotPassword} 
      />
    );
    
    // Click the signup link
    fireEvent.click(screen.getByText('Sign Up'));
    
    // Check if onSignupClick callback was called
    expect(mockOnSignupClick).toHaveBeenCalled();
  });
  
  it('navigates to forgot password when forgot password link is clicked', () => {
    render(
      <LoginForm 
        onSuccess={mockOnSuccess} 
        onSignupClick={mockOnSignupClick} 
        onForgotPassword={mockOnForgotPassword} 
      />
    );
    
    // Click the forgot password link
    fireEvent.click(screen.getByText('Forgot password?'));
    
    // Check if onForgotPassword callback was called
    expect(mockOnForgotPassword).toHaveBeenCalled();
  });
});
