import { Metadata } from 'next';
import { Suspense } from 'react';
import ArticlesContent from './ArticlesContent';

export const metadata: Metadata = {
  title: 'Articles | Mode Men Magazine',
  description: 'Read the latest stories on style, culture, business, and more from Mode Men Magazine.',
  openGraph: {
    title: 'Articles | Mode Men Magazine',
    description: 'Read the latest stories on style, culture, business, and more from Mode Men Magazine.',
  },
};

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div>Loading articles...</div>}>
      <ArticlesContent />
    </Suspense>
  );
}
