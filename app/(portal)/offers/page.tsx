import type { Metadata } from 'next';
import { Offers } from '@/components/screens/Offers';

export const metadata: Metadata = { title: 'Offers & Events' };

export default function Page() {
  return <Offers />;
}
