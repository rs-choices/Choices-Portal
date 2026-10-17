'use client';

import { useListings } from '@/components/portal/ListingsProvider';
import { Icon } from '@/components/ui/Icon';
import { IMG } from '@/lib/portal/data';

// Pieces shared by the Events, Activities and Offers pages and forms.

export function PhotoPicker({ value, onChange }: { value: number; onChange: (i: number) => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="font-medium text-brand-purple">Photo</span>
      <div className="flex flex-wrap gap-2.5">
        {IMG.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => onChange(i)}
            aria-label={`Photo ${i + 1}`}
            aria-pressed={value === i}
            style={{ backgroundImage: `url('${src}')` }}
            className={`size-14 cursor-pointer rounded-md border-none bg-cover bg-center p-0 ${value === i ? 'opacity-100 shadow-[0_0_0_2.5px_var(--color-brand-peach)]' : 'opacity-75'}`}
          />
        ))}
        <button type="button" title="Upload photo" className="grid size-14 cursor-pointer place-items-center rounded-md border-[1.5px] border-dashed border-line-dashed bg-fill-faint text-brand-purple">
          <Icon name="upload" size={18} />
        </button>
      </div>
    </div>
  );
}

// "All branches" plus one option per branch; '' means all.
export function BranchFilter({ value, onChange }: { value: string; onChange: (branchId: string) => void }) {
  const { branches } = useListings();
  if (branches.length < 2) return null;
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Branch"
      className="h-10 rounded-pill border-none bg-surface px-4 text-[13px] font-semibold text-brand-purple shadow-soft"
    >
      <option value="">All branches</option>
      {branches.map((b) => (
        <option key={b.id} value={b.id}>
          {b.name}
        </option>
      ))}
    </select>
  );
}

// True when the outlet belongs to the branch (or no branch is picked).
export function useInBranch() {
  const { outlets } = useListings();
  return (outletId: string, branchId: string) => !branchId || outlets.find((o) => o.id === outletId)?.branchId === branchId;
}

export const NOT_VERIFIED = 'Publishes once the Choices team verifies this branch';
