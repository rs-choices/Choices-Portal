'use client';

import { useState } from 'react';
import { usePortal } from '@/components/portal/PortalProvider';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { FAQ } from '@/lib/portal/data';

export function Help() {
  const { plan, showToast, startTour } = usePortal();
  const [open, setOpen] = useState(0);

  return (
    <section className="flex flex-wrap items-start gap-4">
      <Card className="flex flex-[2_1_480px] flex-col gap-1 p-6">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Common questions</CardTitle>
          <Button variant="secondary" size="xs" onClick={startTour}>
            Replay portal tour
          </Button>
        </div>
        {FAQ.map(([q, a], i) => (
          <div key={q} className="border-t border-line-soft">
            <button
              type="button"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 border-none bg-transparent py-4 text-left text-[15px] font-semibold text-fg"
            >
              {q}
              <Icon name="chevronDown" size={18} stroke={2} className={`text-brand-purple transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <div className="pb-4 leading-[1.6] text-fg-soft">{a}</div>}
          </div>
        ))}
      </Card>

      <div className="flex flex-[1_1_280px] flex-col gap-4">
        <Card className="flex flex-col gap-3 p-6">
          <CardTitle>Talk to us</CardTitle>
          <div className="text-sm leading-normal text-fg-muted">
            We&apos;re here Sunday to Thursday, 9 AM to 9 PM.{' '}
            {plan === 'Starter' && 'Replies within one working day.'}
            {plan === 'Growth' && 'Priority support: replies within 2 hours.'}
            {plan === 'Enterprise' && 'Your account manager is Reem Al Hashimi.'}
          </div>
          <div className="flex flex-col gap-2 text-sm font-semibold">
            <span>support@choices.ae</span>
            <span>+971 4 555 0199</span>
          </div>
          <Button size="md" className="py-[13px]" onClick={() => showToast('A support agent will reply by email within a few hours')}>
            Send a message
          </Button>
        </Card>

        <div className="relative flex min-h-[220px] items-end overflow-hidden rounded-xl bg-[url('/assets/popular-offer-hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-linear-to-t from-scrim/88 to-scrim/10 to-70%" />
          <div className="relative flex flex-col gap-2 p-5 text-inverse">
            <span className="text-[17px] font-bold">Write offers that get claimed</span>
            <span className="text-[13px] leading-normal opacity-92">Short titles, a clear deal and the right time window. Our guide walks you through it.</span>
            <Button variant="light" size="xs" className="mt-1 self-start px-4 py-2.5" onClick={() => showToast('Opening the offer-writing guide')}>
              Read the guide
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
