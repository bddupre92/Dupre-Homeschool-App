import React from 'react';
import { withErrorBoundary } from '../../components/ErrorBoundary';
import ProfileForm from '../../components/Auth/ProfileForm';

const ProfileFormWithErrorBoundary = withErrorBoundary(ProfileForm, {
  onError: (error, errorInfo) => {
    console.error('Error in ProfileForm component:', error, errorInfo);
  }
});

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProfileFormWithErrorBoundary />
      </div>
    </div>
  );
}
