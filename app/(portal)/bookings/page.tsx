import type { Metadata } from 'next';
import { Bookings } from '@/components/screens/Bookings';

export const metadata: Metadata = { title: 'Bookings' };

export default function Page() {
  return <Bookings />;
}
