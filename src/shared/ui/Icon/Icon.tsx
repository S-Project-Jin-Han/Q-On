import * as React from 'react';
import { IconProps } from './Icon.types';
import { LucideIcon } from './LucideIcon';
import { CustomIcon } from './CustomIcon';

export function Icon(props: IconProps) {
  if ('lucideName' in props && props.lucideName)
    return <LucideIcon {...props} />;
  if ('customName' in props && props.customName)
    return <CustomIcon {...props} />;
  if ('paths' in props && props.paths) return <CustomIcon {...props} />;
  if ('icon' in props && props.icon) return <LucideIcon {...props} />;
  return null;
}
