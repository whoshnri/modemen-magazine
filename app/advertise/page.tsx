import { Metadata } from 'next';
import AdvertiseContent from './AdvertiseContent';

export const metadata: Metadata = {
    title: 'Advertise | Mode Men Magazine',
    description: 'Connect your premium brand with the pulse of modern masculinity. Explore our media kit and advertising opportunities.',
    openGraph: {
        title: 'Advertise | Mode Men Magazine',
        description: 'Connect your premium brand with the pulse of modern masculinity. Explore our media kit and advertising opportunities.',
    },
};

export default function AdvertisePage() {
    return <AdvertiseContent />;
}
