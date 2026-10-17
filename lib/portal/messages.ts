import { PLAN_PRICE } from './data';

// Mock messages from the Choices team: bell notifications, conversations
// (support tickets and report cases) and the account states a business can
// be in. Replace with Supabase queries when the API exists.

// ---- Account state ----

export type AccountFlag = 'suspended' | 'payment-failed' | 'changes-requested' | 'announcement';

// Only the first active flag in this order shows as the banner.
export const BANNER_ORDER: AccountFlag[] = ['suspended', 'payment-failed', 'changes-requested', 'announcement'];

// '?account=suspended,payment-failed' -> ['suspended', 'payment-failed'].
// With no valid flag, the business is in good standing with one announcement.
export function parseAccountFlags(search: string): AccountFlag[] {
  const raw = new URLSearchParams(search).get('account') ?? '';
  const flags = raw.split(',').filter((f): f is AccountFlag => (BANNER_ORDER as string[]).includes(f));
  return flags.length ? [...new Set(flags)] : ['announcement'];
}

export const LOCKED_REASON = 'Not available while your business is suspended';

export const SUSPENSION_REASON = 'Reason: several reports of offers that were not honoured at the counter.';

export const ANNOUNCEMENT = {
  title: 'Plan your National Day offers',
  body: 'Clients start looking for 2 December plans in mid November. Schedule your offers early.',
};

// ---- Notifications ----

export type NoticeKind =
  | 'booking'
  | 'offer'
  | 'review'
  | 'payment'
  | 'refund'
  | 'report'
  | 'fix'
  | 'outcome'
  | 'message'
  | 'support'
  | 'closed'
  | 'verification'
  | 'listing'
  | 'suspension'
  | 'announcement';

export type Notice = {
  id: string;
  kind: NoticeKind;
  title: string;
  body: string;
  when: string;
  read: boolean;
  // Also sent by email, as the EventStorming board says.
  emailed: boolean;
  href?: string;
  conversationId?: string;
};

// ---- Conversations ----

// 'notice' is a message from the team that cannot be answered.
export type ConversationKind = 'support' | 'listing-report' | 'review-report' | 'client-report' | 'account' | 'notice';
export type ConversationStatus = 'open' | 'waiting' | 'fix' | 'closed';
export type SupportCategory = 'Billing' | 'Verification' | 'Listing' | 'Technical';

export const SUPPORT_CATEGORIES: SupportCategory[] = ['Billing', 'Verification', 'Listing', 'Technical'];

export type Message = { from: 'team' | 'business'; text: string; when: string };

export type Conversation = {
  id: string;
  kind: ConversationKind;
  subject: string;
  status: ConversationStatus;
  messages: Message[];
  // Shown on a closed report case.
  outcome?: string;
  // The listing or photo a listing report is about.
  item?: { label: string; hidden: boolean };
  rating?: number;
  reviewId?: number;
  customerId?: number;
};

export const CONVERSATION_KIND: Record<ConversationKind, string> = {
  support: 'Support',
  'listing-report': 'Listing report',
  'review-report': 'Review report',
  'client-report': 'Client report',
  account: 'Account',
  notice: 'Notice',
};

// The filters on the Help page's Messages tab.
export type ConversationGroup = 'support' | 'reports' | 'notices';
export const CONVERSATION_GROUPS: [ConversationGroup | 'all', string][] = [
  ['all', 'All'],
  ['support', 'Support'],
  ['reports', 'Reports'],
  ['notices', 'Notices'],
];
export function conversationGroup(kind: ConversationKind): ConversationGroup {
  if (kind === 'notice') return 'notices';
  if (kind === 'support' || kind === 'account') return 'support';
  return 'reports';
}

// The chat screen's id for a support chat not sent yet.
export const NEW_CHAT = 'new';

export const CONVERSATION_STATUS: Record<ConversationStatus, { label: string; className: string }> = {
  open: { label: 'Waiting on the team', className: 'bg-surface-purple text-brand-purple' },
  waiting: { label: 'Waiting on you', className: 'bg-brand-peach/14 text-peach-ink' },
  fix: { label: 'Fix requested', className: 'bg-brand-peach/14 text-peach-ink' },
  closed: { label: 'Closed', className: 'bg-line-soft text-fg-grey' },
};

export const REVIEW_REPORT_REASONS = ['Fake or not a real visit', 'Offensive or abusive', 'Spam', 'Other'];
export const CLIENT_REPORT_REASONS = ['No-show', 'Rude or abusive', 'Fake booking', 'Other'];

