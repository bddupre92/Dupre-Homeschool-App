"use client";

import React from 'react';
import { CommunityGroups } from '../../../components/Community/CommunityGroups';
import Link from 'next/link';

export default function CommunityGroupsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/community" className="text-blue-600 hover:text-blue-800 mr-4">
          ← Back to Community
        </Link>
        <h1 className="text-3xl font-bold">Community Groups</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 mb-4">
          Connect with other homeschoolers in interest-based groups and discussions.
          Find your community based on homeschooling approach, location, or shared interests.
        </p>
      </div>
      
      <CommunityGroups />
    </div>
  );
}
