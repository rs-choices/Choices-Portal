import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export function BackToSignIn() {
  return (
    <Link href="/sign-in" className="flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-purple hover:text-brand-peach">
      <Icon name="chevronLeft" size={16} stroke={2} />
      Back to sign in
    </Link>
  );
}
