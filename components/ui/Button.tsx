import type { ButtonHTMLAttributes } from 'react';

// Wraps the theme's .ds-button. The portal uses bold labels and several
// tighter sizes than the theme's 48px default, so each size resets min-height
// and sets its own padding.
const VARIANTS = {
  primary: 'ds-button',
  // .ds-button:hover turns the label white, and .ds-button-ghost:hover does not
  // set it back, so the purple label is restored here.
  secondary: 'ds-button ds-button-ghost bg-surface-purple text-brand-purple hover:bg-brand-purple/14 hover:text-brand-purple',
  light: 'ds-button bg-surface text-brand-purple hover:bg-surface hover:text-brand-purple',
};

const SIZES = {
  xs: 'min-h-0 px-3.5 py-2 text-xs',
  sm: 'min-h-0 px-4 py-[9px] text-xs',
  md: 'min-h-0 px-[22px] py-[13px] text-sm',
  lg: 'min-h-0 px-[26px] py-3.5 text-sm',
  block: 'ds-button-block min-h-0 py-4 text-[15px]',
  header: 'min-h-0 h-[42px] px-5 text-sm',
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
};

export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...rest }: Props) {
  return <button type={type} className={`${VARIANTS[variant]} ${SIZES[size]} font-bold ${className}`} {...rest} />;
}

// Text-only link button, peach by default.
export function TextButton({ className = '', type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`cursor-pointer border-none bg-transparent p-0 font-semibold text-brand-peach hover:text-brand-peach-hover ${className}`}
      {...rest}
    />
  );
}
