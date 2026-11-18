'use client';

import { useState } from 'react';
import { useListings } from '@/components/portal/ListingsProvider';
import { usePortal } from '@/components/portal/PortalProvider';
import { useLock } from '@/components/portal/useLock';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Label, Select, Textarea } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import type { Booking, BookingSource } from '@/lib/portal/data';
import { nowHHMM, todayISO } from '@/lib/portal/format';
import { NEW_MARK } from '@/lib/portal/reviewMark';

const SOURCES = [
  ['phone', 'Phone'],
  ['walk-in', 'Walk-in'],
  ['other', 'Other'],
] as const;

const digits = (p: string) => p.replace(/\D/g, '');

// A manual booking: staff type in a booking a client made by phone, by
// message or at the door. A walk-in is for now and is checked in at once.
export function AddBookingPanel({ defaultBranch, onSaved }: { defaultBranch: string | null; onSaved: (b: Booking) => void }) {
  const { addBookingOpen, setAddBookingOpen } = usePortal();
  if (!addBookingOpen) return null;
  return <Form defaultBranch={defaultBranch} onClose={() => setAddBookingOpen(false)} onSaved={onSaved} />;
}

function Form({ defaultBranch, onClose, onSaved }: { defaultBranch: string | null; onClose: () => void; onSaved: (b: Booking) => void }) {
  const { addBooking, bookings } = usePortal();
  const { visibleBranches } = useListings();
  const lock = useLock('bookings.manage');
  const [branchId, setBranchId] = useState(defaultBranch ?? visibleBranches[0]?.id ?? '');
  const [source, setSource] = useState<Exclude<BookingSource, 'app'>>('phone');
  const [date, setDate] = useState(todayISO());
  const [at, setAt] = useState('19:00');
  const [party, setParty] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  const walkIn = source === 'walk-in';
  const day = walkIn ? todayISO() : date;
  const time = walkIn ? nowHHMM() : at;
  const twin = digits(phone).length >= 6 && bookings.find((b) => b.branchId === branchId && b.date === day && b.status !== 'cancelled' && digits(b.phone) === digits(phone));
  const ready = !!branchId && !!name.trim() && !!phone.trim() && !!day && !!time;

  const save = () => {
    // A walk-in is stamped with the moment it is saved, not when the form opened.
    const b = addBooking({ branchId, date: walkIn ? todayISO() : day, at: walkIn ? nowHHMM() : time, party, name: name.trim(), phone: phone.trim(), source, note: note.trim() || undefined });
    onClose();
    onSaved(b);
  };

  return (
    <Dialog
      open
      title="Add booking"
      onClose={onClose}
      className={NEW_MARK}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button size="md" disabled={lock.disabled || !ready} title={lock.title} onClick={save}>
            {walkIn ? 'Add walk-in' : 'Add booking'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <span className="font-medium text-brand-purple">How did they book?</span>
        <Segmented options={SOURCES} value={source} onChange={setSource} className="self-start" />
        {walkIn && <span className="text-[13px] text-ink-muted">At the door now: booked for today at the current time and checked in.</span>}
      </div>

      {visibleBranches.length > 1 && (
        <Label label="Branch">
          <Select value={branchId} onChange={(e) => setBranchId(e.target.value)}>
            {visibleBranches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </Label>
      )}

      <div className="grid grid-cols-[1fr_1fr_auto] gap-3 max-sm:grid-cols-2">
        <Label label="Date">
          <Input type="date" value={day} disabled={walkIn} onChange={(e) => setDate(e.target.value)} />
        </Label>
        <Label label="Time">
          <Input type="time" value={time} disabled={walkIn} onChange={(e) => setAt(e.target.value)} />
        </Label>
        <div className="flex flex-col gap-2 font-medium text-brand-purple">
          Party
          <div className="flex items-center gap-1 rounded-md bg-surface-muted p-1">
            <Step label="Fewer guests" onClick={() => setParty((n) => Math.max(1, n - 1))}>
              −
            </Step>
            <span className="w-8 text-center font-bold text-fg">{party}</span>
            <Step label="More guests" onClick={() => setParty((n) => Math.min(20, n + 1))}>
              +
            </Step>
          </div>
        </div>
      </div>

      <Label label="Client name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
      </Label>
      <Label label="Phone">
        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+961 70 123 456" />
      </Label>
      {twin && (
        <div className="rounded-md bg-brand-peach/14 px-3.5 py-3 text-[13px] leading-normal text-peach-ink">
          {twin.name} already has a booking at this branch that day ({twin.time}, party of {twin.party}). You can still add this one.
        </div>
      )}
      <Label label="Note (optional)">
        <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Birthday, high chair, window table…" />
      </Label>
    </Dialog>
  );
}

function Step({ label, onClick, children }: { label: string; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-9 cursor-pointer place-items-center rounded-[10px] border-none bg-surface text-lg font-bold text-brand-purple shadow-soft"
    >
      {children}
    </button>
  );
}
