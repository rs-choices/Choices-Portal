import type { CSSProperties } from 'react';

// Line icons from the Business Portal design, drawn on a 24x24 grid with
// currentColor, so the surrounding text colour sets them. The .ds-icon class
// comes from the theme and handles stroke, caps and joins.
export const ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  tag: 'M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01',
  cal: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4',
  users: 'M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.2a3.5 3.5 0 0 1 0 6.6',
  chart: 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6',
  store: 'M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6',
  card: 'M3 6h18v12H3zM3 10h18M7 15h3',
  sliders: 'M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17.5h.01',
  close: 'M6 6l12 12M18 6 6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  bell: 'M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15zM10 21h4',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12.5l4.5 4.5L19 7',
  chevronLeft: 'M15 6l-6 6 6 6',
  chevronRight: 'M9 6l6 6-6 6',
  chevronUp: 'M6 15l6-6 6 6',
  chevronDown: 'M6 9l6 6 6-6',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  alert: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5v5.5M12 16.5h.01',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  pause: 'M9 6v12M15 6v12',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  upload: 'M12 16V5M7 10l5-5 5 5M5 20h14',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
} as const;

// Filled glyphs, drawn with fill rather than stroke.
export const STAR = 'M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9z';
export const PLAY = 'M8 5.5v13l10.5-6.5z';
export const PIN = 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z';

export type IconName = keyof typeof ICONS;

type Props = {
  name?: IconName;
  d?: string;
  size?: number;
  stroke?: number;
  className?: string;
};

export function Icon({ name, d, size = 20, stroke, className = '' }: Props) {
  const style = { '--icon-size': `${size}px`, strokeWidth: stroke } as CSSProperties;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`ds-icon ${className}`} style={style}>
      <path d={d ?? (name ? ICONS[name] : '')} />
    </svg>
  );
}

export function Star({ size = 16, on = true }: { size?: number; on?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={on ? 'fill-brand-peach' : 'fill-line-strong'}>
      <path d={STAR} />
    </svg>
  );
}
