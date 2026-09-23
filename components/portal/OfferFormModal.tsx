'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { FieldError, Input, Label, Textarea } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { PhoneFrame, StatusBar } from '@/components/ui/PhoneFrame';
import { IMG, TODAY, VENUE, type OfferType } from '@/lib/portal/data';
import { fmtDate, fmtTime } from '@/lib/portal/format';
import { usePortal } from './PortalProvider';

const TYPES: OfferType[] = ['Discount', 'Set menu', 'Happy hour', 'Event'];

// New / edit offer dialog, with a live preview of the card in the Choices app.
export function OfferFormModal() {
  const { form: f, setFormField: set, closeOfferForm, saveOfferForm } = usePortal();
  const [error, setError] = useState(false);
  if (!f) return null;

  const save = (asDraft: boolean) => setError(!saveOfferForm(asDraft));
  const close = () => {
    setError(false);
    closeOfferForm();
  };
  const when = (f.sd === TODAY ? 'Today' : fmtDate(f.sd)) + ' · ' + fmtTime(f.st) + '–' + fmtTime(f.et);

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-scrim/45 px-4 py-8">
      <div role="dialog" aria-modal="true" className="flex w-full max-w-[1040px] flex-wrap overflow-hidden rounded-2xl bg-surface shadow-modal">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-[18px] p-7">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-[22px] font-bold text-brand-purple">{f.id ? 'Edit offer' : 'New offer'}</h2>
            <IconButton icon="close" iconSize={18} stroke={1.8} aria-label="Close" onClick={close} />
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-medium text-brand-purple">Offer type</span>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <Chip key={t} on={f.type === t} onClick={() => set('type', t)} className="px-4 py-[9px] text-[13px]">
                  {t}
                </Chip>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
            <Label label="Title" className="col-span-2">
              <Input
                value={f.title}
                onChange={(e) => {
                  set('title', e.target.value);
                  setError(false);
                }}
                placeholder="e.g. Mocktail happy hour"
              />
              {error && <FieldError className="text-xs font-normal">Give your offer a title so customers know what it is.</FieldError>}
            </Label>
            <Label label="Deal or price">
              <Input value={f.deal} onChange={(e) => set('deal', e.target.value)} placeholder={f.type === 'Discount' ? 'e.g. 20% off' : 'e.g. AED 99'} />
            </Label>
            <Label label="Redemptions available">
              <Input type="number" min={1} value={f.red} onChange={(e) => set('red', Number(e.target.value))} />
            </Label>
          </div>

          <Label label="Description">
            <Textarea rows={3} value={f.desc} onChange={(e) => set('desc', e.target.value)} placeholder="What do customers get? Keep it short and specific." />
          </Label>

          <div className="flex flex-col gap-2.5">
            <span className="font-medium text-brand-purple">Photo</span>
            <div className="flex flex-wrap gap-2.5">
              {IMG.slice(0, 5).map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => set('img', i)}
                  aria-label={`Photo ${i + 1}`}
                  style={{ backgroundImage: `url('${src}')` }}
                  className={`size-16 cursor-pointer rounded-md border-none bg-cover bg-center p-0 ${
                    f.img === i ? 'opacity-100 shadow-[0_0_0_2.5px_var(--color-brand-peach)]' : 'opacity-75'
                  }`}
                />
              ))}
              <button
                type="button"
                title="Upload photo"
                className="grid size-16 cursor-pointer place-items-center rounded-md border-[1.5px] border-dashed border-line-dashed bg-fill-faint text-brand-purple"
              >
                <Icon name="upload" size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3.5">
            <Label label="Starts">
              <Input size="sm" type="date" value={f.sd} onChange={(e) => set('sd', e.target.value)} className="px-3" />
            </Label>
            <Label label="From">
              <Input size="sm" type="time" value={f.st} onChange={(e) => set('st', e.target.value)} className="px-3" />
            </Label>
            <Label label="Ends">
              <Input size="sm" type="date" value={f.ed} onChange={(e) => set('ed', e.target.value)} className="px-3" />
            </Label>
            <Label label="Until">
              <Input size="sm" type="time" value={f.et} onChange={(e) => set('et', e.target.value)} className="px-3" />
            </Label>
          </div>

          <div className="flex flex-wrap justify-end gap-2.5 pt-1.5">
            <Button variant="secondary" onClick={() => save(true)}>
              Save as draft
            </Button>
            <Button className="px-[26px]" onClick={() => save(false)}>
              Publish offer
            </Button>
          </div>
        </div>

        <div className="flex flex-[0_1_380px] flex-col items-center gap-3.5 border-l border-line-soft bg-linear-to-b from-surface to-peach-wash p-7">
          <div className="text-xs font-bold tracking-[0.08em] text-fg-muted">PREVIEW IN THE CHOICES APP</div>
          <PhoneFrame width={290} height={560}>
            <StatusBar className="pb-1.5" />
            <div className="flex flex-col gap-0.5 px-4 pt-2 pb-3">
              <span className="text-[11px] text-ink-muted">Near you · Jumeirah</span>
              <span className="text-lg font-bold text-brand-purple">Offers for you</span>
            </div>
            <div
              style={{ backgroundImage: `url('${IMG[f.img]}')` }}
              className="relative mx-3.5 h-[250px] shrink-0 overflow-hidden rounded-xl bg-cover bg-center"
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/78 to-black/0 to-60%" />
              <span className="absolute top-3 left-3 rounded-pill bg-brand-peach px-[11px] py-[5px] text-xs font-bold text-inverse">
                {f.deal || (f.type === 'Event' ? 'Event' : 'Deal')}
              </span>
              <span className="absolute top-3 right-3 rounded-pill bg-surface/90 px-2.5 py-[5px] text-[11px] font-bold text-brand-purple">{f.type}</span>
              <div className="absolute right-3.5 bottom-3.5 left-3.5 flex flex-col gap-1 text-inverse">
                <span className="text-[17px] leading-tight font-bold">{f.title || 'Your offer title'}</span>
                <span className="text-xs opacity-90">{VENUE} · 0.4 km</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 px-4 py-3.5">
              <div className="line-clamp-3 text-xs leading-normal text-fg-soft">{f.desc || 'Describe what customers get, in a sentence or two.'}</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-pill bg-surface-muted px-2.5 py-[5px] text-[11px] font-semibold text-brand-purple">{when}</span>
                <span className="rounded-pill bg-surface-muted px-2.5 py-[5px] text-[11px] font-semibold text-brand-purple">{f.red || 0} left</span>
              </div>
              <div className="mt-1 rounded-pill bg-brand-peach p-3 text-center font-button text-[13px] font-bold text-inverse">Claim offer</div>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}
