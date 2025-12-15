import { Metadata } from 'next';
import { getInterViews } from '../actions/interviewOps';
import InterviewsContent from './InterviewsContent';

export const metadata: Metadata = {
    title: 'Interviews | Mode Men Magazine',
    description: 'Intimate portraits and conversations with icons, trailblazers, and leaders shaping culture.',
    openGraph: {
        title: 'Interviews | Mode Men Magazine',
        description: 'Intimate portraits and conversations with icons, trailblazers, and leaders shaping culture.',
    },
};

export default async function InterviewsPage() {
    const interviews = await getInterViews();
    return <InterviewsContent initialInterviews={interviews || []} />;
}
