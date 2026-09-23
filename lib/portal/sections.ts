import type { IconName } from '@/components/ui/Icon';

export type SectionId = 'dashboard' | 'offers' | 'bookings' | 'customers' | 'analytics' | 'profile' | 'billing' | 'settings' | 'help';

// Sidebar order, page title, icon and the header's primary action per page.
export const SECTIONS: { id: SectionId; label: string; icon: IconName; action: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home', action: 'New offer' },
  { id: 'offers', label: 'Offers & Events', icon: 'tag', action: 'New offer' },
  { id: 'bookings', label: 'Bookings', icon: 'cal', action: 'Add walk-in' },
  { id: 'customers', label: 'Customers', icon: 'users', action: 'Export list' },
  { id: 'analytics', label: 'Analytics', icon: 'chart', action: 'Download report' },
  { id: 'profile', label: 'Venue profile', icon: 'store', action: 'Save changes' },
  { id: 'billing', label: 'Billing & plan', icon: 'card', action: 'Download invoice' },
  { id: 'settings', label: 'Settings', icon: 'sliders', action: 'Save changes' },
  { id: 'help', label: 'Help & support', icon: 'help', action: 'Contact support' },
];

export const sectionHref = (id: SectionId) => `/${id}`;

export function sectionFromPath(pathname: string) {
  const id = pathname.split('/')[1];
  return SECTIONS.find((s) => s.id === id) ?? SECTIONS[0];
}

// Toast shown by the header's primary action on pages where it is not "New offer".
export const ACTION_TOAST: Partial<Record<SectionId, string>> = {
  bookings: 'Walk-in added for 2 guests at 10:50 AM',
  customers: 'Customer list exported as CSV',
  analytics: 'Report downloaded (PDF)',
  profile: 'Profile saved. Changes are live in the app.',
  billing: 'Invoice INV-2026-09 downloaded',
  settings: 'Settings saved',
  help: 'A support agent will reply by email within a few hours',
};
