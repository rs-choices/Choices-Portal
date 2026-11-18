'use client';

import { Input, FieldError } from '@/components/ui/Field';
import { Toggle } from '@/components/ui/Toggle';
import { kitchenInside, rangesOverlap, type DayHours } from '@/lib/portal/hours';

const small = 'w-[118px] py-2';

// One day's hours: Closed, or one or more time ranges, plus an optional
// kitchen closing time. A range that closes at or before it opens runs past
// midnight.
export function TimeRangesEditor({
  value,
  onChange,
  allowKitchen,
  label,
}: {
  value: DayHours;
  onChange: (d: DayHours) => void;
  allowKitchen: boolean;
  label?: string;
}) {
  const set = (patch: Partial<DayHours>) => onChange({ ...value, ...patch });
  const setRange = (i: number, k: 'open' | 'close', v: string) => set({ ranges: value.ranges.map((r, j) => (j === i ? { ...r, [k]: v } : r)) });
  const last = value.ranges[value.ranges.length - 1];

  return (
    <div className="flex flex-col gap-2 border-t border-line-faint py-2.5 first:border-t-0">
      <div className="flex flex-wrap items-center gap-3">
        {label && <span className="w-24 font-semibold text-fg">{label}</span>}
        <button
          type="button"
          onClick={() => set(value.closed ? { closed: false, ranges: value.ranges.length ? value.ranges : [{ open: '09:00', close: '22:00' }] } : { closed: true, kitchenCloses: null })}
          className="flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-[13px] text-fg-soft"
        >
          <Toggle on={!value.closed} />
          {value.closed ? 'Closed' : 'Open'}
        </button>
      </div>

      {!value.closed && (
        <div className="flex flex-col gap-2 sm:pl-[108px]">
          {value.ranges.map((r, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <Input type="time" size="sm" className={small} value={r.open} onChange={(e) => setRange(i, 'open', e.target.value)} aria-label="Opens" />
              <span className="text-fg-muted">to</span>
              <Input type="time" size="sm" className={small} value={r.close} onChange={(e) => setRange(i, 'close', e.target.value)} aria-label="Closes" />
              {value.ranges.length > 1 && (
                <button
                  type="button"
                  onClick={() => set({ ranges: value.ranges.filter((_, j) => j !== i) })}
                  className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-fg-muted hover:text-danger"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => set({ ranges: [...value.ranges, { open: last?.close ?? '18:00', close: '23:00' }] })}
            className="cursor-pointer self-start border-none bg-transparent p-0 text-[13px] font-semibold text-brand-peach hover:text-brand-peach-hover"
          >
            + Add time range
          </button>

          {allowKitchen && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => set({ kitchenCloses: value.kitchenCloses ? null : (last ? last.close : '22:00') })}
                className="flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-[13px] text-fg-soft"
              >
                <Toggle on={!!value.kitchenCloses} />
                Kitchen closing time
              </button>
              {value.kitchenCloses && (
                <Input
                  type="time"
                  size="sm"
                  className={small}
                  value={value.kitchenCloses}
                  onChange={(e) => set({ kitchenCloses: e.target.value || null })}
                  aria-label="Kitchen closes"
                />
              )}
            </div>
          )}
          {rangesOverlap(value) && <FieldError>These time ranges overlap.</FieldError>}
          {!kitchenInside(value) && <FieldError>The kitchen must close while the branch is open.</FieldError>}
        </div>
      )}
    </div>
  );
}
