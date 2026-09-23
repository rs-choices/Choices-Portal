import { avatarClass, initials } from '@/lib/portal/format';

export function Avatar({ name, seed, size = 34, className = '' }: { name: string; seed: number; size?: number; className?: string }) {
  return (
    <span
      style={{ width: size, height: size, fontSize: size >= 52 ? 17 : 12 }}
      className={`grid shrink-0 place-items-center rounded-full font-bold text-inverse ${avatarClass(seed)} ${className}`}
    >
      {initials(name)}
    </span>
  );
}
