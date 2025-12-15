import { Metadata } from 'next';
import SignupContent from './SignupContent';

export const metadata: Metadata = {
  title: 'Sign Up | Mode Men Magazine',
  description: 'Join Mode Men Magazine to access exclusive content, shop members-only products, and more.',
};

export default function SignupPage() {
  return <SignupContent />;
}
