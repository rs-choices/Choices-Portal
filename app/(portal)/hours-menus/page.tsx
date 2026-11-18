import type { Metadata } from 'next';
import { HoursMenus } from '@/components/screens/HoursMenus';

export const metadata: Metadata = { title: 'Hours & menus' };

export default function Page() {
  return <HoursMenus />;
}
