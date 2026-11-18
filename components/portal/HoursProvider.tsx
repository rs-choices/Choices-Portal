'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useListings } from './ListingsProvider';
import { usePortal } from './PortalProvider';
import { addDays, nowHHMM, todayISO } from '@/lib/portal/format';
import {
  MENUS,
  OPENING_HOURS,
  SPECIAL_HOURS,
  WEEKDAYS,
  applySave,
  statusAt,
  isPast,
  newId,
  type Menu,
  type OpeningHours,
  type Scope,
  type SpecialHours,
} from '@/lib/portal/hours';

// Which form is open, and from where. fromBranch is set when it was opened
// from a branch page: saving a shared item then asks "all or only this one".
export type HoursForm =
  | { kind: 'opening'; item: OpeningHours | null; fromBranch?: string }
  | { kind: 'special'; item: SpecialHours | null; fromBranch?: string }
  | { kind: 'menu'; item: Menu | null; fromBranch?: string };

type Ctx = {
  openingHours: OpeningHours[];
  specialHours: SpecialHours[];
  menus: Menu[];
  saveOpeningHours: (item: OpeningHours, scope?: Scope) => void;
  saveSpecialHours: (item: SpecialHours, scope?: Scope) => void;
  saveMenu: (item: Menu, scope?: Scope) => void;
  deleteOpeningHours: (id: string) => boolean;
  deleteSpecialHours: (id: string) => void;
  deleteMenu: (id: string) => void;
  hoursOf: (branchId: string) => OpeningHours | undefined;
  menuOf: (branchId: string) => Menu | undefined;
  upcomingOf: (branchId: string) => SpecialHours[];
  // Open or closed right now, for the phone preview. Browser only (uses the clock).
  statusOf: (branchId: string) => { open: boolean; text: string };
  createForBranch: (branchId: string, name: string, open: string, close: string) => void;
  form: HoursForm | null;
  openForm: (f: HoursForm) => void;
  closeForm: () => void;
};

const HoursCtx = createContext<Ctx | null>(null);

export function useHours() {
  const ctx = useContext(HoursCtx);
  if (!ctx) throw new Error('useHours must be used inside HoursProvider');
  return ctx;
}

const branchesText = (n: number) => (n === 1 ? '1 branch' : `${n} branches`);

export function HoursProvider({ children }: { children: ReactNode }) {
  const { showToast } = usePortal();
  const { branches } = useListings();
  const [openingHours, setOpeningHours] = useState(OPENING_HOURS);
  const [specialHours, setSpecialHours] = useState(SPECIAL_HOURS);
  const [menus, setMenus] = useState(MENUS);
  const [form, setForm] = useState<HoursForm | null>(null);

  const branchName = (id: string) => branches.find((b) => b.id === id)?.name ?? id;
  const count = (item: { branchIds: string[] }, scope: Scope) => (scope === 'all' ? item.branchIds.length : 1);

  const saveOpeningHours: Ctx['saveOpeningHours'] = (item, scope = 'all') => {
    setOpeningHours((all) => applySave(all, item, scope, true, (t, b) => ({ ...t, name: `${t.name} (${b})` }), branchName));
    setForm(null);
    showToast(`Opening hours saved for ${branchesText(count(item, scope))}.`);
  };

  const saveSpecialHours: Ctx['saveSpecialHours'] = (item, scope = 'all') => {
    setSpecialHours((all) => applySave(all, item, scope, false, (t, b) => ({ ...t, label: `${t.label} (${b})` }), branchName));
    setForm(null);
    showToast(`Special hours saved for ${branchesText(count(item, scope))}.`);
  };

  // A replaced or deleted upload's preview URL is released.
  const release = (url: string | null | undefined) => url?.startsWith('blob:') && URL.revokeObjectURL(url);

  const saveMenu: Ctx['saveMenu'] = (item, scope = 'all') => {
    const old = menus.find((m) => m.id === item.id);
    if (old && old.url !== item.url && scope === 'all') release(old.url);
    setMenus((all) => applySave(all, item, scope, true, (t, b) => ({ ...t, name: `${t.name} (${b})` }), branchName));
    setForm(null);
    showToast(`Menu saved for ${branchesText(count(item, scope))}.`);
  };

  // Every branch needs opening hours, so a set still in use can't go.
  const deleteOpeningHours: Ctx['deleteOpeningHours'] = (id) => {
    const set = openingHours.find((h) => h.id === id);
    if (!set || set.branchIds.length > 0) return false;
    setOpeningHours((all) => all.filter((h) => h.id !== id));
    showToast('Opening hours deleted.');
    return true;
  };

  const deleteSpecialHours: Ctx['deleteSpecialHours'] = (id) => {
    setSpecialHours((all) => all.filter((s) => s.id !== id));
    showToast('Special hours deleted. Those days go back to the opening hours.');
  };

  const deleteMenu: Ctx['deleteMenu'] = (id) => {
    release(menus.find((m) => m.id === id)?.url);
    setMenus((all) => all.filter((m) => m.id !== id));
    showToast('Menu deleted.');
  };

  const value: Ctx = {
    openingHours,
    specialHours,
    menus,
    saveOpeningHours,
    saveSpecialHours,
    saveMenu,
    deleteOpeningHours,
    deleteSpecialHours,
    deleteMenu,
    hoursOf: (b) => openingHours.find((h) => h.branchIds.includes(b)),
    menuOf: (b) => menus.find((m) => m.branchIds.includes(b)),
    upcomingOf: (b) =>
      specialHours
        .filter((s) => s.branchIds.includes(b) && !isPast(s, todayISO()))
        .sort((x, y) => x.from.localeCompare(y.from)),
    statusOf: (b) => {
      const t = todayISO();
      return statusAt(b, t, nowHHMM(), addDays(t, -1), openingHours, specialHours);
    },
    // A new branch gets its own set, the same hours every day.
    createForBranch: (branchId, name, open, close) =>
      setOpeningHours((all) => [
        ...all,
        { id: newId('oh'), name, branchIds: [branchId], days: WEEKDAYS.map(() => ({ closed: false, ranges: [{ open, close }], kitchenCloses: null })) },
      ]),
    form,
    openForm: setForm,
    closeForm: () => setForm(null),
  };

  return <HoursCtx.Provider value={value}>{children}</HoursCtx.Provider>;
}
