export const initials = (name: string) =>
  name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('');

export const firstName = (name: string) => name.split(' ')[0];

// Avatar background colours, picked by id so a person keeps the same colour.
const AVATARS = ['bg-brand-peach', 'bg-brand-purple', 'bg-brand-teal', 'bg-lilac', 'bg-amber'];
export const avatarClass = (n: number) => AVATARS[n % AVATARS.length];

// '2026-09-23' -> 'Wed 23 Sep'
export function fmtDate(d: string) {
  if (!d) return '';
  const x = new Date(d + 'T00:00:00');
  return x.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

// '16:30' -> '4:30 PM', '07:00' -> '7 AM'
export function fmtTime(t: string) {
  if (!t) return '';
  const [hh, m] = t.split(':').map(Number);
  const ap = hh >= 12 ? 'PM' : 'AM';
  const h = hh % 12 || 12;
  return h + (m ? ':' + String(m).padStart(2, '0') : '') + ' ' + ap;
}

// Maps a series onto the 600x200 chart viewBox as SVG polyline points.
export function chartPoints(a: number[], top = 170) {
  const max = Math.max(...a) * 1.15 || 1;
  return a
    .map((v, i) => {
      const x = a.length === 1 ? 300 : (i / (a.length - 1)) * 600;
      return x.toFixed(1) + ',' + (200 - (v / max) * top).toFixed(1);
    })
    .join(' ');
}

export const chartArea = (a: number[]) => 'M0,200 L' + chartPoints(a).split(' ').join(' L') + ' L600,200 Z';
