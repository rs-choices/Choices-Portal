'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { useMessages } from './MessagesProvider';

// The header bell: one inbox for bookings, reviews, offers and everything the
// Choices team sends. Items open their page or their Help conversation.
export function NotificationBell({ highlight }: { highlight: boolean }) {
  const { notices, unread, openNotice, markAllRead } = useMessages();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // The header is sticky with a backdrop blur, so a fixed overlay inside it
  // would not cover the page. Close on any click outside, or on Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        className={`relative grid size-[42px] cursor-pointer place-items-center rounded-full border-none bg-surface text-brand-purple ${
          highlight ? 'shadow-tour-ring' : 'shadow-[0_2px_6px_rgba(0,0,0,0.05)]'
        }`}
      >
        <Icon name="bell" size={20} />
        {unread > 0 && <span className="absolute top-[9px] right-2.5 size-[9px] rounded-full border-2 border-surface bg-brand-peach" />}
      </button>
      {open && (
        <div className="absolute top-[52px] right-0 z-60 w-[360px] max-w-[calc(100vw-32px)] rounded-xl bg-surface p-2 shadow-popover">
          <div className="flex items-center justify-between gap-3 px-3 py-2.5">
            <span className="text-[15px] font-bold text-brand-purple">Notifications</span>
            <span className="flex items-center gap-3 text-xs text-ink-muted">
              {unread ? `${unread} new` : 'All caught up'}
              {unread > 0 && (
                <button type="button" onClick={markAllRead} className="cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-brand-peach hover:text-brand-peach-hover">
                  Mark all as read
                </button>
              )}
            </span>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {notices.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  if (n.conversationId || n.href) setOpen(false);
                  openNotice(n.id);
                }}
                className="flex w-full cursor-pointer gap-3 rounded-md border-none bg-transparent p-3 text-left hover:bg-page"
              >
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-brand-peach'}`} />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className={`text-[13px] text-fg ${n.read ? 'font-medium' : 'font-semibold'}`}>{n.title}</span>
                  <span className="text-[13px] text-fg-muted">{n.body}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-fg-subtle">
                    {n.when}
                    {n.emailed && (
                      <Badge className="inline-flex items-center gap-1 bg-surface-muted px-2 py-0.5 text-[10px] text-fg-soft">
                        <Icon name="mail" size={11} />
                        Also sent by email
                      </Badge>
                    )}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
