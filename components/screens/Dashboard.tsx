'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePortal } from '@/components/portal/PortalProvider';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Segmented } from '@/components/ui/Segmented';
import { IMG, RANGES, SERIES, VENUE, type Range } from '@/lib/portal/data';
import { firstName } from '@/lib/portal/format';
import { Chart, ChartLabels, Legend } from './Chart';

export function Dashboard() {
  const router = useRouter();
  const { offers, bookings, checklist, completeChecklist, openOfferForm, setBookingStatus } = usePortal();
  const [range, setRange] = useState<Range>('7d');
  const d = SERIES[range];

  const items = [
    { key: 'profile', label: 'Complete your profile', sub: 'Add a description and opening hours', go: () => router.push('/profile') },
    {
      key: 'photos',
      label: 'Add photos',
      sub: 'Venues with 5+ photos get 2× more views',
      go: () => {
        completeChecklist('photos');
        router.push('/profile');
      },
    },
    { key: 'offer', label: 'Post your first offer', sub: 'Offers put you in front of people nearby', go: () => openOfferForm() },
  ] as const;
  const done = items.filter((c) => checklist[c.key]).length;

  const live = offers.filter((o) => o.live && o.status === 'active');
  // Bookings still to come today. The design's clock reads 10:46 AM.
  const upcoming = bookings.filter((b) => (b.status === 'confirmed' || b.status === 'requested') && b.t > 1046);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[26px] font-bold text-fg">Good morning, Layla</div>
          <div className="text-[15px] text-ink-muted">Here&apos;s how {VENUE} is doing · Wednesday, 23 September</div>
        </div>
        <Segmented options={RANGES} value={range} onChange={setRange} />
      </div>

      {done < 3 && (
        <Card className="flex flex-wrap items-center gap-6 px-6 py-5">
          <div className="flex flex-[1_1_220px] flex-col gap-2.5">
            <div className="text-base font-bold text-brand-purple">Get the most out of Choices</div>
            <div className="text-[13px] text-fg-muted">{done} of 3 done</div>
            <ProgressBar pct={(done / 3) * 100} />
          </div>
          <div className="grid flex-[3_1_480px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
            {items.map((c) => {
              const isDone = checklist[c.key];
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={c.go}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border-none bg-page p-3.5 text-left hover:bg-fill-row"
                >
                  {isDone ? (
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-teal text-inverse">
                      <Icon name="check" size={14} stroke={3} />
                    </span>
                  ) : (
                    <span className="size-6 shrink-0 rounded-full border-2 border-line-dashed" />
                  )}
                  <span className="flex flex-col gap-0.5">
                    <span className={`font-semibold ${isDone ? 'text-fg-subtle line-through' : 'text-fg'}`}>{c.label}</span>
                    <span className="text-xs text-ink-muted">{c.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {d.stats.map(([label, value, delta, up]) => (
          <Card key={label} className="flex flex-col gap-2.5 p-5">
            <div className="font-medium text-fg-muted">{label}</div>
            <div className="text-[30px] font-bold tracking-[-0.01em] text-brand-purple">{value}</div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-ink-muted">
              <span className={`whitespace-nowrap rounded-pill px-2 py-[3px] font-bold ${up ? 'bg-brand-teal/10 text-teal-ink-bright' : 'bg-brand-peach/12 text-danger'}`}>
                {delta}
              </span>
              {d.vs}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4">
        <Card className="col-span-full flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Views and bookings</CardTitle>
            <Legend
              items={[
                ['Listing views', 'bg-brand-peach'],
                ['Bookings', 'bg-brand-purple'],
              ]}
            />
          </div>
          <Chart height={220} area={d.v} lines={[[d.v, 'stroke-brand-peach'], [d.b, 'stroke-brand-purple']]} />
          <ChartLabels labels={d.lbl} />
        </Card>

        <Card className="flex flex-col gap-3.5 p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-brand-peach shadow-live-dot" />
              Live now
            </CardTitle>
            <Link href="/offers" className="font-semibold text-brand-peach hover:text-brand-peach-hover">
              View all
            </Link>
          </div>
          {live.map((o) => (
            <div key={o.id} className="flex items-center gap-3.5">
              <div role="img" style={{ backgroundImage: `url('${IMG[o.img]}')` }} className="size-14 shrink-0 rounded-md bg-surface-muted bg-cover bg-center" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex justify-between gap-2">
                  <span className="truncate font-semibold">{o.title}</span>
                  <span className="whitespace-nowrap text-xs font-bold text-peach-ink">{o.left}</span>
                </div>
                <ProgressBar pct={o.pct ?? 0} height={5} />
                <div className="text-xs text-ink-muted">
                  {o.deal} · {o.claims} claims
                </div>
              </div>
            </div>
          ))}
        </Card>

        <Card className="flex flex-col gap-1.5 p-6">
          <div className="mb-2 flex items-center justify-between">
            <CardTitle>Coming up today · {upcoming.length}</CardTitle>
            <Link href="/bookings" className="font-semibold text-brand-peach hover:text-brand-peach-hover">
              All bookings
            </Link>
          </div>
          {upcoming.map((b) => (
            <div key={b.id} className="flex items-center gap-3 border-t border-line-soft py-2.5">
              <div className="w-16 shrink-0 text-[13px] font-bold text-brand-purple">{b.time}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{b.name}</div>
                <div className="text-xs text-ink-muted">
                  Party of {b.party}
                  {b.offer !== '—' && ` · ${b.offer}`}
                </div>
              </div>
              {b.status === 'requested' && (
                <Button size="xs" onClick={() => setBookingStatus(b.id, 'confirmed', `Booking confirmed. ${firstName(b.name)} has been notified.`)}>
                  Confirm
                </Button>
              )}
              {b.status === 'confirmed' && (
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => setBookingStatus(b.id, 'checkedin', `${firstName(b.name)} checked in${b.offer !== '—' ? '. Offer redeemed.' : ''}`)}
                >
                  Check in
                </Button>
              )}
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
