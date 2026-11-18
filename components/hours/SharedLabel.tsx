'use client';

import { useListings } from '@/components/portal/ListingsProvider';
import { Icon } from '@/components/ui/Icon';

// "Shared with Jumeirah 1, Downtown Dubai" on a branch's card, so the owner
// knows an edit can reach other branches. Nothing for a one-branch item.
export function SharedLabel({ branchIds }: { branchIds: string[] }) {
  const { branches } = useListings();
  if (branchIds.length <= 1) return null;
  const names = branchIds.map((id) => branches.find((b) => b.id === id)?.name ?? id);
  const text = names.length <= 3 ? names.join(', ') : `${names.length} branches`;
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-purple">
      <Icon name="copy" size={13} />
      Shared with {text}
    </span>
  );
}

// Branch names as small chips, for the business-wide page.
export function BranchChips({ branchIds }: { branchIds: string[] }) {
  const { branches } = useListings();
  if (branches.length <= 1) return null;
  if (branchIds.length === 0) return <span className="text-xs text-fg-muted">Not used by any branch</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {branchIds.map((id) => (
        <span key={id} className="rounded-pill bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-brand-purple">
          {branches.find((b) => b.id === id)?.name ?? id}
        </span>
      ))}
    </div>
  );
}
