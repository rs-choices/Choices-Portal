export function ProgressBar({ pct, height = 6, barClass = 'bg-brand-peach' }: { pct: number; height?: number; barClass?: string }) {
  return (
    <div style={{ height }} className="overflow-hidden rounded-md bg-surface-muted">
      <div style={{ width: `${pct}%` }} className={`h-full rounded-md ${barClass}`} />
    </div>
  );
}
