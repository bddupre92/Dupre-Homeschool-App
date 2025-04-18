"use client";

import React from 'react';
import Navigation from '../../components/Navigation';
import Link from 'next/link';

export default function PlanningPage() {
  const planningTools = [
    {
      title: 'Lesson Planner',
      description: 'Create and manage your weekly lesson plans, track recurring activities, and organize your curriculum',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      path: '/planning/lesson-planner'
    },
    {
      title: 'Progress Tracker',
      description: 'Monitor and visualize your student\'s progress across different subjects and learning goals',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/planning/progress-tracker'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Homeschool Planning Tools</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Organize your homeschool journey with our powerful and intuitive planning tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {planningTools.map((tool, index) => (
            <Link href={tool.path} key={index}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-8 h-full flex flex-col items-center text-center">
                <div className="mb-4">
                  {tool.icon}
                </div>
                <h2 className="text-2xl font-bold mb-2">{tool.title}</h2>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="mt-auto">
                  <span className="text-blue-600 font-medium">Open {tool.title}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 bg-blue-50 rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Planning Tips</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Start with setting clear goals for each semester or learning period</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Balance structure with flexibility to accommodate learning opportunities</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Review and adjust your plans regularly based on your student's progress</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
