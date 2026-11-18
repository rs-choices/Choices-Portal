'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select, Textarea } from '@/components/ui/Field';
import { usePortal } from '@/components/portal/PortalProvider';

// Onboarding asks only for the business itself. The main branch (address, map
// pin, licence and opening hours) comes after it, and verification starts from
// the branch: nothing can be added to a branch before it is verified. It
// cannot be skipped: verification needs the business name.
const AREAS = ['Jumeirah', 'Dubai Marina', 'Downtown Dubai', 'Business Bay', 'JLT', 'Al Barsha'];

export function Onboarding() {
  const { finishOnboarding } = usePortal();
  const [ob, setOb] = useState({ name: 'Qahwa House', area: 'Jumeirah', desc: '' });
  const set = (k: keyof typeof ob) => (v: string) => setOb((s) => ({ ...s, [k]: v }));

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-surface to-peach-wash text-sm text-fg">
      <div className="flex items-center px-8 py-5">
        <Image src="/assets/choices-logo-01.png" alt="Choices" width={108} height={40} priority className="h-10 w-auto" />
      </div>

      <div className="flex flex-1 justify-center px-5 pt-2 pb-12">
        <div className="flex w-full max-w-[640px] flex-col gap-6">
          <div className="flex flex-col gap-[22px] rounded-xl bg-surface p-8 shadow-card">
            <StepHeading title="Let's set up your business">This is what people see when Choices recommends you.</StepHeading>
            <Label label="Business name">
              <Input size="lg" value={ob.name} onChange={(e) => set('name')(e.target.value)} />
            </Label>
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

            <p className="m-0 text-[13px] text-fg-muted">
              Next, add your main branch: its address, map pin, trade licence and opening hours. The Choices team verifies it before anything goes live.
            </p>

            <div className="flex justify-end pt-1">
              <Button size="lg" disabled={!ob.name.trim()} onClick={finishOnboarding}>
                Finish
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
