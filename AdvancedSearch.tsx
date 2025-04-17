import React, { useState, useEffect } from 'react';
import { withErrorBoundary } from '../../components/ErrorBoundary';
import { useAnalytics } from '../../lib/analytics';
import { useLocalStorageCache } from '../../hooks/useLocalStorageCache';

const AdvancedSearch = () => {
  const { trackEvent } = useAnalytics();
  const { getItem, setItem } = useLocalStorageCache();
  
  // Search parameters
  const [searchParams, setSearchParams] = useState({
    query: '',
    grades: [],
    subjects: [],
    approaches: [],
    mediaTypes: [],
    sortBy: 'recent'
  });
  
  // Saved searches
  const [savedSearches, setSavedSearches] = useState(() => {
    const saved = getItem('advanced-saved-searches', null);
    return saved || [];
  });
  
  // New saved search name
  const [newSearchName, setNewSearchName] = useState('');
  
  // Available filter options
  const grades = ['Preschool', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', 'High School'];
  const subjects = ['Math', 'Science', 'Language Arts', 'History', 'Social Studies', 'Art', 'Music', 'Physical Education', 'Foreign Language', 'Technology', 'Life Skills'];
  const approaches = ['Classical', 'Montessori', 'Charlotte Mason', 'Waldorf', 'Unschooling', 'Eclectic', 'Traditional', 'Unit Studies', 'Online/Virtual'];
  const mediaTypes = ['Photos', 'Videos', 'Documents', 'Links', 'Text'];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'relevant', label: 'Most Relevant' }
  ];
  
  // Save searches to local storage whenever they change
  useEffect(() => {
    setItem('advanced-saved-searches', savedSearches);
  }, [savedSearches, setItem]);
  
  // Handle checkbox change for multi-select filters
  const handleCheckboxChange = (category, value) => {
    setSearchParams(prev => {
      const current = [...prev[category]];
      const index = current.indexOf(value);
      
      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }
      
      return {
        ...prev,
        [category]: current
      };
    });
  };
  
  // Handle saving current search
  const handleSaveSearch = () => {
    if (!newSearchName.trim()) {
      alert('Please enter a name for your saved search');
      return;
    }
    
    // Check if a search with this name already exists
    if (savedSearches.some(search => search.name === newSearchName)) {
      alert('A search with this name already exists');
      return;
    }
    
    const newSavedSearch = {
      id: Date.now().toString(),
      name: newSearchName,
      params: { ...searchParams },
      createdAt: new Date().toISOString()
    };
    
    setSavedSearches([...savedSearches, newSavedSearch]);
    
    // Track search saved
    trackEvent('search_saved', {
      searchName: newSearchName,
      hasFilters: Object.values(searchParams).some(val => 
        Array.isArray(val) ? val.length > 0 : Boolean(val)
      )
    });
    
    setNewSearchName('');
  };
  
  // Handle loading a saved search
  const handleLoadSearch = (search) => {
    setSearchParams(search.params);
    
    // Track search loaded
    trackEvent('saved_search_loaded', {
      searchName: search.name
    });
  };
  
  // Handle deleting a saved search
  const handleDeleteSearch = (searchId) => {
    setSavedSearches(savedSearches.filter(search => search.id !== searchId));
    
    // Track search deleted
    trackEvent('saved_search_deleted', {
      searchId
    });
  };
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    // In a real app, this would trigger an API call with the search parameters
    console.log('Searching with params:', searchParams);
    
    // Track search performed
    trackEvent('advanced_search_performed', {
      query: searchParams.query,
      gradeCount: searchParams.grades.length,
      subjectCount: searchParams.subjects.length,
      approachCount: searchParams.approaches.length,
      mediaTypeCount: searchParams.mediaTypes.length,
      sortBy: searchParams.sortBy
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Advanced Search & Discovery</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Filters */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
            
            <form onSubmit={handleSearch}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Query
                </label>
                <input
                  type="text"
                  value={searchParams.query}
                  onChange={(e) => setSearchParams({...searchParams, query: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter keywords..."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Levels
                </label>
                <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {grades.map(grade => (
                    <label key={grade} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={searchParams.grades.includes(grade)}
                        onChange={() => handleCheckboxChange('grades', grade)}
                        className="mr-2"
                      />
                      <span className="text-sm">{grade}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subjects
                </label>
                <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {subjects.map(subject => (
                    <label key={subject} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={searchParams.subjects.includes(subject)}
                        onChange={() => handleCheckboxChange('subjects', subject)}
                        className="mr-2"
                      />
                      <span className="text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Homeschool Approaches
                </label>
                <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {approaches.map(approach => (
                    <label key={approach} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={searchParams.approaches.includes(approach)}
                        onChange={() => handleCheckboxChange('approaches', approach)}
                        className="mr-2"
                      />
                      <span className="text-sm">{approach}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Types
                </label>
                <div className="p-2 border border-gray-200 rounded-md">
                  {mediaTypes.map(mediaType => (
                    <label key={mediaType} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={searchParams.mediaTypes.includes(mediaType)}
                        onChange={() => handleCheckboxChange('mediaTypes', mediaType)}
                        className="mr-2"
                      />
                      <span className="text-sm">{mediaType}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={searchParams.sortBy}
                  onChange={(e) => setSearchParams({...searchParams, sortBy: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mb-4"
              >
                Search
              </button>
              
              <div className="flex items-center">
                <input
                  type="text"
                  value={newSearchName}
                  onChange={(e) => setNewSearchName(e.target.value)}
                  placeholder="Name this search"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                />
                <button
                  type="button"
                  onClick={handleSaveSearch}
                  className="bg-green-600 text-white py-2 px-4 rounded-r-md hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
          
          {/* Saved Searches */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Saved Searches</h2>
            
            {savedSearches.length > 0 ? (
              <div className="space-y-3">
                {savedSearches.map(search => (
                  <div key={search.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{search.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(search.createdAt).toLocaleDateString()}
                        </p>
                        <div className="mt-1 text-xs text-gray-500">
                          {search.params.query && (
                            <span className="mr-2">"{search.params.query}"</span>
                          )}
                          {search.params.grades.length > 0 && (
                            <span className="mr-2">{search.params.grades.length} grades</span>
                          )}
                          {search.params.subjects.length > 0 && (
                            <span className="mr-2">{search.params.subjects.length} subjects</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex">
                        <button
                          onClick={() => handleLoadSearch(search)}
                          className="text-blue-600 hover:text-blue-800 text-sm mr-3"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteSearch(search.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No saved searches yet</p>
            )}
          </div>
        </div>
        
        {/* Search Results & Trending Content */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            
            <div className="p-8 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="mb-2">Use the filters on the left to search for content</p>
              <p className="text-sm">Results will appear here after you search</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Trending Content</h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex">
                  <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0 mr-4"></div>
                  <div>
                    <h3 className="font-medium mb-1">DIY Science Experiments for Elementary Students</h3>
                    <p className="text-sm text-gray-600 mb-2">10 easy experiments you can do at home with common household items</p>
                    <div className="flex flex-wrap">
                      <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-1">Science</span>
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-1">Elementary</span>
                      <span className="inline-block bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs font-semibold mb-1">Hands-on</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex">
                  <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0 mr-4"></div>
                  <div>
                    <h3 className="font-medium mb-1">Charlotte Mason Nature Study Guide</h3>
                    <p className="text-sm text-gray-600 mb-2">Comprehensive guide to implementing nature studies in your homeschool</p>
                    <div className="flex flex-wrap">
                      <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-1">Science</span>
                      <span className="inline-block bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-1">Charlotte Mason</span>
                      <span className="inline-block bg-red-100 text-red-800 rounded-full px-2 py-1 text-xs font-semibold mb-1">All Ages</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex">
                  <div 
(Content truncated due to size limit. Use line ranges to read in chunks)