import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

// Flat grey field with a 1px inset purple ring on focus, as the design system
// specifies for inputs.
const BASE =
  'w-full rounded-md border-none bg-surface-muted text-fg outline-none focus:shadow-[inset_0_0_0_1px_var(--color-brand-purple)] focus-visible:outline-none';
const SIZES = { lg: 'px-4 py-3.5 text-[15px]', md: 'px-3.5 py-[13px] text-sm', sm: 'px-3.5 py-3 text-sm' };

type Size = keyof typeof SIZES;

export const fieldClass = (size: Size = 'md') => `${BASE} ${SIZES[size]}`;

export function Label({ label, children, className = '' }: { label: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-2 font-medium text-brand-purple ${className}`}>
      {label}
      {children}
    </label>
  );
}

export function Input({ size = 'md', className = '', ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & { size?: Size }) {
  return <input className={`${fieldClass(size)} ${className}`} {...rest} />;
}

export function Textarea({ size = 'md', className = '', ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { size?: Size }) {
  return <textarea className={`${fieldClass(size)} resize-y ${className}`} {...rest} />;
}

export function Select({ size = 'md', className = '', ...rest }: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & { size?: Size }) {
  return <select className={`${fieldClass(size)} ${className}`} {...rest} />;
}

export function FieldError({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`text-[13px] font-medium text-danger ${className}`}>{children}</span>;
}
