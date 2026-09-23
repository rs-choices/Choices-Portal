'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePortal } from '@/components/portal/PortalProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Input, Label, Select } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import { Toggle } from '@/components/ui/Toggle';
import { LOCATIONS, TEAM, VENUE } from '@/lib/portal/data';
import { Avatar } from '@/components/ui/Avatar';

const NOTIFICATIONS = [
  ['booking', 'New booking', 'When a customer books or claims an offer'],
  ['expiring', 'Offer expiring', 'One hour before an offer ends'],
  ['review', 'New review', 'When someone rates or reviews you'],
  ['weekly', 'Weekly summary', 'A short email every Sunday morning'],
] as const;

export function Settings() {
  const { plan, location, setLocation, showToast } = usePortal();
  const [team, setTeam] = useState(TEAM);
  const [invEmail, setInvEmail] = useState('');
  const [invRole, setInvRole] = useState<'Manager' | 'Staff'>('Staff');
  const [notif, setNotif] = useState<Record<string, boolean>>({ booking: true, expiring: true, review: true, weekly: false });
  const [lang, setLang] = useState('English');

  const invite = () => {
    const e = invEmail.trim();
    if (!e.includes('@')) {
      showToast('Enter an email address to send an invite');
      return;
    }
    const name = e
      .split('@')[0]
      .replace(/\./g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    setTeam((t) => [...t, { name, email: e, role: invRole, status: 'Invited' }]);
    setInvEmail('');
    showToast(`Invite sent to ${e}`);
  };

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-start gap-4">
      <Card className="flex flex-col gap-3.5 p-6">
        <CardTitle>Your account</CardTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
          <Label label="Full name">
            <Input defaultValue="Layla Haddad" />
          </Label>
          <Label label="Mobile">
            <Input defaultValue="+971 50 123 4567" />
          </Label>
        </div>
        <Label label="Email">
          <Input defaultValue="layla@qahwahouse.ae" />
        </Label>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
          <Label label="Current password">
            <Input type="password" placeholder="••••••••" />
          </Label>
          <Label label="New password">
            <Input type="password" placeholder="At least 8 characters" />
          </Label>
        </div>
      </Card>

      <Card className="flex flex-col gap-3 p-6">
        <CardTitle>Team</CardTitle>
        {team.map((m) => (
          <div key={m.email} className="flex items-center gap-3 py-1.5">
            <Avatar name={m.name} seed={m.name.length} size={36} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 font-semibold">
                {m.name}
                {m.status === 'Invited' && <Badge className="bg-surface-muted px-[7px] py-0.5 text-[10px] text-fg-soft">Invite sent</Badge>}
              </div>
              <div className="truncate text-xs text-ink-muted">{m.email}</div>
            </div>
            <span className="rounded-pill bg-surface-purple px-3 py-1.5 text-[13px] font-semibold text-brand-purple">{m.role}</span>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-2 border-t border-line-soft pt-3.5">
          <Input size="sm" value={invEmail} onChange={(e) => setInvEmail(e.target.value)} placeholder="colleague@qahwahouse.ae" className="w-auto flex-[1_1_180px]" />
          <Segmented
            options={[
              ['Manager', 'Manager'],
              ['Staff', 'Staff'],
            ]}
            value={invRole}
            onChange={setInvRole}
            size="sm"
          />
          <Button size="md" className="px-[18px] py-[11px] text-[13px]" onClick={invite}>
            Invite
          </Button>
        </div>
        <div className="text-xs leading-normal text-ink-muted">Managers can edit offers and see analytics. Staff can manage bookings and check customers in.</div>
      </Card>

      <Card className="flex flex-col gap-1 p-6">
        <CardTitle className="mb-2">Notifications</CardTitle>
        {NOTIFICATIONS.map(([key, label, sub]) => (
          <button
            key={key}
            type="button"
            role="switch"
            aria-checked={notif[key]}
            onClick={() => setNotif((n) => ({ ...n, [key]: !n[key] }))}
            className="flex cursor-pointer items-center gap-3 border-t border-line-faint bg-transparent py-2.5 text-left"
          >
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm font-semibold text-fg">{label}</span>
              <span className="text-xs text-ink-muted">{sub}</span>
            </span>
            <Toggle on={notif[key]} />
          </button>
        ))}
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <CardTitle>Language and region</CardTitle>
        <div className="flex flex-col gap-2">
          <span className="font-medium text-brand-purple">Portal language</span>
          <Segmented
            options={[
              ['English', 'English'],
              ['Arabic', 'العربية'],
            ]}
            value={lang}
            onChange={setLang}
            size="lg"
            className="self-start"
          />
        </div>
        <Label label="Time zone">
          <Select>
            <option>Gulf Standard Time (GMT+4) · Dubai</option>
            <option>Arabia Standard Time (GMT+3) · Riyadh</option>
          </Select>
        </Label>
        <div className="flex flex-col gap-2.5 border-t border-line-soft pt-3.5">
          <span className="font-semibold text-brand-purple">Locations</span>
          {plan === 'Enterprise' ? (
            LOCATIONS.map((l, i) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLocation(i);
                  showToast(`Switched to ${VENUE} · ${l}`);
                }}
                className="flex cursor-pointer items-center gap-2.5 rounded-[12px] border-none bg-page px-3 py-2.5 text-left text-sm text-fg"
              >
                <span className={`size-2.5 rounded-full ${i === location ? 'bg-brand-peach' : 'bg-line-strong'}`} />
                {VENUE} · {l}
              </button>
            ))
          ) : (
            <div className="text-[13px] leading-normal text-fg-muted">
              Running more than one venue? Manage every location from one account on Enterprise.{' '}
              <Link href="/billing" className="font-semibold text-brand-peach hover:text-brand-peach-hover">
                See plans
              </Link>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}
