'use client';

// Pill segmented control: a grey track with the selected option raised in white.
type Props<T extends string | number> = {
  options: readonly (readonly [T, string])[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZES = { sm: 'px-3 py-[7px] text-xs', md: 'px-4 py-2 text-[13px]', lg: 'px-[18px] py-2 text-[13px]' };

export function Segmented<T extends string | number>({ options, value, onChange, size = 'md', className = '' }: Props<T>) {
  return (
    <div className={`flex gap-0.5 rounded-pill bg-surface-muted p-1 ${className}`}>
      {options.map(([v, label]) => {
        const on = v === value;
        return (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange(v)}
            className={`cursor-pointer whitespace-nowrap rounded-pill border-none font-semibold ${SIZES[size]} ${
              on ? 'bg-surface text-brand-purple shadow-segment' : 'bg-transparent text-fg-muted'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
