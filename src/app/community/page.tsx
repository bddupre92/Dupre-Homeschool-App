"use client";

import React from 'react';
import Navigation from '../../components/Navigation';
import Link from 'next/link';

export default function CommunityPage() {
  const communityLinks = [
    {
      title: 'Community Groups',
      description: 'Join groups based on homeschooling approach, location, or shared interests',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: '/community/groups'
    },
    {
      title: 'Community Events',
      description: 'Find local and virtual events, meetups, and workshops',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      path: '/community/events'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Connect with the Homeschool Community</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Share experiences, find local connections, and participate in events with other homeschooling families
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {communityLinks.map((link, index) => (
            <Link href={link.path} key={index}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-8 h-full flex flex-col items-center text-center">
                <div className="mb-4">
                  {link.icon}
                </div>
                <h2 className="text-2xl font-bold mb-2">{link.title}</h2>
                <p className="text-gray-600 mb-4">{link.description}</p>
                <div className="mt-auto">
                  <span className="text-blue-600 font-medium">Explore {link.title}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
