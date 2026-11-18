'use client';

import { useEffect, useId, type ReactNode } from 'react';
import { IconButton } from './IconButton';

// Open dialogs, oldest first.
const OPEN: symbol[] = [];

// Small modal dialog with a title, closed by Escape, the scrim or the close button.
export function Dialog({
  open,
  title,
  onClose,
  children,
  footer,
  width = 'max-w-[520px]',
  className = '',
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
  className?: string;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const me = Symbol();
    OPEN.push(me);
    // Only the top dialog closes on Escape, so a question asked over a form
    // doesn't take the form (and its edits) with it.
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && OPEN[OPEN.length - 1] === me && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      OPEN.splice(OPEN.indexOf(me), 1);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-scrim/45 px-4 py-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full ${width} flex-col gap-[18px] rounded-2xl bg-surface p-7 shadow-modal ${className}`}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id={titleId} className="m-0 text-[22px] font-bold text-brand-purple">
            {title}
          </h2>
          <IconButton icon="close" iconSize={18} stroke={1.8} aria-label="Close" onClick={onClose} />
        </div>
        {children}
        {footer && <div className="flex flex-wrap justify-end gap-2.5">{footer}</div>}
      </div>
    </div>
  );
}
