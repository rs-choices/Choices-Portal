'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Label, Select, Textarea } from '@/components/ui/Field';

// Reporting a review or a client to the Choices team: a reason, an optional
// booking (clients only) and optional details.
export function ReportDialog({
  open,
  title,
  reasons,
  bookings,
  note,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  reasons: string[];
  // Booking labels to pick from; omit for reviews.
  bookings?: string[];
  note?: string;
  onClose: () => void;
  onSubmit: (v: { reason: string; details: string; booking: string }) => void;
}) {
  const [reason, setReason] = useState('');
  const [booking, setBooking] = useState('');
  const [details, setDetails] = useState('');

  const close = () => {
    setReason('');
    setBooking('');
    setDetails('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      title={title}
      onClose={close}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={close}>
            Cancel
          </Button>
          <Button
            size="md"
            disabled={!reason}
            onClick={() => {
              onSubmit({ reason, details, booking });
              close();
            }}
          >
            Send report
          </Button>
        </>
      }
    >
      <fieldset className="m-0 flex flex-col gap-2 border-none p-0">
        <legend className="mb-2 font-medium text-brand-purple">Reason</legend>
        {reasons.map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2.5 text-fg">
            <input type="radio" name="report-reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="size-4 accent-brand-purple" />
            {r}
          </label>
        ))}
      </fieldset>
      {bookings && (
        <Label label="Booking (optional)">
          <Select value={booking} onChange={(e) => setBooking(e.target.value)}>
            <option value="">No booking</option>
            {bookings.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </Select>
        </Label>
      )}
      <Label label="Details (optional)">
        <Textarea rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="What happened?" />
      </Label>
      {note && <p className="m-0 text-[13px] text-fg-muted">{note}</p>}
    </Dialog>
  );
}
