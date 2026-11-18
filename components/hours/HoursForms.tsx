'use client';

import { useState, type ReactNode } from 'react';
import { useHours, type HoursForm } from '@/components/portal/HoursProvider';
import { useListings } from '@/components/portal/ListingsProvider';
import { useLock } from '@/components/portal/useLock';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { FieldError, Input, Label } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { todayISO } from '@/lib/portal/format';
import {
  WEEKDAYS,
  kitchenInside,
  rangesOverlap,
  newId,
  overlapping,
  type DayHours,
  type Menu,
  type OpeningHours,
  type Scope,
  type Shared,
  type SpecialHours,
} from '@/lib/portal/hours';
import { NEW_MARK } from '@/lib/portal/reviewMark';
import { BranchesPicker } from './BranchesPicker';
import { ScopeDialog } from './ScopeDialog';
import { TimeRangesEditor } from './TimeRangesEditor';

const MAX_PDF = 10 * 1024 * 1024;

// The open hours form, if any. Keyed so each opening starts from its item.
export function HoursForms() {
  const { form, closeForm } = useHours();
  if (!form) return null;
  const key = `${form.kind}-${form.item?.id ?? 'new'}-${form.fromBranch ?? ''}`;
  if (form.kind === 'opening') return <OpeningHoursForm key={key} form={form} onClose={closeForm} />;
  if (form.kind === 'special') return <SpecialHoursForm key={key} form={form} onClose={closeForm} />;
  return <MenuForm key={key} form={form} onClose={closeForm} />;
}

// Shared footer and the "all or only this branch" question. Asked only when
// the form was opened from a branch page and the saved item already applies
// to more than one branch.
function useScopedSave<T extends Shared>(original: T | null, fromBranch: string | undefined, save: (item: T, scope?: Scope) => void) {
  const { branches } = useListings();
  const [pending, setPending] = useState<T | null>(null);
  const same = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));
  // Asked only when the branches weren't changed in this edit: ticking or
  // unticking branches is already a decision about all of them.
  const ask = (item: T) => !!original && !!fromBranch && original.branchIds.length > 1 && same(item.branchIds, original.branchIds);
  const submit = (item: T) => (ask(item) ? setPending(item) : save(item, 'all'));
  const dialog = (
    <ScopeDialog
      open={!!pending}
      count={original?.branchIds.length ?? 0}
      branchId={fromBranch ?? ''}
      branchName={branches.find((b) => b.id === fromBranch)?.name ?? ''}
      onClose={() => setPending(null)}
      onPick={(scope) => pending && save(pending, scope)}
    />
  );
  return { submit, dialog };
}

function Footer({ onClose, onSave, ready, label = 'Save' }: { onClose: () => void; onSave: () => void; ready: boolean; label?: string }) {
  const lock = useLock('place.edit');
  return (
    <>
      <Button variant="secondary" size="md" onClick={onClose}>
        Cancel
      </Button>
      <Button size="md" disabled={lock.disabled || !ready} title={lock.title} onClick={onSave}>
        {label}
      </Button>
    </>
  );
}

const openDay = (): DayHours => ({ closed: false, ranges: [{ open: '09:00', close: '22:00' }], kitchenCloses: null });
const dayOk = (d: DayHours) => d.closed || (d.ranges.length > 0 && d.ranges.every((r) => r.open && r.close) && kitchenInside(d) && !rangesOverlap(d));

function Shell({ title, onClose, footer, wide, children }: { title: string; onClose: () => void; footer: ReactNode; wide?: boolean; children: ReactNode }) {
  return (
    <Dialog open title={title} onClose={onClose} footer={footer} width={wide ? 'max-w-[760px]' : undefined} className={NEW_MARK}>
      {children}
    </Dialog>
  );
}