const CASES: Conversation[] = [
  {
    id: 'c-support-1',
    kind: 'support',
    subject: 'Invoice shows the wrong legal name',
    status: 'waiting',
    messages: [
      { from: 'business', text: 'Our September invoice says Qahwa Cafe LLC. Our trade licence says Qahwa House Cafe LLC.', when: '2 days ago' },
      { from: 'team', text: 'Thanks Layla. Can you send a photo of the first page of your trade licence so we can update the billing name?', when: '1 hour ago' },
    ],
  },
  {
    id: 'c-listing-fix',
    kind: 'listing-report',
    subject: 'Opening hours on your listing',
    status: 'fix',
    item: { label: 'Listing: Qahwa House · Jumeirah 1', hidden: false },
    messages: [
      { from: 'team', text: 'A client reported that your listing shows you open until midnight on Fridays, but you closed at 10 PM.', when: 'Yesterday' },
      { from: 'team', text: 'Please update your Friday hours in Business profile, then mark this as fixed.', when: 'Yesterday' },
    ],
  },
  {
    id: 'c-photo-removed',
    kind: 'listing-report',
    subject: 'Photo reported as not from your business',
    status: 'closed',
    item: { label: 'Photo: terrace at sunset', hidden: true },
    outcome: 'Removed. The photo was a stock image, not your terrace.',
    messages: [
      { from: 'team', text: 'A client reported one of your photos as not showing your business. We hid it while we check.', when: '3 days ago' },
      { from: 'business', text: 'That one came from our agency. We will upload our own.', when: '3 days ago' },
      { from: 'team', text: 'Thanks. We removed the photo. You can add a new one in Business profile at any time.', when: '2 days ago' },
    ],
  },
  {
    id: 'c-review-report',
    kind: 'review-report',
    subject: 'Review by Daniel Rossi',
    status: 'closed',
    reviewId: 3,
    outcome: 'Author warned. The review stays, without the part about your staff.',
    messages: [
      { from: 'business', text: 'Reason: Offensive or abusive. The review names one of our staff.', when: '5 days ago' },
      { from: 'team', text: 'We warned the author and removed the part that named your staff. The rest of the review stays.', when: '4 days ago' },
    ],
  },
  {
    id: 'c-client-report',
    kind: 'client-report',
    subject: 'Client Hessa Al Falasi',
    status: 'waiting',
    customerId: 9,
    messages: [
      { from: 'business', text: 'Reason: No-show. Booked for 4 three times this month and never came.', when: '2 days ago' },
      { from: 'team', text: 'Thanks for reporting. Were these bookings made in Choices or by WhatsApp?', when: '5 hours ago' },
    ],
  },
  {
    id: 'c-support-closed',
    kind: 'support',
    subject: 'How do I add a second branch?',
    status: 'closed',
    messages: [
      { from: 'business', text: 'We are opening in Dubai Marina next month. How do we add it?', when: '1 week ago' },
      { from: 'team', text: 'Use the location switcher in the sidebar, then Add branch. We verify it within two working days.', when: '6 days ago' },
    ],
  },
  {
    id: 'c-republished',
    kind: 'notice',
    subject: 'Your listing is live again',
    status: 'closed',
    messages: [
      { from: 'team', text: 'We unpublished your Dubai Marina listing because its address pointed to another business.', when: '1 week ago' },
      { from: 'team', text: 'The address is fixed, so we published the listing again. Clients can see it now.', when: '4 days ago' },
    ],
  },
];

// Notices: messages from the team with nothing to answer.
const NOTICE_CONVERSATIONS: Conversation[] = [
  {
    id: 'c-refund',
    kind: 'notice',
    subject: 'Refund issued',
    status: 'closed',
    messages: [{ from: 'team', text: 'We refunded AED 120 for the double charge on your August invoice. It reaches your card in 5 to 10 working days.', when: '1 week ago' }],
  },
  {
    id: 'c-announcement',
    kind: 'notice',
    subject: ANNOUNCEMENT.title,
    status: 'closed',
    messages: [{ from: 'team', text: ANNOUNCEMENT.body, when: '1 week ago' }],
  },
];

export const CONVERSATIONS: Conversation[] = [...CASES, ...NOTICE_CONVERSATIONS];

