'use client';

import { useState } from 'react';
import { useListings, type ActivityDraft } from '@/components/portal/ListingsProvider';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { FieldError, Input, Label, Textarea } from '@/components/ui/Field';
import { NOT_VERIFIED, PhotoPicker } from './shared';
import { WherePicker } from './WherePicker';
import { useLock } from '@/components/portal/useLock';

// New / edit activity: where first, then the details. An activity is its own
// listing on top of a place, available whenever it runs (no date).
export function ActivityFormModal() {
  const { activityForm, closeActivityForm, saveActivity, canPublish } = useListings();
  const lock = useLock('listings.manage');
  const [draft, setDraft] = useState<ActivityDraft | null>(null);
  const [error, setError] = useState('');
  const [openedFrom, setOpenedFrom] = useState<ActivityDraft | null>(null);
  if (activityForm !== openedFrom) {
    setOpenedFrom(activityForm);
    setDraft(activityForm);
    setError('');
  }
  if (!draft) return null;

  const set = <K extends keyof ActivityDraft>(k: K, v: ActivityDraft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const save = (publish: boolean) => {
    if (!draft.outletId) return setError('Choose where the activity happens.');
    if (!draft.title.trim()) return setError('Give the activity a title.');
    saveActivity({ ...draft, title: draft.title.trim() }, publish);
  };
  const publishable = !draft.outletId || canPublish(draft.outletId);

  return (
    <Dialog
      open
      title={draft.id !== null ? 'Edit activity' : 'New activity'}
      onClose={closeActivityForm}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={() => save(false)} {...lock}>
            Save draft
          </Button>
          <Button size="md" onClick={() => save(true)} disabled={lock.disabled || !publishable} title={lock.title ?? (publishable ? undefined : NOT_VERIFIED)}>
            Publish
          </Button>
        </>
      }
    >
      <WherePicker value={draft.outletId} onChange={(id) => set('outletId', id)} />
      {draft.outletId && (
        <>
          <Label label="Title">
            <Input value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Cooking class" />
          </Label>
          <div className="grid grid-cols-3 gap-3">
            <Label label="Duration">
              <Input value={draft.duration} onChange={(e) => set('duration', e.target.value)} placeholder="1 hour" />
            </Label>
            <Label label="Price (AED)">
              <Input type="number" min={0} value={draft.price} onChange={(e) => set('price', Number(e.target.value))} />
            </Label>
            <Label label="Minimum age">
              <Input type="number" min={0} value={draft.minAge} onChange={(e) => set('minAge', Number(e.target.value))} />
            </Label>
          </div>
          <Label label="When it's available">
            <Input value={draft.availability} onChange={(e) => set('availability', e.target.value)} placeholder="e.g. Sat–Sun, 10 AM–6 PM" />
          </Label>
          <Label label="Description">
            <Textarea rows={3} value={draft.desc} onChange={(e) => set('desc', e.target.value)} placeholder="What do people do, and what's included?" />
          </Label>
          <PhotoPicker value={draft.img} onChange={(i) => set('img', i)} />
          {!publishable && <p className="m-0 text-[13px] text-peach-ink">{NOT_VERIFIED}. You can save it as a draft now.</p>}
        </>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Dialog>
  );
}
