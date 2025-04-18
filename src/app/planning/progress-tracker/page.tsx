"use client";

import React from 'react';
import { ProgressTracker } from '../../../components/Planning/ProgressTracker';
import Link from 'next/link';

export default function ProgressTrackerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/planning" className="text-blue-600 hover:text-blue-800 mr-4">
          ← Back to Planning
        </Link>
        <h1 className="text-3xl font-bold">Progress Tracker</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 mb-4">
          Track your child's progress across subjects with visual charts and reports.
          Monitor growth over time and identify areas that need more attention.
        </p>
      </div>
      
      <ProgressTracker />
    </div>
  );
}
