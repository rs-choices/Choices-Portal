'use client';

import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import type { Scope } from '@/lib/portal/hours';
import { NEW_MARK } from '@/lib/portal/reviewMark';

// Asked when a shared item is saved from one branch's page.
export function ScopeDialog({
  open,
  count,
  branchId,
  branchName,
  onPick,
  onClose,
}: {
  open: boolean;
  count: number;
  branchId: string;
  branchName: string;
  onPick: (s: Scope) => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} title="Save for which branches?" onClose={onClose} className={NEW_MARK}>
      <p className="m-0 leading-normal text-fg-soft">
        This is shared with {count} branches. You can change it for all of them, or give {branchName} its own copy and leave the others as they are.
      </p>
      <div className="flex flex-col gap-2.5">
        <Button size="md" onClick={() => onPick('all')}>
          Change for all {count} branches
        </Button>
        <Button variant="secondary" size="md" onClick={() => onPick({ only: branchId })}>
          Only for {branchName}
        </Button>
      </div>
    </Dialog>
  );
}
