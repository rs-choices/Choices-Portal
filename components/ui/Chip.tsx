import type { ButtonHTMLAttributes } from 'react';

// Selectable pill: solid purple when on, grey when off.
export function Chip({ on, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { on: boolean }) {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-pill border-none font-semibold ${
        on ? 'bg-brand-purple text-inverse' : 'bg-surface-muted text-brand-purple'
      } ${className}`}
      {...rest}
    />
  );
}

// Outlined variant used for venue tags.
export function TagChip({ on, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { on: boolean }) {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-pill border px-3.5 py-2 text-[13px] font-semibold ${
        on ? 'border-brand-purple bg-brand-purple text-inverse' : 'border-line-strong bg-surface text-brand-purple'
      } ${className}`}
      {...rest}
    />
  );
}
