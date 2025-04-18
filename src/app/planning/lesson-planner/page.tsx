"use client";

import React from 'react';
import { LessonPlanner } from '../../../components/Planning/LessonPlanner';
import Link from 'next/link';

export default function LessonPlannerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/planning" className="text-blue-600 hover:text-blue-800 mr-4">
          ← Back to Planning
        </Link>
        <h1 className="text-3xl font-bold">Lesson Planner</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-700 mb-4">
          Create and organize your homeschool lessons with our dynamic planning tool. 
          Plan by day, week, or month and organize by subject or child.
        </p>
      </div>
      
      <LessonPlanner />
    </div>
  );
}
