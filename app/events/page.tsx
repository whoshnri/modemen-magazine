import { Metadata } from 'next';
import EventsContent from './EventsContent';
import { getEvents } from '../actions/fetchEvents';

export const metadata: Metadata = {
    title: 'Events | Mode Men Magazine',
    description: 'Discover upcoming events, galas, and exclusive gatherings curated by Mode Men Magazine.',
    openGraph: {
        title: 'Events | Mode Men Magazine',
        description: 'Discover upcoming events, galas, and exclusive gatherings curated by Mode Men Magazine.',
    },
};

export default async function EventsPage() {
    const events = await getEvents(0);
    return <EventsContent initialEvents={events || []} />;
}