'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { ACCOUNT_EFFECTS, ANNOUNCEMENT, SUSPENSION_REASON } from '@/lib/portal/messages';
import { useMessages } from './MessagesProvider';

// One banner at the top of every portal page: the most important account
// state, or an announcement from the Choices team.
export function AccountBanner() {
  const router = useRouter();
  const { banner, dismissAnnouncement, openConversation, openSupportChat } = useMessages();
  if (!banner) return null;

  if (banner === 'announcement') {
    return (
      <Shell tone="neutral" icon="mail" title={ANNOUNCEMENT.title} body={ANNOUNCEMENT.body}>
        <IconButton icon="close" iconSize={16} aria-label="Dismiss announcement" onClick={dismissAnnouncement} />
      </Shell>
    );
  }

  if (banner === 'suspended') {
    return (
      <Shell tone="warn" icon="alert" title="Your business is suspended. Your listings are hidden from the app." body={SUSPENSION_REASON}>
        <Button size="sm" onClick={openSupportChat}>
          Contact support
        </Button>
      </Shell>
    );
  }

  if (banner === 'payment-failed') {
    return (
      <Shell tone="warn" icon="alert" title="Your last payment didn't go through." body="Update your card so your listings stay live.">
        <Button size="sm" onClick={() => router.push('/billing')}>
          Update card
        </Button>
      </Shell>
    );
  }

  return (
    <Shell tone="neutral" icon="alert" title="The Choices team asked for changes before verifying your business." body="Your listing goes live once we verify it.">
      <Button size="sm" onClick={() => openConversation(ACCOUNT_EFFECTS['changes-requested'].conversation?.id ?? '')}>
        See what to change
      </Button>
    </Shell>
  );
}

function Shell({ tone, icon, title, body, children }: { tone: 'warn' | 'neutral'; icon: 'alert' | 'mail'; title: string; body: string; children: ReactNode }) {
  return (
    <div
      role={tone === 'warn' ? 'alert' : 'status'}
      className={`flex flex-wrap items-center gap-3 rounded-xl px-5 py-4 ${tone === 'warn' ? 'bg-peach-wash' : 'bg-surface-purple'}`}
    >
      <Icon name={icon} size={20} className={`shrink-0 ${tone === 'warn' ? 'text-peach-ink' : 'text-brand-purple'}`} />
      <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-0.5">
        <span className={`font-bold ${tone === 'warn' ? 'text-peach-ink' : 'text-brand-purple'}`}>{title}</span>
        <span className="text-[13px] text-fg-soft">{body}</span>
      </div>
      {children}
    </div>
  );
}
