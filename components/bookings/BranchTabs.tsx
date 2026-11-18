'use client';

import { useListings } from '@/components/portal/ListingsProvider';
import { NEW_MARK } from '@/lib/portal/reviewMark';

// "All branches" plus one tab per branch this person sees, each with the
// number of bookings waiting for confirmation. Hidden with one branch.
export function BranchTabs({ value, onChange, counts }: { value: string; onChange: (v: string) => void; counts: Record<string, number> }) {
  const { visibleBranches } = useListings();
  if (visibleBranches.length <= 1) return null;
  const tabs: [string, string][] = [['all', 'All branches'], ...visibleBranches.map((b): [string, string] => [b.id, b.name])];

  return (
    <div role="tablist" aria-label="Branches" className={`flex gap-1 overflow-x-auto border-b border-line-soft ${NEW_MARK}`}>
      {tabs.map(([id, label]) => {
        const on = id === value;
        const n = counts[id] ?? 0;
        return (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => onChange(id)}
            className={`-mb-px flex shrink-0 cursor-pointer items-center gap-2 border-x-0 border-t-0 border-b-[3px] bg-transparent px-4 py-3 text-sm font-semibold whitespace-nowrap ${
              on ? 'border-brand-purple text-brand-purple' : 'border-transparent text-fg-muted hover:text-brand-purple'
            }`}
          >
            {label}
            {n > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-[10px] bg-brand-peach px-1.5 text-[11px] font-bold text-inverse" title={`${n} waiting for you to confirm`}>
                {n}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
