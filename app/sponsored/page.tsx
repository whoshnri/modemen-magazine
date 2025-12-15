import { Metadata } from 'next';
import SponsoredContent from './SponsoredContent';

export const metadata: Metadata = {
    title: 'Sponsored Content | Mode Men Magazine',
    description: 'Explore our partners and sponsored features, showcasing the best in luxury, innovation, and culture.',
    openGraph: {
        title: 'Sponsored Content | Mode Men Magazine',
        description: 'Explore our partners and sponsored features, showcasing the best in luxury, innovation, and culture.',
    },
};

export default function SponsoredPage() {
    return <SponsoredContent />;
}
