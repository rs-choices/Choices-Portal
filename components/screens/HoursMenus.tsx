'use client';

import { useState } from 'react';
import { BranchChips } from '@/components/hours/SharedLabel';
import { useHours } from '@/components/portal/HoursProvider';
import { useListings } from '@/components/portal/ListingsProvider';
import { usePortal } from '@/components/portal/PortalProvider';
import { useLock } from '@/components/portal/useLock';
import { useMounted } from '@/components/portal/useMounted';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { Segmented } from '@/components/ui/Segmented';
import { fmtDate, todayISO } from '@/lib/portal/format';
import { describeDay, isPast, summariseWeek, type SpecialHours } from '@/lib/portal/hours';
import { NEW_MARK } from '@/lib/portal/reviewMark';

// Business-wide view of every shared item: opening hours sets, special hours
// periods and menus, each with the branches it applies to. Each branch's page
// shows the same items for that branch, and both open the same forms.
export function HoursMenus() {
  const { openingHours, specialHours, menus, openForm, deleteOpeningHours, deleteSpecialHours, deleteMenu } = useHours();
  const { branches } = useListings();
  const { showToast } = usePortal();
  const lock = useLock('place.edit');
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [confirm, setConfirm] = useState<{ title: string; branchIds: string[]; run: () => void } | null>(null);
  const mounted = useMounted();
  const today = todayISO();
  // Upcoming and Past depend on today: worked out in the browser only.
  const shown = !mounted ? [] : specialHours.filter((s) => (tab === 'past' ? isPast(s, today) : !isPast(s, today))).sort((a, b) => a.from.localeCompare(b.from));
  const names = (ids: string[]) => ids.map((id) => branches.find((b) => b.id === id)?.name ?? id).join(', ');

  return (
    <section className="flex flex-col gap-5">
      <Card className={`flex flex-col gap-3 p-6 ${NEW_MARK}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Opening hours</CardTitle>
            <p className="m-0 mt-1 text-[13px] text-ink-muted">Your normal week. Each branch uses one set; a set can be shared by several branches.</p>
          </div>
          <Button variant="secondary" size="sm" {...lock} onClick={() => openForm({ kind: 'opening', item: null })}>
            Add opening hours
          </Button>
        </div>
        {openingHours.map((h) => (
          <Row key={h.id}>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="font-bold text-fg">{h.name}</span>
              <span className="text-[13px] text-fg-soft">{summariseWeek(h.days)}</span>
              {h.days.some((d) => d.kitchenCloses && !d.closed) && <span className="text-xs text-ink-muted">Kitchen closing times set</span>}
              <BranchChips branchIds={h.branchIds} />
            </div>
            <Actions
              lock={lock}
              onEdit={() => openForm({ kind: 'opening', item: h })}
              onDelete={() => {
                if (!deleteOpeningHours(h.id)) showToast('Move these branches to other hours first.');
              }}
            />
          </Row>
        ))}
      </Card>

      <Card className={`flex flex-col gap-3 p-6 ${NEW_MARK}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Special hours</CardTitle>
            <p className="m-0 mt-1 text-[13px] text-ink-muted">Holidays, Ramadan and days off. On these days they replace the opening hours.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Segmented
              size="sm"
              options={[
                ['upcoming', 'Upcoming'],
                ['past', 'Past'],
              ]}
              value={tab}
              onChange={setTab}
            />
            <Button variant="secondary" size="sm" {...lock} onClick={() => openForm({ kind: 'special', item: null })}>
              Add special hours
            </Button>
          </div>
        </div>
        {mounted && shown.length === 0 && <div className="text-[13px] text-fg-muted">{tab === 'past' ? 'No past special hours.' : 'No upcoming special hours.'}</div>}
        {shown.map((s) => (
          <Row key={s.id}>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="font-bold text-fg">{s.label}</span>
              <span className="text-[13px] text-fg-soft">
                {periodText(s)} · {describeDay(s)}
              </span>
              <BranchChips branchIds={s.branchIds} />
            </div>
            <Actions
              lock={lock}
              onEdit={() => openForm({ kind: 'special', item: s })}
              onDelete={() => setConfirm({ title: `Delete ${s.label}?`, branchIds: s.branchIds, run: () => deleteSpecialHours(s.id) })}
            />
          </Row>
        ))}
      </Card>

      <Card className={`flex flex-col gap-3 p-6 ${NEW_MARK}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Menus</CardTitle>
            <p className="m-0 mt-1 text-[13px] text-ink-muted">A PDF per branch. One menu can be shared by several branches.</p>
          </div>
          <Button variant="secondary" size="sm" {...lock} onClick={() => openForm({ kind: 'menu', item: null })}>
            Add menu
          </Button>
        </div>
        {menus.length === 0 && <div className="text-[13px] text-fg-muted">No menus yet.</div>}
        {menus.map((m) => (
          <Row key={m.id}>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="font-bold text-fg">{m.name}</span>
              <span className="text-[13px] text-fg-soft">
                {m.fileName} · {(m.size / 1_000_000).toFixed(1)} MB · uploaded {fmtDate(m.uploadedAt)}
              </span>
              <BranchChips branchIds={m.branchIds} />
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="xs" onClick={() => (m.url ? window.open(m.url, '_blank') : showToast('Sample menu: upload a PDF to view it.'))}>
                View
              </Button>
              <Actions
                lock={lock}
                onEdit={() => openForm({ kind: 'menu', item: m })}
                onDelete={() => setConfirm({ title: `Delete ${m.name}?`, branchIds: m.branchIds, run: () => deleteMenu(m.id) })}
              />
            </div>
          </Row>
        ))}
      </Card>

      <Dialog
        open={!!confirm}
        title={confirm?.title ?? ''}
        onClose={() => setConfirm(null)}
        footer={
          <>
            <Button variant="secondary" size="md" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              size="md"
              onClick={() => {
                confirm?.run();
                setConfirm(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="m-0 leading-normal text-fg-soft">It is removed from {confirm && confirm.branchIds.length ? names(confirm.branchIds) : 'every branch'}.</p>
      </Dialog>
    </section>
  );
}

export function periodText(s: SpecialHours) {
  return s.from === s.to ? fmtDate(s.from) : `${fmtDate(s.from)} – ${fmtDate(s.to)}`;
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-start justify-between gap-3 border-t border-line-faint pt-3.5">{children}</div>;
}

function Actions({ lock, onEdit, onDelete }: { lock: { disabled: boolean; title?: string }; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex shrink-0 gap-2">
      <Button variant="secondary" size="xs" {...lock} onClick={onEdit}>
        Edit
      </Button>
      <Button variant="light" size="xs" {...lock} onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}
