'use client';

import { useEffect, useState } from 'react';
import { useListings } from '@/components/portal/ListingsProvider';
import { Icon } from '@/components/ui/Icon';
import { outletsOf, placeLabel } from '@/lib/portal/places';

// "Where does this go?" for every event, activity and offer: pick the branch,
// then the outlet only when that branch has several. A business with one
// branch and one outlet never sees either step, and never the word "outlet".
// A branch waiting for verification is shown but can't be picked: nothing
// can be added to it, not even a draft, until it is verified.
export function WherePicker({ value, onChange }: { value: string; onChange: (outletId: string) => void }) {
  const { branches, outlets } = useListings();
  const [branchId, setBranchId] = useState<string | null>(null);

  const liveOf = (bid: string) => outletsOf(outlets, bid).filter((o) => o.status === 'live');
  const pickBranch = (bid: string) => {
    const live = liveOf(bid);
    if (live.length === 1) onChange(live[0].id);
    else setBranchId(bid);
  };

  // One verified branch with one place: choose it straight away.
  const only = branches.length === 1 && branches[0].status === 'verified' ? liveOf(branches[0].id) : [];
  const onlyId = only.length === 1 ? only[0].id : null;
  useEffect(() => {
    if (!value && onlyId) onChange(onlyId);
  }, [value, onlyId, onChange]);

  if (value) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-md bg-page px-3.5 py-3 text-sm">
        <Icon name="store" size={16} className="text-brand-purple" />
        <span className="text-fg-muted">At:</span>
        <span className="font-semibold text-fg">{placeLabel(outlets, branches, value)}</span>
        {(branches.length > 1 || outlets.filter((o) => o.status === 'live').length > 1) && (
          <button
            type="button"
            onClick={() => {
              setBranchId(null);
              onChange('');
            }}
            className="cursor-pointer border-none bg-transparent p-0 font-semibold text-brand-peach hover:text-brand-peach-hover"
          >
            Change
          </button>
        )}
      </div>
    );
  }

  const branch = branchId ? branches.find((b) => b.id === branchId) : null;
  const options = branch
    ? liveOf(branch.id).map((o) => ({ id: o.id, title: o.name, sub: o.type, locked: false }))
    : branches.map((b) => ({
        id: b.id,
        title: b.name,
        sub: b.status === 'waiting' ? 'Waiting for verification. You can add to it once it is verified.' : b.area,
        locked: b.status === 'waiting',
      }));

  return (
    <div className="flex flex-col gap-2">
      <span className="font-medium text-brand-purple">{branch ? `Which place at ${branch.name}?` : 'Which branch?'}</span>
      <div className="flex flex-col gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            disabled={o.locked}
            onClick={() => (branch ? onChange(o.id) : pickBranch(o.id))}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-md border-none bg-page px-3.5 py-3 text-left hover:bg-fill-row disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-page"
          >
            <span className="flex flex-col">
              <span className="font-semibold text-fg">{o.title}</span>
              <span className="text-xs text-ink-muted">{o.sub}</span>
            </span>
            {!o.locked && <Icon name="chevronRight" size={16} className="text-brand-purple" />}
          </button>
        ))}
      </div>
      {branch && (
        <button type="button" onClick={() => setBranchId(null)} className="cursor-pointer self-start border-none bg-transparent p-0 text-[13px] font-semibold text-fg-muted">
          Back to branches
        </button>
      )}
    </div>
  );
}
