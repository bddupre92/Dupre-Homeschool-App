import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BoardCreationModal from '../../../components/Boards/BoardCreationModal';

describe('BoardCreationModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnCreateBoard = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders nothing when not visible', () => {
    const { container } = render(
      <BoardCreationModal 
        visible={false}
        onClose={mockOnClose}
        onCreateBoard={mockOnCreateBoard}
      />
    );
    
    // Check if the component renders nothing
    expect(container.firstChild).toBeNull();
  });
  
  it('renders the modal when visible', () => {
    render(
      <BoardCreationModal 
        visible={true}
        onClose={mockOnClose}
        onCreateBoard={mockOnCreateBoard}
      />
    );
    
    // Check if the modal elements are rendered
    expect(screen.getByText('Create New Board')).toBeInTheDocument();
    expect(screen.getByLabelText(/Board Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText('Make this board private')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Board/i })).toBeInTheDocument();
  });
  
  it('validates form inputs', async () => {
    render(
      <BoardCreationModal 
        visible={true}
        onClose={mockOnClose}
        onCreateBoard={mockOnCreateBoard}
      />
    );
    
    // Try to submit with empty board name
    fireEvent.click(screen.getByRole('button', { name: /Create Board/i }));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Board name is required')).toBeInTheDocument();
    });
    
    // Fill in board name
    fireEvent.change(screen.getByLabelText(/Board Name/i), { target: { value: 'Test Board' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Board/i }));
    
    // Check if onCreateBoard was called with correct arguments
    expect(mockOnCreateBoard).toHaveBeenCalledWith('Test Board', '', false);
  });
  
  it('handles form submission with all fields', async () => {
    render(
      <BoardCreationModal 
        visible={true}
        onClose={mockOnClose}
        onCreateBoard={mockOnCreateBoard}
      />
    );
    
    // Fill in all form fields
    fireEvent.change(screen.getByLabelText(/Board Name/i), { target: { value: 'Test Board' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'This is a test board' } });
    
    // Toggle private checkbox
    fireEvent.click(screen.getByText('Make this board private'));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Board/i }));
    
    // Check if onCreateBoard was called with correct arguments
    expect(mockOnCreateBoard).toHaveBeenCalledWith('Test Board', 'This is a test board', true);
  });
  
  it('closes the modal when cancel button is clicked', () => {
    render(
      <BoardCreationModal 
        visible={true}
        onClose={mockOnClose}
        onCreateBoard={mockOnCreateBoard}
      />
    );
    
    // Click the cancel button
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });
});
