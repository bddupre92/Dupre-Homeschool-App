"use client";

import React from 'react';
import Navigation from '../../components/Navigation';
import BoardsGrid from '../../components/Boards/BoardsGrid';

export default function BoardsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Boards</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Create and organize collections of your favorite homeschool resources, activities, and ideas
        </p>
        
        <BoardsGrid />
      </div>
    </div>
  );
}
