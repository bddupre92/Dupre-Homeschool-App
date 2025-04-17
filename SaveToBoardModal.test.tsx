import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SaveToBoardModal from '../../../components/Boards/SaveToBoardModal';

describe('SaveToBoardModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnCreateNewBoard = jest.fn();
  const mockBoards = [
    { id: 'board1', name: 'Board 1', postCount: 5 },
    { id: 'board2', name: 'Board 2', postCount: 10 },
    { id: 'board3', name: 'Board 3', postCount: 1 }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders nothing when not visible', () => {
    const { container } = render(
      <SaveToBoardModal 
        visible={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
        boards={mockBoards}
        onCreateNewBoard={mockOnCreateNewBoard}
      />
    );
    
    // Check if the component renders nothing
    expect(container.firstChild).toBeNull();
  });
  
  it('renders the modal with boards when visible', () => {
    render(
      <SaveToBoardModal 
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        boards={mockBoards}
        onCreateNewBoard={mockOnCreateNewBoard}
      />
    );
    
    // Check if the modal elements are rendered
    expect(screen.getByText('Save to Board')).toBeInTheDocument();
    expect(screen.getByText('Select a board:')).toBeInTheDocument();
    
    // Check if all boards are displayed
    mockBoards.forEach(board => {
      expect(screen.getByText(board.name)).toBeInTheDocument();
      expect(screen.getByText(`${board.postCount} ${board.postCount === 1 ? 'item' : 'items'}`)).toBeInTheDocument();
    });
    
    expect(screen.getByText('+ Create New Board')).toBeInTheDocument();
    expect(screen.getByText('Add a note (optional):')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });
  
  it('renders empty state when no boards are available', () => {
    render(
      <SaveToBoardModal 
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        boards={[]}
        onCreateNewBoard={mockOnCreateNewBoard}
      />
    );
    
    // Check if empty state is rendered
    expect(screen.getByText("You don't have any boards yet")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create a Board/i })).toBeInTheDocument();
  });
  
  it('selects a board and saves with a note', async () => {
    render(
      <SaveToBoardModal 
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        boards={mockBoards}
        onCreateNewBoard={mockOnCreateNewBoard}
      />
    );
    
    // Select a board
    fireEvent.click(screen.getByText('Board 2'));
    
    // Add a note
    fireEvent.change(screen.getByPlaceholderText(/Add a private note about this post/i), { 
      target: { value: 'This is a test note' } 
    });
    
    // Click save button
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    
    // Check if onSave was called with correct arguments
    expect(mockOnSave).toHaveBeenCalledWith('board2', 'This is a test note');
  });
  
  it('disables save button when no board is selected', () => {
    render(
      <SaveToBoardModal 
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        boards={mockBoards}
        onCreateNewBoard={mockOnCreateNewBoard}
      />
    );
    
    // Check if save button is disabled
    const saveButton = screen.getByRole('button', { name: /Save/i });
    expect(saveButton).toBeDisabled();
    
    // Select a board
    fireEvent.click(screen.getByText('Board 1'));
    
    // Check if save button is enabled
    expect(saveButton).not.toBeDisabled();
  });
  
  it('calls onCreateNewBoard when create new board button is clicked', () => {
    render(
      <SaveToBoardModal 
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        boards={mockBoards}
        onCreateNewBoard={mockOnCreateNewBoard}
      />
    );
    
    // Click create new board button
    fireEvent.click(screen.getByText('+ Create New Board'));
    
    // Check if onCreateNewBoard was called
    expect(mockOnCreateNewBoard).toHaveBeenCalled();
  });
  
  it('calls onCreateNewBoard when create board button is clicked in empty state', () => {
    render(
      <SaveToBoardModal 
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        boards={[]}
        onCreateNewBoard={mockOnCreateNewBoard}
      />
    );
    
    // Click create board button in empty state
    fireEvent.click(screen.getByRole('button', { name: /Create a Board/i }));
    
    // Check if onCreateNewBoard was called
    expect(mockOnCreateNewBoard).toHaveBeenCalled();
  });
  
  it('closes the modal when cancel button is clicked', () => {
    render(
      <SaveToBoardModal 
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        boards={mockBoards}
        onCreateNewBoard={mockOnCreateNewBoard}
      />
    );
    
    // Click the cancel button
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });
});
