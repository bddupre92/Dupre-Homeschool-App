import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterBar from '../../../components/Feed/FilterBar';

describe('FilterBar Component', () => {
  const mockGrades = ['Preschool', 'Kindergarten', '1st Grade', '2nd Grade'];
  const mockSubjects = ['Math', 'Science', 'Language Arts', 'History'];
  const mockApproaches = ['Classical', 'Charlotte Mason', 'Montessori', 'Waldorf'];
  const mockOnFiltersChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the filter bar correctly', () => {
    render(
      <FilterBar 
        grades={mockGrades}
        subjects={mockSubjects}
        approaches={mockApproaches}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    
    // Check if filter buttons are rendered
    expect(screen.getByText('Grades')).toBeInTheDocument();
    expect(screen.getByText('Subjects')).toBeInTheDocument();
    expect(screen.getByText('Approaches')).toBeInTheDocument();
  });
  
  it('shows grade filters when grades button is clicked', () => {
    render(
      <FilterBar 
        grades={mockGrades}
        subjects={mockSubjects}
        approaches={mockApproaches}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    
    // Click the grades filter button
    fireEvent.click(screen.getByText('Grades'));
    
    // Check if grade options are displayed
    mockGrades.forEach(grade => {
      expect(screen.getByText(grade)).toBeInTheDocument();
    });
  });
  
  it('shows subject filters when subjects button is clicked', () => {
    render(
      <FilterBar 
        grades={mockGrades}
        subjects={mockSubjects}
        approaches={mockApproaches}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    
    // Click the subjects filter button
    fireEvent.click(screen.getByText('Subjects'));
    
    // Check if subject options are displayed
    mockSubjects.forEach(subject => {
      expect(screen.getByText(subject)).toBeInTheDocument();
    });
  });
  
  it('shows approach filters when approaches button is clicked', () => {
    render(
      <FilterBar 
        grades={mockGrades}
        subjects={mockSubjects}
        approaches={mockApproaches}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    
    // Click the approaches filter button
    fireEvent.click(screen.getByText('Approaches'));
    
    // Check if approach options are displayed
    mockApproaches.forEach(approach => {
      expect(screen.getByText(approach)).toBeInTheDocument();
    });
  });
  
  it('selects and deselects grade filters correctly', async () => {
    render(
      <FilterBar 
        grades={mockGrades}
        subjects={mockSubjects}
        approaches={mockApproaches}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    
    // Click the grades filter button
    fireEvent.click(screen.getByText('Grades'));
    
    // Select a grade
    fireEvent.click(screen.getByText('1st Grade'));
    
    // Check if onFiltersChange was called with the correct arguments
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      grades: ['1st Grade'],
      subjects: [],
      approaches: []
    });
    
    // Select another grade
    fireEvent.click(screen.getByText('2nd Grade'));
    
    // Check if onFiltersChange was called with both grades
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      grades: ['1st Grade', '2nd Grade'],
      subjects: [],
      approaches: []
    });
    
    // Deselect a grade
    fireEvent.click(screen.getByText('1st Grade'));
    
    // Check if onFiltersChange was called with only the remaining grade
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      grades: ['2nd Grade'],
      subjects: [],
      approaches: []
    });
  });
  
  it('maintains selected filters when switching between filter types', async () => {
    render(
      <FilterBar 
        grades={mockGrades}
        subjects={mockSubjects}
        approaches={mockApproaches}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    
    // Click the grades filter button
    fireEvent.click(screen.getByText('Grades'));
    
    // Select a grade
    fireEvent.click(screen.getByText('1st Grade'));
    
    // Switch to subjects
    fireEvent.click(screen.getByText('Subjects'));
    
    // Select a subject
    fireEvent.click(screen.getByText('Math'));
    
    // Check if onFiltersChange was called with both the grade and subject
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      grades: ['1st Grade'],
      subjects: ['Math'],
      approaches: []
    });
    
    // Switch to approaches
    fireEvent.click(screen.getByText('Approaches'));
    
    // Select an approach
    fireEvent.click(screen.getByText('Montessori'));
    
    // Check if onFiltersChange was called with all selected filters
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      grades: ['1st Grade'],
      subjects: ['Math'],
      approaches: ['Montessori']
    });
  });
  
  it('displays the count of selected filters', async () => {
    render(
      <FilterBar 
        grades={mockGrades}
        subjects={mockSubjects}
        approaches={mockApproaches}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    
    // Click the grades filter button
    fireEvent.click(screen.getByText('Grades'));
    
    // Select two grades
    fireEvent.click(screen.getByText('1st Grade'));
    fireEvent.click(screen.getByText('2nd Grade'));
    
    // Check if the count is displayed
    expect(screen.getByText('Grades (2)')).toBeInTheDocument();
  });
});
