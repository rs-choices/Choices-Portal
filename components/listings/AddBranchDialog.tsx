'use client';

import { useState } from 'react';
import { useListings } from '@/components/portal/ListingsProvider';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Label } from '@/components/ui/Field';
import { useLock } from '@/components/portal/useLock';

// A new branch is a new place. It waits for the Choices team to verify it.
export function AddBranchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addBranch } = useListings();
  const lock = useLock('branch.add');
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [licence, setLicence] = useState('');
  const ready = name.trim() && address.trim() && licence.trim();

  const close = () => {
    setName('');
    setArea('');
    setAddress('');
    setLicence('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      title="Add a branch"
      onClose={close}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={close}>
            Cancel
          </Button>
          <Button
            size="md"
            disabled={lock.disabled || !ready}
            title={lock.title}
            onClick={() => {
              addBranch({ name: name.trim(), area: area.trim() || name.trim(), address: address.trim(), licence: licence.trim() });
              close();
            }}
          >
            Add branch
          </Button>
        </>
      }
    >
      <Label label="Branch name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Business Bay" />
      </Label>
      <Label label="Area">
        <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Business Bay" />
      </Label>
      <Label label="Address">
        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Building, street" />
      </Label>
      <Label label="Trade licence number">
        <Input value={licence} onChange={(e) => setLicence(e.target.value)} placeholder="DED-000000" />
      </Label>
      <p className="m-0 text-[13px] text-fg-muted">The Choices team verifies a new branch within two working days. You can prepare its place, events and offers meanwhile.</p>
    </Dialog>
  );
}
