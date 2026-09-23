'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { EMPTY_COPY } from '@/lib/portal/data';
import { sectionFromPath } from '@/lib/portal/sections';

const useSectionName = () => sectionFromPath(usePathname()).label.toLowerCase();

export function LoadingState() {
  const name = useSectionName();
  return (
    <div className="flex flex-col gap-5" aria-label="Loading">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {[0, 150, 300, 450].map((delay) => (
          <div key={delay} style={{ animationDelay: `${delay}ms` }} className="h-28 animate-pulse-soft rounded-xl bg-surface-muted" />
        ))}
      </div>
      <div className="h-[300px] animate-pulse-soft rounded-xl bg-surface-muted" />
      <div className="flex items-center gap-2.5 font-medium text-fg-muted">Loading your {name}…</div>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const name = useSectionName();
  return (
    <Card className="flex flex-col items-center gap-3.5 px-8 py-14 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-brand-peach/12 text-brand-peach">
        <Icon name="alert" size={30} />
      </div>
      <h2 className="m-0 text-xl font-bold text-brand-purple">We couldn&apos;t load your {name}</h2>
      <div className="max-w-[420px] leading-normal text-fg-muted">Something went wrong on our side or your connection dropped. Nothing has been lost.</div>
      <Button size="md" className="mt-1.5 px-6 py-3" onClick={onRetry}>
        Try again
      </Button>
    </Card>
  );
}

// Shown when a section has no data. Not used yet: every page reads mock data.
export function EmptyState({ onCta }: { onCta: () => void }) {
  const pathname = usePathname();
  const section = sectionFromPath(pathname);
  const [title, body, cta] = EMPTY_COPY[section.id];
  return (
    <Card className="flex flex-col items-center gap-3.5 px-8 py-16 text-center">
      <div className="grid size-[72px] place-items-center rounded-2xl bg-surface-purple text-brand-purple">
        <Icon name={section.icon} size={32} stroke={1.6} />
      </div>
      <h2 className="m-0 text-[22px] font-bold text-brand-purple">{title}</h2>
      <div className="max-w-[440px] text-[15px] leading-[1.55] text-fg-muted">{body}</div>
      <Button size="lg" className="mt-2" onClick={onCta}>
        {cta}
      </Button>
    </Card>
  );
}
