import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostCard from '../../../components/Feed/PostCard';

describe('PostCard Component', () => {
  const mockPost = {
    id: 'post1',
    title: 'Test Post',
    description: 'This is a test post description',
    mediaUrl: 'https://example.com/image.jpg',
    mediaType: 'image',
    userId: 'user1',
    grades: '["3rd Grade"]',
    subjects: '["Math"]',
    approaches: '["Montessori"]',
    createdAt: Date.now()
  };
  
  const mockOnPress = jest.fn();
  const mockOnLike = jest.fn();
  const mockOnComment = jest.fn();
  const mockOnSave = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the post card correctly', () => {
    render(
      <PostCard 
        post={mockPost}
        onPress={mockOnPress}
        onLike={mockOnLike}
        onComment={mockOnComment}
        onSave={mockOnSave}
      />
    );
    
    // Check if post content is rendered
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test post description')).toBeInTheDocument();
    
    // Check if tags are rendered
    expect(screen.getByText('3rd Grade')).toBeInTheDocument();
    expect(screen.getByText('Math')).toBeInTheDocument();
    expect(screen.getByText('Montessori')).toBeInTheDocument();
    
    // Check if action buttons are rendered
    expect(screen.getByText('Like')).toBeInTheDocument();
    expect(screen.getByText('Comment')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
  
  it('calls onPress when the card is clicked', () => {
    render(
      <PostCard 
        post={mockPost}
        onPress={mockOnPress}
        onLike={mockOnLike}
        onComment={mockOnComment}
        onSave={mockOnSave}
      />
    );
    
    // Click the post card
    fireEvent.click(screen.getByText('Test Post'));
    
    // Check if onPress was called
    expect(mockOnPress).toHaveBeenCalled();
  });
  
  it('calls onLike when the like button is clicked', () => {
    render(
      <PostCard 
        post={mockPost}
        onPress={mockOnPress}
        onLike={mockOnLike}
        onComment={mockOnComment}
        onSave={mockOnSave}
      />
    );
    
    // Click the like button
    fireEvent.click(screen.getByText('Like'));
    
    // Check if onLike was called
    expect(mockOnLike).toHaveBeenCalled();
  });
  
  it('calls onComment when the comment button is clicked', () => {
    render(
      <PostCard 
        post={mockPost}
        onPress={mockOnPress}
        onLike={mockOnLike}
        onComment={mockOnComment}
        onSave={mockOnSave}
      />
    );
    
    // Click the comment button
    fireEvent.click(screen.getByText('Comment'));
    
    // Check if onComment was called
    expect(mockOnComment).toHaveBeenCalled();
  });
  
  it('calls onSave when the save button is clicked', () => {
    render(
      <PostCard 
        post={mockPost}
        onPress={mockOnPress}
        onLike={mockOnLike}
        onComment={mockOnComment}
        onSave={mockOnSave}
      />
    );
    
    // Click the save button
    fireEvent.click(screen.getByText('Save'));
    
    // Check if onSave was called
    expect(mockOnSave).toHaveBeenCalled();
  });
  
  it('renders post without description when description is not provided', () => {
    const postWithoutDescription = {
      ...mockPost,
      description: undefined
    };
    
    render(
      <PostCard 
        post={postWithoutDescription}
        onPress={mockOnPress}
        onLike={mockOnLike}
        onComment={mockOnComment}
        onSave={mockOnSave}
      />
    );
    
    // Check if title is rendered
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    
    // Check that description is not rendered
    expect(screen.queryByText('This is a test post description')).not.toBeInTheDocument();
  });
  
  it('formats the date correctly', () => {
    // Use a fixed date for testing
    const fixedDate = new Date('2025-04-17T12:00:00Z').getTime();
    const postWithFixedDate = {
      ...mockPost,
      createdAt: fixedDate
    };
    
    render(
      <PostCard 
        post={postWithFixedDate}
        onPress={mockOnPress}
        onLike={mockOnLike}
        onComment={mockOnComment}
        onSave={mockOnSave}
      />
    );
    
    // Check if date is formatted correctly
    // Note: The exact format might depend on the implementation
    expect(screen.getByText(/Apr 17/)).toBeInTheDocument();
  });
});
