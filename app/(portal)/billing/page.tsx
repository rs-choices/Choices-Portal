import type { Metadata } from 'next';
import { Billing } from '@/components/screens/Billing';

export const metadata: Metadata = { title: 'Billing & plan' };

export default function Page() {
  return <Billing />;
}
