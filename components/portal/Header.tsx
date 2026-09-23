'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PLAN_PRICE } from '@/lib/portal/data';
import { ACTION_TOAST, type SectionId } from '@/lib/portal/sections';
import { usePortal } from './PortalProvider';

export function Header({
  section,
  title,
  action,
  onMenu,
  highlight,
}: {
  section: SectionId;
  title: string;
  action: string;
  onMenu: () => void;
  highlight: 'btn' | 'bell' | null;
}) {
  const router = useRouter();
  const { plan, openOfferForm, showToast, tour } = usePortal();
  const [notifOpen, setNotifOpen] = useState(false);
  const newOffer = section === 'dashboard' || section === 'offers';

  const notifications = [
    { title: 'New booking request', body: 'Noura Al Suwaidi, party of 6 at 5:30 PM', when: '2 min ago', href: '/bookings' },
    { title: 'Offer ending soon', body: 'Spanish latte 2-for-1 ends in 14 minutes', when: '5 min ago', href: '/offers' },
    { title: 'New 5-star review', body: 'Fatima Al Mansoori: “Best Spanish latte in Jumeirah…”', when: '2 days ago', href: '/customers' },
    { title: 'Next payment on 1 Oct', body: `${PLAN_PRICE[plan]} + VAT for your ${plan} plan`, when: '3 days ago', href: '/billing' },
  ];

  return (
    <>
      {notifOpen && <div onClick={() => setNotifOpen(false)} className="fixed inset-0 z-25" />}
      <header
        className={`sticky top-0 flex items-center gap-3 border-b border-black/4 bg-page/92 px-7 py-4 backdrop-blur-[10px] ${tour !== null ? 'z-36' : 'z-30'}`}
      >
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-[12px] border-none bg-surface text-brand-purple shadow-soft lg:hidden"
        >
          <Icon name="menu" size={20} />
        </button>
        <h1 className="m-0 min-w-0 flex-1 truncate text-[22px] font-bold text-brand-purple">{title}</h1>

        <label className="hidden h-[42px] w-[min(280px,28vw)] items-center gap-2 rounded-pill bg-surface px-4 text-fg-subtle shadow-[0_2px_6px_rgba(0,0,0,0.05)] min-[900px]:flex">
          <Icon name="search" size={18} />
          <input
            placeholder="Search bookings, customers, offers"
            className="min-w-0 flex-1 border-none bg-transparent text-[13px] text-fg outline-none focus-visible:outline-none"
          />
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Notifications"
            className={`relative grid size-[42px] cursor-pointer place-items-center rounded-full border-none bg-surface text-brand-purple ${
              highlight === 'bell' ? 'shadow-tour-ring' : 'shadow-[0_2px_6px_rgba(0,0,0,0.05)]'
            }`}
          >
            <Icon name="bell" size={20} />
            <span className="absolute top-[9px] right-2.5 size-[9px] rounded-full border-2 border-surface bg-brand-peach" />
          </button>
          {notifOpen && (
            <div className="absolute top-[52px] right-0 z-60 w-[340px] max-w-[calc(100vw-32px)] rounded-xl bg-surface p-2 shadow-popover">
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-[15px] font-bold text-brand-purple">Notifications</span>
                <span className="text-xs text-ink-muted">4 new</span>
              </div>
              {notifications.map((n) => (
                <button
                  key={n.title}
                  type="button"
                  onClick={() => {
                    setNotifOpen(false);
                    router.push(n.href);
                  }}
                  className="flex w-full cursor-pointer gap-3 rounded-md border-none bg-transparent p-3 text-left hover:bg-page"
                >
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-peach" />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold text-fg">{n.title}</span>
                    <span className="text-[13px] text-fg-muted">{n.body}</span>
                    <span className="text-[11px] text-fg-subtle">{n.when}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          size="header"
          onClick={() => (newOffer ? openOfferForm() : showToast(ACTION_TOAST[section] ?? ''))}
          className={`shrink-0 ${highlight === 'btn' ? 'shadow-tour-ring' : ''}`}
        >
          {newOffer && <Icon name="plus" size={18} stroke={2.2} />}
          {action}
        </Button>
      </header>
    </>
  );
}
