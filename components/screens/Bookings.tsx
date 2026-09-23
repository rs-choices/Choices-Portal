'use client';

import { useState } from 'react';
import { usePortal } from '@/components/portal/PortalProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Segmented } from '@/components/ui/Segmented';
import { STATUS } from '@/lib/portal/data';
import { firstName } from '@/lib/portal/format';

const COLS = 'grid grid-cols-[90px_minmax(180px,2fr)_70px_minmax(160px,1.6fr)_150px_190px] gap-3 px-5 py-3.5';

// Sample week around today for the calendar view. Only Wednesday uses the real
// bookings; the other days are filler.
const DAYS = ['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27'];
const NAMES = ['Mariam S.', 'Khalid A.', 'Emma W.', 'Rashid M.', 'Leila K.', 'Tom B.', 'Huda R.', 'Vikram P.'];
const TIMES = ['8:00 AM', '9:30 AM', '12:00 PM', '1:30 PM', '5:30 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 AM', '3:00 PM', '6:30 PM'];
const COUNTS = [5, 6, 0, 7, 9, 11, 8];
const MORE = [0, 0, 0, 1, 3, 5, 2];

export function Bookings() {
  const { bookings, setBookingStatus } = usePortal();
  const [view, setView] = useState<'list' | 'cal'>('list');
  const open = bookings.filter((b) => b.status !== 'cancelled');
  const guests = open.reduce((a, b) => a + b.party, 0);
  const needConfirm = bookings.filter((b) => b.status === 'requested').length;

  const week = DAYS.map((day, i) => ({
    day,
    today: i === 2,
    items:
      i === 2
        ? open.map((b) => ({ time: b.time, name: `${firstName(b.name)} ${b.name.split(' ').slice(-1)[0][0]}.`, party: b.party, cls: STATUS[b.status].className }))
        : Array.from({ length: COUNTS[i] })
            .map((_, k) => ({ time: TIMES[k], name: NAMES[(i + k) % 8], party: (k % 4) + 2, cls: STATUS[i < 2 ? 'checkedin' : 'confirmed'].className }))
            .slice(0, 6),
    more: MORE[i],
  }));

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <DayButton icon="chevronLeft" label="Previous day" />
          <div className="flex flex-col">
            <span className="text-base font-bold text-brand-purple">Today, Wed 23 Sep</span>
            <span className="text-[13px] text-ink-muted">
              {open.length} bookings · {guests} guests
            </span>
          </div>
          <DayButton icon="chevronRight" label="Next day" />
        </div>
        <Segmented
          options={[
            ['list', 'List'],
            ['cal', 'Calendar'],
          ]}
          value={view}
          onChange={setView}
          size="lg"
        />
      </div>

      {needConfirm > 0 && (
        <div className="flex items-center gap-2.5 rounded-lg bg-brand-peach/10 px-[18px] py-3.5 font-medium text-peach-deep">
          <Icon name="clock" size={18} />
          {needConfirm} bookings are waiting for you to confirm. Customers are notified as soon as you do.
        </div>
      )}

      {view === 'list' ? (
        <Card className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className={`${COLS} border-b border-line-soft text-xs font-semibold text-ink-muted`}>
              <span>Time</span>
              <span>Customer</span>
              <span>Party</span>
              <span>Offer used</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
            {bookings.map((b) => {
              const st = STATUS[b.status];
              const name = firstName(b.name);
              return (
                <div key={b.id} className={`${COLS} items-center border-b border-line-faint`}>
                  <span className="font-bold text-brand-purple">{b.time}</span>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Avatar name={b.name} seed={b.id} />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-semibold">{b.name}</span>
                      <span className="text-xs text-ink-muted">{b.phone}</span>
                    </span>
                  </span>
                  <span className="font-semibold">{b.party}</span>
                  <span className="text-[13px] text-fg-soft">{b.offer}</span>
                  <span>
                    <Badge className={`px-2.5 py-1 text-xs ${st.className}`}>{st.label}</Badge>
                  </span>
                  <span className="flex justify-end gap-1.5">
                    {b.status === 'requested' && (
                      <Button size="xs" onClick={() => setBookingStatus(b.id, 'confirmed', `Booking confirmed. ${name} has been notified.`)}>
                        Confirm
                      </Button>
                    )}
                    {b.status === 'confirmed' && (
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => setBookingStatus(b.id, 'checkedin', `${name} checked in${b.offer !== '—' ? '. Offer redeemed.' : ''}`)}
                      >
                        Check in
                      </Button>
                    )}
                    {(b.status === 'requested' || b.status === 'confirmed') && (
                      <button
                        type="button"
                        title="Cancel booking"
                        aria-label="Cancel booking"
                        onClick={() => setBookingStatus(b.id, 'cancelled', 'Booking cancelled')}
                        className="grid size-8 cursor-pointer place-items-center rounded-full border-none bg-fill-soft text-fg-muted hover:bg-brand-peach/14"
                      >
                        <Icon name="close" size={14} stroke={2.2} />
                      </button>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-4">
          <div className="grid min-w-[880px] grid-cols-[repeat(7,minmax(120px,1fr))] gap-2.5">
            {week.map((d) => (
              <div key={d.day} className="flex min-h-[360px] flex-col gap-2 rounded-lg bg-fill-faint p-2">
                <div className={`rounded-[12px] p-2 text-center text-[13px] font-bold ${d.today ? 'bg-brand-purple text-inverse' : 'text-brand-purple'}`}>{d.day}</div>
                {d.items.map((it, k) => (
                  <div key={k} className={`flex flex-col gap-0.5 rounded-[12px] px-2.5 py-2 ${it.cls}`}>
                    <span className="text-[11px] font-bold">{it.time}</span>
                    <span className="text-xs font-semibold text-fg">{it.name}</span>
                    <span className="text-[11px]">Party of {it.party}</span>
                  </div>
                ))}
                {d.more > 0 && <span className="p-1 text-center text-xs font-semibold text-fg-muted">+{d.more} more</span>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </section>
  );
}

function DayButton({ icon, label }: { icon: 'chevronLeft' | 'chevronRight'; label: string }) {
  return (
    <button type="button" aria-label={label} className="grid size-9 cursor-pointer place-items-center rounded-[12px] border-none bg-surface text-brand-purple shadow-soft">
      <Icon name={icon} size={16} stroke={2} />
    </button>
  );
}
