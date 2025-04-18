"use client";
import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import AdvancedSearch from '../../components/AdvancedSearch';
import AIAssistant from '../../components/AIAssistant';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('search');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Explore Content</h1>
        
        <div className="mb-8 border-b">
          <div className="flex space-x-8">
            <button
              className={`py-3 px-1 font-medium ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('search')}
            >
              Advanced Search
            </button>
            <button
              className={`py-3 px-1 font-medium ${activeTab === 'ai' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('ai')}
            >
              AI Assistant
            </button>
          </div>
        </div>
        
        {activeTab === 'search' ? (
          <AdvancedSearch />
        ) : (
          <AIAssistant />
        )}
      </div>
    </div>
  );
} 