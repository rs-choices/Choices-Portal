// Mock data for the Business Portal. There is no backend yet, so every screen
// reads from here. Replace these with Supabase queries when the API exists.

export type Plan = 'Starter' | 'Growth' | 'Enterprise';

export type OfferStatus = 'active' | 'paused' | 'scheduled' | 'draft' | 'expired';
export type BookingStatus = 'confirmed' | 'requested' | 'checkedin' | 'noshow' | 'cancelled';
export type OfferType = 'Discount' | 'Set menu' | 'Happy hour' | 'Event';

export type Offer = {
  id: number;
  title: string;
  type: OfferType;
  deal: string;
  desc: string;
  window: string;
  dates: string;
  views: number;
  claims: number;
  img: number;
  status: OfferStatus;
  live?: boolean;
  left?: string;
  pct?: number;
  sd: string;
  st: string;
  ed: string;
  et: string;
  red: number;
};

export type Booking = {
  id: number;
  time: string;
  t: number;
  name: string;
  party: number;
  offer: string;
  status: BookingStatus;
  phone: string;
};

export type Customer = {
  id: number;
  name: string;
  area: string;
  visits: number;
  last: string;
  claimed: number;
  bookings: number;
  seg: 'new' | 'returning';
  since: string;
};

export type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  text: string;
  reply: string;
};

export type TeamMember = {
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Staff';
  status: 'Active' | 'Invited';
};

export const VENUE = 'Qahwa House';
export const TODAY = '2026-09-23';
export const USER = { name: 'Layla Haddad', role: 'Owner', initials: 'LH' };

export const IMG = [
  '/assets/notif-1.jpg',
  '/assets/popular-offer-hero.jpg',
  '/assets/notif-3.jpg',
  '/assets/event-1.jpg',
  '/assets/event-3.jpg',
  '/assets/event-2.jpg',
];

// Badge label and Tailwind colour classes for each offer or booking status.
export const STATUS: Record<OfferStatus | BookingStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-brand-teal/12 text-teal-ink' },
  paused: { label: 'Paused', className: 'bg-surface-muted text-fg-soft' },
  scheduled: { label: 'Scheduled', className: 'bg-surface-purple text-brand-purple' },
  draft: { label: 'Draft', className: 'bg-surface-muted text-fg-soft' },
  expired: { label: 'Expired', className: 'bg-line-soft text-fg-grey' },
  confirmed: { label: 'Confirmed', className: 'bg-brand-teal/12 text-teal-ink' },
  requested: { label: 'Needs confirming', className: 'bg-brand-peach/14 text-peach-ink' },
  checkedin: { label: 'Checked in', className: 'bg-surface-purple text-brand-purple' },
  noshow: { label: 'No-show', className: 'bg-brand-peach/14 text-peach-ink' },
  cancelled: { label: 'Cancelled', className: 'bg-line-soft text-fg-grey' },
};

