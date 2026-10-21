import { TEAM, type TeamMember } from '@/lib/portal/data';

// Who may do what in the portal. The rule book is docs/domain/roles-and-permissions.md;
// this map follows it line by line. With no sign-in yet, the role comes from
// ?role=owner|manager|staff (see PortalProvider).

export type Role = TeamMember['role'];

export type Permission =
  | 'place.edit'
  | 'branch.add'
  | 'branch.move'
  | 'place.unlist'
  | 'listings.manage' // event listings, activity listings and offers
  | 'bookings.manage'
  | 'customers.export'
  | 'reviews.reply'
  | 'reports.create'
  | 'analytics.view'
  | 'billing.manage'
  | 'billing.invoices'
  | 'team.staff'
  | 'team.managers'
  | 'business.details'
  | 'business.ownership';

const OWNER_MANAGER: Role[] = ['Owner', 'Manager'];

export const PERMISSIONS: Record<Permission, Role[]> = {
  'place.edit': OWNER_MANAGER,
  'branch.add': OWNER_MANAGER,
  'branch.move': ['Owner'],
  'place.unlist': OWNER_MANAGER,
  'listings.manage': OWNER_MANAGER,
  'bookings.manage': ['Owner', 'Manager', 'Staff'],
  'customers.export': ['Owner'],
  'reviews.reply': OWNER_MANAGER,
  'reports.create': OWNER_MANAGER,
  'analytics.view': OWNER_MANAGER,
  'billing.manage': ['Owner'],
  'billing.invoices': OWNER_MANAGER,
  'team.staff': OWNER_MANAGER,
  'team.managers': ['Owner'],
  'business.details': ['Owner'],
  'business.ownership': ['Owner'],
};

export const can = (role: Role, p: Permission) => PERMISSIONS[p].includes(role);

export const ROLE_REASON = "Your role can't do this. Ask the business owner.";

// '?role=staff' -> 'Staff'. Anything else, or nothing, is the Owner.
export function parseRole(search: string): Role {
  const v = new URLSearchParams(search).get('role')?.toLowerCase();
  return v === 'manager' ? 'Manager' : v === 'staff' ? 'Staff' : 'Owner';
}

// The demo person shown for each role, taken from the sample team.
export function demoUser(role: Role) {
  const m = TEAM.find((t) => t.role === role) ?? TEAM[0];
  const initials = m.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);
  return { name: m.name, email: m.email, role: m.role, initials };
}
