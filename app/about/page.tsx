import { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
    title: 'About Us | Mode Men Magazine',
    description: 'Defining the modern man since 2005. Discover our history, team, and brand values.',
    openGraph: {
        title: 'About Us | Mode Men Magazine',
        description: 'Defining the modern man since 2005. Discover our history, team, and brand values.',
    },
};

export default function AboutPage() {
    return <AboutContent />;
}
