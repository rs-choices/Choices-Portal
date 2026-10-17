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
import { LOCKED_REASON } from '@/lib/portal/messages';
import { ACTIVITY_STATUS, placeLabel } from '@/lib/portal/places';

// Activities across all branches. Each one is its own listing on top of a place.
export function Activities() {
  const { activities, outlets, branches, openActivityForm, setActivityStatus, canPublish } = useListings();
  const { suspended } = useMessages();
  const inBranch = useInBranch();
  const [branchId, setBranchId] = useState('');
  const list = activities.filter((a) => inBranch(a.outletId, branchId));
  const lock = { disabled: suspended, title: suspended ? LOCKED_REASON : undefined };

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BranchFilter value={branchId} onChange={setBranchId} />
        <span className="text-[13px] text-fg-muted">{list.length} activities</span>
      </div>
      <div className="flex flex-col gap-3">
        {list.map((a) => {
          const st = ACTIVITY_STATUS[a.status];
          return (
            <Card key={a.id} className="flex flex-wrap items-center gap-4 p-3.5">
              <div role="img" style={{ backgroundImage: `url('${IMG[a.img]}')` }} className="size-[84px] shrink-0 rounded-lg bg-surface-muted bg-cover bg-center" />
              <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-bold text-fg">{a.title}</span>
                  <Badge className={`px-[9px] py-[3px] text-[11px] ${st.className}`}>{st.label}</Badge>
                </div>
                <div className="text-[13px] text-fg-muted">
                  {placeLabel(outlets, branches, a.outletId)} · {a.availability || 'Availability not set'}
                </div>
                <div className="text-[13px] text-fg-soft">
                  {a.duration} · {a.price ? `AED ${a.price}` : 'Free'} · {a.minAge ? `Ages ${a.minAge}+` : 'All ages'}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5" title={suspended ? LOCKED_REASON : undefined}>
                <IconButton icon="edit" title="Edit" aria-label="Edit" onClick={() => openActivityForm(a)} disabled={suspended} />
                {a.status === 'published' ? (
                  <Button variant="secondary" size="xs" onClick={() => setActivityStatus(a.id, 'unpublished')} {...lock}>
                    Unpublish
                  </Button>
                ) : (
                  <Button variant="secondary" size="xs" onClick={() => setActivityStatus(a.id, 'published')} disabled={suspended || !canPublish(a.outletId)}>
                    Publish
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
        {list.length === 0 && (
          <div className="flex flex-col items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-line-strong bg-surface p-10 text-center">
            <div className="text-base font-bold text-brand-purple">No activities yet</div>
            <div className="text-fg-muted">A cooking class, a tasting, a kids&apos; corner: add it to one of your places.</div>
            <Button size="md" className="mt-1 py-3" onClick={() => openActivityForm()} {...lock}>
              Add activity
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
