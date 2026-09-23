'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input, Label, Select, Textarea } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { fmtTime } from '@/lib/portal/format';
import { CoverBadge } from '@/components/screens/Profile';
import { usePortal } from '@/components/portal/PortalProvider';

const STEPS = ['Create your profile', 'Add hours & photos', 'Post your first offer'];
const CATEGORIES = ['Restaurant', 'Café', 'Lounge', 'Activity', 'Events'];
const AREAS = ['Jumeirah', 'Dubai Marina', 'Downtown Dubai', 'Business Bay', 'JLT', 'Al Barsha'];
const OFFER_TYPES = ['Discount', 'Set menu', 'Happy hour', 'Event'];

export function Onboarding() {
  const { finishOnboarding } = usePortal();
  const [step, setStep] = useState(0);
  const [ob, setOb] = useState({
    name: 'Qahwa House',
    cat: 'Café',
    area: 'Jumeirah',
    desc: '',
    open: '07:00',
    close: '23:00',
    offer: 'Spanish latte 2-for-1',
    otype: 'Discount',
  });
  const set = (k: keyof typeof ob) => (v: string) => setOb((s) => ({ ...s, [k]: v }));

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-surface to-peach-wash text-sm text-fg">
      <div className="flex items-center justify-between px-8 py-5">
        <Image src="/assets/choices-logo-01.png" alt="Choices" width={108} height={40} priority className="h-10 w-auto" />
        <Link href="/dashboard" className="text-sm font-medium text-fg-muted hover:text-brand-purple">
          Skip for now
        </Link>
      </div>

      <div className="flex flex-1 justify-center px-5 pt-2 pb-12">
        <div className="flex w-full max-w-[640px] flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2.5">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2.5">
                <div
                  className={`grid size-[30px] place-items-center rounded-full text-[13px] font-bold ${
                    i <= step ? 'bg-brand-purple text-inverse' : 'bg-surface-muted text-fg-muted'
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-[13px] font-semibold ${i === step ? 'text-brand-purple' : 'text-fg-muted'}`}>{label}</span>
                {i < 2 && <div className={`h-0.5 w-7 rounded-xs ${i < step ? 'bg-brand-purple' : 'bg-surface-muted'}`} />}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-[22px] rounded-xl bg-surface p-8 shadow-card">
            {step === 0 && (
              <>
                <StepHeading title="Let's set up your venue">This is what people see when Choices recommends you.</StepHeading>
                <Label label="Venue name">
                  <Input size="lg" value={ob.name} onChange={(e) => set('name')(e.target.value)} />
                </Label>
                <div className="flex flex-col gap-2.5">
                  <span className="font-medium text-brand-purple">What kind of place is it?</span>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <Chip key={c} on={ob.cat === c} onClick={() => set('cat')(c)} className="px-4 py-2.5 text-sm">
                        {c}
                      </Chip>
                    ))}
                  </div>
                </div>
                <Label label="Area">
                  <Select size="lg" value={ob.area} onChange={(e) => set('area')(e.target.value)}>
                    {AREAS.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </Select>
                </Label>
                <Label label="Short description">
                  <Textarea
                    size="lg"
                    rows={3}
                    value={ob.desc}
                    onChange={(e) => set('desc')(e.target.value)}
                    placeholder="A neighbourhood café on Jumeirah Beach Road with specialty coffee and a sunset terrace."
                  />
                </Label>
              </>
            )}

            {step === 1 && (
              <>
                <StepHeading title="When are you open?">You can set different hours per day later in Venue profile.</StepHeading>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                  <Label label="Opens">
                    <Input size="lg" type="time" value={ob.open} onChange={(e) => set('open')(e.target.value)} />
                  </Label>
                  <Label label="Closes">
                    <Input size="lg" type="time" value={ob.close} onChange={(e) => set('close')(e.target.value)} />
                  </Label>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="font-medium text-brand-purple">Photos</span>
                  <span className="-mt-1.5 text-[13px] text-ink-muted">Add at least 3. Your first photo is the cover.</span>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
                    <div className="relative aspect-square rounded-lg bg-[url('/assets/notif-1.jpg')] bg-cover bg-center">
                      <CoverBadge />
                    </div>
                    <div className="aspect-square rounded-lg bg-[url('/assets/popular-offer-hero.jpg')] bg-cover bg-center" />
                    <button
                      type="button"
                      className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-dashed border-line-dashed bg-fill-faint font-semibold text-brand-purple hover:bg-brand-purple/5"
                    >
                      <Icon name="plus" size={22} />
                      Add photo
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <StepHeading title="Post your first offer">Something simple works best. You can edit or pause it any time.</StepHeading>
                <Label label="Offer title">
                  <Input size="lg" value={ob.offer} onChange={(e) => set('offer')(e.target.value)} />
                </Label>
                <div className="flex flex-wrap gap-2">
                  {OFFER_TYPES.map((t) => (
                    <Chip key={t} on={ob.otype === t} onClick={() => set('otype')(t)} className="px-4 py-2.5 text-sm">
                      {t}
                    </Chip>
                  ))}
                </div>
                <div className="relative h-[200px] overflow-hidden rounded-xl bg-[url('/assets/notif-1.jpg')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 to-black/0 to-65%" />
                  <span className="absolute top-4 left-4 rounded-pill bg-brand-peach px-3 py-1.5 text-xs font-bold text-inverse">{ob.otype}</span>
                  <div className="absolute right-4 bottom-4 left-4 text-inverse">
                    <div className="text-xl font-bold">{ob.offer}</div>
                    <div className="text-[13px] opacity-90">
                      {ob.name || 'Your venue'} · {ob.area} · Today until {fmtTime(ob.close)}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-between gap-3 pt-1">
              {step > 0 && (
                <Button variant="secondary" size="md" className="py-3.5" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <div className="flex-1" />
              <Button size="lg" onClick={() => (step < 2 ? setStep(step + 1) : finishOnboarding())}>
                {step < 2 ? 'Continue' : 'Finish and go live'}
              </Button>
            </div>
          </div>

          <Link href="/sign-in" className="text-center text-[13px] text-fg-muted hover:text-brand-purple">
            Already listed? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

function StepHeading({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="m-0 text-[26px] font-bold text-brand-purple">{title}</h1>
      <div className="text-[15px] text-ink-muted">{children}</div>
    </div>
  );
}
