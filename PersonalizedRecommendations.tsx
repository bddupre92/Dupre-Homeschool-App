import React, { useState, useEffect } from 'react';
import { withErrorBoundary } from '../../components/ErrorBoundary';
import { useAnalytics } from '../../lib/analytics';
import { useLocalStorageCache } from '../../hooks/useLocalStorageCache';

const PersonalizedRecommendations = () => {
  const { trackEvent } = useAnalytics();
  const { getItem, setItem } = useLocalStorageCache();
  
  // User preferences state
  const [userPreferences, setUserPreferences] = useState(() => {
    const savedPreferences = getItem('user-preferences', null);
    return savedPreferences || {
      grades: [],
      subjects: [],
      approaches: [],
      interests: []
    };
  });
  
  // Recommended content state
  const [recommendations, setRecommendations] = useState(() => {
    const savedRecommendations = getItem('personalized-recommendations', null);
    return savedRecommendations || {
      forYou: [],
      trending: [],
      newContent: []
    };
  });
  
  // Preference editing mode
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  
  // Temporary preferences for editing
  const [tempPreferences, setTempPreferences] = useState({...userPreferences});
  
  // Available options for preferences
  const grades = ['Preschool', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', 'High School'];
  const subjects = ['Math', 'Science', 'Language Arts', 'History', 'Social Studies', 'Art', 'Music', 'Physical Education', 'Foreign Language', 'Technology', 'Life Skills'];
  const approaches = ['Classical', 'Montessori', 'Charlotte Mason', 'Waldorf', 'Unschooling', 'Eclectic', 'Traditional', 'Unit Studies', 'Online/Virtual'];
  const interests = ['Outdoor Activities', 'STEM', 'Arts & Crafts', 'Reading', 'Writing', 'Music', 'Sports', 'Cooking', 'Gardening', 'Coding', 'Robotics', 'History', 'Geography', 'Languages', 'Science Experiments'];
  
  // Sample recommended content (in a real app, this would come from an API)
  const sampleRecommendations = {
    forYou: [
      {
        id: '1',
        title: 'Hands-on Fractions Activities',
        description: 'Fun and engaging activities to teach fractions to elementary students',
        type: 'activity',
        tags: ['Math', 'Elementary', 'Hands-on'],
        matchScore: 98
      },
      {
        id: '2',
        title: 'Nature Journal Templates',
        description: 'Printable templates for nature study journals',
        type: 'document',
        tags: ['Science', 'Charlotte Mason', 'Printable'],
        matchScore: 95
      },
      {
        id: '3',
        title: 'History Timeline Project',
        description: 'Create an interactive history timeline with your students',
        type: 'project',
        tags: ['History', 'All Ages', 'Interactive'],
        matchScore: 92
      }
    ],
    trending: [
      {
        id: '4',
        title: 'Coding for Kids: Scratch Basics',
        description: 'Introduction to coding with Scratch for beginners',
        type: 'tutorial',
        tags: ['Technology', 'Coding', 'Elementary'],
        popularity: 'High'
      },
      {
        id: '5',
        title: 'Virtual Field Trips Collection',
        description: 'Explore museums, national parks, and historical sites from home',
        type: 'collection',
        tags: ['Virtual', 'Field Trips', 'All Ages'],
        popularity: 'High'
      }
    ],
    newContent: [
      {
        id: '6',
        title: 'Homeschool Record Keeping Templates',
        description: 'Comprehensive set of templates for tracking progress and attendance',
        type: 'document',
        tags: ['Organization', 'Planning', 'Templates'],
        dateAdded: '2025-04-15'
      },
      {
        id: '7',
        title: 'Science Experiment: Water Cycle in a Bag',
        description: 'Easy demonstration of the water cycle using household items',
        type: 'activity',
        tags: ['Science', 'Elementary', 'Hands-on'],
        dateAdded: '2025-04-14'
      }
    ]
  };
  
  // Generate AI recommendations based on user preferences
  useEffect(() => {
    // In a real app, this would be an API call to an AI recommendation service
    // For this demo, we'll simulate AI recommendations with sample data
    
    // Only update if we have some preferences set
    if (userPreferences.grades.length > 0 || 
        userPreferences.subjects.length > 0 || 
        userPreferences.approaches.length > 0 || 
        userPreferences.interests.length > 0) {
      
      setRecommendations(sampleRecommendations);
      
      // Save to local storage
      setItem('personalized-recommendations', sampleRecommendations);
      
      // Track recommendations generated
      trackEvent('ai_recommendations_generated', {
        gradeCount: userPreferences.grades.length,
        subjectCount: userPreferences.subjects.length,
        approachCount: userPreferences.approaches.length,
        interestCount: userPreferences.interests.length
      });
    }
  }, [userPreferences, trackEvent, setItem]);
  
  // Save user preferences to local storage whenever they change
  useEffect(() => {
    setItem('user-preferences', userPreferences);
  }, [userPreferences, setItem]);
  
  // Handle checkbox change for multi-select preferences
  const handleCheckboxChange = (category, value) => {
    setTempPreferences(prev => {
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
  
  // Handle saving preference changes
  const handleSavePreferences = () => {
    setUserPreferences(tempPreferences);
    setIsEditingPreferences(false);
    
    // Track preference update
    trackEvent('user_preferences_updated', {
      gradeCount: tempPreferences.grades.length,
      subjectCount: tempPreferences.subjects.length,
      approachCount: tempPreferences.approaches.length,
      interestCount: tempPreferences.interests.length
    });
  };
  
  // Handle canceling preference changes
  const handleCancelEdit = () => {
    setTempPreferences({...userPreferences});
    setIsEditingPreferences(false);
  };
  
  // Get icon for content type
  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        );
      case 'activity':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        );
      case 'project':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
          </svg>
        );
      case 'tutorial':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        );
      case 'collection':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  // Handle saving an item
  const handleSaveItem = (item) => {
    // In a real app, this would save the item to the user's saved items
    console.log('Saving item:', item);
    
    // Track item saved
    trackEvent('recommendation_saved', {
      itemId: item.id,
      itemType: item.type,
      matchScore: item.matchScore
    });
    
    // Show feedback to user
    alert(`"${item.title}" has been saved to your collections!`);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Personalized Recommendations</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Preferences</h2>
            <p className="text-gray-600 mb-4">
              These preferences help us tailor content recommendations to your specific homeschooling needs.
            </p>
          </div>
          
          {!isEditingPreferences && (
            <button
              onClick={() => setIsEditingPreferences(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Preferences
            </button>
          )}
        </div>
        
        {isEditingPreferences ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium mb-2">Grade Levels</h3>
                <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {grades.map(grade => (
                    <label key={grade} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={tempPreferences.grades.includes(grade)}
                        onChange={() => handleCheckboxChange('grades', grade)}
                        className="mr-2"
                      />
                      <span className="text-sm">{grade}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Subjects</h3>
                <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {subjects.map(subject => (
                    <label key={subject} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={tempPreferences.subjects.includes(subject)}
                        onChange={() => handleCheckboxChange('subjects', subject)}
                        className="mr-2"
                      />
                      <span className="text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Homeschool Approaches</h3>
                <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {approaches.map(approach => (
                    <label key={approach} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={tempPreferences.approaches.includes(approach)}
                        onChange={() => handleCheckboxChange('approaches', approach)}
                        className="mr-2"
                      />
                      <span className="text-sm">{approach}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Interests</h3>
                <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {interests.map(interest => (
                    <label key={interest} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={tempPreferences.interests.includes(interest)}
                        onChange={() => handleCheckboxChange('interests', interest)}
                        className="mr-2"
                      />
                      <span className="text-sm">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Grade Levels</h3>
              {userPreferences.grades.length > 0 ? (
                <div className="flex flex-wrap">
                  {userPreferences.grades.map(grade => (
                    <span key={grade} className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                      {grade}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No grade levels selected</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Subjects</h3>
              {userPreferences.subjects.length > 0 ? (
                <div className="flex flex-wrap">
                  {userPreferences.subjects.map(subject => (
                    <span key={subject} className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                    
(Content truncated due to size limit. Use line ranges to read in chunks)