function OpeningHoursForm({ form, onClose }: { form: Extract<HoursForm, { kind: 'opening' }>; onClose: () => void }) {
  const { openingHours, saveOpeningHours } = useHours();
  const original = form.item;
  const [draft, setDraft] = useState<OpeningHours>(
    () => original ?? { id: newId('oh'), name: '', branchIds: form.fromBranch ? [form.fromBranch] : [], days: WEEKDAYS.map(openDay) },
  );
  const [kitchen, setKitchen] = useState('22:00');
  const { submit, dialog } = useScopedSave(original, form.fromBranch, saveOpeningHours);

  const ownerOf = (b: string) => openingHours.find((h) => h.id !== draft.id && h.branchIds.includes(b))?.name ?? null;
  const required = (b: string) => (original?.branchIds.includes(b) ? 'Every branch needs opening hours. Tick it on another set to move it.' : null);
  const moving = draft.branchIds.filter((b) => !original?.branchIds.includes(b) && ownerOf(b));
  const from = [...new Set(moving.map((b) => ownerOf(b)))].join(', ');
  const ready = !!draft.name.trim() && draft.branchIds.length > 0 && draft.days.every(dayOk);

  return (
    <Shell
      wide
      title={original ? 'Edit opening hours' : 'Add opening hours'}
      onClose={onClose}
      footer={
        <Footer
          onClose={onClose}
          ready={ready}
          label={moving.length ? `Save · moves ${moving.length === 1 ? '1 branch' : `${moving.length} branches`} from ${from}` : 'Save'}
          onSave={() => submit({ ...draft, name: draft.name.trim() })}
        />
      }
    >
      <Label label="Name">
        <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Café hours" />
      </Label>
      <BranchesPicker value={draft.branchIds} onChange={(branchIds) => setDraft((d) => ({ ...d, branchIds }))} ownerOf={ownerOf} required={required} />
      <div className="flex flex-col">
        {draft.days.map((d, i) => (
          <TimeRangesEditor
            key={WEEKDAYS[i]}
            label={WEEKDAYS[i]}
            value={d}
            allowKitchen
            onChange={(nd) => setDraft({ ...draft, days: draft.days.map((x, j) => (j === i ? nd : x)) })}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-md bg-page px-3.5 py-3 text-[13px]">
        <span className="font-semibold text-brand-purple">Same kitchen closing time every day</span>
        <Input type="time" size="sm" className="w-[118px] py-2" value={kitchen} onChange={(e) => setKitchen(e.target.value)} aria-label="Kitchen closes every day" />
        <Button
          variant="secondary"
          size="xs"
          onClick={() => setDraft({ ...draft, days: draft.days.map((d) => (d.closed ? d : { ...d, kitchenCloses: kitchen || null })) })}
        >
          Apply to open days
        </Button>
      </div>
      {dialog}
    </Shell>
  );
}

function SpecialHoursForm({ form, onClose }: { form: Extract<HoursForm, { kind: 'special' }>; onClose: () => void }) {
  const { specialHours, saveSpecialHours } = useHours();
  const original = form.item;
  const [draft, setDraft] = useState<SpecialHours>(() => {
    const t = todayISO();
    return original ?? { id: newId('sh'), label: '', from: t, to: t, closed: true, ranges: [], kitchenCloses: null, branchIds: form.fromBranch ? [form.fromBranch] : [] };
  });
  const { submit, dialog } = useScopedSave(original, form.fromBranch, saveSpecialHours);
  const badDates = !draft.from || !draft.to || draft.to < draft.from;
  const clashes = badDates ? [] : overlapping(draft, specialHours);
  const ready = !!draft.label.trim() && !badDates && draft.branchIds.length > 0 && dayOk(draft);

  return (
    <Shell
      title={original ? 'Edit special hours' : 'Add special hours'}
      onClose={onClose}
      footer={<Footer onClose={onClose} ready={ready} onSave={() => submit({ ...draft, label: draft.label.trim() })} />}
    >
      <Label label="Label">
        <Input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="Ramadan 2027" />
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <Label label="From">
          <Input type="date" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value, to: draft.to < e.target.value ? e.target.value : draft.to })} />
        </Label>
        <Label label="To">
          <Input type="date" value={draft.to} min={draft.from} onChange={(e) => setDraft({ ...draft, to: e.target.value })} />
        </Label>
      </div>
      {badDates && <FieldError>The last day can&apos;t be before the first day.</FieldError>}
      <div className="flex flex-col gap-1">
        <span className="font-medium text-brand-purple">Hours on these days</span>
        <TimeRangesEditor value={draft} allowKitchen onChange={(d) => setDraft({ ...draft, ...d })} />
      </div>
      <BranchesPicker value={draft.branchIds} onChange={(branchIds) => setDraft((d) => ({ ...d, branchIds }))} />
      {clashes.length > 0 && (
        <div className="rounded-md bg-brand-peach/14 px-3.5 py-3 text-[13px] leading-normal text-peach-ink">
          Overlaps with {clashes.map((c) => c.label).join(', ')}. On shared days the shorter period wins.
        </div>
      )}
      {dialog}
    </Shell>
  );
}

