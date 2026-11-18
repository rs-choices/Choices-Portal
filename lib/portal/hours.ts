import { fmtTime, weekdayIndex } from './format';

// Opening hours, special hours and menus: each is a shared item, saved once
// for the business and applied to one or more branches ("Applies to").
// Times are 24-hour 'HH:MM'; a range whose close is at or before its open
// runs past midnight. Dates are ISO 'YYYY-MM-DD'. Mock data, like the rest of
// the portal: replace with Supabase queries when the API exists.

export type TimeRange = { open: string; close: string };
export type DayHours = { closed: boolean; ranges: TimeRange[]; kitchenCloses: string | null };
export type Shared = { id: string; branchIds: string[] };
// days: 7 entries, Monday first.
export type OpeningHours = Shared & { name: string; days: DayHours[] };
// from..to inclusive; the same hours on every day of the period.
export type SpecialHours = Shared & { label: string; from: string; to: string } & DayHours;
export type Menu = Shared & { name: string; fileName: string; size: number; uploadedAt: string; url: string | null };
// 'all': change the item for every branch it applies to. { only }: split off a copy for that branch.
export type Scope = 'all' | { only: string };
export type DayResolved = DayHours & { special: SpecialHours | null };

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const ALL = ['b-jum', 'b-mar', 'b-dtn'];

const day = (open: string, close: string, kitchenCloses: string | null = null): DayHours => ({ closed: false, ranges: [{ open, close }], kitchenCloses });
export const CLOSED_DAY: DayHours = { closed: true, ranges: [], kitchenCloses: null };

export const OPENING_HOURS: OpeningHours[] = [
  {
    id: 'oh-cafe',
    name: 'Café hours',
    branchIds: ['b-jum', 'b-dtn'],
    days: [
      day('07:00', '23:00', '22:30'),
      day('07:00', '23:00', '22:30'),
      day('07:00', '23:00', '22:30'),
      day('07:00', '00:00', '22:30'),
      day('07:00', '00:00', '22:30'),
      day('08:00', '00:00', '22:30'),
      day('08:00', '23:00', '22:30'),
    ],
  },
  { id: 'oh-marina', name: 'Marina evenings', branchIds: ['b-mar'], days: WEEKDAYS.map(() => day('17:00', '01:00')) },
];

export const SPECIAL_HOURS: SpecialHours[] = [
  { id: 'sh-independence', label: 'Independence Day', from: '2026-11-22', to: '2026-11-22', ...CLOSED_DAY, branchIds: ALL },
  { id: 'sh-christmas', label: 'Christmas Day 2026', from: '2026-12-25', to: '2026-12-25', ...day('12:00', '18:00'), branchIds: ['b-jum', 'b-mar'] },
  {
    id: 'sh-ramadan',
    label: 'Ramadan 2027',
    from: '2027-02-08',
    to: '2027-03-09',
    closed: false,
    ranges: [
      { open: '11:00', close: '15:00' },
      { open: '18:00', close: '02:00' },
    ],
    kitchenCloses: null,
    branchIds: ['b-jum', 'b-dtn'],
  },
  { id: 'sh-eid', label: 'Eid al-Fitr 2027', from: '2027-03-10', to: '2027-03-10', ...CLOSED_DAY, branchIds: ALL },
];

export const MENUS: Menu[] = [
  { id: 'mn-cafe', name: 'Café menu', fileName: 'cafe-menu.pdf', size: 1_240_000, uploadedAt: '2026-11-02', url: null, branchIds: ['b-jum', 'b-dtn'] },
  { id: 'mn-marina', name: 'Marina menu', fileName: 'marina-dinner.pdf', size: 2_830_000, uploadedAt: '2026-10-21', url: null, branchIds: ['b-mar'] },
];

const span = (s: SpecialHours) => (Date.parse(s.to) - Date.parse(s.from)) / 86_400_000;

// The special hours period in force for a branch on a date. When several
// cover it, the shorter one wins (an Eid day off inside Ramadan); on a tie,
// the later one in the list.
export function activeSpecial(branchId: string, date: string, specials: SpecialHours[]): SpecialHours | null {
  let best: SpecialHours | null = null;
  for (const s of specials) {
    if (!s.branchIds.includes(branchId) || s.from > date || s.to < date) continue;
    if (!best || span(s) <= span(best)) best = s;
  }
  return best;
}

export function hoursForBranch(branchId: string, date: string, hours: OpeningHours[], specials: SpecialHours[]): DayResolved {
  const special = activeSpecial(branchId, date, specials);
  if (special) return { closed: special.closed, ranges: special.ranges, kitchenCloses: special.kitchenCloses, special };
  const set = hours.find((h) => h.branchIds.includes(branchId));
  const d = set?.days[weekdayIndex(date)] ?? CLOSED_DAY;
  return { ...d, special: null };
}

// '7:00 AM–11:00 PM', 'Closed', or several ranges joined with ', '.
export function describeDay(d: DayHours) {
  if (d.closed || d.ranges.length === 0) return 'Closed';
  return d.ranges.map((r) => `${fmtTime(r.open)}–${fmtTime(r.close)}`).join(', ');
}

