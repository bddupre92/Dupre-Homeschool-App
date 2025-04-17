import React, { useState, useEffect } from 'react';
import { withErrorBoundary } from '../app/index';
import { useAnalytics } from '../lib/analytics';
import { useLocalStorageCache } from '../hooks/useLocalStorageCache';

const CommunityEvents = () => {
  const { trackEvent } = useAnalytics();
  const { getItem, setItem } = useLocalStorageCache();
  
  // Load events from local storage or initialize with sample data
  const [events, setEvents] = useState(() => {
    const savedEvents = getItem('community-events', null);
    return savedEvents || [
      {
        id: '1',
        title: 'Science Fair Showcase',
        description: 'Join us for a day of amazing science projects created by homeschooled students. Share your projects and learn from others!',
        date: '2025-05-15',
        time: '10:00 AM - 3:00 PM',
        location: 'Community Center, 123 Main St',
        organizer: 'STEM Homeschoolers Group',
        attendees: 24,
        isVirtual: false,
        isAttending: false,
        tags: ['Science', 'Exhibition', 'All Ages']
      },
      {
        id: '2',
        title: 'Virtual Book Club: Classical Literature',
        description: 'Monthly discussion of classic literature for middle and high school students. This month we\'re reading "To Kill a Mockingbird".',
        date: '2025-04-25',
        time: '4:00 PM - 5:30 PM',
        location: 'Zoom (link provided after RSVP)',
        organizer: 'Classical Education Enthusiasts',
        attendees: 18,
        isVirtual: true,
        isAttending: false,
        tags: ['Literature', 'Discussion', 'Middle School', 'High School']
      },
      {
        id: '3',
        title: 'Homeschool Park Day',
        description: 'Weekly meetup at the park for homeschooling families. Bring games, snacks, and enjoy socializing with other families.',
        date: '2025-04-22',
        time: '1:00 PM - 4:00 PM',
        location: 'Sunshine Park, 456 Park Avenue',
        organizer: 'Local Homeschool Network',
        attendees: 35,
        isVirtual: false,
        isAttending: false,
        tags: ['Social', 'Outdoor', 'All Ages']
      }
    ];
  });
  
  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    isVirtual: false,
    tags: ''
  });
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVirtual, setFilterVirtual] = useState(false);
  const [filterInPerson, setFilterInPerson] = useState(false);
  const [filterUpcoming, setFilterUpcoming] = useState(true);
  
  // Selected event for viewing details
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Save events to local storage whenever they change
  useEffect(() => {
    setItem('community-events', events);
  }, [events]);
  
  // Handle RSVP to an event
  const handleToggleAttendance = (eventId) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const newState = !event.isAttending;
        
        // Track event
        trackEvent(newState ? 'event_rsvp' : 'event_cancel_rsvp', {
          eventId,
          eventTitle: event.title,
          isVirtual: event.isVirtual
        });
        
        return {
          ...event,
          isAttending: newState,
          attendees: newState ? (Number(event.attendees) || 0) + 1 : Math.max(0, (Number(event.attendees) || 0) - 1)
        };
      }
      return event;
    }));
    
    // Update selected event if it's the one being modified
    if (selectedEvent && selectedEvent.id === eventId) {
      const updatedEvent = events.find(e => e.id === eventId);
      if (updatedEvent) {
        const newState = !updatedEvent.isAttending;
        setSelectedEvent({
          ...updatedEvent,
          isAttending: newState,
          attendees: newState ? (Number(updatedEvent.attendees) || 0) + 1 : Math.max(0, (Number(updatedEvent.attendees) || 0) - 1)
        });
      }
    }
  };
  
  // Handle creating a new event
  const handleCreateEvent = (e) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.time || !newEvent.location) {
      alert('Please fill in all required fields');
      return;
    }
    
    const event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      organizer: 'You',
      attendees: 1,
      isVirtual: newEvent.isVirtual,
      isAttending: true,
      tags: newEvent.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    
    setEvents([...events, event]);
    
    // Track event creation
    trackEvent('event_created', {
      eventId: event.id,
      eventTitle: event.title,
      isVirtual: event.isVirtual,
      tagCount: event.tags.length
    });
    
    // Reset form
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      isVirtual: false,
      tags: ''
    });
  };
  
  // Filter events based on search term and filters
  const filteredEvents = events.filter(event => {
    // Search term filter
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // Virtual/In-person filter
    const matchesVirtual = !filterVirtual || event.isVirtual;
    const matchesInPerson = !filterInPerson || !event.isVirtual;
    
    // Upcoming filter
    const isUpcoming = !filterUpcoming || new Date(event.date) >= new Date();
    
    return matchesSearch && matchesVirtual && matchesInPerson && isUpcoming;
  });
  
  // Sort events by date (upcoming first) - Explicitly get time for subtraction
  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // View event details
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    
    // Track event view
    trackEvent('event_viewed', {
      eventId: event.id,
      eventTitle: event.title,
      isVirtual: event.isVirtual
    });
  };
  
  // Back to events list
  const handleBackToEvents = () => {
    setSelectedEvent(null);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if event is past
  const isPastEvent = (dateString) => {
    return new Date(dateString) < new Date();
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Community Events</h1>
      
      {selectedEvent ? (
        // Event detail view
        <div>
          <button 
            onClick={handleBackToEvents}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Events
          </button>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{selectedEvent.title}</h2>
                
                <div className="mb-4">
                  {selectedEvent.isVirtual && (
                    <span className="inline-block bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold mr-2">
                      Virtual Event
                    </span>
                  )}
                  
                  {isPastEvent(selectedEvent.date) && (
                    <span className="inline-block bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm font-semibold">
                      Past Event
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-6">{selectedEvent.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                    <p className="text-gray-900">{formatDate(selectedEvent.date)}</p>
                    <p className="text-gray-900">{selectedEvent.time}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="text-gray-900">{selectedEvent.location}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Organizer</h3>
                    <p className="text-gray-900">{selectedEvent.organizer}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Attendees</h3>
                    <p className="text-gray-900">{selectedEvent.attendees} people attending</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  {selectedEvent.tags && selectedEvent.tags.map(tag => (
                    <span key={tag} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {!isPastEvent(selectedEvent.date) && (
                <button
                  onClick={() => handleToggleAttendance(selectedEvent.id)}
                  className={`px-4 py-2 rounded-md ${
                    selectedEvent.isAttending 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } transition-colors`}
                >
                  {selectedEvent.isAttending ? 'Cancel RSVP' : 'RSVP'}
                </button>
              )}
            </div>
            
            {selectedEvent.isAttending && !isPastEvent(selectedEvent.date) && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-lg font-medium text-green-800 mb-2">You're attending this event!</h3>
                <p className="text-green-700">
                  {selectedEvent.isVirtual 
                    ? 'You will receive connection details closer to the event date.' 
                    : 'We look forward to seeing you there!'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Events list view
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Event Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create an Event</h2>
            
            <form onSubmit={handleCreateEvent}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 3:00 PM - 5:00 PM"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={newEvent.isVirtual ? "e.g. Zoom (details to follow)" : "e.g. Community Center, 123 Main St"}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newEvent.isVirtual}
                    onChange={(e) => setNewEvent({...newEvent, isVirtual: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">This is a virtual event</span>
                </label>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newEvent.tags}
                  onChange={(e) => setNewEvent({...newEvent, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g. Science, Elementary, Workshop"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Event
              </button>
            </form>
          </div>
          
          {/* Events List */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <h2 className="text-xl font-semibold mb-2 sm:mb-0">Upcoming Events</h2>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events..."
                  className="px-3 py-1 border border-gray-300 rounded-md w-48"
                />
                
                <div className="flex items-center">
                  <label className="flex items-center text-sm mr-4">
                    <input
                      type="checkbox"
                      checked={filterVirtual}
                      onChange={() => setFilterVirtual(!filterVirtual)}
                      className="mr-1"
                    />
                    Virtual
                  </label>
                  
                  <label className="flex items-center text-sm mr-4">
                    <input
                      type="checkbox"
                      checked={filterInPerson}
                      onChange={() => setFilterInPerson(!filterInPerson)}
                      className="mr-1"
                    />
                    In-person
                  </label>
                  
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={filterUpcoming}
                      onChange={() => setFilterUpcoming(!filterUpcoming)}
                      className="mr-1"
                    />
                    Upcoming only
                  </label>
                </div>
              </div>
            </div>
            
            {sortedEvents.length > 0 ? (
              <div className="space-y-4">
                {sortedEvents.map(event => (
                  <div 
                    key={event.id} 
                    className={`border rounded-lg p-4 transition-colors ${isPastEvent(event.date) ? 'bg-gray-50' : 'hover:bg-blue-50 cursor-pointer'}`}
                    onClick={() => handleViewEvent(event)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{formatDate(event.date)} • {event.time}</p>
                        <p className={`text-sm ${isPastEvent(event.date) ? 'text-gray-500' : 'text-gray-700'}`}>
                          {event.description.length > 120 
                            ? `${event.description.substring(0, 120)}...` 
                            : event.description}
                        </p>
                        
                        <div className="mt-2 flex flex-wrap">
                          {event.isVirtual && (
                            <span className="inline-block bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-1">
                              Virtual
                            </span>
                          )}
                          
                          {event.tags && event.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="inline-block bg-gray-100 text-gray-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-1"
                            >
                              {tag}
                            </span>
                          ))}
                          
                          {isPastEvent(event.date) && (
                            <span className="inline-block bg-gray-100 text-gray-500 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-1">
                              Past Event
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end">
                        <div className="text-sm text-gray-500 mb-1">{event.attendees} {event.attendees === 1 ? 'person' : 'people'} attending</div>
                        
                        {!isPastEvent(event.date) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAttendance(event.id);
                            }}
                            className={`px-3 py-1 rounded-md text-sm ${
                              event.isAttending 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            } transition-colors`}
                          >
                            {event.isAttending ? 'Cancel RSVP' : 'RSVP'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No events found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default withErrorBoundary(CommunityEvents, {
  onError: (error, errorInfo) => {
    console.error('Error in CommunityEvents component:', error, errorInfo);
  }
});