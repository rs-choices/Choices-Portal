'use client';

import { useState } from 'react';
import { useListings } from '@/components/portal/ListingsProvider';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Label, Select } from '@/components/ui/Field';
import { OUTLET_TYPES, type Branch, type OutletType } from '@/lib/portal/places';
import { useLock } from '@/components/portal/useLock';

// A big branch can hold several places (a hotel's café and rooftop
// restaurant). Each extra one is requested here and approved by the team.
export function RequestOutletDialog({ branch, onClose }: { branch: Branch | null; onClose: () => void }) {
  const { requestOutlet } = useListings();
  const lock = useLock('branch.add');
  const [name, setName] = useState('');
  const [type, setType] = useState<OutletType>('Food & Beverage');

  const close = () => {
    setName('');
    onClose();
  };

  return (
    <Dialog
      open={!!branch}
      title="Request an extra outlet"
      onClose={close}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={close}>
            Cancel
          </Button>
          <Button
            size="md"
            disabled={lock.disabled || !name.trim()}
            title={lock.title}
            onClick={() => {
              if (branch) requestOutlet(branch.id, { name: name.trim(), type });
              close();
            }}
          >
            Send request
          </Button>
        </>
      }
    >
      <p className="m-0 text-[13px] text-fg-muted">
        For a big branch with several places, such as a hotel&apos;s café and rooftop restaurant. Each one shows in the app as its own place.
      </p>
      <Label label="Outlet name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rooftop restaurant" />
      </Label>
      <Label label="Type">
        <Select value={type} onChange={(e) => setType(e.target.value as OutletType)}>
          {OUTLET_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Label>
      <p className="m-0 text-[13px] text-fg-muted">The Choices team checks that it is a separate place, then it goes live.</p>
    </Dialog>
  );
}
