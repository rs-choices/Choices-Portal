'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { LOCATIONS, USER, VENUE } from '@/lib/portal/data';
import { SECTIONS, sectionHref } from '@/lib/portal/sections';
import { usePortal } from './PortalProvider';

// Three layouts, switched by breakpoint:
//   under 1024px   off-canvas drawer, opened from the header menu button
//   1024-1279px    76px rail with icons only
//   1280px and up  260px sidebar with labels
// `hidden lg:… xl:…` pairs below hide the labels in the icon rail only.
export function Sidebar({ open, onClose, highlight }: { open: boolean; onClose: () => void; highlight: boolean }) {
  const pathname = usePathname();
  const { plan, bookings, location, setLocation, showToast } = usePortal();
  const [userOpen, setUserOpen] = useState(false);
  const pending = bookings.filter((b) => b.status === 'requested').length;

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-39 bg-scrim/40 lg:hidden" />}
      {userOpen && <div onClick={() => setUserOpen(false)} className="fixed inset-0 z-25" />}
      <aside
        className={`fixed top-0 left-0 z-40 flex h-screen w-[260px] shrink-0 flex-col border-r border-border-subtle bg-surface transition-[transform,width] duration-200 lg:sticky lg:w-[76px] lg:translate-x-0 xl:w-[260px] ${
          open ? 'translate-x-0' : '-translate-x-[105%]'
        } ${highlight ? 'shadow-tour-ring' : ''}`}
      >
        <div className="flex h-[76px] items-center gap-2 px-3.5 lg:justify-center lg:px-0 xl:justify-start xl:px-3.5">
          <Image src="/assets/choices-logo-01.png" alt="Choices" width={108} height={40} priority className="-ml-1 h-10 w-auto lg:hidden xl:block" />
          <div className="hidden size-10 place-items-center overflow-hidden rounded-[12px] bg-brand-peach/10 lg:grid xl:hidden">
            <Image src="/assets/choices-logo-01.png" alt="Choices" width={118} height={44} className="ml-[52px] h-11 w-auto max-w-none" />
          </div>
          <div className="flex-1 lg:hidden" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-9 cursor-pointer place-items-center rounded-[12px] border-none bg-fill-soft text-brand-purple lg:hidden"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
          {SECTIONS.map((s) => {
            const active = pathname === sectionHref(s.id);
            const locked = s.id === 'analytics' && plan === 'Starter';
            const badge = s.id === 'bookings' && pending ? pending : null;
            return (
              <Link
                key={s.id}
                href={sectionHref(s.id)}
                title={s.label}
                onClick={onClose}
                className={`relative flex h-11 items-center gap-3 rounded-md px-3.5 text-sm font-semibold lg:justify-center lg:px-0 xl:justify-start xl:px-3.5 ${
                  active ? 'bg-brand-purple text-inverse hover:text-inverse' : 'text-fg-soft hover:bg-brand-purple/6 hover:text-fg-soft'
                }`}
              >
                <Icon name={s.icon} size={20} />
                <span className="flex-1 lg:hidden xl:inline">{s.label}</span>
                {locked && (
                  <span className="rounded-pill bg-brand-peach/14 px-[7px] py-[3px] text-[10px] font-bold tracking-[0.04em] text-peach-ink lg:hidden xl:inline">
                    GROWTH
                  </span>
                )}
                {badge && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-[10px] bg-brand-peach px-1.5 text-[11px] font-bold text-inverse">{badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="relative border-t border-border-subtle p-3">
          <div className="mb-2.5 flex flex-col gap-1 rounded-lg bg-page px-3.5 py-3 lg:hidden xl:flex">
            <div className="text-sm font-bold text-brand-purple">{VENUE}</div>
            <div className="text-xs text-ink-muted">{LOCATIONS[location]}, Dubai</div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="rounded-pill bg-brand-peach/14 px-2.5 py-1 text-xs font-bold text-peach-ink">{plan} plan</span>
              {plan === 'Starter' && (
                <Link href="/billing" onClick={onClose} className="text-xs font-bold text-brand-purple hover:text-brand-peach">
                  Upgrade
                </Link>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setUserOpen((o) => !o)}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-md border-none bg-transparent p-1.5 text-left hover:bg-fill-soft lg:justify-center xl:justify-start"
          >
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-purple text-[13px] font-bold text-inverse">{USER.initials}</div>
            <div className="min-w-0 flex-1 lg:hidden xl:block">
              <div className="font-semibold text-fg">{USER.name}</div>
              <div className="text-xs text-ink-muted">{USER.role}</div>
            </div>
            <Icon name="chevronUp" size={16} stroke={2} className="text-fg-muted lg:hidden xl:block" />
          </button>

          {userOpen && (
            <div className="absolute bottom-[72px] left-3 z-60 flex w-[236px] flex-col gap-0.5 rounded-lg bg-surface p-2 shadow-popover">
              {plan === 'Enterprise' && (
                <>
                  <div className="px-2.5 pt-2 pb-1 text-[11px] font-bold tracking-[0.06em] text-fg-subtle">LOCATIONS</div>
                  {LOCATIONS.map((l, i) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => {
                        setLocation(i);
                        setUserOpen(false);
                        showToast(`Switched to ${VENUE} · ${l}`);
                      }}
                      className="flex cursor-pointer items-center gap-2.5 rounded-[10px] border-none bg-transparent p-2.5 text-left text-[13px] text-fg hover:bg-fill-soft"
                    >
                      <span className={`size-2 rounded-full ${i === location ? 'bg-brand-peach' : 'bg-line-strong'}`} />
                      {VENUE} · {l}
                    </button>
                  ))}
                  <div className="my-1 h-px bg-surface-muted" />
                </>
              )}
              {[
                ['/settings', 'Account settings', 'text-fg'],
                ['/help', 'Help & support', 'text-fg'],
                ['/sign-in', 'Sign out', 'text-danger'],
              ].map(([href, label, color]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    setUserOpen(false);
                    onClose();
                  }}
                  className={`rounded-[10px] p-2.5 text-[13px] hover:bg-fill-soft ${color}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