function MenuForm({ form, onClose }: { form: Extract<HoursForm, { kind: 'menu' }>; onClose: () => void }) {
  const { menus, saveMenu } = useHours();
  const original = form.item;
  const [draft, setDraft] = useState<Menu>(
    () => original ?? { id: newId('mn'), name: '', fileName: '', size: 0, uploadedAt: todayISO(), url: null, branchIds: form.fromBranch ? [form.fromBranch] : [] },
  );
  const [error, setError] = useState('');
  const { submit, dialog } = useScopedSave(original, form.fromBranch, saveMenu);
  // Cancelling drops an upload that was never saved.
  const cancel = () => {
    if (draft.url && draft.url !== original?.url) URL.revokeObjectURL(draft.url);
    onClose();
  };
  const ownerOf = (b: string) => menus.find((m) => m.id !== draft.id && m.branchIds.includes(b))?.name ?? null;
  const ready = !!draft.name.trim() && !!draft.fileName && draft.branchIds.length > 0;

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (f.type !== 'application/pdf') return setError('Upload a PDF file.');
    if (f.size > MAX_PDF) return setError('The PDF must be 10 MB or smaller.');
    setError('');
    setDraft((d) => {
      if (d.url && d.url !== original?.url) URL.revokeObjectURL(d.url);
      return { ...d, name: d.name || f.name.replace(/\.pdf$/i, ''), fileName: f.name, size: f.size, uploadedAt: todayISO(), url: URL.createObjectURL(f) };
    });
  };

  return (
    <Shell
      title={original ? 'Edit menu' : 'Add menu'}
      onClose={cancel}
      footer={<Footer onClose={cancel} ready={ready} onSave={() => submit({ ...draft, name: draft.name.trim() })} />}
    >
      <Label label="Name">
        <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Dinner menu" />
      </Label>
      <div className="flex flex-col gap-2">
        <span className="font-medium text-brand-purple">Menu file (PDF, up to 10 MB)</span>
        <label className="flex cursor-pointer items-center gap-3 rounded-md border-[1.5px] border-dashed border-line-dashed bg-fill-faint px-4 py-3.5 text-[13px] font-semibold text-brand-purple hover:bg-brand-purple/5">
          <input type="file" accept="application/pdf" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
          <Icon name="upload" size={20} />
          {draft.fileName ? `${draft.fileName} · ${(draft.size / 1_000_000).toFixed(1)} MB · Replace` : 'Choose a PDF'}
        </label>
        {error && <FieldError>{error}</FieldError>}
      </div>
      <BranchesPicker value={draft.branchIds} onChange={(branchIds) => setDraft((d) => ({ ...d, branchIds }))} ownerOf={ownerOf} />
      {dialog}
    </Shell>
  );
}
