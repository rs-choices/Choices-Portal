'use client';

import { useEffect, useRef, useState } from 'react';
import { useMessages } from '@/components/portal/MessagesProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select, Textarea } from '@/components/ui/Field';
import { Icon, Star } from '@/components/ui/Icon';
import { CONVERSATION_KIND, CONVERSATION_STATUS, NEW_CHAT, SUPPORT_CATEGORIES, type SupportCategory } from '@/lib/portal/messages';

// The chat with the Choices team: header, message bubbles, and the composer
// pinned at the bottom. A new support chat asks for a topic first and is
// created on Send. Notices are read-only.
export function ChatScreen({ id }: { id: string }) {
  const { conversations, setActive, reply, markFixed, rate, startSupport } = useMessages();
  const c = conversations.find((x) => x.id === id);
  const isNew = id === NEW_CHAT;
  const [text, setText] = useState('');
  const [category, setCategory] = useState<SupportCategory>('Billing');
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const scroller = useRef<HTMLDivElement>(null);
  const count = c?.messages.length ?? 0;

  // Keep the latest message in view, as in any chat.
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [count]);

  if (!isNew && !c) return null;
  const notice = c?.kind === 'notice';
  const closed = c?.status === 'closed';
  const canReply = isNew || (!closed && !notice);

  const send = () => {
    if (!text.trim()) return;
    if (isNew) startSupport(category, text);
    else reply(id, text);
    setText('');
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 border-b border-line-soft px-5 py-4">
        <button
          type="button"
          aria-label="Back to messages"
          onClick={() => setActive(null)}
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-[12px] border-none bg-fill-soft text-brand-purple min-[900px]:hidden"
        >
          <Icon name="chevronLeft" size={18} stroke={2} />
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-[15px] font-bold text-brand-purple">{c ? c.subject : 'New message'}</span>
          <span className="text-xs text-fg-subtle">{c ? CONVERSATION_KIND[c.kind] : 'The Choices team replies here and in the bell'}</span>
        </div>
        {c && !notice && <Badge className={`px-[9px] py-[3px] text-[11px] ${CONVERSATION_STATUS[c.status].className}`}>{CONVERSATION_STATUS[c.status].label}</Badge>}
      </div>

      <div ref={scroller} className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto bg-page px-5 py-4">
        {isNew && <div className="m-auto max-w-[320px] text-center text-fg-muted">Pick a topic and write your message. We&apos;re here Sunday to Thursday, 9 AM to 9 PM.</div>}
        {c?.item && (
          <div className="flex flex-wrap items-center gap-2 self-center text-[13px] text-fg-soft">
            <span className="font-semibold text-fg">{c.item.label}</span>
          </div>
        )}
        {c?.messages.map((m, i) => (
          <div key={i} className={`flex max-w-[80%] flex-col gap-1 ${m.from === 'team' ? 'self-start' : 'items-end self-end'}`}>
            <div className={`rounded-lg px-3.5 py-2.5 leading-normal ${m.from === 'team' ? 'bg-surface-purple text-fg' : 'bg-brand-purple text-inverse'}`}>{m.text}</div>
            <span className="text-[11px] text-fg-subtle">
              {m.from === 'team' ? 'Choices team' : 'You'} · {m.when}
            </span>
          </div>
        ))}
        {closed && c?.outcome && (
          <div className="self-center rounded-md bg-surface px-3.5 py-2.5 text-center text-[13px]">
            <span className="font-semibold text-brand-purple">Outcome: </span>
            {c.outcome}
          </div>
        )}
        {closed && c?.kind === 'support' && c.rating !== undefined && <div className="self-center text-[13px] text-fg-muted">You rated this {c.rating} out of 5</div>}
      </div>

      {c?.status === 'fix' && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line-soft px-5 py-3">
          <span className="text-[13px] text-fg-soft">Made the change? Let the team know.</span>
          <Button variant="secondary" size="sm" onClick={() => markFixed(c.id)}>
            Mark as fixed
          </Button>
        </div>
      )}

      {closed && c?.kind === 'support' && c.rating === undefined && (
        <div className="flex flex-col gap-2 border-t border-line-soft px-5 py-3">
          <span className="font-semibold text-brand-purple">How was our answer?</span>
          <div className="flex gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={stars === n}
                aria-label={`${n} out of 5`}
                onClick={() => setStars(n)}
                className="cursor-pointer border-none bg-transparent p-0.5"
              >
                <Star size={22} on={n <= stars} />
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <Textarea rows={1} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Anything to add (optional)" aria-label="Rating comment" />
            <Button size="sm" disabled={!stars} onClick={() => rate(c.id, stars, comment)} className="shrink-0">
              Send rating
            </Button>
          </div>
        </div>
      )}

      {notice && <div className="border-t border-line-soft px-5 py-3 text-[13px] text-fg-muted">This is a notice from the Choices team. There is nothing to reply to.</div>}
      {closed && !notice && c?.kind !== 'support' && <div className="border-t border-line-soft px-5 py-3 text-[13px] text-fg-muted">This conversation is closed.</div>}

      {canReply && (
        <div className="flex flex-col gap-2 border-t border-line-soft px-5 py-3">
          {isNew && (
            <Select size="sm" value={category} onChange={(e) => setCategory(e.target.value as SupportCategory)} aria-label="Topic">
              {SUPPORT_CATEGORIES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
          )}
          <div className="flex items-end gap-2">
            <Textarea
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Write a message"
              aria-label="Message to the Choices team"
            />
            <Button size="md" disabled={!text.trim()} onClick={send} className="shrink-0">
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