export const OFFERS: Offer[] = [
  { id: 1, title: 'Spanish latte 2-for-1', type: 'Discount', deal: '2 for 1', desc: 'Bring a friend: two Spanish lattes for the price of one, every morning.', window: 'Daily · 7–11 AM', dates: 'Until 30 Sep', views: 1284, claims: 96, img: 0, status: 'active', live: true, left: '14m left', pct: 6, sd: '2026-09-01', st: '07:00', ed: '2026-09-30', et: '11:00', red: 150 },
  { id: 2, title: 'Breakfast for two', type: 'Set menu', deal: 'AED 99', desc: 'Shakshuka, labneh, fresh bread, juice and two coffees.', window: 'Daily · 8 AM–12 PM', dates: 'Until 15 Oct', views: 940, claims: 58, img: 1, status: 'active', live: true, left: '1h 14m left', pct: 30, sd: '2026-09-10', st: '08:00', ed: '2026-10-15', et: '12:00', red: 120 },
  { id: 3, title: 'Work-from-café day pass', type: 'Discount', deal: '20% off', desc: '20% off your whole bill, fast Wi-Fi and a quiet corner.', window: 'Weekdays · 9 AM–6 PM', dates: 'Until 31 Oct', views: 611, claims: 33, img: 4, status: 'active', live: true, left: '7h 14m left', pct: 80, sd: '2026-09-15', st: '09:00', ed: '2026-10-31', et: '18:00', red: 200 },
  { id: 4, title: 'Sunset terrace set menu', type: 'Set menu', deal: 'AED 145', desc: 'Three courses on the terrace as the sun goes down.', window: 'Daily · 5–8 PM', dates: 'Until 30 Sep', views: 862, claims: 41, img: 0, status: 'active', live: false, sd: '2026-09-05', st: '17:00', ed: '2026-09-30', et: '20:00', red: 80 },
  { id: 5, title: 'Mocktail happy hour', type: 'Happy hour', deal: '30% off', desc: '30% off all mocktails and iced drinks.', window: 'Daily · 4–7 PM', dates: 'Until 20 Oct', views: 1102, claims: 74, img: 2, status: 'active', live: false, sd: '2026-09-01', st: '16:00', ed: '2026-10-20', et: '19:00', red: 300 },
  { id: 6, title: 'Acoustic Thursdays', type: 'Event', deal: 'Free entry', desc: 'Live acoustic sets on the terrace every Thursday.', window: 'Thursdays · 8–10 PM', dates: 'Until 26 Nov', views: 488, claims: 22, img: 3, status: 'active', live: false, sd: '2026-09-03', st: '20:00', ed: '2026-11-26', et: '22:00', red: 60 },
  { id: 7, title: 'Kids eat free', type: 'Discount', deal: 'Kids free', desc: 'One free kids meal with every adult main.', window: 'Sat–Sun · All day', dates: 'Until 31 Dec', views: 730, claims: 29, img: 5, status: 'active', live: false, sd: '2026-09-06', st: '08:00', ed: '2026-12-31', et: '22:00', red: 100 },
  { id: 8, title: 'Winter hot chocolate bar', type: 'Discount', deal: 'AED 25', desc: 'Build-your-own hot chocolate with toppings.', window: 'Daily · 3–9 PM', dates: 'Starts 15 Oct', views: 0, claims: 0, img: 2, status: 'scheduled', sd: '2026-10-15', st: '15:00', ed: '2026-12-31', et: '21:00', red: 200 },
  { id: 9, title: 'National Day brunch', type: 'Event', deal: 'AED 195', desc: 'A long brunch with Emirati dishes and live oud.', window: '2 Dec · 11 AM–3 PM', dates: 'Starts 2 Dec', views: 0, claims: 0, img: 1, status: 'scheduled', sd: '2026-12-02', st: '11:00', ed: '2026-12-02', et: '15:00', red: 60 },
  { id: 10, title: 'Ladies morning', type: 'Discount', deal: '25% off', desc: '25% off breakfast every Tuesday.', window: 'Tuesdays · 8–11 AM', dates: 'Not scheduled', views: 0, claims: 0, img: 4, status: 'draft', sd: '', st: '08:00', ed: '', et: '11:00', red: 50 },
  { id: 11, title: 'Summer iced coffee 3 for 2', type: 'Discount', deal: '3 for 2', desc: '', window: 'Daily · All day', dates: 'Ended 31 Aug', views: 3420, claims: 211, img: 0, status: 'expired', sd: '2026-07-01', st: '07:00', ed: '2026-08-31', et: '23:00', red: 300 },
  { id: 12, title: 'Back-to-school breakfast', type: 'Set menu', deal: 'AED 59', desc: '', window: 'Weekdays · 7–9 AM', dates: 'Ended 14 Sep', views: 1190, claims: 64, img: 1, status: 'expired', sd: '2026-09-01', st: '07:00', ed: '2026-09-14', et: '09:00', red: 100 },
];

