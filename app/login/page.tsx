import { Metadata } from 'next';
import LoginContent from './LoginContent';

export const metadata: Metadata = {
  title: 'Login | Mode Men Magazine',
  description: 'Sign in to access your Mode Men Magazine account, manage subscriptions, and shop exclusives.',
};

export default function LoginPage() {
  return <LoginContent />;
}
