"use client";
import React from 'react';
import { withErrorBoundary } from './index';
import ProfileForm from '../components/Auth/ProfileForm';
import Navigation from '../components/Navigation';
import Link from 'next/link';
import Image from 'next/image';

const ProfileFormWithErrorBoundary = withErrorBoundary(ProfileForm, {
  onError: (error, errorInfo) => {
    console.error('Error in ProfileForm component:', error, errorInfo);
  }
});

const handleSuccess = () => {
  console.log("Profile form submitted successfully on ProfilePage!");
  // Add navigation or other success actions here if needed
};

// Example data for content cards - replace with actual data fetching later
const posts = [
  {
    id: 1,
    tags: ['Elementary', 'Science', 'Montessori'],
    title: 'Nature Study: Exploring Your Backyard Ecosystem',
    description: 'A comprehensive guide to teaching children about local ecosystems through hands-on exploration and observation.',
    author: 'Sarah Johnson',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    authorImageUrl: null, // Placeholder
  },
  {
    id: 2,
    tags: ['Middle School', 'Math', 'Classical'],
    title: 'Hands-On Fractions: Beyond the Worksheet',
    description: 'Creative activities and games that make learning fractions engaging and intuitive for middle school students.',
    author: 'Michael Chen',
    imageUrl: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    authorImageUrl: null, // Placeholder
  },
  {
    id: 3,
    tags: ['Elementary', 'Language Arts', 'Charlotte Mason'],
    title: 'Creating a Literature-Rich Home Environment',
    description: 'Tips for building a reading culture in your home and fostering a love of literature in your children.',
    author: 'Emily Rodriguez',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    authorImageUrl: null, // Placeholder
  },
  // Add more post objects as needed
];

// Helper component for Select dropdowns (optional, but good practice)
const SelectInput = ({ label, options, defaultValue }: { label: string, options: string[], defaultValue?: string }) => (
  <div className="mr-4 my-2">
    <select
      aria-label={label}
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      defaultValue={defaultValue}
    >
      {options.map(option => <option key={option}>{option}</option>)}
    </select>
  </div>
);

export default function Home() {
  // TODO: Add state and handlers for filters if needed

  return (
    <main className="flex flex-col min-h-screen font-sans antialiased text-gray-800 bg-white">
      {/* Use your existing Navigation component or adapt the HTML */}
      <Navigation /> 

      {/* Hero Section */}
      <div className="hero-pattern py-12 sm:py-16"> {/* Apply background pattern style */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left flex flex-col justify-center">
              <div>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Inspire your</span>
                  <span className="block text-blue-600">homeschool journey</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Discover, save, and share homeschool inspiration. Connect with other homeschoolers, organize your curriculum, and track your progress all in one place.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link href="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                        Get started
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link href="/about" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                        Learn more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden aspect-video"> {/* Use aspect ratio */}
                  <Image 
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                    alt="Homeschooling setup with books and apple"
                    fill // Use fill layout
                    style={{ objectFit: 'cover' }} // Control how the image covers the area
                    priority // Prioritize loading for LCP
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 to-transparent">
                    <button aria-label="Play video" className="bg-white/90 rounded-full p-3 hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-blue-500">
                       <svg className="h-16 w-16 text-blue-600" fill="currentColor" viewBox="0 0 84 84">
                         <circle opacity="0.9" cx="42" cy="42" r="42" fill="white"/>
                         <path d="M55 41.5L36 55V28L55 41.5Z" fill="#3B82F6"/>
                       </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-t border-b border-gray-200"> {/* Add borders */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-wrap items-center justify-between gap-4"> {/* Use gap */}
            <div className="flex flex-wrap items-center">
              <SelectInput label="Filter by grade" options={['All Grades', 'Preschool', 'Elementary', 'Middle School', 'High School']} defaultValue="All Grades" />
              <SelectInput label="Filter by subject" options={['All Subjects', 'Math', 'Science', 'Language Arts', 'History', 'Art', 'Music']} defaultValue="All Subjects" />
              <SelectInput label="Filter by approach" options={['All Approaches', 'Classical', 'Charlotte Mason', 'Montessori', 'Unschooling', 'Waldorf', 'Eclectic']} defaultValue="All Approaches" />
            </div>
            <div className="flex items-center my-2">
              <span className="mr-2 text-sm text-gray-500 shrink-0">Sort by:</span> {/* Added shrink-0 */}
              <select 
                aria-label="Sort content"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue="Most Recent"
              >
                <option>Most Recent</option>
                <option>Most Popular</option>
                <option>Most Saved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow bg-gray-50"> {/* Added flex-grow and bg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="post-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg"> {/* Added border, hover shadow */}
              <div className="relative aspect-w-16 aspect-h-9"> {/* Consistent aspect ratio */}
                <Image 
                  src={post.imageUrl} 
                  alt={post.title}
                  fill
                  style={{ objectFit: 'cover' }} 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes prop
                />
              </div>
              <div className="p-4 flex flex-col"> {/* Adjusted padding */}
                <div className="flex items-center flex-wrap gap-2 mb-2"> {/* Use gap */}
                  {post.tags.map(tag => (
                     // Simple heuristic for tag colors - can be improved
                    <span key={tag} className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      tag === 'Elementary' || tag === 'Middle School' ? 'bg-blue-100 text-blue-800' :
                      tag === 'Science' || tag === 'Math' ? 'bg-green-100 text-green-800' :
                      tag === 'Montessori' || tag === 'Classical' || tag === 'Charlotte Mason' ? 'bg-purple-100 text-purple-800' :
                      tag === 'Language Arts' ? 'bg-pink-100 text-pink-800' : // Added pink
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600">
                  <Link href={`/posts/${post.id}`}> {/* Link the title */}
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-3 flex-grow">{post.description}</p> {/* Added flex-grow */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100"> {/* Added border top */}
                  <div className="flex items-center space-x-2">
                    {/* Placeholder Avatar */}
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"> 
                       {post.authorImageUrl ? (
                         <Image src={post.authorImageUrl} alt={post.author} width={32} height={32} />
                       ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                       )}
                    </div>
                    <span className="text-sm text-gray-500 hover:text-gray-800">
                      <Link href={`/users/${post.author}`}>{post.author}</Link> {/* Link author */}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-blue-600 transition-colors duration-150" aria-label="Save post">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
