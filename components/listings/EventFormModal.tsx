'use client';

import { useState } from 'react';
import { useListings, type EventDraft } from '@/components/portal/ListingsProvider';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { FieldError, Input, Label, Textarea } from '@/components/ui/Field';
import { Toggle } from '@/components/ui/Toggle';
import { NOT_VERIFIED, PhotoPicker } from './shared';
import { WherePicker } from './WherePicker';

// New / edit event: where it happens first (branch, then outlet when there
// are several), then the details. An event is its own listing on top of a place.
export function EventFormModal() {
  const { eventForm, closeEventForm, saveEvent, canPublish } = useListings();
  const [draft, setDraft] = useState<EventDraft | null>(null);
  const [error, setError] = useState('');
  // Start from the form the provider opened, each time it opens.
  const [openedFrom, setOpenedFrom] = useState<EventDraft | null>(null);
  if (eventForm !== openedFrom) {
    setOpenedFrom(eventForm);
    setDraft(eventForm);
    setError('');
  }
  if (!draft) return null;

  const set = <K extends keyof EventDraft>(k: K, v: EventDraft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const save = (publish: boolean) => {
    if (!draft.outletId) return setError('Choose where the event happens.');
    if (!draft.title.trim() || !draft.date || !draft.time) return setError('Add a title, a date and a time.');
    saveEvent({ ...draft, title: draft.title.trim() }, publish);
  };
  const publishable = !draft.outletId || canPublish(draft.outletId);

  return (
    <Dialog
      open
      title={draft.id !== null ? 'Edit event' : 'New event'}
      onClose={closeEventForm}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={() => save(false)}>
            Save draft
          </Button>
          <Button size="md" onClick={() => save(true)} disabled={!publishable} title={publishable ? undefined : NOT_VERIFIED}>
            Publish
          </Button>
        </>
      }
    >
      <WherePicker value={draft.outletId} onChange={(id) => set('outletId', id)} />
      {draft.outletId && (
        <>
          <Label label="Title">
            <Input value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Jazz night" />
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Label label="Date">
              <Input size="sm" type="date" value={draft.date} onChange={(e) => set('date', e.target.value)} />
            </Label>
            <Label label="Time">
              <Input size="sm" type="time" value={draft.time} onChange={(e) => set('time', e.target.value)} />
            </Label>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={draft.weekly}
            onClick={() => set('weekly', !draft.weekly)}
            className="flex cursor-pointer items-center justify-between gap-3 border-none bg-transparent p-0 text-sm font-medium text-brand-purple"
          >
            Repeats every week
            <Toggle on={draft.weekly} />
          </button>
          <div className="grid grid-cols-2 gap-3">
            <Label label="Price (AED, 0 for free)">
              <Input type="number" min={0} value={draft.price} onChange={(e) => set('price', Number(e.target.value))} />
            </Label>
            <Label label="Spots">
              <Input type="number" min={1} value={draft.spots} onChange={(e) => set('spots', Number(e.target.value))} />
            </Label>
          </div>
          <Label label="Description">
            <Textarea rows={3} value={draft.desc} onChange={(e) => set('desc', e.target.value)} placeholder="What happens, and what's included?" />
          </Label>
          <PhotoPicker value={draft.img} onChange={(i) => set('img', i)} />
          {!publishable && <p className="m-0 text-[13px] text-peach-ink">{NOT_VERIFIED}. You can save it as a draft now.</p>}
        </>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Dialog>
  );
}
