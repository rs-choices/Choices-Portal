'use client';

import { useState } from 'react';
import { BranchFilter, useInBranch } from '@/components/listings/shared';
import { useListings } from '@/components/portal/ListingsProvider';
import { useMessages } from '@/components/portal/MessagesProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { IMG } from '@/lib/portal/data';
import { fmtDate, fmtTime } from '@/lib/portal/format';
import { LOCKED_REASON } from '@/lib/portal/messages';
import { EVENT_STATUS, placeLabel, type EventListing } from '@/lib/portal/places';

const WEEKDAY = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long' });
export const eventWhen = (e: EventListing) => (e.weekly ? `Every ${WEEKDAY(e.date)} · ${fmtTime(e.time)}` : `${fmtDate(e.date)} · ${fmtTime(e.time)}`);

// Events across all branches. Each one is its own listing on top of a place.
export function Events() {
  const { events, outlets, branches, openEventForm, setEventStatus } = useListings();
  const { suspended } = useMessages();
  const inBranch = useInBranch();
  const [branchId, setBranchId] = useState('');
  const list = events.filter((e) => inBranch(e.outletId, branchId));
  const lock = { disabled: suspended, title: suspended ? LOCKED_REASON : undefined };

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BranchFilter value={branchId} onChange={setBranchId} />
        <span className="text-[13px] text-fg-muted">{list.length} events</span>
      </div>
      <div className="flex flex-col gap-3">
        {list.map((e) => {
          const st = EVENT_STATUS[e.status];
          const live = e.status === 'published';
          return (
            <Card key={e.id} className="flex flex-wrap items-center gap-4 p-3.5">
              <div role="img" style={{ backgroundImage: `url('${IMG[e.img]}')` }} className="size-[84px] shrink-0 rounded-lg bg-surface-muted bg-cover bg-center" />
              <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-bold text-fg">{e.title}</span>
                  <Badge className={`px-[9px] py-[3px] text-[11px] ${st.className}`}>{st.label}</Badge>
                </div>
                <div className="text-[13px] text-fg-muted">
                  {placeLabel(outlets, branches, e.outletId)} · {eventWhen(e)}
                </div>
                <div className="text-[13px] text-fg-soft">
                  {e.price ? `AED ${e.price}` : 'Free'} · {e.left} of {e.spots} spots left
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5" title={suspended ? LOCKED_REASON : undefined}>
                {e.status !== 'ended' && e.status !== 'cancelled' && <IconButton icon="edit" title="Edit" aria-label="Edit" onClick={() => openEventForm(e)} disabled={suspended} />}
                {live && (
                  <Button variant="secondary" size="xs" onClick={() => setEventStatus(e.id, 'soldout')} {...lock}>
                    Mark sold out
                  </Button>
                )}
                {(live || e.status === 'soldout') && (
                  <>
                    <Button variant="secondary" size="xs" onClick={() => setEventStatus(e.id, 'ended')} {...lock}>
                      End
                    </Button>
                    <Button variant="secondary" size="xs" onClick={() => setEventStatus(e.id, 'cancelled')} {...lock}>
                      Cancel event
                    </Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
        {list.length === 0 && (
          <div className="flex flex-col items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-line-strong bg-surface p-10 text-center">
            <div className="text-base font-bold text-brand-purple">No events yet</div>
            <div className="text-fg-muted">A jazz night, a quiz, a brunch: add it to one of your places.</div>
            <Button size="md" className="mt-1 py-3" onClick={() => openEventForm()} {...lock}>
              Add event
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
