import type { Metadata } from 'next';
import { Onboarding } from '@/components/auth/Onboarding';

export const metadata: Metadata = { title: 'Set up your venue' };

export default function Page() {
  return <Onboarding />;
}
