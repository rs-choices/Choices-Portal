'use client';

import Link from 'next/link';
import { usePortal, type OfferTab } from '@/components/portal/PortalProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PLAY } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { IMG, STATUS, type Offer } from '@/lib/portal/data';

const TABS: [OfferTab, string, (o: Offer) => boolean][] = [
  ['active', 'Active', (o) => o.status === 'active' || o.status === 'paused'],
  ['scheduled', 'Scheduled', (o) => o.status === 'scheduled'],
  ['draft', 'Drafts', (o) => o.status === 'draft'],
  ['expired', 'Expired', (o) => o.status === 'expired'],
];

export function Offers() {
  const { offers, plan, offerTab, setOfferTab, openOfferForm, updateOffer, duplicateOffer } = usePortal();
  const tab = TABS.find((t) => t[0] === offerTab)!;
  const list = offers.filter(tab[2]);
  const active = offers.filter((o) => o.status === 'active').length;
  const limit = plan === 'Starter' ? 10 : null;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-0.5 rounded-pill bg-surface-muted p-1">
          {TABS.map(([id, label, match]) => {
            const on = id === offerTab;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setOfferTab(id)}
                className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-pill border-none px-4 py-[9px] text-[13px] font-semibold ${
                  on ? 'bg-surface text-brand-purple shadow-segment' : 'bg-transparent text-fg-muted'
                }`}
              >
                {label}
                <span className="text-[11px] opacity-70">{offers.filter(match).length}</span>
              </button>
            );
          })}
        </div>
        <div className="flex min-w-[220px] flex-col gap-1.5">
          <div className="flex justify-between gap-3 text-[13px]">
            <span className="font-semibold text-brand-purple">
              {limit ? `${active} of ${limit} active offers` : `${active} active offers · Unlimited on ${plan}`}
            </span>
            {plan === 'Starter' && (
              <Link href="/billing" className="font-semibold text-brand-peach hover:text-brand-peach-hover">
                Go unlimited
              </Link>
            )}
          </div>
          <ProgressBar pct={limit ? Math.min(100, (active / limit) * 100) : 100} barClass={limit ? 'bg-brand-peach' : 'bg-brand-teal'} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {list.map((o) => (
          <OfferRow
            key={o.id}
            o={o}
            onPause={() => updateOffer(o.id, { status: 'paused', live: false }, 'Offer paused. It is hidden from the app until you resume it.')}
            onResume={() => updateOffer(o.id, { status: 'active' }, 'Offer resumed')}
            onEnd={() => updateOffer(o.id, { status: 'expired', live: false, dates: 'Ended today' }, 'Offer ended')}
            onEdit={() => openOfferForm(o)}
            onDuplicate={() => duplicateOffer(o)}
          />
        ))}
        {list.length === 0 && (
          <div className="flex flex-col items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-line-strong bg-surface p-10 text-center">
            <div className="text-base font-bold text-brand-purple">No {tab[1].toLowerCase()} offers</div>
            <div className="text-fg-muted">Offers you create will show up here.</div>
            <Button size="md" className="mt-1 py-3" onClick={() => openOfferForm()}>
              New offer
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

type RowProps = { o: Offer; onPause: () => void; onResume: () => void; onEnd: () => void; onEdit: () => void; onDuplicate: () => void };

function OfferRow({ o, onPause, onResume, onEnd, onEdit, onDuplicate }: RowProps) {
  const st = STATUS[o.status];
  return (
    <Card className="flex flex-wrap items-center gap-4 p-3.5">
      <div role="img" style={{ backgroundImage: `url('${IMG[o.img]}')` }} className="size-[84px] shrink-0 rounded-lg bg-surface-muted bg-cover bg-center" />
      <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-bold text-fg">{o.title}</span>
          <Badge className={`px-[9px] py-[3px] text-[11px] ${st.className}`}>{st.label}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-fg-muted">
          <span className="rounded-sm bg-brand-peach/12 px-2 py-0.5 font-bold text-peach-ink">{o.deal}</span>
          <span>{o.type}</span>·<span>{o.window}</span>·<span>{o.dates}</span>
        </div>
      </div>
      <div className="flex gap-6 px-2">
        <Metric label="Views" value={o.views} />
        <Metric label="Claims" value={o.claims} />
      </div>
      <div className="flex gap-1.5">
        {o.status === 'active' && <IconButton icon="pause" stroke={2.2} title="Pause" aria-label="Pause" onClick={onPause} />}
        {o.status === 'paused' && (
          <button
            type="button"
            title="Resume"
            aria-label="Resume"
            onClick={onResume}
            className="grid size-9 cursor-pointer place-items-center rounded-[12px] border-none bg-fill-soft text-brand-purple hover:bg-fill-hover"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current" aria-hidden="true">
              <path d={PLAY} />
            </svg>
          </button>
        )}
        {o.status !== 'expired' && <IconButton icon="edit" title="Edit" aria-label="Edit" onClick={onEdit} />}
        <IconButton icon="copy" title="Duplicate" aria-label="Duplicate" onClick={onDuplicate} />
        {(o.status === 'active' || o.status === 'paused' || o.status === 'scheduled') && (
          <button
            type="button"
            onClick={onEnd}
            className="h-9 cursor-pointer rounded-[12px] border-none bg-brand-peach/12 px-3 text-xs font-semibold text-peach-ink hover:bg-brand-peach/20"
          >
            End early
          </button>
        )}
        {o.status === 'expired' && (
          <button type="button" onClick={onDuplicate} className="h-9 cursor-pointer rounded-[12px] border-none bg-surface-purple px-3 text-xs font-semibold text-brand-purple">
            Run again
          </button>
        )}
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-ink-muted">{label}</span>
      <span className="text-base font-bold text-brand-purple">{value.toLocaleString('en-US')}</span>
    </div>
  );
}
