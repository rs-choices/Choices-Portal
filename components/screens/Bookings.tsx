'use client';

import { useEffect, useState } from 'react';
import { AddBookingPanel } from '@/components/bookings/AddBookingPanel';
import { BranchTabs } from '@/components/bookings/BranchTabs';
import { useListings } from '@/components/portal/ListingsProvider';
import { usePortal } from '@/components/portal/PortalProvider';
import { useLock } from '@/components/portal/useLock';
import { useMounted } from '@/components/portal/useMounted';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Segmented } from '@/components/ui/Segmented';
import { STATUS, type Booking } from '@/lib/portal/data';
import { addDays, firstName, fmtDate, todayISO, weekdayIndex } from '@/lib/portal/format';
import { NEW_MARK } from '@/lib/portal/reviewMark';

// No Status column: a booking's state shows in its actions cell.
const COLS = 'grid grid-cols-[110px_minmax(180px,2fr)_70px_minmax(160px,1.6fr)_200px] gap-3 px-5 py-3.5';

// The branch tab lives in ?branch= so a link or a refresh keeps it.
function readBranchParam() {
  return new URLSearchParams(window.location.search).get('branch') ?? 'all';
}
function writeBranchParam(v: string) {
  const url = new URL(window.location.href);
  if (v === 'all') url.searchParams.delete('branch');
  else url.searchParams.set('branch', v);
  window.history.replaceState(null, '', url);
}

export function Bookings() {
  const { bookings, setBookingStatus } = usePortal();
  const { visibleBranches } = useListings();
  const lock = useLock('bookings.manage');
  const [view, setView] = useState<'list' | 'cal'>('list');
  const [tab, setTab] = useState('all');
  const [day, setDay] = useState(todayISO());
  const today = todayISO();
  const mounted = useMounted();

  useEffect(() => {
    const v = readBranchParam();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after hydration
    if (v !== 'all' && visibleBranches.some((b) => b.id === v)) setTab(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- read once, on first load
  }, []);

  const pickTab = (v: string) => {
    setTab(v);
    writeBranchParam(v);
  };

  const visibleIds = visibleBranches.map((b) => b.id);
  const inTab = bookings.filter((b) => visibleIds.includes(b.branchId) && (tab === 'all' || b.branchId === tab));
  const ofDay = inTab.filter((b) => b.date === day).sort((a, b) => a.t - b.t);
  const open = ofDay.filter((b) => b.status !== 'cancelled');
  const guests = open.reduce((a, b) => a + b.party, 0);
  const needConfirm = inTab.filter((b) => b.status === 'requested').length;
  const counts: Record<string, number> = { all: bookings.filter((b) => b.status === 'requested' && visibleIds.includes(b.branchId)).length };
  for (const id of visibleIds) counts[id] = bookings.filter((b) => b.status === 'requested' && b.branchId === id).length;
  const branchName = (id: string) => visibleBranches.find((b) => b.id === id)?.name ?? '';
  const showBranch = tab === 'all' && visibleBranches.length > 1;

  const monday = addDays(day, -weekdayIndex(day));
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const items = inTab.filter((b) => b.date === d && b.status !== 'cancelled').sort((a, b) => a.t - b.t);
    return { d, items: items.slice(0, 6), more: Math.max(0, items.length - 6) };
  });

  const title = day === today ? `Today, ${fmtDate(day)}` : day === addDays(today, 1) ? `Tomorrow, ${fmtDate(day)}` : fmtDate(day);

  // Everything below depends on today's date: drawn in the browser only, so
  // the server's date and timezone never disagree with the client's.
  if (!mounted) {
    return (
      <section className="flex flex-col gap-5">
        <BranchTabs value={tab} onChange={pickTab} counts={counts} />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <BranchTabs value={tab} onChange={pickTab} counts={counts} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <DayButton icon="chevronLeft" label={view === 'cal' ? 'Previous week' : 'Previous day'} onClick={() => setDay((d) => addDays(d, view === 'cal' ? -7 : -1))} />
          <div className="flex flex-col">
            <span className="text-base font-bold text-brand-purple">{title}</span>
            <span className="text-[13px] text-ink-muted">
              {open.length} bookings · {guests} guests
            </span>
          </div>
          <DayButton icon="chevronRight" label={view === 'cal' ? 'Next week' : 'Next day'} onClick={() => setDay((d) => addDays(d, view === 'cal' ? 7 : 1))} />
          {day !== today && (
            <Button variant="light" size="xs" onClick={() => setDay(today)} className={NEW_MARK}>
              Today
            </Button>
          )}
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
          <div className="min-w-[720px]">
            <div className={`${COLS} border-b border-line-soft text-xs font-semibold text-ink-muted`}>
              <span>Time</span>
              <span>Customer</span>
              <span>Party</span>
              <span>Offer used</span>
              <span className="text-right">Actions</span>
            </div>
            {ofDay.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-fg-muted">No bookings on this day.</div>}
            {ofDay.map((b) => (
              <Row key={b.id} b={b} branch={showBranch ? branchName(b.branchId) : null} lock={lock} setStatus={setBookingStatus} />
            ))}
          </div>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-4">
          <div className="grid min-w-[880px] grid-cols-[repeat(7,minmax(120px,1fr))] gap-2.5">
            {week.map(({ d, items, more }) => (
              <div key={d} className="flex min-h-[360px] flex-col gap-2 rounded-lg bg-fill-faint p-2">
                <button
                  type="button"
                  onClick={() => {
                    setDay(d);
                    setView('list');
                  }}
                  className={`cursor-pointer rounded-[12px] border-none p-2 text-center text-[13px] font-bold ${d === today ? 'bg-brand-purple text-inverse' : 'bg-transparent text-brand-purple'}`}
                >
                  {fmtDate(d)}
                </button>
                {items.map((it) => (
                  <div key={it.id} className={`flex flex-col gap-0.5 rounded-[12px] px-2.5 py-2 ${STATUS[it.status].className}`}>
                    <span className="text-[11px] font-bold">{it.time}</span>
                    <span className="text-xs font-semibold text-fg">{`${firstName(it.name)} ${it.name.split(' ').slice(-1)[0][0]}.`}</span>
                    <span className="text-[11px]">Party of {it.party}</span>
                    {showBranch && <span className="text-[10px] font-semibold">{branchName(it.branchId)}</span>}
                  </div>
                ))}
                {more > 0 && <span className="p-1 text-center text-xs font-semibold text-fg-muted">+{more} more</span>}
              </div>
            ))}
          </div>
        </Card>
      )}

      <AddBookingPanel
        defaultBranch={tab === 'all' ? null : tab}
        onSaved={(b) => {
          pickTab(b.branchId);
          setDay(b.date);
          setView('list');
        }}
      />
    </section>
  );
}

