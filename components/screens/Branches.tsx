'use client';

import { useState } from 'react';
import { AddBranchDialog } from '@/components/listings/AddBranchDialog';
import { PlaceEditor } from '@/components/listings/PlaceEditor';
import { RequestOutletDialog } from '@/components/listings/RequestOutletDialog';
import { useListings } from '@/components/portal/ListingsProvider';
import { usePortal } from '@/components/portal/PortalProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { canAddBranch, outletsOf, type Branch } from '@/lib/portal/places';
import { useLock } from '@/components/portal/useLock';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// Every branch is a place. A big branch holds several outlets, each its own
// place; a small branch's one outlet is just "the branch" and never named.
export function Branches() {
  const { plan, offers } = usePortal();
  const { branches, outlets, events, activities, addBranchOpen, setAddBranchOpen } = useListings();
  const [selId, setSelId] = useState(branches[0]?.id ?? '');
  const [outletId, setOutletId] = useState<string | null>(null);
  const [requestFor, setRequestFor] = useState<Branch | null>(null);
  const lock = useLock('branch.add');

  const sel = branches.find((b) => b.id === selId) ?? branches[0];
  const all = sel ? outletsOf(outlets, sel.id) : [];
  const live = all.filter((o) => o.status === 'live');
  const requested = all.filter((o) => o.status === 'requested');
  const big = live.length > 1;
  const current = live.find((o) => o.id === outletId) ?? live[0];

  const counts = (b: Branch) => {
    const ids = outlets.filter((o) => o.branchId === b.id && o.status === 'live').map((o) => o.id);
    const inB = <T extends { outletId: string }>(xs: T[]) => xs.filter((x) => ids.includes(x.outletId)).length;
    return [plural(ids.length, 'place', 'places'), plural(inB(events), 'event', 'events'), plural(inB(activities), 'activity', 'activities'), plural(inB(offers), 'offer', 'offers')].join(' · ');
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
        {branches.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-pressed={b.id === sel?.id}
            onClick={() => {
              setSelId(b.id);
              setOutletId(null);
            }}
            className={`flex cursor-pointer flex-col gap-1.5 rounded-xl border-none p-4 text-left shadow-soft ${b.id === sel?.id ? 'bg-surface-purple' : 'bg-surface hover:bg-fill-faint'}`}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-[15px] font-bold text-brand-purple">{b.name}</span>
              {b.status === 'waiting' && <Badge className="bg-brand-peach/14 px-2 py-[3px] text-[11px] text-peach-ink">Waiting for verification</Badge>}
            </span>
            <span className="text-xs text-ink-muted">{b.address}</span>
            <span className="text-xs font-semibold text-fg-soft">{counts(b)}</span>
          </button>
        ))}
        {canAddBranch(plan, branches) && (
          <button
            type="button"
            onClick={() => setAddBranchOpen(true)}
            {...lock}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-line-strong bg-transparent p-4 font-semibold text-brand-purple hover:bg-surface disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Icon name="plus" size={18} stroke={2.2} />
            Add branch
          </button>
        )}
      </div>

      {sel && (
        <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-brand-purple">{sel.name}</span>
            <span className="text-[13px] text-ink-muted">
              {sel.address} · Licence {sel.licence}
            </span>
            {sel.status === 'waiting' && <span className="text-[13px] text-peach-ink">You can prepare this branch now. Publishing opens once the Choices team verifies it.</span>}
          </div>
          <Button variant="secondary" size="sm" onClick={() => setRequestFor(sel)} {...lock}>
            Request an extra outlet
          </Button>
        </Card>
      )}

      {(big || requested.length > 0) && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Places at this branch">
          {live.map((o) => (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={o.id === current?.id}
              onClick={() => setOutletId(o.id)}
              className={`cursor-pointer rounded-pill border-none px-4 py-2 text-[13px] font-semibold ${o.id === current?.id ? 'bg-brand-purple text-inverse' : 'bg-surface text-brand-purple shadow-soft'}`}
            >
              {o.name}
            </button>
          ))}
          {requested.map((o) => (
            <span key={o.id} className="rounded-pill bg-surface-muted px-4 py-2 text-[13px] font-semibold text-fg-muted">
              {o.name} · Waiting for the Choices team
            </span>
          ))}
        </div>
      )}

      {current && <PlaceEditor key={current.id} outlet={current} />}

      <AddBranchDialog open={addBranchOpen} onClose={() => setAddBranchOpen(false)} />
      <RequestOutletDialog branch={requestFor} onClose={() => setRequestFor(null)} />
    </section>
  );
}
