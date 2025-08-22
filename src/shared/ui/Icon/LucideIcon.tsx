import * as React from 'react';
import { cn } from '@/shared/lib';
import { iconVariants } from './iconVariants';
import { LucideIconProps } from './Icon.types';
import { getLucideByName } from './LucideTypes';

export function LucideIcon({
  icon: IconCmp,
  lucideName,
  size,
  tone,
  spin,
  label,
  decorative = !label,
  title,
  strokeWidth,
  className,
  ...rest
}: LucideIconProps) {
  const classes = cn(iconVariants({ size, tone, spin }), className);
  const ariaProps = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': label };

  const Comp =
    IconCmp ?? (lucideName ? getLucideByName(lucideName) : undefined);
  if (!Comp) return null;

  return (
    <span className={classes} {...ariaProps} {...rest}>
      {title ? <span className="sr-only">{title}</span> : null}
      <Comp
        className="size-full"
        color="currentColor"
        strokeWidth={strokeWidth}
      />
    </span>
  );
}