// Consecutive days with the same hours folded: 'Mon–Wed 7 AM–11 PM · Thu–Fri 7 AM–12 AM'.
export function summariseWeek(days: DayHours[]): string {
  const parts: string[] = [];
  let start = 0;
  for (let i = 1; i <= days.length; i++) {
    if (i < days.length && describeDay(days[i]) === describeDay(days[start])) continue;
    const label = i - 1 === start ? SHORT[start] : `${SHORT[start]}–${SHORT[i - 1]}`;
    parts.push(`${label} ${describeDay(days[start])}`);
    start = i;
  }
  return parts.join(' · ');
}

const mins = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

// True when there is no kitchen closing time, or it falls inside one of the
// day's ranges (ranges past midnight included).
export function kitchenInside(d: DayHours): boolean {
  if (!d.kitchenCloses) return true;
  if (d.closed) return false;
  const k = mins(d.kitchenCloses);
  return d.ranges.some((r) => {
    const o = mins(r.open);
    let c = mins(r.close);
    if (c <= o) c += 1440;
    return (k > o && k <= c) || (k + 1440 > o && k + 1440 <= c);
  });
}

// End of a range in minutes from the day's start; past midnight adds a day.
const endMins = (r: TimeRange) => {
  const o = mins(r.open);
  const c = mins(r.close);
  return c <= o ? c + 1440 : c;
};

// The time a branch closes for the day: the latest end among its ranges,
// whatever order they were typed in.
export function closesAt(d: DayHours): string | null {
  if (d.closed || d.ranges.length === 0) return null;
  return d.ranges.reduce((a, b) => (endMins(b) > endMins(a) ? b : a)).close;
}

// True when two of the day's ranges overlap (overnight ranges included).
export function rangesOverlap(d: DayHours): boolean {
  if (d.closed) return false;
  const rs = d.ranges.filter((r) => r.open && r.close).map((r) => [mins(r.open), endMins(r)] as const).sort((a, b) => a[0] - b[0]);
  return rs.some((r, i) => i > 0 && r[0] < rs[i - 1][1]);
}

// Whether a branch is open at a moment, as clients would read it:
// 'Open · closes 11 PM', 'Closed · opens 6 PM', 'Closed now', or
// 'Closed today · Eid al-Fitr'. Yesterday's ranges that run past midnight
// count too (1:30 AM at a bar that closes at 2 AM).
export function statusAt(branchId: string, date: string, now: string, yesterday: string, hours: OpeningHours[], specials: SpecialHours[]) {
  const t = mins(now);
  const today = hoursForBranch(branchId, date, hours, specials);
  const prev = hoursForBranch(branchId, yesterday, hours, specials);
  const label = (d: DayResolved) => (d.special ? ` · ${d.special.label}` : '');
  if (!prev.closed) {
    const late = prev.ranges.find((r) => mins(r.close) <= mins(r.open) && t < mins(r.close));
    if (late) return { open: true, text: `Open · closes ${fmtTime(late.close)}${label(prev)}` };
  }
  if (today.closed || today.ranges.length === 0) return { open: false, text: `Closed today${label(today)}` };
  const now_ = today.ranges.find((r) => t >= mins(r.open) && t < endMins(r));
  if (now_) return { open: true, text: `Open · closes ${fmtTime(now_.close)}${label(today)}` };
  const next = today.ranges.filter((r) => mins(r.open) > t).sort((a, b) => mins(a.open) - mins(b.open))[0];
  if (next) return { open: false, text: `Closed · opens ${fmtTime(next.open)}${label(today)}` };
  return { open: false, text: `Closed now${label(today)}` };
}

// Other periods that share at least one day and one branch with the draft.
export function overlapping(draft: Pick<SpecialHours, 'id' | 'from' | 'to' | 'branchIds'>, specials: SpecialHours[]): SpecialHours[] {
  return specials.filter((s) => s.id !== draft.id && s.from <= draft.to && s.to >= draft.from && s.branchIds.some((b) => draft.branchIds.includes(b)));
}

export const isPast = (s: SpecialHours, today: string) => s.to < today;

let seq = 0;
export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(seq++).toString(36)}`;

// Saves one shared item into its list.
// - A new id is added. scope 'all' replaces the item for every branch.
// - { only: b } keeps the original for its other branches and adds a copy
//   with the edits for b alone, renamed '<name> (<branch>)'.
// - exclusive (opening hours, menus: one per branch): the branches the saved
//   item now covers are taken off every other item of that kind.
export function applySave<T extends Shared>(
  items: T[],
  edited: T,
  scope: Scope,
  exclusive: boolean,
  rename: (t: T, branchName: string) => T,
  branchName: (id: string) => string,
): T[] {
  let next: T[];
  let covers: string[];
  const exists = items.some((t) => t.id === edited.id);
  if (!exists) {
    next = [...items, edited];
    covers = edited.branchIds;
  } else if (scope === 'all') {
    next = items.map((t) => (t.id === edited.id ? edited : t));
    covers = edited.branchIds;
  } else {
    const b = scope.only;
    const copy = rename({ ...edited, id: newId('x'), branchIds: [b] }, branchName(b));
    next = [...items.map((t) => (t.id === edited.id ? { ...t, branchIds: t.branchIds.filter((x) => x !== b) } : t)), copy];
    covers = [b];
    if (!exclusive) return next;
    return next.map((t) => (t.id === copy.id ? t : { ...t, branchIds: t.branchIds.filter((x) => !covers.includes(x)) }));
  }
  if (!exclusive) return next;
  return next.map((t) => (t.id === edited.id ? t : { ...t, branchIds: t.branchIds.filter((x) => !covers.includes(x)) }));
}
