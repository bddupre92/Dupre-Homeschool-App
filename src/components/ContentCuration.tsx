import React, { useState, useEffect } from 'react';
import { withErrorBoundary } from '../app/index';
import { useAnalytics } from '../lib/analytics';
import { useLocalStorageCache } from '../hooks/useLocalStorageCache';

const ContentCuration = () => {
  const { trackEvent } = useAnalytics();
  const { getItem, setItem } = useLocalStorageCache();
  
  // Collections state
  const [collections, setCollections] = useState(() => {
    const savedCollections = getItem('content-collections', null);
    return savedCollections || [
      {
        id: '1',
        name: 'Math Resources',
        description: 'Collection of math resources for elementary students',
        items: [
          { id: '101', title: 'Multiplication Games', type: 'activity' },
          { id: '102', title: 'Fractions Worksheets', type: 'document' },
          { id: '103', title: 'Geometry Basics Video', type: 'video' }
        ],
        isPublic: true,
        tags: ['Math', 'Elementary']
      },
      {
        id: '2',
        name: 'Science Experiments',
        description: 'Easy science experiments to do at home',
        items: [
          { id: '201', title: 'Volcano Experiment', type: 'activity' },
          { id: '202', title: 'Plant Growth Journal', type: 'document' }
        ],
        isPublic: false,
        tags: ['Science', 'Hands-on']
      }
    ];
  });
  
  // New collection form state
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    isPublic: false,
    tags: ''
  });
  
  // Selected collection for viewing details
  const [selectedCollection, setSelectedCollection] = useState(null);
  
  // Save collections to local storage whenever they change
  useEffect(() => {
    setItem('content-collections', collections);
  }, [collections, setItem]);
  
  // Handle creating a new collection
  const handleCreateCollection = (e) => {
    e.preventDefault();
    
    if (!newCollection.name) {
      alert('Please enter a collection name');
      return;
    }
    
    const collection = {
      id: Date.now().toString(),
      name: newCollection.name,
      description: newCollection.description,
      items: [],
      isPublic: newCollection.isPublic,
      tags: newCollection.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    };
    
    setCollections([...collections, collection]);
    
    // Track collection creation
    trackEvent('collection_created', {
      collectionId: collection.id,
      collectionName: collection.name,
      isPublic: collection.isPublic,
      tagCount: collection.tags.length
    });
    
    // Reset form
    setNewCollection({
      name: '',
      description: '',
      isPublic: false,
      tags: ''
    });
  };
  
  // Handle deleting a collection
  const handleDeleteCollection = (collectionId) => {
    setCollections(collections.filter(collection => collection.id !== collectionId));
    
    // If the deleted collection is currently selected, clear selection
    if (selectedCollection && selectedCollection.id === collectionId) {
      setSelectedCollection(null);
    }
    
    // Track collection deletion
    trackEvent('collection_deleted', {
      collectionId
    });
  };
  
  // Handle viewing a collection
  const handleViewCollection = (collection) => {
    setSelectedCollection(collection);
    
    // Track collection view
    trackEvent('collection_viewed', {
      collectionId: collection.id,
      collectionName: collection.name,
      itemCount: collection.items.length
    });
  };
  
  // Handle toggling collection public/private status
  const handleTogglePublic = (collectionId) => {
    setCollections(collections.map(collection => {
      if (collection.id === collectionId) {
        const newIsPublic = !collection.isPublic;
        
        // Track visibility change
        trackEvent('collection_visibility_changed', {
          collectionId,
          isPublic: newIsPublic
        });
        
        return {
          ...collection,
          isPublic: newIsPublic
        };
      }
      return collection;
    }));
    
    // Update selected collection if it's the one being modified
    if (selectedCollection && selectedCollection.id === collectionId) {
      setSelectedCollection({
        ...selectedCollection,
        isPublic: !selectedCollection.isPublic
      });
    }
  };
  
  // Handle removing an item from a collection
  const handleRemoveItem = (collectionId, itemId) => {
    setCollections(collections.map(collection => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          items: collection.items.filter(item => item.id !== itemId)
        };
      }
      return collection;
    }));
    
    // Update selected collection if it's the one being modified
    if (selectedCollection && selectedCollection.id === collectionId) {
      setSelectedCollection({
        ...selectedCollection,
        items: selectedCollection.items.filter(item => item.id !== itemId)
      });
    }
    
    // Track item removal
    trackEvent('collection_item_removed', {
      collectionId,
      itemId
    });
  };
  
  // Back to collections list
  const handleBackToCollections = () => {
    setSelectedCollection(null);
  };
  
  // Get icon for item type
  const getItemTypeIcon = (type) => {
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
            <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd" />
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
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Content Curation</h1>
      
      {selectedCollection ? (
        // Collection detail view
        <div>
          <button 
            onClick={handleBackToCollections}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Collections
          </button>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{selectedCollection.name}</h2>
                <p className="text-gray-600 mb-4">{selectedCollection.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    {selectedCollection.items.length} items
                  </span>
                  
                  <span>
                    {selectedCollection.isPublic ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Public
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Private
                      </>
                    )}
                  </span>
                </div>
                
                <div className="mb-4">
                  {selectedCollection.tags.map(tag => (
                    <span key={tag} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex">
                <button
                  onClick={() => handleTogglePublic(selectedCollection.id)}
                  className={`px-4 py-2 rounded-md mr-2 ${
                    selectedCollection.isPublic 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } transition-colors`}
                >
                  {selectedCollection.isPublic ? 'Make Private' : 'Make Public'}
                </button>
                
                <button
                  onClick={() => handleDeleteCollection(selectedCollection.id)}
                  className="px-4 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Collection Items</h3>
            
            {selectedCollection.items.length > 0 ? (
              <div className="space-y-4">
                {selectedCollection.items.map(item => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                          {getItemTypeIcon(item.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(selectedCollection.id, item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="mb-2">This collection is empty</p>
                <p className="text-sm">Add items to this collection by saving content from the home feed or search results</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Collections list view
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Collection Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create Collection</h2>
            
            <form onSubmit={handleCreateCollection}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newCollection.tags}
                  onChange={(e) => setNewCollection({...newCollection, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g. Math, Elementary, Worksheets"
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Collection
              </button>
            </form>
          </div>
          
          {collections.map(collection => (
            <div key={collection.id} className="md:col-span-1 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">{collection.name}</h2>
              
              <p className="text-gray-600 mb-4">{collection.description}</p>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleViewCollection(collection)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View
                </button>
                
                <button
                  onClick={() => handleDeleteCollection(collection.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default withErrorBoundary(ContentCuration);