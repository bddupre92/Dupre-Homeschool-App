import React, { useState, useRef, useEffect } from 'react';
import { withErrorBoundary } from '../../components/ErrorBoundary';
import { useAnalytics } from '../../lib/analytics';
import { useLocalStorageCache } from '../../hooks/useLocalStorageCache';

const AIAssistant = () => {
  const { trackEvent } = useAnalytics();
  const { getItem, setItem } = useLocalStorageCache();
  const messagesEndRef = useRef(null);
  
  // Chat history state
  const [chatHistory, setChatHistory] = useState(() => {
    const savedChat = getItem('ai-assistant-chat-history', null);
    return savedChat || [
      {
        role: 'assistant',
        content: 'Hello! I\'m your homeschool assistant. I can help you find resources, answer questions about homeschooling approaches, suggest activities, and more. How can I help you today?',
        timestamp: new Date().toISOString()
      }
    ];
  });
  
  // Current message being typed
  const [currentMessage, setCurrentMessage] = useState('');
  
  // Loading state for AI response
  const [isLoading, setIsLoading] = useState(false);
  
  // Suggested questions
  const suggestedQuestions = [
    'What activities can I do to teach fractions?',
    'How do I create a Charlotte Mason schedule?',
    'Can you suggest science experiments for 3rd grade?',
    'What are good resources for teaching world history?',
    'How do I keep records for homeschooling?'
  ];
  
  // Save chat history to local storage whenever it changes
  useEffect(() => {
    setItem('ai-assistant-chat-history', chatHistory);
  }, [chatHistory, setItem]);
  
  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    
    // Track message sent
    trackEvent('ai_assistant_message_sent', {
      messageLength: currentMessage.length
    });
    
    // Clear input
    setCurrentMessage('');
    
    // Set loading state
    setIsLoading(true);
    
    // Simulate AI response (in a real app, this would be an API call to an AI service)
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentMessage);
      
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      }]);
      
      setIsLoading(false);
      
      // Track response received
      trackEvent('ai_assistant_response_received', {
        responseLength: aiResponse.length
      });
    }, 1500);
  };
  
  // Handle clicking a suggested question
  const handleSuggestedQuestion = (question) => {
    setCurrentMessage(question);
  };
  
  // Handle clearing chat history
  const handleClearChat = () => {
    const initialMessage = {
      role: 'assistant',
      content: 'Hello! I\'m your homeschool assistant. I can help you find resources, answer questions about homeschooling approaches, suggest activities, and more. How can I help you today?',
      timestamp: new Date().toISOString()
    };
    
    setChatHistory([initialMessage]);
    
    // Track chat cleared
    trackEvent('ai_assistant_chat_cleared');
  };
  
  // Generate AI response based on user message
  // In a real app, this would be replaced with an actual AI API call
  const generateAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Simple pattern matching for demo purposes
    if (lowerMessage.includes('fraction') || lowerMessage.includes('math')) {
      return "Here are some engaging activities for teaching fractions:\n\n1. **Fraction Pizza**: Use paper plates to create pizza slices representing different fractions.\n\n2. **Measuring Cup Activities**: Bake together and let your child measure ingredients to understand fractions in real life.\n\n3. **Fraction Strips**: Create colorful paper strips divided into different fractions for visual comparison.\n\n4. **Lego Fractions**: Use Lego bricks to represent different fractions and demonstrate addition and subtraction.\n\nWould you like me to suggest specific resources for any of these activities?";
    }
    
    if (lowerMessage.includes('charlotte mason')) {
      return "Creating a Charlotte Mason schedule involves balancing several key elements:\n\n1. **Short Lessons**: Keep lessons to 15-20 minutes for younger children, gradually increasing with age.\n\n2. **Morning Time**: Start with Bible reading, poetry, music appreciation, and art study.\n\n3. **Core Subjects**: Focus on math and language arts in the morning when minds are fresh.\n\n4. **Afternoon Activities**: Reserve afternoons for nature study, handicrafts, and free play.\n\n5. **Reading Aloud**: Incorporate living books throughout the day.\n\nA sample daily schedule might look like:\n- 8:30-9:00: Morning basket (poetry, music, art)\n- 9:00-10:30: Language arts and math\n- 10:30-11:00: Break\n- 11:00-12:00: History and science through living books\n- 12:00-1:30: Lunch and free time\n- 1:30-3:00: Nature study, handicrafts, or physical activity\n\nWould you like more specific guidance for a particular age group?";
    }
    
    if (lowerMessage.includes('science') || lowerMessage.includes('experiment')) {
      return "Here are some engaging science experiments perfect for 3rd grade:\n\n1. **Volcano Eruption**: Create a model volcano with baking soda and vinegar to demonstrate chemical reactions.\n\n2. **Plant Growth Experiment**: Grow plants in different conditions to learn about plant needs.\n\n3. **Water Cycle in a Bag**: Create a mini water cycle using a plastic bag, water, and food coloring.\n\n4. **Magnetic Slime**: Make slime with iron oxide powder to create a substance that reacts to magnets.\n\n5. **Egg Drop Challenge**: Design a container to protect an egg from breaking when dropped.\n\nAll of these experiments use simple household materials and connect to 3rd grade science standards. Would you like detailed instructions for any specific experiment?";
    }
    
    if (lowerMessage.includes('history') || lowerMessage.includes('social studies')) {
      return "Here are excellent resources for teaching world history:\n\n1. **Story of the World** by Susan Wise Bauer - A narrative approach to world history that's engaging for children.\n\n2. **History Quest** - A history curriculum that incorporates hands-on activities and living books.\n\n3. **Beautiful Feet Books** - Literature-based history guides with excellent book selections.\n\n4. **Timeline Books** - Creating an ongoing timeline helps children visualize historical periods.\n\n5. **Mystery of History** - Christian-based world history curriculum with activities for multiple age levels.\n\nFree online resources:\n- Khan Academy's World History section\n- BBC Bitesize History\n- Crash Course History videos on YouTube (better for older students)\n\nWould you like recommendations for a specific time period or civilization?";
    }
    
    if (lowerMessage.includes('record') || lowerMessage.includes('documentation')) {
      return "Keeping good homeschool records is important for both legal compliance and tracking progress. Here's what you should consider:\n\n1. **Attendance Records**: Most states require 180 days of instruction. A simple calendar works well for tracking.\n\n2. **Portfolio of Work**: Keep samples of your child's work throughout the year, especially writing samples and major projects.\n\n3. **Reading Lists**: Track books read independently and as read-alouds.\n\n4. **Curriculum Plans**: Document what materials you're using for each subject.\n\n5. **Progress Reports**: Consider quarterly assessments of progress and goals.\n\n6. **Standardized Test Results**: If your state requires testing, keep these records.\n\n7. **Field Trips and Activities**: Document educational outings and extracurricular activities.\n\nDigital tools that can help:\n- Homeschool Planet\n- Homeschool Tracker\n- Trello or Notion for digital organization\n- Google Drive for storing digital work samples\n\nCheck your specific state requirements, as they vary significantly in terms of what records you must maintain and submit.";
    }
    
    // Default response for other queries
    return "That's a great question about homeschooling! While I don't have specific information on that topic, I can suggest some approaches to find what you're looking for:\n\n1. Check the resource library in the app for related materials\n\n2. Browse the community groups to connect with other homeschoolers who might have experience with this\n\n3. Try using the advanced search feature with specific keywords related to your question\n\nWould you like me to help you formulate a more specific search or connect you with relevant community groups?";
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-[600px]">
        {/* Chat header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h2 className="text-lg font-semibold">Homeschool AI Assistant</h2>
          </div>
          <button
            onClick={handleClearChat}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {chatHistory.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="whitespace-pre-line">{message.content}</div>
                <div 
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="mb-4 flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggested questions */}
        {chatHistory.length < 3 && (
          <div className="p-3 bg-blue-50 border-t border-blue-100">
            <p className="text-sm font-medium text-blue-800 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-sm bg-white border border-blue-200 rounded-full px-3 py-1 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Message input */}
        <div className="p-3 border-t">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`bg-blue-600 text-white rounded-r-lg px-4 py-2 ${
                isLoading || !currentMessage.trim() 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-700'
              }`}
              disabled={isLoading || !currentMessage.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            This AI assistant can help with homeschooling questions, suggest resources, and provide guidance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(AIAssistant, {
  onError: (error, errorInfo) => {
    console.error('Error in AIAssistant component:', error, errorInfo);
  }
});