export const BOOKINGS: Booking[] = [
  { id: 1, time: '8:15 AM', t: 815, name: 'Omar Khalid', party: 2, offer: 'Spanish latte 2-for-1', status: 'checkedin', phone: '+971 50 214 7781' },
  { id: 2, time: '9:00 AM', t: 900, name: 'Sara Nasser', party: 1, offer: 'Work-from-café day pass', status: 'checkedin', phone: '+971 55 902 1146' },
  { id: 3, time: '9:45 AM', t: 945, name: 'Daniel Rossi', party: 2, offer: '—', status: 'noshow', phone: '+971 52 310 8820' },
  { id: 4, time: '11:30 AM', t: 1130, name: 'Fatima Al Mansoori', party: 2, offer: 'Breakfast for two', status: 'confirmed', phone: '+971 50 667 0932' },
  { id: 5, time: '12:15 PM', t: 1215, name: 'James Carter', party: 4, offer: '—', status: 'confirmed', phone: '+971 58 145 2290' },
  { id: 6, time: '1:00 PM', t: 1300, name: 'Aisha Rahman', party: 3, offer: 'Work-from-café day pass', status: 'requested', phone: '+971 56 778 4410' },
  { id: 7, time: '5:30 PM', t: 1730, name: 'Noura Al Suwaidi', party: 6, offer: 'Sunset terrace set menu', status: 'requested', phone: '+971 50 881 2037' },
  { id: 8, time: '6:00 PM', t: 1800, name: 'Arjun Mehta', party: 2, offer: 'Mocktail happy hour', status: 'confirmed', phone: '+971 55 430 6618' },
  { id: 9, time: '7:00 PM', t: 1900, name: 'Hessa Al Falasi', party: 4, offer: 'Sunset terrace set menu', status: 'cancelled', phone: '+971 52 509 7734' },
];

export const CUSTOMERS: Customer[] = [
  { id: 1, name: 'Fatima Al Mansoori', area: 'Umm Suqeim', visits: 14, last: 'Today', claimed: 9, bookings: 12, seg: 'returning', since: 'Mar 2026' },
  { id: 2, name: 'Omar Khalid', area: 'Jumeirah 1', visits: 21, last: 'Today', claimed: 15, bookings: 18, seg: 'returning', since: 'Jan 2026' },
  { id: 3, name: 'James Carter', area: 'Dubai Marina', visits: 6, last: 'Today', claimed: 3, bookings: 5, seg: 'returning', since: 'May 2026' },
  { id: 4, name: 'Sara Nasser', area: 'Al Wasl', visits: 9, last: 'Today', claimed: 6, bookings: 4, seg: 'returning', since: 'Apr 2026' },
  { id: 5, name: 'Arjun Mehta', area: 'Business Bay', visits: 11, last: '20 Sep', claimed: 8, bookings: 7, seg: 'returning', since: 'Feb 2026' },
  { id: 6, name: 'Aisha Rahman', area: 'Downtown Dubai', visits: 2, last: '19 Sep', claimed: 2, bookings: 1, seg: 'new', since: 'Sep 2026' },
  { id: 7, name: 'Daniel Rossi', area: 'JLT', visits: 1, last: '12 Sep', claimed: 1, bookings: 2, seg: 'new', since: 'Sep 2026' },
  { id: 8, name: 'Noura Al Suwaidi', area: 'Jumeirah 3', visits: 3, last: '8 Sep', claimed: 2, bookings: 3, seg: 'new', since: 'Aug 2026' },
  { id: 9, name: 'Hessa Al Falasi', area: 'Al Safa', visits: 0, last: '—', claimed: 0, bookings: 1, seg: 'new', since: 'Sep 2026' },
];

export const VISIT_HISTORY: [date: string, what: string, detail: string][] = [
  ['Today', 'Breakfast for two', 'Party of 2 · Checked in'],
  ['16 Sep', 'Spanish latte 2-for-1', 'Claimed offer'],
  ['9 Sep', 'Table booking', 'Party of 3 · Checked in'],
  ['30 Aug', 'Summer iced coffee 3 for 2', 'Claimed offer'],
  ['21 Aug', 'Sunset terrace set menu', 'Party of 4 · Checked in'],
  ['2 Aug', 'Saved Qahwa House', 'From recommendations'],
];

