'use client';

import { LOCKED_REASON } from '@/lib/portal/messages';
import { ROLE_REASON, type Permission } from '@/lib/portal/roles';
import { useMessages } from './MessagesProvider';
import { usePortal } from './PortalProvider';

// Props for a button that changes something: locked while the business is
// suspended (that reason wins, it applies to everyone) or when the signed-in
// role lacks the permission.
export function useLock(p: Permission) {
  const { suspended } = useMessages();
  const { can } = usePortal();
  const disabled = suspended || !can(p);
  return { disabled, title: suspended ? LOCKED_REASON : disabled ? ROLE_REASON : undefined };
}

// Role only: for actions a suspended business keeps (billing, reports, replies).
export function useRoleLock(p: Permission) {
  const { can } = usePortal();
  const disabled = !can(p);
  return { disabled, title: disabled ? ROLE_REASON : undefined };
}
