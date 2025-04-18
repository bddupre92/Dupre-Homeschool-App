import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupForm from '../components/Auth/SignupForm';

// Mock the Firebase auth functions
jest.mock('../../../lib/firebase', () => ({
  auth: {
    createUserWithEmailAndPassword: jest.fn(),
    updateProfile: jest.fn(),
  }
}));

describe('SignupForm Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnLoginClick = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the signup form correctly', () => {
    render(
      <SignupForm 
        onSuccess={mockOnSuccess} 
        onLoginClick={mockOnLoginClick} 
      />
    );
    
    // Check if the form elements are rendered
    expect(screen.getByText('Create an Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/Display Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });
  
  it('validates form inputs', async () => {
    render(
      <SignupForm 
        onSuccess={mockOnSuccess} 
        onLoginClick={mockOnLoginClick} 
      />
    );
    
    // Try to submit with empty fields
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Display name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
    
    // Fill in invalid email
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check for email validation error
    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });
    
    // Fill in short password
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check for password validation error
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
    
    // Fill in non-matching passwords
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check for password match error
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });
  
  it('calls createUserWithEmailAndPassword and updateProfile when form is valid', async () => {
    const { auth } = require('../../../lib/firebase');
    const userCredential = { user: { displayName: null } };
    auth.createUserWithEmailAndPassword.mockResolvedValueOnce(userCredential);
    auth.updateProfile.mockResolvedValueOnce({});
    
    render(
      <SignupForm 
        onSuccess={mockOnSuccess} 
        onLoginClick={mockOnLoginClick} 
      />
    );
    
    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check if Firebase auth functions were called with correct arguments
    await waitFor(() => {
      expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
      expect(auth.updateProfile).toHaveBeenCalledWith(
        userCredential.user,
        { displayName: 'Test User' }
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
  
  it('handles authentication errors', async () => {
    const { auth } = require('../../../lib/firebase');
    auth.createUserWithEmailAndPassword.mockRejectedValueOnce({ 
      code: 'auth/email-already-in-use' 
    });
    
    render(
      <SignupForm 
        onSuccess={mockOnSuccess} 
        onLoginClick={mockOnLoginClick} 
      />
    );
    
    // Fill in form data
    fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('This email is already in use. Please try another one.')).toBeInTheDocument();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
  
  it('navigates to login when login link is clicked', () => {
    render(
      <SignupForm 
        onSuccess={mockOnSuccess} 
        onLoginClick={mockOnLoginClick} 
      />
    );
    
    // Click the login link
    fireEvent.click(screen.getByText('Log In'));
    
    // Check if onLoginClick callback was called
    expect(mockOnLoginClick).toHaveBeenCalled();
  });
});
