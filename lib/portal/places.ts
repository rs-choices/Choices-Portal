import { HOURS, type Plan } from './data';

// Mock branches, outlets, events and activities. A business lists each
// branch as a place first; events, activities and offers are added on top of
// a place. Every branch has a default outlet, hidden until a second one is
// approved: a branch can be too big and hold several places (a hotel's café,
// rooftop restaurant and kids' corner), and each of those is an outlet shown
// as its own place. Replace with Supabase queries when the API exists.

export type BranchStatus = 'verified' | 'waiting';
export type Branch = { id: string; name: string; area: string; address: string; licence: string; status: BranchStatus };

export type OutletType = 'Food & Beverage' | 'Activities' | 'Events' | 'Leisure';
export const OUTLET_TYPES: OutletType[] = ['Food & Beverage', 'Activities', 'Events', 'Leisure'];

export type PlaceDetails = {
  description: string;
  photos: number[];
  hours: [day: string, open: string, close: string][];
  tags: string[];
  priceBand: 0 | 1 | 2;
  whatsapp: string;
};

export type Outlet = { id: string; branchId: string; name: string; type: OutletType; isDefault: boolean; status: 'live' | 'requested'; place: PlaceDetails };

export type EventStatus = 'draft' | 'published' | 'soldout' | 'ended' | 'cancelled';
export type EventListing = {
  id: number;
  outletId: string;
  title: string;
  date: string;
  time: string;
  weekly: boolean;
  price: number;
  spots: number;
  left: number;
  desc: string;
  img: number;
  status: EventStatus;
};

export type ActivityStatus = 'draft' | 'published' | 'unpublished';
export type Activity = {
  id: number;
  outletId: string;
  title: string;
  duration: string;
  price: number;
  minAge: number;
  availability: string;
  desc: string;
  img: number;
  status: ActivityStatus;
};

export const PRICE_BANDS: [0 | 1 | 2, string][] = [
  [0, 'Under AED 50'],
  [1, 'AED 50–150'],
  [2, 'AED 150+'],
];

export const EVENT_STATUS: Record<EventStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-surface-muted text-fg-soft' },
  published: { label: 'Published', className: 'bg-brand-teal/12 text-teal-ink' },
  soldout: { label: 'Sold out', className: 'bg-brand-peach/14 text-peach-ink' },
  ended: { label: 'Ended', className: 'bg-line-soft text-fg-grey' },
  cancelled: { label: 'Cancelled', className: 'bg-line-soft text-fg-grey' },
};

export const ACTIVITY_STATUS: Record<ActivityStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-surface-muted text-fg-soft' },
  published: { label: 'Published', className: 'bg-brand-teal/12 text-teal-ink' },
  unpublished: { label: 'Unpublished', className: 'bg-line-soft text-fg-grey' },
};

const EVENING: PlaceDetails['hours'] = HOURS.map(([d]) => [d, '5:00 PM', '1:00 AM']);
const DAYTIME: PlaceDetails['hours'] = HOURS.map(([d]) => [d, '10:00 AM', '8:00 PM']);

export const BRANCHES: Branch[] = [
  { id: 'b-jum', name: 'Jumeirah 1', area: 'Jumeirah', address: 'Jumeirah Beach Road, near Mercato Mall', licence: 'DED-884213', status: 'verified' },
  { id: 'b-mar', name: 'Dubai Marina', area: 'Dubai Marina', address: 'Marina Walk, Tower 4, ground and 32nd floor', licence: 'DED-902117', status: 'verified' },
  { id: 'b-dtn', name: 'Downtown Dubai', area: 'Downtown', address: 'Boulevard Point, Sheikh Mohammed bin Rashid Blvd', licence: 'DED-913480', status: 'waiting' },
];

