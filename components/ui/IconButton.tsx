import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';

// Square grey icon button used for row actions and close buttons.
export function IconButton({
  icon,
  d,
  size = 36,
  iconSize = 16,
  stroke = 2,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: IconName; d?: string; size?: number; iconSize?: number; stroke?: number }) {
  return (
    <button
      type="button"
      style={{ width: size, height: size }}
      className={`grid shrink-0 cursor-pointer place-items-center rounded-[12px] border-none bg-fill-soft text-brand-purple hover:bg-fill-hover ${className}`}
      {...rest}
    >
      <Icon name={icon} d={d} size={iconSize} stroke={stroke} />
    </button>
  );
}