export const REVIEWS: Review[] = [
  { id: 1, name: 'Fatima Al Mansoori', rating: 5, date: '21 Sep', text: 'Best Spanish latte in Jumeirah, and the 2-for-1 made my morning. The staff remembered my order.', reply: '' },
  { id: 2, name: 'James Carter', rating: 4, date: '18 Sep', text: 'Lovely terrace at sunset. The set menu was good value, dessert could be a little bigger.', reply: 'Thanks James! A bigger kunafa portion joins the sunset menu next month.' },
  { id: 3, name: 'Daniel Rossi', rating: 3, date: '12 Sep', text: 'Nice spot, but lunch service was slow on a busy Friday.', reply: '' },
];

export const TEAM: TeamMember[] = [
  { name: 'Layla Haddad', email: 'layla@qahwahouse.ae', role: 'Owner', status: 'Active' },
  { name: 'Omar Farouk', email: 'omar@qahwahouse.ae', role: 'Manager', status: 'Active' },
  { name: 'Priya Nair', email: 'priya@qahwahouse.ae', role: 'Staff', status: 'Invited' },
];

export const INVOICES: [no: string, date: string][] = [
  ['INV-2026-09', '1 Sep 2026'],
  ['INV-2026-08', '1 Aug 2026'],
  ['INV-2026-07', '1 Jul 2026'],
  ['INV-2026-06', '1 Jun 2026'],
  ['INV-2026-05', '1 May 2026'],
];

export const FAQ: [q: string, a: string][] = [
  ['How do customers find my venue?', 'Choices shows your listing to people nearby based on what they are in the mood for, the time of day and their saved preferences. Active offers and a complete profile help you appear more often.'],
  ['When does an offer go live?', 'As soon as you publish it, if the start time has passed. Otherwise it waits in Scheduled and goes live automatically.'],
  ['How do customers redeem an offer?', 'They claim it in the app and show the code to your staff. Check them in from Bookings so the redemption is counted.'],
  ['Can I cancel my plan?', 'Yes. Billing is monthly with no contract. Cancel any time from Billing & plan and your listing stays live until the end of the month.'],
  ['Who can see my analytics?', 'Owners and managers. Staff can only see bookings and live offers.'],
];

export const TAGS = ['Family friendly', 'Outdoor seating', 'Free Wi-Fi', 'Laptop friendly', 'Pet friendly', 'Vegan options', 'Valet parking', 'Sea view'];

export const HOURS: [day: string, open: string, close: string][] = [
  ['Monday', '7:00 AM', '11:00 PM'],
  ['Tuesday', '7:00 AM', '11:00 PM'],
  ['Wednesday', '7:00 AM', '11:00 PM'],
  ['Thursday', '7:00 AM', '12:00 AM'],
  ['Friday', '7:00 AM', '12:00 AM'],
  ['Saturday', '8:00 AM', '12:00 AM'],
  ['Sunday', '8:00 AM', '11:00 PM'],
];

export const LOCATIONS = ['Jumeirah 1', 'Dubai Marina', 'Downtown Dubai'];

export const PLAN_PRICE: Record<Plan, string> = { Starter: 'AED 299', Growth: 'AED 799', Enterprise: 'Custom' };

export const PLANS: { name: Plan; price: string; unit: string; feats: string[] }[] = [
  { name: 'Starter', price: '299', unit: 'AED / month', feats: ['Up to 10 active offers', 'Dashboard', 'Basic support'] },
  { name: 'Growth', price: '799', unit: 'AED / month', feats: ['Unlimited offers', 'Analytics', 'Priority placement in search', 'Priority support'] },
  { name: 'Enterprise', price: 'Custom', unit: 'Tailored pricing', feats: ['Multiple locations', 'Dedicated account manager', 'API access', 'Everything in Growth'] },
];

export type Range = 'today' | '7d' | '30d';

