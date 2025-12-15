import { Metadata } from 'next';
import AnniversaryContent from './AnniversaryContent';

export const metadata: Metadata = {
    title: '20th Anniversary | Mode Men Magazine',
    description: 'Celebrating 20 years of defining style. Join the campaign, view our archive, and see upcoming events.',
    openGraph: {
        title: '20th Anniversary | Mode Men Magazine',
        description: 'Celebrating 20 years of defining style. Join the campaign, view our archive, and see upcoming events.',
    },
};

export default function AnniversaryPage() {
    return <AnniversaryContent />;
}
