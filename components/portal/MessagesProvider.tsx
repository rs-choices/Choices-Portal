'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  ACCOUNT_EFFECTS,
  BANNER_ORDER,
  CONVERSATIONS,
  NEW_CHAT,
  NOTICES,
  parseAccountFlags,
  type AccountFlag,
  type Conversation,
  type Notice,
  type SupportCategory,
} from '@/lib/portal/messages';
import { usePortal } from './PortalProvider';

// Everything the Choices team sends a business: bell notifications,
// conversations on the Help page and the account state behind the banner.
// Mounted in PortalShell, which stays mounted across portal pages, so read
// flags and a forced ?account= state hold while the user navigates.

type ReportInput = {
  kind: 'review-report' | 'client-report';
  subject: string;
  reason: string;
  details: string;
  reviewId?: number;
  customerId?: number;
};

type Ctx = {
  flags: AccountFlag[];
  suspended: boolean;
  banner: AccountFlag | null;
  dismissAnnouncement: () => void;
  notices: Notice[];
  unread: number;
  openNotice: (id: string) => void;
  markAllRead: () => void;
  conversations: Conversation[];
  // The open chat on the Help page: a conversation id, NEW_CHAT or null.
  active: string | null;
  setActive: (id: string | null) => void;
  helpTab: HelpTab;
  setHelpTab: (t: HelpTab) => void;
  openConversation: (id: string) => void;
  openSupportChat: () => void;
  reply: (id: string, text: string) => void;
  markFixed: (id: string) => void;
  rate: (id: string, stars: number, comment: string) => void;
  startSupport: (category: SupportCategory, text: string) => void;
  report: (input: ReportInput) => void;
  reportedReviewIds: number[];
  reportedCustomerIds: number[];
};

export type HelpTab = 'faq' | 'messages';

const MessagesContext = createContext<Ctx | null>(null);

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages must be used inside MessagesProvider');
  return ctx;
}

export function MessagesProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { showToast } = usePortal();
  const [flags, setFlags] = useState<AccountFlag[]>(['announcement']);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [notices, setNotices] = useState(NOTICES);
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [active, setActive] = useState<string | null>(null);
  const [helpTab, setHelpTab] = useState<HelpTab>('faq');
  const nextId = useRef(1);

  // Read the forced account state once, on first load. The URL is only
  // available after hydration, so this runs in an effect.
  useEffect(() => {
    const forced = parseAccountFlags(window.location.search);
    const effects = forced.flatMap((f) => (f === 'announcement' ? [] : [ACCOUNT_EFFECTS[f]]));
    if (!effects.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after hydration
    setFlags(forced);
    setNotices((all) => [...effects.map((e) => e.notice), ...all]);
    setConversations((all) => [...effects.flatMap((e) => (e.conversation ? [e.conversation] : [])), ...all]);
  }, []);

  const newId = (prefix: string) => `${prefix}-new-${nextId.current++}`;

  const banner = BANNER_ORDER.find((f) => flags.includes(f) && !(f === 'announcement' && announcementDismissed)) ?? null;

  const updateConversation = (id: string, change: (c: Conversation) => Conversation) =>
    setConversations((all) => all.map((c) => (c.id === id ? change(c) : c)));

  const openNotice = (id: string) => {
    const n = notices.find((x) => x.id === id);
    if (!n) return;
    setNotices((all) => all.map((x) => (x.id === id ? { ...x, read: true } : x)));
    if (n.conversationId) {
      openConversation(n.conversationId);
    } else if (n.href) {
      router.push(n.href);
    }
  };

  // Opens a chat on the Help page's Messages tab, from any page.
  const openConversation = (id: string) => {
    setActive(id);
    setHelpTab('messages');
    router.push('/help');
  };

  // "Send a message": reopen the open support chat, or start a new one.
  const openSupportChat = () => {
    const open = conversations.find((c) => c.kind === 'support' && c.status !== 'closed');
    openConversation(open?.id ?? NEW_CHAT);
  };

  const reply = (id: string, text: string) => {
    if (!text.trim()) return;
    updateConversation(id, (c) => ({ ...c, status: 'open', messages: [...c.messages, { from: 'business', text: text.trim(), when: 'Just now' }] }));
    showToast('Message sent to the Choices team');
  };

  const markFixed = (id: string) => {
    updateConversation(id, (c) => ({ ...c, status: 'open', messages: [...c.messages, { from: 'business', text: 'Fixed. Please check it.', when: 'Just now' }] }));
    showToast('Fixed, the Choices team will check it');
  };

  const rate = (id: string, stars: number, comment: string) => {
    updateConversation(id, (c) => ({
      ...c,
      rating: stars,
      messages: comment.trim() ? [...c.messages, { from: 'business', text: comment.trim(), when: 'Just now' }] : c.messages,
    }));
    showToast('Thanks for rating');
  };

  const startSupport = (category: SupportCategory, text: string) => {
    if (!text.trim()) return;
    const id = newId('c-support');
    setConversations((all) => [
      { id, kind: 'support', subject: `${category}: ${text.trim().slice(0, 48)}`, status: 'open', messages: [{ from: 'business', text: text.trim(), when: 'Just now' }] },
      ...all,
    ]);
    setActive(id);
    showToast('Message sent. The reply will show here and in the bell.');
  };

  const report = ({ kind, subject, reason, details, reviewId, customerId }: ReportInput) => {
    const text = `Reason: ${reason}.${details.trim() ? ' ' + details.trim() : ''}`;
    setConversations((all) => [
      { id: newId('c-report'), kind, subject, status: 'open', reviewId, customerId, messages: [{ from: 'business', text, when: 'Just now' }] },
      ...all,
    ]);
    showToast(`${kind === 'review-report' ? 'Review' : 'Client'} reported. We'll let you know what we decide.`);
  };

  const value: Ctx = {
    flags,
    suspended: flags.includes('suspended'),
    banner,
    dismissAnnouncement: () => setAnnouncementDismissed(true),
    notices,
    unread: notices.filter((n) => !n.read).length,
    openNotice,
    markAllRead: () => setNotices((all) => all.map((n) => ({ ...n, read: true }))),
    conversations,
    active,
    setActive,
    reply,
    markFixed,
    rate,
    startSupport,
    report,
    reportedReviewIds: conversations.flatMap((c) => (c.kind === 'review-report' && c.reviewId !== undefined ? [c.reviewId] : [])),
    reportedCustomerIds: conversations.flatMap((c) => (c.kind === 'client-report' && c.customerId !== undefined ? [c.customerId] : [])),
    helpTab,
    setHelpTab,
    openConversation,
    openSupportChat,
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}
