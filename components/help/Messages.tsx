'use client';

import { useState } from 'react';
import { useMessages } from '@/components/portal/MessagesProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Segmented } from '@/components/ui/Segmented';
import { CONVERSATION_GROUPS, CONVERSATION_KIND, CONVERSATION_STATUS, conversationGroup, type ConversationGroup } from '@/lib/portal/messages';
import { ChatScreen } from './ChatScreen';

// The Messages tab: every conversation with the Choices team, filtered by
// support, reports or notices, with the open chat beside the list. On narrow
// screens the chat replaces the list and has a back button.
export function Messages() {
  const { conversations, active, setActive, openSupportChat } = useMessages();
  const [group, setGroup] = useState<ConversationGroup | 'all'>('all');
  const list = group === 'all' ? conversations : conversations.filter((c) => conversationGroup(c.kind) === group);

  return (
    <Card className="grid h-[min(680px,calc(100dvh-230px))] min-h-[460px] grid-cols-1 overflow-hidden min-[900px]:grid-cols-[minmax(280px,340px)_1fr]">
      <div className={`flex min-h-0 flex-col border-line-soft min-[900px]:border-r ${active ? 'max-[899px]:hidden' : ''}`}>
        <div className="flex flex-col gap-3 border-b border-line-soft p-4">
          <Segmented options={CONVERSATION_GROUPS} value={group} onChange={setGroup} size="sm" className="self-start" />
          <Button size="sm" onClick={openSupportChat}>
            Send a message
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {list.length === 0 && <div className="p-4 text-center text-fg-muted">Nothing here yet</div>}
          {list.map((c) => {
            const last = c.messages[c.messages.length - 1];
            const needsYou = c.status === 'waiting' || c.status === 'fix';
            return (
              <button
                key={c.id}
                type="button"
                aria-current={c.id === active}
                onClick={() => setActive(c.id)}
                className={`flex w-full cursor-pointer flex-col gap-1 rounded-md border-none px-3 py-3 text-left ${c.id === active ? 'bg-fill-row' : 'bg-transparent hover:bg-page'}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`min-w-0 flex-1 truncate text-sm text-fg ${needsYou ? 'font-bold' : 'font-semibold'}`}>{c.subject}</span>
                  <span className="shrink-0 text-[11px] text-fg-subtle">{last?.when}</span>
                </span>
                <span className="truncate text-[13px] text-fg-muted">{last?.text}</span>
                <span className="flex items-center gap-2 text-[11px] text-fg-subtle">
                  {CONVERSATION_KIND[c.kind]}
                  {c.kind !== 'notice' && c.status !== 'closed' && (
                    <Badge className={`px-2 py-0.5 text-[10px] ${CONVERSATION_STATUS[c.status].className}`}>{CONVERSATION_STATUS[c.status].label}</Badge>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={`min-h-0 ${active ? '' : 'max-[899px]:hidden'}`}>
        {active ? (
          <ChatScreen key={active} id={active} />
        ) : (
          <div className="grid h-full place-items-center p-8 text-center text-fg-muted">Pick a conversation, or send us a message.</div>
        )}
      </div>
    </Card>
  );
}
