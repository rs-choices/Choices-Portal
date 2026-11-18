// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BranchHoursCards } from '@/components/hours/BranchHoursCards';
import { HoursForms } from '@/components/hours/HoursForms';
import { HoursProvider } from '@/components/portal/HoursProvider';
import { ListingsProvider } from '@/components/portal/ListingsProvider';
import { MessagesProvider } from '@/components/portal/MessagesProvider';
import { PortalProvider, usePortal } from '@/components/portal/PortalProvider';
import { Bookings } from '@/components/screens/Bookings';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/bookings',
  useSearchParams: () => new URLSearchParams(),
}));

// The portal's provider tree, as in app/layout.tsx and PortalShell.
function Portal({ children }: { children: ReactNode }) {
  return (
    <PortalProvider>
      <MessagesProvider>
        <ListingsProvider>
          <HoursProvider>{children}</HoursProvider>
        </ListingsProvider>
      </MessagesProvider>
    </PortalProvider>
  );
}

// Stands in for the header's "Add booking" button.
function OpenAddBooking() {
  const { setAddBookingOpen } = usePortal();
  return (
    <button type="button" onClick={() => setAddBookingOpen(true)}>
      open add booking
    </button>
  );
}

// Thursday 19 November 2026, noon, local time. Only Date is faked, so
// timers and user events run normally.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 10, 19, 12, 0));
  window.history.replaceState(null, '', '/bookings');
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const tab = (name: RegExp) => screen.getByRole('tab', { name });
const rowOf = (text: string) => screen.getByText(text).closest('div.grid') as HTMLElement;

describe('9. Escape on the "which branches?" question', () => {
  it('closes only the question; the form and its edits stay', async () => {
    const user = userEvent.setup();
    render(
      <Portal>
        <BranchHoursCards branchId="b-jum" />
        <HoursForms />
      </Portal>,
    );

    await user.click(screen.getByRole('button', { name: 'Edit hours' }));
    const name = screen.getByPlaceholderText('Café hours') as HTMLInputElement;
    await user.clear(name);
    await user.type(name, 'Café hours edited');
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^Save/ }));
    expect(screen.getAllByRole('dialog')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Only for Jumeirah 1' })).toBeTruthy();

    await user.keyboard('{Escape}');

    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect((screen.getByPlaceholderText('Café hours') as HTMLInputElement).value).toBe('Café hours edited');
  });
});

describe('10. Add booking jumps to its branch and day; badges update', () => {
  it('a phone booking for tomorrow at Marina switches to Marina and tomorrow', async () => {
    const user = userEvent.setup();
    render(
      <Portal>
        <OpenAddBooking />
        <Bookings />
      </Portal>,
    );

    expect(tab(/All branches/).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText(/^Today, Thu 19 Nov$/)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'open add booking' }));
    const dialog = screen.getByRole('dialog');
    await user.selectOptions(within(dialog).getByLabelText('Branch'), 'Dubai Marina');
    fireEvent.change(within(dialog).getByLabelText('Date'), { target: { value: '2026-11-20' } });
    await user.type(within(dialog).getByPlaceholderText('Full name'), 'Test Phone');
    await user.type(within(dialog).getByPlaceholderText('+961 70 123 456'), '+971 55 000 1234');
    await user.click(within(dialog).getByRole('button', { name: 'Add booking' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(tab(/Dubai Marina/).getAttribute('aria-selected')).toBe('true');
    expect(window.location.search).toBe('?branch=b-mar');
    expect(screen.getByText(/^Tomorrow, Fri 20 Nov$/)).toBeTruthy();
    expect(screen.getByText('Test Phone')).toBeTruthy();
  });

  it('confirming a request lowers that branch tab and All branches', async () => {
    const user = userEvent.setup();
    render(
      <Portal>
        <Bookings />
      </Portal>,
    );
    // Sample data: 4 requests, 2 at Jumeirah 1 and 2 at Dubai Marina.
    expect(tab(/All branches/).textContent).toContain('4');
    expect(tab(/Dubai Marina/).textContent).toContain('2');

    await user.click(tab(/Dubai Marina/));
    await user.click(within(rowOf('Noura Al Suwaidi')).getByRole('button', { name: 'Confirm' }));

    expect(tab(/All branches/).textContent).toContain('3');
    expect(tab(/Dubai Marina/).textContent).toContain('1');
  });
});

describe('11. Walk-in', () => {
  it('warns about a same-day booking for that phone, then saves checked in at the current time', async () => {
    const user = userEvent.setup();
    render(
      <Portal>
        <OpenAddBooking />
        <Bookings />
      </Portal>,
    );

    await user.click(screen.getByRole('button', { name: 'open add booking' }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Walk-in' }));
    // Omar Khalid already has a booking at Jumeirah 1 today.
    await user.type(within(dialog).getByPlaceholderText('Full name'), 'Walk Test');
    await user.type(within(dialog).getByPlaceholderText('+961 70 123 456'), '+971 50 214 7781');
    expect(within(dialog).getByText(/Omar Khalid already has a booking at this branch that day/)).toBeTruthy();

    vi.setSystemTime(new Date(2026, 10, 19, 12, 7));
    await user.click(within(dialog).getByRole('button', { name: 'Add walk-in' }));

    const row = rowOf('Walk Test');
    expect(row.textContent).toContain('12:07 PM');
    expect(row.textContent).toContain('Walk-in');
    expect(row.textContent).toContain('Checked in');
    expect(within(row).queryByRole('button', { name: 'Check in' })).toBeNull();
  });
});