type Series = { lbl: string[]; v: number[]; b: number[]; c: number[]; stats: [string, string, string, boolean][]; vs: string };

function thirtyDays(): Series {
  const s: Series = {
    lbl: ['25 Aug', '31 Aug', '6 Sep', '12 Sep', '18 Sep', '23 Sep'],
    v: [],
    b: [],
    c: [],
    stats: [['Listing views', '11,920', '+21%', true], ['Offer claims', '978', '+17%', true], ['Bookings', '342', '+11%', true], ['Conversion', '8.2%', '−0.2 pts', false]],
    vs: 'vs. previous 30 days',
  };
  for (let i = 0; i < 30; i++) {
    const wk = i % 7 === 1 || i % 7 === 2 ? 1.35 : 1;
    s.v.push(Math.round((300 + i * 4 + 40 * Math.sin(i * 1.3)) * wk));
    s.b.push(Math.round((9 + i * 0.12 + 3 * Math.sin(i * 0.8 + 1)) * wk));
    s.c.push(Math.round((26 + i * 0.3 + 6 * Math.sin(i * 1.1 + 2)) * wk));
  }
  return s;
}

export const SERIES: Record<Range, Series> = {
  today: { lbl: ['7 AM', '8 AM', '9 AM', '10 AM'], v: [64, 118, 131, 99], b: [2, 4, 5, 3], c: [5, 11, 13, 8], stats: [['Listing views', '412', '+8%', true], ['Offer claims', '37', '+12%', true], ['Bookings', '14', '−3%', false], ['Conversion', '9.0%', '+0.4 pts', true]], vs: 'vs. last Wednesday' },
  '7d': { lbl: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'], v: [318, 352, 440, 396, 368, 561, 425], b: [9, 11, 16, 14, 10, 12, 14], c: [27, 31, 44, 36, 29, 41, 33], stats: [['Listing views', '2,860', '+14%', true], ['Offer claims', '241', '+9%', true], ['Bookings', '86', '+6%', true], ['Conversion', '8.4%', '+0.3 pts', true]], vs: 'vs. previous 7 days' },
  '30d': thirtyDays(),
};

export const RANGES: [Range, string][] = [['today', 'Today'], ['7d', '7 days'], ['30d', '30 days']];

export const VIEW_SOURCES: { label: string; pct: number; className: string }[] = [
  { label: 'Search', pct: 42, className: 'bg-brand-purple' },
  { label: 'Recommendations', pct: 35, className: 'bg-brand-peach' },
  { label: 'Shared by friends', pct: 16, className: 'bg-brand-teal' },
  { label: 'Your profile link', pct: 7, className: 'bg-muted-lilac' },
];

// Copy for each section's empty state, shown once the API can return no data.
export const EMPTY_COPY: Record<string, [title: string, body: string, cta: string]> = {
  dashboard: ['Your numbers will show up here', 'Once people start finding Qahwa House, you will see views, claims and bookings here. Posting an offer is the quickest way to get noticed.', 'Post your first offer'],
  offers: ['No offers yet', 'Offers are how nearby people discover you. Start with something simple, like a morning coffee deal.', 'Create an offer'],
  bookings: ['No bookings yet', 'When customers book a table or claim an offer, they will appear here so you can confirm and check them in.', 'Post an offer'],
  customers: ['No customers yet', 'People who book, claim an offer or save Qahwa House will be listed here, with their visit history.', 'Post an offer'],
  analytics: ['Not enough data yet', 'Analytics fill in after your first week on Choices. Check back soon.', 'Go to dashboard'],
  profile: ['Your listing is empty', 'Add a description, opening hours and a few photos so customers know what to expect.', 'Start your profile'],
  billing: ['You are not on a plan yet', 'Pick a plan to go live on Choices. Monthly billing, no contract, cancel any time.', 'Choose a plan'],
  settings: ['It is just you so far', 'Invite your team so they can manage bookings and offers with you.', 'Invite a team member'],
  help: ['No results found', 'We could not find an answer to that. Our team usually replies within a few hours.', 'Contact support'],
};
