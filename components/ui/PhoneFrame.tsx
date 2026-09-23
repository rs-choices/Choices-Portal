import type { ReactNode } from 'react';

// Phone mockup used for "how customers see you" previews.
export function PhoneFrame({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  return (
    <div style={{ width, height }} className="flex shrink-0 flex-col overflow-hidden rounded-[42px] bg-surface shadow-phone-frame">
      {children}
    </div>
  );
}

export function StatusBar({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-between px-[22px] py-3.5 text-xs font-bold ${className}`}>
      <span>10:46</span>
      <span className="h-5 w-[70px] rounded-[12px] bg-fg" />
      <span>5G</span>
    </div>
  );
}
