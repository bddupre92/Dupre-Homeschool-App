"use client";

import React from 'react';
import { CommunityEvents } from '../../../components/Community/CommunityEvents';
import Link from 'next/link';

export default function CommunityEventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/community" className="text-blue-600 hover:text-blue-800 mr-4">
          ← Back to Community
        </Link>
        <h1 className="text-3xl font-bold">Events & Meetups</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 mb-4">
          Discover virtual and in-person homeschool events and meetups near you.
          Connect with other homeschoolers, attend workshops, and join field trips.
        </p>
      </div>
      
      <CommunityEvents />
    </div>
  );
}
