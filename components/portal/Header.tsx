'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LOCKED_REASON } from '@/lib/portal/messages';
import { ACTION_TOAST, type SectionId } from '@/lib/portal/sections';
import { useListings } from './ListingsProvider';
import { useMessages } from './MessagesProvider';
import { NotificationBell } from './NotificationBell';
import { usePortal } from './PortalProvider';

export function Header({
  section,
  title,
  action,
  onMenu,
  highlight,
}: {
  section: SectionId;
  title: string;
  action: string;
  onMenu: () => void;
  highlight: 'btn' | 'bell' | null;
}) {
  const { openOfferForm, showToast, tour } = usePortal();
  const { suspended, openSupportChat } = useMessages();
  const { openEventForm, openActivityForm, setAddBranchOpen } = useListings();
  const newOffer = section === 'dashboard' || section === 'offers';
  // While suspended, actions that change what clients see are locked.
  const locked = suspended && (newOffer || section === 'bookings' || section === 'branches' || section === 'events' || section === 'activities');

  const onAction = () => {
    if (newOffer) openOfferForm();
    else if (section === 'branches') setAddBranchOpen(true);
    else if (section === 'events') openEventForm();
    else if (section === 'activities') openActivityForm();
    else if (section === 'help') openSupportChat();
    else showToast(ACTION_TOAST[section] ?? '');
  };

  return (
    <header
      className={`sticky top-0 flex items-center gap-3 border-b border-black/4 bg-page/92 px-7 py-4 backdrop-blur-[10px] ${tour !== null ? 'z-36' : 'z-30'}`}
    >
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
        className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-[12px] border-none bg-surface text-brand-purple shadow-soft lg:hidden"
      >
        <Icon name="menu" size={20} />
      </button>
      <h1 className="m-0 min-w-0 flex-1 truncate text-[22px] font-bold text-brand-purple">{title}</h1>

      <label className="hidden h-[42px] w-[min(280px,28vw)] items-center gap-2 rounded-pill bg-surface px-4 text-fg-subtle shadow-[0_2px_6px_rgba(0,0,0,0.05)] min-[900px]:flex">
        <Icon name="search" size={18} />
        <input
          placeholder="Search bookings, customers, offers"
          className="min-w-0 flex-1 border-none bg-transparent text-[13px] text-fg outline-none focus-visible:outline-none"
        />
      </label>

      <NotificationBell highlight={highlight === 'bell'} />

      <Button
        size="header"
        onClick={onAction}
        disabled={locked}
        title={locked ? LOCKED_REASON : undefined}
        className={`shrink-0 ${highlight === 'btn' ? 'shadow-tour-ring' : ''}`}
      >
        {(newOffer || section === 'branches' || section === 'events' || section === 'activities') && <Icon name="plus" size={18} stroke={2.2} />}
        {action}
      </Button>
    </header>
  );
}
