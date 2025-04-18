import React, { useState } from 'react';
import { withErrorBoundary } from '../../app/index';
import { useAnalytics } from '../../lib/analytics';
import { useLocalStorageCache } from '../../hooks/useLocalStorageCache';

const CommunityGroups = () => {
  const { trackEvent } = useAnalytics();
  const { getItem, setItem } = useLocalStorageCache();
  
  // Load groups from local storage or initialize with sample data
  const [groups, setGroups] = useState(() => {
    const savedGroups = getItem('community-groups', null);
    return savedGroups || [
      {
        id: '1',
        name: 'Classical Education Enthusiasts',
        description: 'A group for homeschoolers following the classical education approach.',
        members: 128,
        topics: ['Classical Education', 'Trivium', 'Great Books'],
        isJoined: false
      },
      {
        id: '2',
        name: 'STEM Homeschoolers',
        description: 'Share resources and ideas for science, technology, engineering, and math education.',
        members: 215,
        topics: ['Science', 'Technology', 'Engineering', 'Math'],
        isJoined: false
      },
      {
        id: '3',
        name: 'Homeschooling Multiple Ages',
        description: 'Support and strategies for families homeschooling children of different ages.',
        members: 176,
        topics: ['Multiple Ages', 'Scheduling', 'Curriculum Adaptation'],
        isJoined: false
      }
    ];
  });
  
  // New group form state
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    topics: ''
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected group for viewing details
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // New post in group state
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });
  
  // Save groups to local storage whenever they change
  React.useEffect(() => {
    setItem('community-groups', groups);
  }, [groups]);
  
  // Handle joining/leaving a group
  const handleToggleJoinGroup = (groupId) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        const newState = !group.isJoined;
        
        // Track event
        trackEvent(newState ? 'group_joined' : 'group_left', {
          groupId,
          groupName: group.name
        });
        
        return {
          ...group,
          isJoined: newState,
          members: newState ? group.members + 1 : group.members - 1
        };
      }
      return group;
    }));
  };
  
  // Handle creating a new group
  const handleCreateGroup = (e) => {
    e.preventDefault();
    
    if (!newGroup.name || !newGroup.description) {
      alert('Please enter a group name and description');
      return;
    }
    
    const group = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      members: 1,
      topics: newGroup.topics.split(',').map(topic => topic.trim()).filter(Boolean),
      isJoined: true,
      posts: []
    };
    
    setGroups([...groups, group]);
    
    // Track group creation
    trackEvent('group_created', {
      groupId: group.id,
      groupName: group.name,
      topicCount: group.topics.length
    });
    
    // Reset form
    setNewGroup({
      name: '',
      description: '',
      topics: ''
    });
  };
  
  // Handle creating a new post in a group
  const handleCreatePost = (e) => {
    e.preventDefault();
    
    if (!newPost.title || !newPost.content) {
      alert('Please enter a post title and content');
      return;
    }
    
    const post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: 'You',
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    
    setGroups(groups.map(group => {
      if (group.id === selectedGroup.id) {
        return {
          ...group,
          posts: [post, ...(group.posts || [])]
        };
      }
      return group;
    }));
    
    // Update selected group to show the new post
    setSelectedGroup({
      ...selectedGroup,
      posts: [post, ...(selectedGroup.posts || [])]
    });
    
    // Track post creation
    trackEvent('group_post_created', {
      groupId: selectedGroup.id,
      groupName: selectedGroup.name,
      postId: post.id
    });
    
    // Reset form
    setNewPost({
      title: '',
      content: ''
    });
  };
  
  // Filter groups based on search term
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // View group details
  const handleViewGroup = (group) => {
    setSelectedGroup(group);
    
    // Track group view
    trackEvent('group_viewed', {
      groupId: group.id,
      groupName: group.name
    });
  };
  
  // Back to groups list
  const handleBackToGroups = () => {
    setSelectedGroup(null);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Community Groups</h1>
      
      {selectedGroup ? (
        // Group detail view
        <div>
          <button 
            onClick={handleBackToGroups}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Groups
          </button>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{selectedGroup.name}</h2>
                <p className="text-gray-600 mb-4">{selectedGroup.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    {selectedGroup.members} members
                  </span>
                </div>
                
                <div className="mb-4">
                  {selectedGroup.topics.map(topic => (
                    <span key={topic} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => handleToggleJoinGroup(selectedGroup.id)}
                className={`px-4 py-2 rounded-md ${
                  selectedGroup.isJoined 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                {selectedGroup.isJoined ? 'Leave Group' : 'Join Group'}
              </button>
            </div>
          </div>
          
          {selectedGroup.isJoined && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-xl font-semibold mb-4">Create a Post</h3>
              
              <form onSubmit={handleCreatePost}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Post to Group
                </button>
              </form>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Group Posts</h3>
            
            {selectedGroup.posts && selectedGroup.posts.length > 0 ? (
              <div className="space-y-6">
                {selectedGroup.posts.map(post => (
                  <div key={post.id} className="border-b pb-6 last:border-b-0">
                    <h4 className="text-lg font-medium mb-2">{post.title}</h4>
                    <p className="text-gray-600 mb-3">{post.content}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div>
                        <span className="font-medium">{post.author}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div>
                        <button className="mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          {post.likes}
                        </button>
                        
                        <button>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                          </svg>
                          {post.comments ? post.comments.length : 0}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No posts in this group yet. Be the first to post!</p>
            )}
          </div>
        </div>
      ) : (
        // Groups list view
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Group Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create a Group</h2>
            
            <form onSubmit={handleCreateGroup}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topics (comma separated)
                </label>
                <input
                  type="text"
                  value={newGroup.topics}
                  onChange={(e) => setNewGroup({...newGroup, topics: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g. Math, Science, Elementary"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Group
              </button>
            </form>
          </div>
          
          {/* Groups List */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Find Groups</h2>
              
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search groups..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {filteredGroups.length > 0 ? (
              <div className="space-y-4">
                {filteredGroups.map(group => (
                  <div key={group.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium mb-1">{group.name}</h3>
                        <p className="text-gray-600 mb-2">{group.description}</p>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            {group.members} members
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleViewGroup(group)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No groups found. Be the first to create a group!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default withErrorBoundary(CommunityGroups);