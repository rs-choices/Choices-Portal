'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { TagChip } from '@/components/ui/Chip';
import { Input, Label, Select, Textarea } from '@/components/ui/Field';
import { Icon, PIN, Star } from '@/components/ui/Icon';
import { PhoneFrame, StatusBar } from '@/components/ui/PhoneFrame';
import { Segmented } from '@/components/ui/Segmented';
import { HOURS, IMG, TAGS, VENUE } from '@/lib/portal/data';

const PRICES = [
  [0, 'Under AED 50'],
  [1, 'AED 50–150'],
  [2, 'AED 150+'],
] as const;

const DESCRIPTION = 'A neighbourhood café on Jumeirah Beach Road. Specialty coffee, all-day breakfast and a terrace that catches the sunset.';

export function Profile() {
  const [price, setPrice] = useState<0 | 1 | 2>(1);
  const [tags, setTags] = useState<Record<string, boolean>>({ 'Outdoor seating': true, 'Free Wi-Fi': true, 'Laptop friendly': true, 'Family friendly': true });

  return (
    <section className="flex flex-wrap items-start gap-5">
      <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-4">
        <Card className="flex flex-col gap-4 p-6">
          <CardTitle>About</CardTitle>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
            <Label label="Venue name">
              <Input defaultValue={VENUE} />
            </Label>
            <Label label="Category">
              <Select>
                <option>Café</option>
                <option>Restaurant</option>
                <option>Lounge</option>
                <option>Activity</option>
              </Select>
            </Label>
          </div>
          <Label label="Description">
            <Textarea rows={3} defaultValue={DESCRIPTION} className="leading-normal" />
          </Label>
          <div className="flex flex-col gap-2.5">
            <span className="font-medium text-brand-purple">Price range</span>
            <Segmented options={PRICES} value={price} onChange={setPrice} className="flex-wrap self-start" />
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-medium text-brand-purple">Tags</span>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <TagChip key={t} on={!!tags[t]} onClick={() => setTags((s) => ({ ...s, [t]: !s[t] }))}>
                  {t}
                </TagChip>
              ))}
            </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-3.5 p-6">
          <div className="flex items-center justify-between">
            <CardTitle>Photos</CardTitle>
            <span className="text-[13px] text-ink-muted">Drag to reorder. The first photo is your cover.</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2.5">
            {IMG.slice(0, 5).map((src, i) => (
              <div key={src} style={{ backgroundImage: `url('${src}')` }} className="relative aspect-square rounded-lg bg-cover bg-center">
                {i === 0 && <CoverBadge />}
              </div>
            ))}
            <button
              type="button"
              className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-dashed border-line-dashed bg-fill-faint text-[13px] font-semibold text-brand-purple hover:bg-brand-purple/5"
            >
              <Icon name="upload" size={22} />
              Upload
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          <Card className="flex flex-col gap-1.5 p-6">
            <CardTitle className="mb-2">Opening hours</CardTitle>
            {HOURS.map(([day, open, close]) => (
              <div key={day} className="flex justify-between border-t border-line-faint py-[7px] text-[13px]">
                <span className="font-semibold">{day}</span>
                <span className="text-fg-soft">
                  {open} – {close}
                </span>
              </div>
            ))}
            <Button variant="secondary" size="sm" className="mt-2 self-start">
              Edit hours
            </Button>
          </Card>

          <Card className="flex flex-col gap-3 p-6">
            <CardTitle>Location and contact</CardTitle>
            <div className="relative grid h-[130px] place-items-center overflow-hidden rounded-lg bg-[#E7EEF0]">
              {/* Placeholder map until a map provider is chosen. */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(35deg,transparent_0_38px,rgba(255,255,255,0.9)_38px_44px),repeating-linear-gradient(-55deg,transparent_0_60px,rgba(255,255,255,0.7)_60px_64px)]" />
              <div className="absolute top-0 right-0 bottom-0 w-[30%] bg-[#CFE6EA]" />
              <svg width="34" height="34" viewBox="0 0 24 24" className="relative fill-brand-peach stroke-surface" strokeWidth={1.5} aria-hidden="true">
                <path d={PIN} />
              </svg>
            </div>
            <div className="text-[13px] leading-normal">
              <div className="font-semibold">Jumeirah Beach Road, Jumeirah 1</div>
              <div className="text-ink-muted">Near Mercato Mall, Dubai</div>
            </div>
            <div className="flex flex-col gap-1.5 text-[13px] text-fg-soft">
              <span>+971 4 345 6789</span>
              <span>hello@qahwahouse.ae</span>
              <span>instagram.com/qahwahouse</span>
            </div>
          </Card>
        </div>
      </div>

      <div className="sticky top-24 mx-auto flex flex-[0_1_330px] flex-col items-center gap-3">
        <div className="text-xs font-bold tracking-[0.08em] text-fg-muted">HOW CUSTOMERS SEE YOU</div>
        <PhoneFrame width={300} height={620}>
          <div className="relative h-[230px] shrink-0 bg-[url('/assets/notif-1.jpg')] bg-cover bg-center">
            <StatusBar className="text-inverse" />
            <span className="absolute bottom-3.5 left-3.5 rounded-pill bg-surface/92 px-2.5 py-[5px] text-[11px] font-bold text-brand-purple">1 / 6</span>
          </div>
          <div className="flex flex-col gap-2.5 overflow-hidden p-4">
            <div>
              <div className="text-[19px] font-bold text-brand-purple">{VENUE}</div>
              <div className="text-xs text-ink-muted">Café · Jumeirah 1 · 0.4 km</div>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <span className="flex items-center gap-1 font-bold">
                <Star size={13} />
                4.7 (312)
              </span>
              <span className="font-semibold text-teal-ink">Open until 11 PM</span>
              <span className="text-ink-muted">{PRICES[price][1]} per person</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.filter((t) => tags[t]).map((t) => (
                <span key={t} className="rounded-pill bg-surface-muted px-2.5 py-[5px] text-[11px] font-semibold text-brand-purple">
                  {t}
                </span>
              ))}
            </div>
            <div className="text-xs leading-normal text-fg-soft">{DESCRIPTION}</div>
            <div className="mt-0.5 text-[13px] font-bold text-brand-purple">Live offers</div>
            <div className="flex items-center gap-2.5 rounded-md bg-page p-2">
              <Image src="/assets/notif-1.jpg" alt="" width={40} height={40} className="size-10 rounded-[10px] object-cover" />
              <div className="flex-1 text-xs">
                <div className="font-semibold">Spanish latte 2-for-1</div>
                <div className="text-ink-muted">Until 11 AM</div>
              </div>
              <span className="rounded-pill bg-brand-peach px-2 py-1 text-[10px] font-bold text-inverse">2 for 1</span>
            </div>
            <div className="rounded-pill bg-brand-peach p-3 text-center font-button text-[13px] font-bold text-inverse">Book a table</div>
          </div>
        </PhoneFrame>
      </div>
    </section>
  );
}

export function CoverBadge() {
  return <span className="absolute top-2 left-2 rounded-pill bg-surface px-2 py-1 text-[11px] font-bold text-brand-purple">Cover</span>;
}
