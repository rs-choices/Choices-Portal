'use client';

import { useHours } from '@/components/portal/HoursProvider';
import { usePortal } from '@/components/portal/PortalProvider';
import { useLock } from '@/components/portal/useLock';
import { useMounted } from '@/components/portal/useMounted';
import { periodText } from '@/components/screens/HoursMenus';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { fmtTime } from '@/lib/portal/format';
import { WEEKDAYS, describeDay } from '@/lib/portal/hours';
import { NEW_MARK } from '@/lib/portal/reviewMark';
import { SharedLabel } from './SharedLabel';

// One branch's opening hours, special hours and menu. The items are shared:
// editing one here asks whether to change it for every branch or only this one.
export function BranchHoursCards({ branchId }: { branchId: string }) {
  const { hoursOf, upcomingOf, menuOf, openForm } = useHours();
  const { showToast } = usePortal();
  const lock = useLock('place.edit');
  const hours = hoursOf(branchId);
  const mounted = useMounted();
  // Upcoming depends on today: worked out in the browser only.
  const upcoming = mounted ? upcomingOf(branchId) : [];
  const menu = menuOf(branchId);

  return (
    <>
      <Card className={`flex flex-col gap-1.5 p-6 ${NEW_MARK}`}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Opening hours</CardTitle>
          {hours && <SharedLabel branchIds={hours.branchIds} />}
        </div>
        {!hours && <div className="text-[13px] text-fg-muted">No opening hours yet.</div>}
        {hours?.days.map((d, i) => (
          <div key={WEEKDAYS[i]} className="flex justify-between gap-3 border-t border-line-faint py-[7px] text-[13px]">
            <span className="font-semibold">{WEEKDAYS[i]}</span>
            <span className="text-right text-fg-soft">
              {describeDay(d)}
              {d.kitchenCloses && !d.closed && <span className="block text-xs text-ink-muted">Kitchen closes {fmtTime(d.kitchenCloses)}</span>}
            </span>
          </div>
        ))}
        <Button
          variant="secondary"
          size="sm"
          className="mt-2 self-start"
          {...lock}
          onClick={() => openForm({ kind: 'opening', item: hours ?? null, fromBranch: branchId })}
        >
          {hours ? 'Edit hours' : 'Add hours'}
        </Button>
      </Card>

      <Card className={`flex flex-col gap-1.5 p-6 ${NEW_MARK}`}>
        <CardTitle className="mb-2">Special hours</CardTitle>
        {mounted && upcoming.length === 0 && <div className="text-[13px] text-fg-muted">No upcoming holidays or days off.</div>}
        {upcoming.map((s) => (
          <div key={s.id} className="flex flex-wrap items-start justify-between gap-2 border-t border-line-faint py-2.5 text-[13px]">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold">{s.label}</span>
              <span className="text-fg-soft">
                {periodText(s)} · {describeDay(s)}
              </span>
              <SharedLabel branchIds={s.branchIds} />
            </div>
            <Button variant="light" size="xs" {...lock} onClick={() => openForm({ kind: 'special', item: s, fromBranch: branchId })}>
              Edit
            </Button>
          </div>
        ))}
        <Button
          variant="secondary"
          size="sm"
          className="mt-2 self-start"
          {...lock}
          onClick={() => openForm({ kind: 'special', item: null, fromBranch: branchId })}
        >
          Add special hours
        </Button>
      </Card>

      <Card className={`flex flex-col gap-2 p-6 ${NEW_MARK}`}>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Menu</CardTitle>
          {menu && <SharedLabel branchIds={menu.branchIds} />}
        </div>
        {menu ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-page px-3.5 py-3 text-[13px]">
            <span>
              <span className="font-semibold">{menu.name}</span>
              <span className="text-fg-soft"> · {menu.fileName}</span>
            </span>
            <Button variant="light" size="xs" onClick={() => (menu.url ? window.open(menu.url, '_blank') : showToast('Sample menu: upload a PDF to view it.'))}>
              View
            </Button>
          </div>
        ) : (
          <div className="text-[13px] text-fg-muted">No menu yet. Clients see a Menu button once you add one.</div>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="self-start"
          {...lock}
          onClick={() => openForm({ kind: 'menu', item: menu ?? null, fromBranch: branchId })}
        >
          {menu ? 'Replace menu' : 'Upload menu'}
        </Button>
      </Card>
    </>
  );
}
