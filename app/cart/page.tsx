import { Metadata } from 'next';
import CartContent from './CartContent';

export const metadata: Metadata = {
  title: 'Shopping Cart | Mode Men Magazine',
  description: 'Review your selected items and proceed to secure checkout.',
};

export default function CartPage() {
  return <CartContent />;
}
