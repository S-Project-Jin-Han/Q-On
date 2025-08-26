import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { iconVariants } from './iconVariants';
import type { LucideName } from './LucideTypes';
import type { CustomName } from './CustomTypes';

export interface BaseIconProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof iconVariants> {
  label?: string;
  decorative?: boolean; // label 없으면 자동 true
  title?: string;
  className?: string;
}

export type LucideIconComponent = React.ComponentType<{
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
}>;

export interface LucideIconProps extends BaseIconProps {
  lucideName?: LucideName;
  icon?: LucideIconComponent;
  strokeWidth?: number | string;
}

export interface CustomIconProps extends BaseIconProps {
  // 1) 레지스트리/paths (stroke currentColor)
  customName?: CustomName;
  paths?: string | string[];
  viewBox?: string;
  strokeWidth?: number | string;

  // 2) 마스크 방식(색상 currentColor로 입히기)
  /** /public 경로의 SVG 파일 (mask-image로 사용) */
  maskSrc?: string;

  // 3) 일반 이미지로 표시 (색상 제어 없음)
  src?: string;
  alt?: string;
}

export type IconProps = LucideIconProps | CustomIconProps;
