'use client';

import { useState } from 'react';
import { useListings } from '@/components/portal/ListingsProvider';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Label } from '@/components/ui/Field';

// A new branch is a new place. It waits for the Choices team to verify it.
export function AddBranchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addBranch } = useListings();
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [licence, setLicence] = useState('');
  const [opens, setOpens] = useState('09:00');
  const [closes, setCloses] = useState('22:00');
  const ready = name.trim() && address.trim() && licence.trim();

  const close = () => {
    setName('');
    setArea('');
    setAddress('');
    setLicence('');
    setOpens('09:00');
    setCloses('22:00');
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
            disabled={!ready}
            onClick={() => {
              addBranch({ name: name.trim(), area: area.trim() || name.trim(), address: address.trim(), licence: licence.trim(), open: opens, close: closes });
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
      <div className="grid grid-cols-2 gap-4">
        <Label label="Opens">
          <Input type="time" value={opens} onChange={(e) => setOpens(e.target.value)} />
        </Label>
        <Label label="Closes">
          <Input type="time" value={closes} onChange={(e) => setCloses(e.target.value)} />
        </Label>
      </div>
      <p className="m-0 text-[13px] text-fg-muted">The Choices team verifies a new branch within two working days. You can set different hours per day later. Events, activities and offers can be added once it is verified.</p>
    </Dialog>
  );
}