export const OUTLETS: Outlet[] = [
  {
    id: 'o-jum',
    branchId: 'b-jum',
    name: 'Jumeirah 1',
    type: 'Food & Beverage',
    isDefault: true,
    status: 'live',
    place: {
      description: 'A neighbourhood café on Jumeirah Beach Road. Specialty coffee, all-day breakfast and a terrace that catches the sunset.',
      photos: [0, 1, 2, 3, 4],
      hours: HOURS,
      tags: ['Outdoor seating', 'Free Wi-Fi', 'Laptop friendly', 'Family friendly'],
      priceBand: 1,
      whatsapp: '+971 4 555 0199',
    },
  },
  {
    id: 'o-mar-lobby',
    branchId: 'b-mar',
    name: 'Lobby café',
    type: 'Food & Beverage',
    isDefault: true,
    status: 'live',
    place: { description: 'Coffee and pastries on the ground floor, right on Marina Walk.', photos: [2, 0], hours: HOURS, tags: ['Free Wi-Fi', 'Laptop friendly'], priceBand: 0, whatsapp: '+971 4 555 0200' },
  },
  {
    id: 'o-mar-roof',
    branchId: 'b-mar',
    name: 'Rooftop restaurant',
    type: 'Food & Beverage',
    isDefault: false,
    status: 'live',
    place: { description: 'Dinner on the 32nd floor with a view over the marina. Live music on Thursdays.', photos: [3, 1, 4], hours: EVENING, tags: ['Sea view', 'Valet parking'], priceBand: 2, whatsapp: '+971 4 555 0201' },
  },
  {
    id: 'o-mar-kids',
    branchId: 'b-mar',
    name: "Kids' corner",
    type: 'Leisure',
    isDefault: false,
    status: 'live',
    place: { description: 'A supervised play and craft corner for children aged 3 to 10.', photos: [5, 4], hours: DAYTIME, tags: ['Family friendly'], priceBand: 0, whatsapp: '+971 4 555 0202' },
  },
  {
    id: 'o-dtn',
    branchId: 'b-dtn',
    name: 'Downtown Dubai',
    type: 'Food & Beverage',
    isDefault: true,
    status: 'live',
    place: { description: 'Our newest café, opening next to the Boulevard.', photos: [1], hours: HOURS, tags: ['Outdoor seating'], priceBand: 1, whatsapp: '+971 4 555 0203' },
  },
];

export const EVENTS: EventListing[] = [
  { id: 1, outletId: 'o-jum', title: 'Acoustic Thursdays', date: '2026-09-24', time: '20:00', weekly: true, price: 0, spots: 60, left: 22, desc: 'Live acoustic sets on the terrace every Thursday.', img: 3, status: 'published' },
  { id: 2, outletId: 'o-mar-roof', title: 'National Day brunch', date: '2026-12-02', time: '11:00', weekly: false, price: 195, spots: 60, left: 60, desc: 'A long brunch with Emirati dishes and live oud.', img: 1, status: 'published' },
  { id: 3, outletId: 'o-mar-kids', title: 'Halloween family night', date: '2026-10-31', time: '17:00', weekly: false, price: 75, spots: 40, left: 40, desc: 'Costumes, crafts and a pumpkin hunt for the little ones.', img: 5, status: 'draft' },
];

export const ACTIVITIES: Activity[] = [
  { id: 1, outletId: 'o-jum', title: 'Latte art class', duration: '1 hour', price: 120, minAge: 12, availability: 'Sat–Sun, 10 AM–12 PM', desc: 'Learn to pour hearts and rosettas with our head barista.', img: 0, status: 'published' },
  { id: 2, outletId: 'o-mar-kids', title: "Kids' painting corner", duration: '45 minutes', price: 40, minAge: 3, availability: 'Daily, 10 AM–6 PM', desc: 'Canvas, colours and a supervisor. Take the painting home.', img: 5, status: 'published' },
];

// Live and requested outlets of one branch, the default one first.
export function outletsOf(outlets: Outlet[], branchId: string): Outlet[] {
  return outlets.filter((o) => o.branchId === branchId).sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
}

// "Jumeirah 1" for a branch with one live outlet (no outlet word for small
// businesses), "Rooftop restaurant, Dubai Marina" for a big branch.
export function placeLabel(outlets: Outlet[], branches: Branch[], outletId: string): string {
  const o = outlets.find((x) => x.id === outletId);
  if (!o) return '';
  const b = branches.find((x) => x.id === o.branchId);
  const live = outlets.filter((x) => x.branchId === o.branchId && x.status === 'live');
  return live.length > 1 && b ? `${o.name}, ${b.name}` : (b?.name ?? o.name);
}

// What each plan unlocks is not decided yet, so every plan can add branches.
// Change this one function when it is.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- the plan rule is not decided yet
export function canAddBranch(plan: Plan, branches: Branch[]): boolean {
  return true;
}
