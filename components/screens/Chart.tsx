import { chartArea, chartPoints } from '@/lib/portal/format';

// Line chart on a 600x200 viewBox, stretched to the card width.
export function Chart({ height, area, lines }: { height: number; area?: number[]; lines: [number[], string][] }) {
  return (
    <svg viewBox="0 0 600 200" preserveAspectRatio="none" style={{ height }} className="block w-full overflow-visible">
      {[30, 87, 143].map((y) => (
        <line key={y} x1="0" x2="600" y1={y} y2={y} vectorEffect="non-scaling-stroke" className="stroke-surface-muted" />
      ))}
      <line x1="0" x2="600" y1="200" y2="200" vectorEffect="non-scaling-stroke" className="stroke-line-strong" />
      {area && <path d={chartArea(area)} className="fill-brand-peach/10" />}
      {lines.map(([series, stroke], i) => (
        <polyline
          key={i}
          points={chartPoints(series)}
          fill="none"
          strokeWidth={2.5}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className={stroke}
        />
      ))}
    </svg>
  );
}

export function ChartLabels({ labels }: { labels: string[] }) {
  return (
    <div className="flex justify-between text-xs text-fg-subtle">
      {labels.map((l) => (
        <span key={l}>{l}</span>
      ))}
    </div>
  );
}

export function Legend({ items }: { items: [label: string, className: string][] }) {
  return (
    <div className="flex gap-4 text-[13px] text-fg-muted">
      {items.map(([label, c]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className={`h-[3px] w-3 rounded-sm ${c}`} />
          {label}
        </span>
      ))}
    </div>
  );
}
