import { Metadata } from 'next';
import { Suspense } from 'react';
import ProfileContent from './ProfileContent';

export const metadata: Metadata = {
  title: 'My Profile | Mode Men Magazine',
  description: 'Manage your profile, orders, and subscriptions.',
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
