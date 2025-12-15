import { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
    title: 'Contact Us | Mode Men Magazine',
    description: 'Get in touch with Mode Men Magazine. Headquarters, direct lines, and contact form.',
    openGraph: {
        title: 'Contact Us | Mode Men Magazine',
        description: 'Get in touch with Mode Men Magazine. Headquarters, direct lines, and contact form.',
    },
};

export default function ContactPage() {
    return <ContactContent />;
}
