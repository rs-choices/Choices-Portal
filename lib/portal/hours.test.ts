import { describe, expect, it } from 'vitest';
import {
  OPENING_HOURS,
  activeSpecial,
  applySave,
  closesAt,
  hoursForBranch,
  kitchenInside,
  overlapping,
  rangesOverlap,
  statusAt,
  summariseWeek,
  type DayHours,
  type OpeningHours,
  type Scope,
  type SpecialHours,
} from './hours';

// Fixtures. 16 Nov 2026 is a Monday.
const MON = '2026-11-16';
const TUE = '2026-11-17';
const SUN = '2026-11-22';

const open = (o: string, c: string, kitchenCloses: string | null = null): DayHours => ({ closed: false, ranges: [{ open: o, close: c }], kitchenCloses });
const CLOSED: DayHours = { closed: true, ranges: [], kitchenCloses: null };

// Café: 7 AM–11 PM, closed on Sunday. Bar: 6 PM–2 AM every day (past midnight).
const cafe: OpeningHours = { id: 'oh-cafe', name: 'Café', branchIds: ['cafe'], days: [...Array.from({ length: 6 }, () => open('07:00', '23:00')), CLOSED] };
const bar: OpeningHours = { id: 'oh-bar', name: 'Bar', branchIds: ['bar'], days: Array.from({ length: 7 }, () => open('18:00', '02:00')) };
const HOURS = [cafe, bar];

const special = (id: string, label: string, from: string, to: string, branchIds: string[], d: DayHours = CLOSED): SpecialHours => ({ id, label, from, to, branchIds, ...d });

describe('1. hoursForBranch: which hours apply on a day', () => {
  it('uses the opening hours on a normal day', () => {
    const r = hoursForBranch('cafe', MON, HOURS, []);
    expect(r.closed).toBe(false);
    expect(r.ranges).toEqual([{ open: '07:00', close: '23:00' }]);
    expect(r.special).toBeNull();
  });

  it('uses the special hours inside a period', () => {
    const xmas = special('x', 'Christmas', MON, MON, ['cafe'], open('12:00', '18:00'));
    const r = hoursForBranch('cafe', MON, HOURS, [xmas]);
    expect(r.ranges).toEqual([{ open: '12:00', close: '18:00' }]);
    expect(r.special?.label).toBe('Christmas');
  });

  it('a closed special day is closed, and a closed weekday is closed', () => {
    expect(hoursForBranch('cafe', MON, HOURS, [special('e', 'Eid', MON, MON, ['cafe'])]).closed).toBe(true);
    expect(hoursForBranch('cafe', SUN, HOURS, []).closed).toBe(true);
  });

  it('ignores a special period for another branch', () => {
    expect(hoursForBranch('cafe', MON, HOURS, [special('e', 'Eid', MON, MON, ['bar'])]).closed).toBe(false);
  });
});

describe('2. activeSpecial: the shorter period wins', () => {
  const ramadan = special('r', 'Ramadan', '2027-02-08', '2027-03-09', ['cafe'], open('18:00', '02:00'));
  const eid = special('e', 'Eid', '2027-03-01', '2027-03-01', ['cafe']);

  it('an Eid day off inside Ramadan gives Eid, in either order', () => {
    expect(activeSpecial('cafe', '2027-03-01', [ramadan, eid])?.label).toBe('Eid');
    expect(activeSpecial('cafe', '2027-03-01', [eid, ramadan])?.label).toBe('Eid');
  });

  it('other Ramadan days give Ramadan', () => {
    expect(activeSpecial('cafe', '2027-03-02', [ramadan, eid])?.label).toBe('Ramadan');
  });

  it('on a tie, the later one in the list wins', () => {
    const a = special('a', 'First', MON, MON, ['cafe']);
    const b = special('b', 'Second', MON, MON, ['cafe']);
    expect(activeSpecial('cafe', MON, [a, b])?.label).toBe('Second');
  });
});

describe('3. statusAt: open now', () => {
  const at = (branch: string, date: string, now: string, yesterday: string, specials: SpecialHours[] = []) =>
    statusAt(branch, date, now, yesterday, HOURS, specials);

  it('open during the day', () => {
    expect(at('cafe', MON, '12:00', '2026-11-15')).toEqual({ open: true, text: 'Open · closes 11 PM' });
  });

  it('before opening', () => {
    expect(at('cafe', MON, '05:00', '2026-11-15')).toEqual({ open: false, text: 'Closed · opens 7 AM' });
  });

  it('after closing', () => {
    expect(at('cafe', MON, '23:30', '2026-11-15')).toEqual({ open: false, text: 'Closed now' });
  });

  it('a closed weekday and a closed special day', () => {
    expect(at('cafe', SUN, '12:00', '2026-11-21').text).toBe('Closed today');
    expect(at('cafe', MON, '12:00', '2026-11-15', [special('e', 'Eid', MON, MON, ['cafe'])]).text).toBe('Closed today · Eid');
  });

  it("at 1:30 AM a bar open until 2 AM is open, from yesterday's hours", () => {
    expect(at('bar', TUE, '01:30', MON)).toEqual({ open: true, text: 'Open · closes 2 AM' });
  });

  it('at 3 AM the bar is closed until the evening', () => {
    expect(at('bar', TUE, '03:00', MON)).toEqual({ open: false, text: 'Closed · opens 6 PM' });
  });
});