export const NOTICES: Notice[] = [
  { id: 'n-booking', kind: 'booking', title: 'New booking request', body: 'Noura Al Suwaidi, party of 6 at 5:30 PM', when: '2 min ago', read: false, emailed: false, href: '/bookings' },
  { id: 'n-offer', kind: 'offer', title: 'Offer ending soon', body: 'Spanish latte 2-for-1 ends in 14 minutes', when: '5 min ago', read: false, emailed: false, href: '/offers' },
  { id: 'n-support', kind: 'support', title: 'The Choices team replied', body: 'Invoice shows the wrong legal name', when: '1 hour ago', read: false, emailed: false, conversationId: 'c-support-1' },
  { id: 'n-client-report', kind: 'message', title: 'New message from the Choices team', body: 'About your report on Hessa Al Falasi', when: '5 hours ago', read: false, emailed: false, conversationId: 'c-client-report' },
  { id: 'n-fix', kind: 'fix', title: 'Please fix your listing', body: 'Your Friday opening hours were reported as wrong', when: 'Yesterday', read: false, emailed: true, conversationId: 'c-listing-fix' },
  { id: 'n-reported', kind: 'report', title: 'Your listing was reported', body: 'A client reported your Friday opening hours', when: 'Yesterday', read: true, emailed: true, conversationId: 'c-listing-fix' },
  { id: 'n-review', kind: 'review', title: 'New 5-star review', body: 'Fatima Al Mansoori: “Best Spanish latte in Jumeirah…”', when: '2 days ago', read: true, emailed: false, href: '/customers' },
  { id: 'n-removed', kind: 'outcome', title: 'Report closed: photo removed', body: 'Your terrace at sunset photo was removed', when: '2 days ago', read: true, emailed: true, conversationId: 'c-photo-removed' },
  { id: 'n-hidden', kind: 'report', title: 'Your photo is hidden while we review a report', body: 'Terrace at sunset', when: '3 days ago', read: true, emailed: false, conversationId: 'c-photo-removed' },
  { id: 'n-payment', kind: 'payment', title: 'Next payment on 1 Oct', body: `${PLAN_PRICE.Starter} + VAT for your Starter plan`, when: '3 days ago', read: true, emailed: false, href: '/billing' },
  { id: 'n-review-outcome', kind: 'outcome', title: 'We reviewed the review you reported', body: 'Daniel Rossi’s review: author warned', when: '4 days ago', read: true, emailed: false, conversationId: 'c-review-report' },
  { id: 'n-republished', kind: 'listing', title: 'Listing published again by the Choices team', body: 'Your Dubai Marina listing is live again', when: '4 days ago', read: true, emailed: true, conversationId: 'c-republished' },
  { id: 'n-closed', kind: 'closed', title: 'Your request is closed. Rate the answer', body: 'How do I add a second branch?', when: '6 days ago', read: true, emailed: true, conversationId: 'c-support-closed' },
  { id: 'n-refund', kind: 'refund', title: 'Refund issued', body: 'AED 120 for a double charge in August', when: '1 week ago', read: true, emailed: true, conversationId: 'c-refund' },
  { id: 'n-announcement', kind: 'announcement', title: ANNOUNCEMENT.title, body: ANNOUNCEMENT.body, when: '1 week ago', read: true, emailed: true, conversationId: 'c-announcement' },
];

// What each forced account state adds to the bell and the Help page.
export const ACCOUNT_EFFECTS: Record<'suspended' | 'payment-failed' | 'changes-requested', { notice: Notice; conversation?: Conversation }> = {
  suspended: {
    notice: { id: 'n-suspended', kind: 'suspension', title: 'Your business is suspended', body: 'Your listings are hidden from the app', when: 'Just now', read: false, emailed: true, conversationId: 'c-suspended' },
    conversation: {
      id: 'c-suspended',
      kind: 'account',
      subject: 'Your business is suspended',
      status: 'open',
      messages: [
        { from: 'team', text: `We suspended your business, so your listings and offers are hidden from the app. ${SUSPENSION_REASON}`, when: 'Just now' },
        { from: 'team', text: 'You can still answer existing bookings and reach us here. Reply if you think this is a mistake.', when: 'Just now' },
      ],
    },
  },
  'payment-failed': {
    notice: { id: 'n-payment-failed', kind: 'payment', title: 'Your payment didn’t go through', body: `${PLAN_PRICE.Starter} + VAT for September. Update your card.`, when: 'Just now', read: false, emailed: true, conversationId: 'c-payment-failed' },
    conversation: {
      id: 'c-payment-failed',
      kind: 'notice',
      subject: 'Your payment didn’t go through',
      status: 'closed',
      messages: [{ from: 'team', text: `We couldn’t take ${PLAN_PRICE.Starter} + VAT for September. Update your card in Billing & plan so your listings stay live. The Choices team will try the payment again once your card is updated.`, when: 'Just now' }],
    },
  },
  'changes-requested': {
    notice: { id: 'n-changes', kind: 'verification', title: 'Changes requested before verification', body: 'Two things to fix before we verify your business', when: 'Just now', read: false, emailed: true, conversationId: 'c-changes' },
    conversation: {
      id: 'c-changes',
      kind: 'account',
      subject: 'Changes requested before verification',
      status: 'waiting',
      messages: [
        { from: 'team', text: 'Before we verify your business, please fix two things: your trade licence has expired, so upload the renewed one, and add a cover photo to your listing.', when: 'Just now' },
      ],
    },
  },
};
