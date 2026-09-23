'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePortal } from '@/components/portal/PortalProvider';
import { Card, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Segmented } from '@/components/ui/Segmented';
import { IMG, RANGES, SERIES, VENUE, VIEW_SOURCES, type Range } from '@/lib/portal/data';
import { fmtTime } from '@/lib/portal/format';
import { Chart, ChartLabels, Legend } from './Chart';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOUR_LABELS = ['7 AM', '', '9 AM', '', '11 AM', '', '1 PM', '', '3 PM', '', '5 PM', '', '7 PM', '', '9 PM', ''];

// Sample busyness for 7 AM to 10 PM: morning, lunch and evening peaks, with
// Thursday to Saturday evenings busiest.
const HEAT = DAYS.map((day, di) => ({
  day,
  cells: Array.from({ length: 16 }).map((_, hi) => {
    const h = hi + 7;
    let v = 0.12 + 0.55 * Math.exp(-((h - 9) ** 2) / 3) + 0.35 * Math.exp(-((h - 13) ** 2) / 2) + 0.6 * Math.exp(-((h - 19) ** 2) / 4) * (di >= 3 && di <= 5 ? 1.4 : 0.8);
    v = Math.min(1, v * (di >= 4 ? 1.1 : 1));
    return { a: 0.08 + v * 0.92, t: `${day} ${fmtTime(String(h).padStart(2, '0') + ':00')}` };
  }),
}));

export function Analytics() {
  const { plan, offers } = usePortal();
  const [range, setRange] = useState<Range>('7d');
  const d = SERIES[range];
  const locked = plan === 'Starter';
  const best = offers
    .filter((o) => o.claims > 0)
    .sort((a, b) => b.claims - a.claims)
    .slice(0, 5);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-[15px] text-fg-muted">How people find {VENUE}, and what makes them come in.</div>
        <Segmented options={RANGES} value={range} onChange={setRange} />
      </div>

      <div className="relative">
        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4 ${locked ? 'pointer-events-none blur-[5px]' : ''}`}
          aria-hidden={locked}
        >
          <Card className="col-span-full flex flex-col gap-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Views, claims and bookings</CardTitle>
              <Legend
                items={[
                  ['Views', 'bg-brand-peach'],
                  ['Claims', 'bg-brand-teal'],
                  ['Bookings', 'bg-brand-purple'],
                ]}
              />
            </div>
            <Chart height={240} lines={[[d.v, 'stroke-brand-peach'], [d.c, 'stroke-brand-teal'], [d.b, 'stroke-brand-purple']]} />
            <ChartLabels labels={d.lbl} />
          </Card>

          <Card className="flex flex-col gap-3.5 p-6">
            <CardTitle>Best-performing offers</CardTitle>
            {best.map((o) => (
              <div key={o.id} className="flex items-center gap-3">
                <div role="img" style={{ backgroundImage: `url('${IMG[o.img]}')` }} className="size-10 shrink-0 rounded-[12px] bg-surface-muted bg-cover bg-center" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex justify-between gap-2 text-[13px]">
                    <span className="truncate font-semibold">{o.title}</span>
                    <span className="whitespace-nowrap text-fg-muted">
                      {o.claims} claims · {((o.claims / o.views) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar pct={(o.claims / best[0].claims) * 100} barClass="bg-brand-purple" />
                </div>
              </div>
            ))}
          </Card>

          <Card className="flex flex-col gap-4 p-6">
            <CardTitle>Where views come from</CardTitle>
            <div className="flex h-3.5 gap-[3px] overflow-hidden rounded-[14px]">
              {VIEW_SOURCES.map((s) => (
                <div key={s.label} style={{ width: `${s.pct}%` }} className={s.className} />
              ))}
            </div>
            {VIEW_SOURCES.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 text-sm">
                <span className={`size-2.5 rounded-[3px] ${s.className}`} />
                <span className="flex-1">{s.label}</span>
                <span className="font-bold text-brand-purple">{s.pct}%</span>
              </div>
            ))}
          </Card>

          <Card className="col-span-full flex flex-col gap-3.5 overflow-x-auto p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>Busiest days and hours</CardTitle>
              <span className="text-[13px] text-fg-muted">Fridays and Saturdays from 6 to 9 PM are your peak.</span>
            </div>
            <div className="flex min-w-[620px] flex-col gap-1">
              {HEAT.map((row) => (
                <div key={row.day} className="grid grid-cols-[44px_repeat(16,minmax(0,1fr))] items-center gap-1">
                  <span className="text-xs font-semibold text-fg-muted">{row.day}</span>
                  {row.cells.map((c) => (
                    <div key={c.t} title={c.t} style={{ background: `rgba(244,114,97,${c.a.toFixed(2)})` }} className="h-[26px] rounded-md" />
                  ))}
                </div>
              ))}
              <div className="mt-1 grid grid-cols-[44px_repeat(16,minmax(0,1fr))] gap-1">
                <span />
                {HOUR_LABELS.map((h, i) => (
                  <span key={i} className="whitespace-nowrap text-[11px] text-fg-subtle">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {locked && (
          <div className="absolute inset-0 flex items-start justify-center pt-[120px]">
            <div className="mx-4 flex max-w-[420px] flex-col items-center gap-3 rounded-2xl bg-surface p-8 text-center shadow-lock">
              <div className="grid size-14 place-items-center rounded-full bg-brand-peach/12 text-brand-peach">
                <Icon name="lock" size={26} />
              </div>
              <span className="rounded-pill bg-brand-peach/14 px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] text-peach-ink">GROWTH PLAN</span>
              <h2 className="m-0 text-xl font-bold text-brand-purple">See what&apos;s really bringing people in</h2>
              <div className="leading-[1.55] text-fg-muted">
                Find your busiest hours, your best offers and where your views come from. Growth also gets you priority placement in search.
              </div>
              <Link href="/billing" className="ds-button mt-1.5 min-h-0 px-[26px] py-3.5 text-sm font-bold">
                Upgrade to Growth · AED 799/mo
              </Link>
              <span className="text-xs text-fg-subtle">Monthly billing. Cancel any time.</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
