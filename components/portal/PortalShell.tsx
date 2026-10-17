'use client';

import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { ActivityFormModal } from '@/components/listings/ActivityFormModal';
import { EventFormModal } from '@/components/listings/EventFormModal';
import { sectionFromPath } from '@/lib/portal/sections';
import { AccountBanner } from './AccountBanner';
import { Header } from './Header';
import { ListingsProvider } from './ListingsProvider';
import { MessagesProvider } from './MessagesProvider';
import { OfferFormModal } from './OfferFormModal';
import { usePortal } from './PortalProvider';
import { Sidebar } from './Sidebar';
import { Toast } from './Toast';
import { TOUR, Tour } from './Tour';

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const section = sectionFromPath(pathname);
  const { tour } = usePortal();
  const [drawer, setDrawer] = useState(false);
  const hl = tour !== null ? TOUR[tour].hl : undefined;

  // On narrow screens the sidebar is a drawer, so the tour opens it for the
  // step that points at it.
  const onTourStep = (next: number | null) => {
    const narrow = window.matchMedia('(max-width: 1023px)').matches;
    setDrawer(next !== null && TOUR[next].hl === 'nav' && narrow);
  };

  return (
    <MessagesProvider>
      <ListingsProvider>
        <div className="flex min-h-screen bg-page text-sm text-fg">
          <Sidebar open={drawer} onClose={() => setDrawer(false)} highlight={hl === 'nav'} />
          <main className="flex min-w-0 flex-1 flex-col">
            <Header
              section={section.id}
              title={section.label}
              action={section.action}
              onMenu={() => setDrawer(true)}
              highlight={hl === 'btn' || hl === 'bell' ? hl : null}
            />
            <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-6 p-7">
              <AccountBanner />
              {children}
            </div>
          </main>
          <Tour onStep={onTourStep} />
          <OfferFormModal />
          <EventFormModal />
          <ActivityFormModal />
          <Toast />
        </div>
      </ListingsProvider>
    </MessagesProvider>
  );
}
