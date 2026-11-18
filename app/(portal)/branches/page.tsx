import type { Metadata } from 'next';
import { Branches } from '@/components/screens/Branches';

export const metadata: Metadata = { title: 'Branches' };

export default function Page() {
  return <Branches />;
}
