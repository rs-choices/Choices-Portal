'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useListings } from '@/components/portal/ListingsProvider';
import { usePortal } from '@/components/portal/PortalProvider';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { TagChip } from '@/components/ui/Chip';
import { Input, Label, Textarea } from '@/components/ui/Field';
import { Icon, Star } from '@/components/ui/Icon';
import { PhoneFrame, StatusBar } from '@/components/ui/PhoneFrame';
import { Segmented } from '@/components/ui/Segmented';
import { IMG, TAGS, VENUE } from '@/lib/portal/data';
import { PRICE_BANDS, type Outlet } from '@/lib/portal/places';
import { useLock } from '@/components/portal/useLock';

// The place clients see: one per outlet. For a small branch this is simply
// "the branch"; a big branch has one per outlet. Remount it per outlet (key)
// so the form starts from that outlet's details.
export function PlaceEditor({ outlet }: { outlet: Outlet }) {
  const { offers } = usePortal();
  const { updatePlace } = useListings();
  const [name, setName] = useState(outlet.name);
  const [description, setDescription] = useState(outlet.place.description);
  const [whatsapp, setWhatsapp] = useState(outlet.place.whatsapp);
  const [band, setBand] = useState(outlet.place.priceBand);
  const [tags, setTags] = useState<string[]>(outlet.place.tags);
  const lock = useLock('place.edit');
  const liveOffer = offers.find((o) => o.outletId === outlet.id && o.status === 'active');
  const cover = IMG[outlet.place.photos[0] ?? 0];

  const save = () =>
    updatePlace(outlet.id, { ...outlet.place, description, whatsapp, priceBand: band, tags }, outlet.isDefault ? undefined : name.trim() || outlet.name);

  return (
    <section className="flex flex-wrap items-start gap-5">
      <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-4">
        <Card className="flex flex-col gap-4 p-6">
          <CardTitle>About this place</CardTitle>
          {!outlet.isDefault && (
            <Label label="Place name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Label>
          )}
          <Label label="Description">
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="leading-normal" />
          </Label>
          <div className="flex flex-col gap-2.5">
            <span className="font-medium text-brand-purple">Price band (per person)</span>
            <Segmented options={PRICE_BANDS} value={band} onChange={setBand} className="flex-wrap self-start" />
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-medium text-brand-purple">Tags</span>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <TagChip key={t} on={tags.includes(t)} onClick={() => setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))}>
                  {t}
                </TagChip>
              ))}
            </div>
          </div>
          <Label label="WhatsApp number">
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </Label>
          <Button size="md" className="self-start" onClick={save} {...lock}>
            Save changes
          </Button>
        </Card>

        <Card className="flex flex-col gap-3.5 p-6">
          <div className="flex items-center justify-between">
            <CardTitle>Photos</CardTitle>
            <span className="text-[13px] text-ink-muted">The first photo is your cover.</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2.5">
            {outlet.place.photos.map((p, i) => (
              <div key={p} style={{ backgroundImage: `url('${IMG[p]}')` }} className="relative aspect-square rounded-lg bg-cover bg-center">
                {i === 0 && <CoverBadge />}
              </div>
            ))}
            <button
              type="button"
              {...lock}
              className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-dashed border-line-dashed bg-fill-faint text-[13px] font-semibold text-brand-purple hover:bg-brand-purple/5 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Icon name="upload" size={22} />
              Upload
            </button>
          </div>
        </Card>

        <Card className="flex flex-col gap-1.5 p-6">
          <CardTitle className="mb-2">Opening hours</CardTitle>
          {outlet.place.hours.length === 0 && <div className="text-[13px] text-fg-muted">No opening hours yet.</div>}
          {outlet.place.hours.map(([day, open, close]) => (
            <div key={day} className="flex justify-between border-t border-line-faint py-[7px] text-[13px]">
              <span className="font-semibold">{day}</span>
              <span className="text-fg-soft">
                {open} – {close}
              </span>
            </div>
          ))}
          <Button variant="secondary" size="sm" className="mt-2 self-start" {...lock}>
            Edit hours
          </Button>
        </Card>
      </div>

      <div className="sticky top-24 mx-auto flex flex-[0_1_330px] flex-col items-center gap-3">
        <div className="text-xs font-bold tracking-[0.08em] text-fg-muted">HOW CUSTOMERS SEE YOU</div>
        <PhoneFrame width={300} height={620}>
          <div style={{ backgroundImage: `url('${cover}')` }} className="relative h-[230px] shrink-0 bg-cover bg-center">
            <StatusBar className="text-inverse" />
            <span className="absolute bottom-3.5 left-3.5 rounded-pill bg-surface/92 px-2.5 py-[5px] text-[11px] font-bold text-brand-purple">
              1 / {Math.max(1, outlet.place.photos.length)}
            </span>
          </div>
          <div className="flex flex-col gap-2.5 overflow-hidden p-4">
            <div>
              <div className="text-[19px] font-bold text-brand-purple">{outlet.isDefault ? VENUE : `${name} · ${VENUE}`}</div>
              <div className="text-xs text-ink-muted">{outlet.type} · 0.4 km</div>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <span className="flex items-center gap-1 font-bold">
                <Star size={13} />
                4.7 (312)
              </span>
              <span className="text-ink-muted">{PRICE_BANDS[band][1]} per person</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={t} className="rounded-pill bg-surface-muted px-2.5 py-[5px] text-[11px] font-semibold text-brand-purple">
                  {t}
                </span>
              ))}
            </div>
            <div className="text-xs leading-normal text-fg-soft">{description}</div>
            {liveOffer && (
              <>
                <div className="mt-0.5 text-[13px] font-bold text-brand-purple">Live offers</div>
                <div className="flex items-center gap-2.5 rounded-md bg-page p-2">
                  <Image src={IMG[liveOffer.img]} alt="" width={40} height={40} className="size-10 rounded-[10px] object-cover" />
                  <div className="flex-1 text-xs font-semibold">{liveOffer.title}</div>
                  <span className="rounded-pill bg-brand-peach px-2 py-1 text-[10px] font-bold text-inverse">{liveOffer.deal}</span>
                </div>
              </>
            )}
            <div className="rounded-pill bg-brand-peach p-3 text-center font-button text-[13px] font-bold text-inverse">Chat on WhatsApp</div>
          </div>
        </PhoneFrame>
      </div>
    </section>
  );
}

export function CoverBadge() {
  return <span className="absolute top-2 left-2 rounded-pill bg-surface px-2 py-1 text-[11px] font-bold text-brand-purple">Cover</span>;
}
