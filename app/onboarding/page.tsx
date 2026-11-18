import type { Metadata } from 'next';
import { Onboarding } from '@/components/auth/Onboarding';

export const metadata: Metadata = { title: 'Set up your business' };

export default function Page() {
  return <Onboarding />;
}
