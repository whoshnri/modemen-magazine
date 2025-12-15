import { Metadata } from 'next';
import ShopContent from './ShopContent';

export const metadata: Metadata = {
  title: 'Shop | Mode Men Magazine',
  description: 'Curated essentials, exclusive collaborations, and timeless pieces selected for the modern man.',
  openGraph: {
    title: 'Shop | Mode Men Magazine',
    description: 'Curated essentials, exclusive collaborations, and timeless pieces selected for the modern man.',
  },
};

export default function ShopPage() {
  return <ShopContent />;
}
