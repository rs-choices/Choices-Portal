import type { Metadata } from 'next';
import { Help } from '@/components/screens/Help';

export const metadata: Metadata = { title: 'Help & support' };

export default function Page() {
  return <Help />;
}
