'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { usePortal } from './PortalProvider';

export const TOUR: { t: string; b: string; img?: boolean; hl?: 'nav' | 'btn' | 'bell' }[] = [
  { t: 'Welcome to your Choices portal', b: 'This is where you run Qahwa House on Choices: offers, bookings, customers and your listing. Here is a quick look around.', img: true },
  { t: 'Everything lives in the sidebar', b: 'Jump between your dashboard, offers, bookings and more. Your plan and venue are at the bottom, with your account menu.', hl: 'nav' },
  { t: 'Post an offer from any page', b: 'Every page has one main action in the top right. On the dashboard and Offers page, it creates a new offer with a live preview of how it looks in the app.', hl: 'btn' },
  { t: 'Never miss a booking', b: 'New bookings, reviews and offers about to end show up in notifications. Confirm and check people in from Bookings.', hl: 'bell' },
  { t: 'You are ready to go', b: 'Start with one simple offer, like a morning coffee deal. You can pause, edit or end it any time.' },
];

// Bottom sheet walkthrough. The highlighted element (sidebar, header button or
// bell) gets a peach ring from PortalShell; this renders only the card.
export function Tour({ onStep }: { onStep: (next: number | null) => void }) {
  const { tour, setTour, openOfferForm } = usePortal();
  if (tour === null) return null;
  const step = TOUR[tour];
  const last = tour === TOUR.length - 1;

  const go = (i: number | null) => {
    onStep(i);
    setTour(i);
  };

  return (
    <>
      <div className="fixed inset-0 z-35 bg-scrim/25" />
      <div className="fixed bottom-8 left-1/2 z-120 w-[min(440px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-2xl bg-surface shadow-dialog">
        {step.img && (
          <div className="relative h-[150px] bg-[url('/assets/notif-1.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-linear-to-t from-scrim/60 to-scrim/0 to-70%" />
            <Image
              src="/assets/choices-logo-01.png"
              alt="Choices"
              width={97}
              height={36}
              className="absolute bottom-3.5 left-5 h-9 w-auto rounded-[12px] bg-surface px-2 py-0.5"
            />
          </div>
        )}
        <div className="flex flex-col gap-3 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-[0.06em] text-peach-ink">
              STEP {tour + 1} OF {TOUR.length}
            </span>
            <button type="button" onClick={() => go(null)} className="cursor-pointer border-none bg-transparent text-[13px] font-medium text-fg-muted hover:text-brand-purple">
              Skip tour
            </button>
          </div>
          <h2 className="m-0 text-[21px] font-bold text-pretty text-brand-purple">{step.t}</h2>
          <div className="text-sm leading-[1.55] text-fg-soft">{step.b}</div>
          <div className="mt-1.5 flex items-center gap-2.5">
            <div className="flex flex-1 gap-1.5">
              {TOUR.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-md transition-[width] ${i === tour ? 'w-[22px] bg-brand-peach' : 'w-1.5 bg-line-strong'}`} />
              ))}
            </div>
            {tour > 0 && (
              <Button variant="secondary" size="md" className="px-[18px] py-[11px] text-[13px]" onClick={() => go(tour - 1)}>
                Back
              </Button>
            )}
            <Button
              size="md"
              className="px-5 py-[11px] text-[13px]"
              onClick={() => {
                if (last) {
                  go(null);
                  openOfferForm();
                } else go(tour + 1);
              }}
            >
              {last ? 'Post my first offer' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
