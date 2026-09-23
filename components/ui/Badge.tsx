import type { HTMLAttributes } from 'react';

// Small status pill. Colour comes from the caller, usually STATUS[x].className.
export function Badge({ className = '', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`whitespace-nowrap rounded-pill font-bold ${className}`} {...rest} />;
}
