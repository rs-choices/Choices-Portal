'use client';

import { useState } from 'react';
import { usePortal } from '@/components/portal/PortalProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Input, Label, Select } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import { Toggle } from '@/components/ui/Toggle';
import { TEAM, VENUE } from '@/lib/portal/data';
import { Avatar } from '@/components/ui/Avatar';
import { useRoleLock } from '@/components/portal/useLock';

const NOTIFICATIONS = [
  ['booking', 'New booking', 'When a customer books or claims an offer'],
  ['expiring', 'Offer expiring', 'One hour before an offer ends'],
  ['review', 'New review', 'When someone rates or reviews you'],
  ['weekly', 'Weekly summary', 'A short email every Sunday morning'],
] as const;

export function Settings() {
  const { showToast, can, user } = usePortal();
  const detailsLock = useRoleLock('business.details');
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
        <CardTitle>Business details</CardTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
          <Label label="Business name">
            <Input defaultValue={VENUE} disabled={detailsLock.disabled} title={detailsLock.title} />
          </Label>
          <Label label="Logo">
            <Button variant="secondary" size="sm" className="self-start" {...detailsLock}>
              Upload logo
            </Button>
          </Label>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
          <Label label="Business email">
            <Input defaultValue="hello@qahwahouse.ae" disabled={detailsLock.disabled} title={detailsLock.title} />
          </Label>
          <Label label="Instagram">
            <Input defaultValue="instagram.com/qahwahouse" disabled={detailsLock.disabled} title={detailsLock.title} />
          </Label>
        </div>
        <span className="text-[13px] text-fg-muted">
          {detailsLock.disabled ? 'Only the business owner can change the business details. ' : ''}Each branch&apos;s photos, hours and WhatsApp are on Branches.
        </span>
      </Card>

      <Card className="flex flex-col gap-3.5 p-6">
        <CardTitle>Your account</CardTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
          <Label label="Full name">
            <Input defaultValue={user.name} />
          </Label>
          <Label label="Mobile">
            <Input defaultValue="+971 50 123 4567" />
          </Label>
        </div>
        <Label label="Email">
          <Input defaultValue={user.email} />
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
        {can('team.staff') && (
          <div className="flex flex-wrap items-center gap-2 border-t border-line-soft pt-3.5">
            <Input size="sm" value={invEmail} onChange={(e) => setInvEmail(e.target.value)} placeholder="colleague@qahwahouse.ae" className="w-auto flex-[1_1_180px]" />
            <Segmented
              options={can('team.managers') ? [['Manager', 'Manager'], ['Staff', 'Staff']] : [['Staff', 'Staff']]}
              value={invRole}
              onChange={setInvRole}
              size="sm"
            />
            <Button size="md" className="px-[18px] py-[11px] text-[13px]" onClick={invite}>
              Invite
            </Button>
          </div>
        )}
        <div className="text-xs leading-normal text-ink-muted">
          Owners do everything, including billing and the business details. Managers run the places, events, activities, offers and the staff. Staff handle bookings and see the rest.
        </div>
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
      </Card>
    </section>
  );
}
