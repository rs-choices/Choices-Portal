'use client';

import { Icon } from '@/components/ui/Icon';
import { usePortal } from './PortalProvider';

export function Toast() {
  const { toast } = usePortal();
  if (!toast) return null;
  return (
    <div
      role="status"
      className="fixed bottom-7 left-1/2 z-200 flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-2.5 rounded-pill bg-brand-purple px-5 py-3.5 font-medium text-inverse shadow-toast"
    >
      <Icon name="check" size={18} stroke={2.2} className="text-brand-peach" />
      <span>{toast}</span>
    </div>
  );
}
