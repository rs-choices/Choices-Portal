'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { BOOKINGS, OFFERS, TODAY, type Booking, type BookingStatus, type Offer, type OfferStatus, type Plan } from '@/lib/portal/data';
import { fmtDate, fmtTime } from '@/lib/portal/format';

// Client-side state shared by every page, mounted in the root layout so
// onboarding can hand over to the dashboard tour. With no backend yet, offers,
// bookings and the plan live here so a change on one page shows on another.

export type OfferDraft = Omit<Offer, 'id' | 'window' | 'dates' | 'views' | 'claims' | 'status'> & {
  id: number | null;
  status?: OfferStatus;
};

export type OfferTab = 'active' | 'scheduled' | 'draft' | 'expired';

type Checklist = { profile: boolean; photos: boolean; offer: boolean };

type Ctx = {
  plan: Plan;
  setPlan: (p: Plan) => void;
  location: number;
  setLocation: (i: number) => void;
  offers: Offer[];
  updateOffer: (id: number, change: Partial<Offer>, message?: string) => void;
  duplicateOffer: (o: Offer) => void;
  offerTab: OfferTab;
  setOfferTab: (t: OfferTab) => void;
  bookings: Booking[];
  setBookingStatus: (id: number, status: BookingStatus, message: string) => void;
  checklist: Checklist;
  completeChecklist: (key: keyof Checklist) => void;
  finishOnboarding: () => void;
  form: OfferDraft | null;
  openOfferForm: (o?: Offer) => void;
  closeOfferForm: () => void;
  setFormField: <K extends keyof OfferDraft>(k: K, v: OfferDraft[K]) => void;
  saveOfferForm: (asDraft: boolean) => boolean;
  toast: string | null;
  showToast: (m: string) => void;
  tour: number | null;
  setTour: (i: number | null) => void;
  startTour: () => void;
};

const PortalContext = createContext<Ctx | null>(null);

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used inside PortalProvider');
  return ctx;
}

const NEW_OFFER: OfferDraft = { id: null, title: '', desc: '', deal: '', type: 'Discount', img: 0, sd: TODAY, st: '16:00', ed: '2026-09-30', et: '19:00', red: 100 };

export function PortalProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan>('Starter');
  const [location, setLocation] = useState(0);
  const [offers, setOffers] = useState(OFFERS);
  const [offerTab, setOfferTab] = useState<OfferTab>('active');
  const [bookings, setBookings] = useState(BOOKINGS);
  const [checklist, setChecklist] = useState<Checklist>({ profile: true, photos: false, offer: false });
  const [form, setForm] = useState<OfferDraft | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [tour, setTour] = useState<number | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback((m: string) => {
    clearTimeout(toastTimer.current);
    setToast(m);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const openOfferForm = (o?: Offer) => {
    if (!o && plan === 'Starter' && offers.filter((x) => x.status === 'active').length >= 10) {
      showToast('You have reached 10 active offers. Upgrade to Growth for unlimited.');
      return;
    }
    setForm(o ? { ...o } : { ...NEW_OFFER });
  };

  const saveOfferForm = (asDraft: boolean) => {
    const f = form;
    if (!f || !f.title.trim()) return false;
    const status: Exclude<OfferTab, 'expired'> = asDraft ? 'draft' : f.sd > TODAY ? 'scheduled' : 'active';
    const saved = {
      ...f,
      status,
      window: (f.type === 'Event' ? fmtDate(f.sd) : 'Daily') + ' · ' + fmtTime(f.st) + '–' + fmtTime(f.et),
      dates: status === 'scheduled' ? 'Starts ' + fmtDate(f.sd) : status === 'draft' ? 'Not scheduled' : 'Until ' + fmtDate(f.ed),
      deal: f.deal || 'Offer',
      live: false,
    };
    setOffers((all) =>
      f.id ? all.map((x) => (x.id === f.id ? { ...x, ...saved, id: x.id } : x)) : [{ ...saved, id: Date.now(), views: 0, claims: 0 }, ...all],
    );
    setOfferTab(status);
    if (!asDraft) setChecklist((c) => ({ ...c, offer: true }));
    setForm(null);
    showToast(asDraft ? 'Saved to drafts' : status === 'scheduled' ? 'Offer scheduled' : 'Your offer is live in the Choices app');
    return true;
  };

  const value: Ctx = {
    plan,
    setPlan,
    location,
    setLocation,
    offers,
    updateOffer: (id, change, message) => {
      setOffers((all) => all.map((x) => (x.id === id ? { ...x, ...change } : x)));
      if (message) showToast(message);
    },
    duplicateOffer: (o) => {
      setOffers((all) => [{ ...o, id: Date.now(), title: o.title + ' (copy)', status: 'draft', views: 0, claims: 0, live: false, dates: 'Not scheduled' }, ...all]);
      setOfferTab('draft');
      showToast('Duplicated to drafts');
    },
    offerTab,
    setOfferTab,
    bookings,
    setBookingStatus: (id, status, message) => {
      setBookings((all) => all.map((b) => (b.id === id ? { ...b, status } : b)));
      showToast(message);
    },
    checklist,
    completeChecklist: (key) => setChecklist((c) => ({ ...c, [key]: true })),
    finishOnboarding: () => {
      setChecklist({ profile: true, photos: true, offer: true });
      setTour(0);
      router.push('/dashboard');
    },
    form,
    openOfferForm,
    closeOfferForm: () => setForm(null),
    setFormField: (k, v) => setForm((f) => (f ? { ...f, [k]: v } : f)),
    saveOfferForm,
    toast,
    showToast,
    tour,
    setTour,
    startTour: () => {
      router.push('/dashboard');
      setTour(0);
    },
  };

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}
