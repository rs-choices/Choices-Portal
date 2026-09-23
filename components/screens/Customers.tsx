'use client';

import { useState } from 'react';
import { usePortal } from '@/components/portal/PortalProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Field';
import { Star } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { Segmented } from '@/components/ui/Segmented';
import { CUSTOMERS, REVIEWS, VISIT_HISTORY } from '@/lib/portal/data';
import { firstName } from '@/lib/portal/format';

type Filter = 'all' | 'new' | 'returning' | 'active';
const FILTERS = [
  ['all', 'All'],
  ['new', 'New'],
  ['returning', 'Returning'],
  ['active', 'Most active'],
] as const;

const COLS = 'grid grid-cols-[minmax(200px,2.2fr)_repeat(4,minmax(70px,1fr))] gap-3 px-5';

export function Customers() {
  const { showToast } = usePortal();
  const [filter, setFilter] = useState<Filter>('all');
  const [sel, setSel] = useState<number | null>(1);
  const [reviews, setReviews] = useState(REVIEWS);
  const [replyOpen, setReplyOpen] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  let list = CUSTOMERS;
  if (filter === 'new') list = CUSTOMERS.filter((c) => c.seg === 'new');
  if (filter === 'returning') list = CUSTOMERS.filter((c) => c.seg === 'returning');
  if (filter === 'active') list = [...CUSTOMERS].sort((a, b) => b.visits - a.visits).slice(0, 4);
  const selected = CUSTOMERS.find((c) => c.id === sel);
  const history = selected ? VISIT_HISTORY.slice(0, Math.max(1, Math.min(6, selected.visits))) : [];

  const sendReply = (id: number, name: string) => {
    if (!replyText.trim()) return;
    setReviews((all) => all.map((r) => (r.id === id ? { ...r, reply: replyText } : r)));
    setReplyOpen(null);
    showToast(`Reply posted. ${firstName(name)} will be notified.`);
  };

  return (
    <section className="flex flex-col gap-6">
      <Segmented options={FILTERS} value={filter} onChange={setFilter} className="flex-wrap self-start" />

      <div className="flex flex-wrap items-start gap-4">
        <Card className="min-w-0 flex-[1_1_560px] overflow-x-auto">
          <div className="min-w-[620px]">
            <div className={`${COLS} border-b border-line-soft py-3.5 text-xs font-semibold text-ink-muted`}>
              <span>Customer</span>
              <span>Visits</span>
              <span>Last visit</span>
              <span>Offers claimed</span>
              <span>Bookings</span>
            </div>
            {list.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSel(c.id)}
                className={`${COLS} w-full cursor-pointer items-center border-b border-line-faint py-3 text-left text-sm text-fg hover:bg-fill-faint ${
                  sel === c.id ? 'bg-brand-purple/5' : 'bg-transparent'
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={c.name} seed={c.id} />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold">{c.name}</span>
                    <span className="text-xs text-ink-muted">{c.area}</span>
                  </span>
                  <Badge className={`px-2 py-[3px] text-[11px] ${c.seg === 'new' ? 'bg-brand-peach/14 text-peach-ink' : 'bg-brand-teal/12 text-teal-ink'}`}>
                    {c.seg === 'new' ? 'New' : 'Returning'}
                  </Badge>
                </span>
                <span className="font-semibold">{c.visits}</span>
                <span>{c.last}</span>
                <span>{c.claimed}</span>
                <span>{c.bookings}</span>
              </button>
            ))}
          </div>
        </Card>

        {selected && (
          <Card className="flex max-w-full flex-[1_1_300px] flex-col gap-[18px] p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} seed={selected.id} size={52} />
                <div>
                  <div className="text-[17px] font-bold text-brand-purple">{selected.name}</div>
                  <div className="text-[13px] text-ink-muted">
                    {selected.area} · Customer since {selected.since}
                  </div>
                </div>
              </div>
              <IconButton icon="close" size={32} iconSize={14} aria-label="Close" onClick={() => setSel(null)} className="rounded-[10px]" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                [selected.visits, 'Visits'],
                [selected.claimed, 'Offers claimed'],
                [selected.bookings, 'Bookings'],
              ].map(([v, l]) => (
                <div key={l} className="rounded-md bg-page p-3">
                  <div className="text-xl font-bold text-brand-purple">{v}</div>
                  <div className="text-xs text-ink-muted">{l}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="mb-2 font-bold text-brand-purple">Visit history</div>
              {history.map(([date, what, detail]) => (
                <div key={date} className="flex gap-3 border-t border-line-soft py-2.5">
                  <span className="w-[52px] shrink-0 text-xs font-bold text-fg-muted">{date}</span>
                  <span className="flex flex-col">
                    <span className="text-[13px] font-semibold">{what}</span>
                    <span className="text-xs text-ink-muted">{detail}</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="m-0 text-lg font-bold text-brand-purple">Reviews</h2>
          <span className="flex items-center gap-1.5 font-bold text-fg">
            <Star />
            4.7
          </span>
          <span className="text-[13px] text-ink-muted">from 312 ratings</span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {reviews.map((r) => (
            <Card key={r.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-center gap-2.5">
                <Avatar name={r.name} seed={r.id} size={36} />
                <div className="flex-1">
                  <div className="font-semibold">{r.name}</div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={13} on={n <= r.rating} />
                    ))}
                    <span className="ml-1.5 text-xs text-fg-subtle">{r.date}</span>
                  </div>
                </div>
              </div>
              <div className="leading-[1.55] text-fg-strong">{r.text}</div>
              {r.reply && (
                <div className="flex flex-col gap-1 rounded-md bg-page px-3.5 py-3">
                  <span className="text-xs font-bold text-brand-purple">Your reply</span>
                  <span className="text-[13px] leading-normal text-fg-soft">{r.reply}</span>
                </div>
              )}
              {!r.reply && replyOpen !== r.id && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="self-start"
                  onClick={() => {
                    setReplyOpen(r.id);
                    setReplyText('');
                  }}
                >
                  Reply
                </Button>
              )}
              {replyOpen === r.id && (
                <>
                  <Textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Thank them, and keep it personal."
                    className="p-3 text-[13px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setReplyOpen(null)} className="cursor-pointer border-none bg-transparent font-semibold text-fg-muted">
                      Cancel
                    </button>
                    <Button size="sm" className="px-[18px]" onClick={() => sendReply(r.id, r.name)}>
                      Post reply
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