describe('4. kitchenInside', () => {
  it('passes inside the hours and fails after closing', () => {
    expect(kitchenInside(open('07:00', '23:00', '22:30'))).toBe(true);
    expect(kitchenInside(open('07:00', '23:00', '23:30'))).toBe(false);
  });

  it('passes at 1 AM inside a 6 PM–2 AM range', () => {
    expect(kitchenInside(open('18:00', '02:00', '01:00'))).toBe(true);
    expect(kitchenInside(open('18:00', '02:00', '03:00'))).toBe(false);
  });

  it('passes with no kitchen time, and at closing time exactly', () => {
    expect(kitchenInside(open('07:00', '23:00'))).toBe(true);
    expect(kitchenInside(open('07:00', '23:00', '23:00'))).toBe(true);
  });
});

describe('5. rangesOverlap and closesAt', () => {
  const day = (...r: [string, string][]): DayHours => ({ closed: false, ranges: r.map(([o, c]) => ({ open: o, close: c })), kitchenCloses: null });

  it('catches overlapping ranges', () => {
    expect(rangesOverlap(day(['10:00', '15:00'], ['12:00', '18:00']))).toBe(true);
  });

  it('allows separate and back-to-back ranges, overnight included', () => {
    expect(rangesOverlap(day(['11:00', '15:00'], ['18:00', '02:00']))).toBe(false);
    expect(rangesOverlap(day(['10:00', '15:00'], ['15:00', '18:00']))).toBe(false);
  });

  it('closesAt takes the latest end, whatever the order typed', () => {
    expect(closesAt(day(['18:00', '02:00'], ['11:00', '15:00']))).toBe('02:00');
    expect(closesAt(day(['11:00', '15:00'], ['18:00', '23:00']))).toBe('23:00');
    expect(closesAt(CLOSED)).toBeNull();
  });
});

describe('6. applySave: saving shared items', () => {
  type Item = { id: string; name: string; branchIds: string[] };
  const A: Item = { id: 'A', name: 'Café hours', branchIds: ['b1', 'b2'] };
  const B: Item = { id: 'B', name: 'Evenings', branchIds: ['b3'] };
  const rename = (t: Item, branch: string) => ({ ...t, name: `${t.name} (${branch})` });
  const branchName = (id: string) => `Branch ${id}`;
  const save = (edited: Item, scope: Scope, exclusive = true) => applySave([A, B], edited, scope, exclusive, rename, branchName);
  const owners = (items: Item[], b: string) => items.filter((t) => t.branchIds.includes(b)).length;

  it('adds a new item', () => {
    const r = save({ id: 'C', name: 'New', branchIds: [] }, 'all');
    expect(r.map((t) => t.id)).toEqual(['A', 'B', 'C']);
  });

  it('"all" changes the item for every branch', () => {
    const r = save({ ...A, name: 'Renamed' }, 'all');
    expect(r.find((t) => t.id === 'A')).toEqual({ ...A, name: 'Renamed' });
  });

  it('"only this branch" splits a copy: original keeps the rest, copy gets the branch', () => {
    const r = save({ ...A, name: 'Edited' }, { only: 'b1' });
    const original = r.find((t) => t.id === 'A')!;
    const copy = r.find((t) => t.id !== 'A' && t.id !== 'B')!;
    expect(original.name).toBe('Café hours');
    expect(original.branchIds).toEqual(['b2']);
    expect(copy.branchIds).toEqual(['b1']);
    expect(copy.name).toBe('Edited (Branch b1)');
  });

  it('ticking a branch that uses another set moves it: no branch in two sets', () => {
    const r = save({ ...A, branchIds: ['b1', 'b2', 'b3'] }, 'all');
    expect(r.find((t) => t.id === 'B')!.branchIds).toEqual([]);
    for (const b of ['b1', 'b2', 'b3']) expect(owners(r, b)).toBe(1);
  });

  it('a new exclusive item takes its branches off the others', () => {
    const r = save({ id: 'C', name: 'New', branchIds: ['b2'] }, 'all');
    expect(r.find((t) => t.id === 'A')!.branchIds).toEqual(['b1']);
  });

  it('non-exclusive (special hours) leaves other items alone', () => {
    const r = save({ id: 'C', name: 'Eid', branchIds: ['b1', 'b3'] }, 'all', false);
    expect(r.find((t) => t.id === 'A')!.branchIds).toEqual(['b1', 'b2']);
    expect(r.find((t) => t.id === 'B')!.branchIds).toEqual(['b3']);
  });
});

describe('7. overlapping: the overlap warning', () => {
  const ramadan = special('r', 'Ramadan', '2027-02-08', '2027-03-09', ['b1']);
  const elsewhere = special('o', 'Other branch', '2027-03-01', '2027-03-01', ['b2']);
  const later = special('l', 'Later', '2027-04-01', '2027-04-01', ['b1']);

  it('finds a period sharing a day and a branch', () => {
    expect(overlapping({ id: 'new', from: '2027-03-01', to: '2027-03-01', branchIds: ['b1'] }, [ramadan, elsewhere, later]).map((s) => s.id)).toEqual(['r']);
  });

  it("ignores the item's own entry, other branches and other dates", () => {
    expect(overlapping({ id: 'r', from: '2027-02-08', to: '2027-03-09', branchIds: ['b1'] }, [ramadan, elsewhere, later])).toEqual([]);
  });
});

describe('8. summariseWeek', () => {
  it('folds days with the same hours (the mock Café hours)', () => {
    const cafeHours = OPENING_HOURS.find((h) => h.id === 'oh-cafe')!;
    expect(summariseWeek(cafeHours.days)).toBe('Mon–Wed 7 AM–11 PM · Thu–Fri 7 AM–12 AM · Sat 8 AM–12 AM · Sun 8 AM–11 PM');
  });

  it('reads closed days as Closed', () => {
    expect(summariseWeek(cafe.days)).toBe('Mon–Sat 7 AM–11 PM · Sun Closed');
  });
});
