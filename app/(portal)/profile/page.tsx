import type { Metadata } from 'next';
import { Profile } from '@/components/screens/Profile';

export const metadata: Metadata = { title: 'Business profile' };

export default function Page() {
  return <Profile />;
}