const SOURCE_LABEL = { app: null, phone: 'Phone', 'walk-in': 'Walk-in', other: 'Added by staff' } as const;

function Row({
  b,
  branch,
  lock,
  setStatus,
}: {
  b: Booking;
  branch: string | null;
  lock: { disabled: boolean; title?: string };
  setStatus: (id: number, s: Booking['status'], m: string) => void;
}) {
  const name = firstName(b.name);
  const done = b.status === 'cancelled' || b.status === 'noshow';
  const source = SOURCE_LABEL[b.source];
  return (
    <div className={`${COLS} items-center border-b border-line-faint ${b.status === 'requested' ? 'bg-brand-peach/6' : ''} ${done ? 'opacity-55' : ''}`}>
      <span className="flex flex-col">
        <span className="font-bold text-brand-purple">{b.time}</span>
        {branch && <span className={`mt-1.5 self-start px-1 text-xs font-semibold text-ink-muted ${NEW_MARK}`}>{branch}</span>}
      </span>
      <span className="flex min-w-0 items-center gap-2.5">
        <Avatar name={b.name} seed={b.id} />
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold">{b.name}</span>
          <span className="text-xs text-ink-muted">
            {b.phone}
            {source && ` · ${source}`}
          </span>
          {b.note && <span className="truncate text-xs text-fg-soft">{b.note}</span>}
        </span>
      </span>
      <span className="font-semibold">{b.party}</span>
      <span className="text-[13px] text-fg-soft">{b.offer}</span>
      <span className="flex items-center justify-end gap-1.5">
        {b.status === 'requested' && (
          <Button size="xs" {...lock} onClick={() => setStatus(b.id, 'confirmed', `Booking confirmed. ${name} has been notified.`)}>
            Confirm
          </Button>
        )}
        {b.status === 'confirmed' && (
          <Button variant="secondary" size="xs" {...lock} onClick={() => setStatus(b.id, 'checkedin', `${name} checked in${b.offer !== '—' ? '. Offer redeemed.' : ''}`)}>
            Check in
          </Button>
        )}
        {(b.status === 'requested' || b.status === 'confirmed') && (
          <button
            type="button"
            title={b.status === 'requested' ? 'Decline booking' : 'Cancel booking'}
            aria-label={b.status === 'requested' ? 'Decline booking' : 'Cancel booking'}
            disabled={lock.disabled}
            onClick={() => setStatus(b.id, 'cancelled', b.status === 'requested' ? 'Booking declined' : 'Booking cancelled')}
            className="grid size-8 cursor-pointer place-items-center rounded-full border-none bg-fill-soft text-fg-muted hover:bg-brand-peach/14 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Icon name="close" size={14} stroke={2.2} />
          </button>
        )}
        {b.status === 'checkedin' && <span className="text-[13px] font-semibold text-brand-purple">Checked in</span>}
        {b.status === 'noshow' && <span className="text-[13px] font-semibold text-fg-muted">No-show</span>}
        {b.status === 'cancelled' && <span className="text-[13px] font-semibold text-fg-muted">Cancelled</span>}
      </span>
    </div>
  );
}

function DayButton({ icon, label, onClick }: { icon: 'chevronLeft' | 'chevronRight'; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid size-9 cursor-pointer place-items-center rounded-[12px] border-none bg-surface text-brand-purple shadow-soft ${NEW_MARK}`}
    >
      <Icon name={icon} size={16} stroke={2} />
    </button>
  );
}
