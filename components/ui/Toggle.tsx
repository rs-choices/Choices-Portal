// On/off switch track. Rendered inside a button by the caller.
export function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`relative h-[26px] w-11 shrink-0 rounded-[13px] transition-colors ${on ? 'bg-brand-purple' : 'bg-line-strong'}`}>
      <span
        className={`absolute top-0.5 size-[22px] rounded-full bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-[left] ${
          on ? 'left-5' : 'left-0.5'
        }`}
      />
    </span>
  );
}
