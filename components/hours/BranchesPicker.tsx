'use client';

import { useEffect } from 'react';
import { useListings } from '@/components/portal/ListingsProvider';
import { Icon } from '@/components/ui/Icon';
import { NEW_MARK } from '@/lib/portal/reviewMark';

// "Applies to": tick the branches a shared item is for. A business with one
// branch never sees it; that branch is chosen for them.
// ownerOf: the set or menu a branch uses now, shown as "now: Café hours".
// required: a reason the branch can't be unticked, or null.
export function BranchesPicker({
  value,
  onChange,
  ownerOf,
  required,
}: {
  value: string[];
  onChange: (ids: string[]) => void;
  ownerOf?: (branchId: string) => string | null;
  required?: (branchId: string) => string | null;
}) {
  const { branches } = useListings();
  const only = branches.length === 1 ? branches[0].id : null;

  useEffect(() => {
    if (only && !value.includes(only)) onChange([only]);
  }, [only, value, onChange]);

  if (only) return null;

  const all = branches.every((b) => value.includes(b.id));
  const toggle = (id: string) => {
    if (value.includes(id)) {
      if (required?.(id)) return;
      onChange(value.filter((x) => x !== id));
    } else onChange([...value, id]);
  };

  return (
    <div className={`flex flex-col gap-2 ${NEW_MARK}`}>
      <div className="flex items-center justify-between">
        <span className="font-medium text-brand-purple">Applies to</span>
        <button
          type="button"
          onClick={() => onChange(all ? value.filter((id) => required?.(id)) : branches.map((b) => b.id))}
          className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-brand-peach hover:text-brand-peach-hover"
        >
          {all ? 'Clear' : 'Select all'}
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        {branches.map((b) => {
          const on = value.includes(b.id);
          const owner = !on ? ownerOf?.(b.id) : null;
          const locked = on ? required?.(b.id) : null;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => toggle(b.id)}
              aria-pressed={on}
              className={`flex cursor-pointer items-center gap-3 rounded-md border-none px-3.5 py-2.5 text-left ${on ? 'bg-surface-purple' : 'bg-surface-muted'}`}
            >
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-[5px] ${on ? 'bg-brand-purple text-inverse' : 'border-[1.5px] border-line-strong bg-surface'}`}
              >
                {on && <Icon name="check" size={13} stroke={2.4} />}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-semibold text-fg">{b.name}</span>
                {owner && <span className="text-xs text-ink-muted">now: {owner}</span>}
                {locked && <span className="text-xs text-ink-muted">{locked}</span>}
                {b.status === 'waiting' && <span className="text-xs text-ink-muted">Waiting for verification</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
