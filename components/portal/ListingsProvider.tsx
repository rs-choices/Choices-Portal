'use client';

import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import {
  ACTIVITIES,
  BRANCHES,
  EVENTS,
  OUTLETS,
  type Activity,
  type ActivityStatus,
  type Branch,
  type EventListing,
  type EventStatus,
  type Outlet,
  type OutletType,
  type PlaceDetails,
} from '@/lib/portal/places';
import { usePortal } from './PortalProvider';

// Branches, outlets, events and activities, shared by every portal page.
// Mounted in PortalShell next to MessagesProvider. Offers stay in
// PortalProvider; each one carries the outletId of its place.

export type EventDraft = Omit<EventListing, 'id' | 'status' | 'left'> & { id: number | null };
export type ActivityDraft = Omit<Activity, 'id' | 'status'> & { id: number | null };

const NEW_EVENT: EventDraft = { id: null, outletId: '', title: '', date: '', time: '20:00', weekly: false, price: 0, spots: 40, desc: '', img: 3 };
const NEW_ACTIVITY: ActivityDraft = { id: null, outletId: '', title: '', duration: '1 hour', price: 0, minAge: 0, availability: '', desc: '', img: 0 };

type Ctx = {
  branches: Branch[];
  outlets: Outlet[];
  events: EventListing[];
  activities: Activity[];
  addBranch: (b: { name: string; area: string; address: string; licence: string }) => void;
  requestOutlet: (branchId: string, o: { name: string; type: OutletType }) => void;
  updatePlace: (outletId: string, place: PlaceDetails, name?: string) => void;
  setEventStatus: (id: number, s: EventStatus) => void;
  setActivityStatus: (id: number, s: ActivityStatus) => void;
  canPublish: (outletId: string) => boolean;
  eventForm: EventDraft | null;
  openEventForm: (e?: EventListing) => void;
  closeEventForm: () => void;
  saveEvent: (d: EventDraft, publish: boolean) => void;
  activityForm: ActivityDraft | null;
  openActivityForm: (a?: Activity) => void;
  closeActivityForm: () => void;
  saveActivity: (d: ActivityDraft, publish: boolean) => void;
  addBranchOpen: boolean;
  setAddBranchOpen: (open: boolean) => void;
};

const ListingsContext = createContext<Ctx | null>(null);

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error('useListings must be used inside ListingsProvider');
  return ctx;
}

export function ListingsProvider({ children }: { children: ReactNode }) {
  const { showToast } = usePortal();
  const [branches, setBranches] = useState(BRANCHES);
  const [outlets, setOutlets] = useState(OUTLETS);
  const [events, setEvents] = useState(EVENTS);
  const [activities, setActivities] = useState(ACTIVITIES);
  const [eventForm, setEventForm] = useState<EventDraft | null>(null);
  const [activityForm, setActivityForm] = useState<ActivityDraft | null>(null);
  const [addBranchOpen, setAddBranchOpen] = useState(false);
  const nextId = useRef(100);

  // A place can only go live once its branch is verified and the outlet is
  // approved; until then events, activities and offers stay as drafts.
  const canPublish = (outletId: string) => {
    const o = outlets.find((x) => x.id === outletId);
    const b = o && branches.find((x) => x.id === o.branchId);
    return !!o && !!b && o.status === 'live' && b.status === 'verified';
  };

  const addBranch: Ctx['addBranch'] = (b) => {
    const id = `b-new-${nextId.current++}`;
    setBranches((all) => [...all, { id, ...b, status: 'waiting' }]);
    setOutlets((all) => [
      ...all,
      {
        id: `o-new-${nextId.current++}`,
        branchId: id,
        name: b.name,
        type: 'Food & Beverage',
        isDefault: true,
        status: 'live',
        place: { description: '', photos: [], hours: [], tags: [], priceBand: 1, whatsapp: '' },
      },
    ]);
    showToast('Branch added. The Choices team verifies it within two working days.');
  };

  const requestOutlet: Ctx['requestOutlet'] = (branchId, o) => {
    setOutlets((all) => [
      ...all,
      {
        id: `o-new-${nextId.current++}`,
        branchId,
        name: o.name,
        type: o.type,
        isDefault: false,
        status: 'requested',
        place: { description: '', photos: [], hours: [], tags: [], priceBand: 1, whatsapp: '' },
      },
    ]);
    showToast('Request sent. The Choices team will review it.');
  };

  const updatePlace: Ctx['updatePlace'] = (outletId, place, name) => {
    setOutlets((all) => all.map((o) => (o.id === outletId ? { ...o, place, name: name ?? o.name } : o)));
    showToast(canPublish(outletId) ? 'Saved. Changes are live in the app.' : 'Saved. It goes live once the Choices team verifies this branch.');
  };

  const saveEvent: Ctx['saveEvent'] = (d, publish) => {
    const status: EventStatus = publish && canPublish(d.outletId) ? 'published' : 'draft';
    setEvents((all) =>
      d.id !== null
        ? all.map((e) => (e.id === d.id ? { ...e, ...d, id: e.id, status: e.status === 'draft' || publish ? status : e.status } : e))
        : [{ ...d, id: nextId.current++, left: d.spots, status }, ...all],
    );
    setEventForm(null);
    showToast(status === 'published' ? 'Event published. Clients can see it in the app.' : 'Event saved as a draft.');
  };

  const saveActivity: Ctx['saveActivity'] = (d, publish) => {
    const status: ActivityStatus = publish && canPublish(d.outletId) ? 'published' : 'draft';
    setActivities((all) =>
      d.id !== null
        ? all.map((a) => (a.id === d.id ? { ...a, ...d, id: a.id, status: a.status === 'draft' || publish ? status : a.status } : a))
        : [{ ...d, id: nextId.current++, status }, ...all],
    );
    setActivityForm(null);
    showToast(status === 'published' ? 'Activity published. Clients can see it in the app.' : 'Activity saved as a draft.');
  };

  const value: Ctx = {
    branches,
    outlets,
    events,
    activities,
    addBranch,
    requestOutlet,
    updatePlace,
    setEventStatus: (id, s) => setEvents((all) => all.map((e) => (e.id === id ? { ...e, status: s } : e))),
    setActivityStatus: (id, s) => setActivities((all) => all.map((a) => (a.id === id ? { ...a, status: s } : a))),
    canPublish,
    eventForm,
    openEventForm: (e) => setEventForm(e ? { ...e } : { ...NEW_EVENT }),
    closeEventForm: () => setEventForm(null),
    saveEvent,
    activityForm,
    openActivityForm: (a) => setActivityForm(a ? { ...a } : { ...NEW_ACTIVITY }),
    closeActivityForm: () => setActivityForm(null),
    saveActivity,
    addBranchOpen,
    setAddBranchOpen,
  };

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}
