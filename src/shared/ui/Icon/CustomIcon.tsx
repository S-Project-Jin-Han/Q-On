import * as React from 'react';
import { cn } from '@/shared/lib';
import { iconVariants } from './iconVariants';
import { CustomIconProps } from './Icon.types';
import { getCustomByName } from './CustomTypes';

/**
 * 렌더 우선순위(단일 렌더 보장):
 * 1) customName (레지스트리 paths)
 * 2) paths (직접 path)
 * 3) maskSrc (mask-image로 currentColor 적용)
 * 4) src (일반 이미지)
 */
export function CustomIcon({
  customName,
  paths,
  viewBox,
  strokeWidth,
  maskSrc,
  src,
  alt,
  size,
  tone,
  spin,
  label,
  decorative = !label && !alt,
  title,
  className,
  ...rest
}: CustomIconProps) {
  const classes = cn(iconVariants({ size, tone, spin }), className);
  const ariaProps = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': label ?? alt };

  // 1) 레지스트리 paths
  if (customName) {
    const reg = getCustomByName(customName);
    if (!reg || !reg.paths) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[Icon] customName "${customName}" not found in registry or has no paths.`
        );
      }
    } else {
      const vb = reg.viewBox ?? '0 0 24 24';
      const sw = strokeWidth ?? reg.strokeWidth ?? 1.5;
      const arr = Array.isArray(reg.paths) ? reg.paths : [reg.paths];

      return (
        <span className={classes} {...ariaProps} {...rest}>
          {title ? <span className="sr-only">{title}</span> : null}
          <svg
            viewBox={vb}
            className="block size-full"
            fill="none"
            stroke="currentColor"
          >
            {arr.map((d, i) => (
              <path key={i} d={d} strokeWidth={sw} />
            ))}
          </svg>
        </span>
      );
    }
  }

  // 2) paths 직접 전달
  if (paths) {
    const vb = viewBox ?? '0 0 24 24';
    const sw = strokeWidth ?? 1.5;
    const arr = Array.isArray(paths) ? paths : [paths];

    return (
      <span className={classes} {...ariaProps} {...rest}>
        {title ? <span className="sr-only">{title}</span> : null}
        <svg
          viewBox={vb}
          className="block size-full"
          fill="none"
          stroke="currentColor"
        >
          {arr.map((d, i) => (
            <path key={i} d={d} strokeWidth={sw} />
          ))}
        </svg>
      </span>
    );
  }

  // 3) mask-image 방식: currentColor로 채워짐
  if (maskSrc) {
    const { style: styleFromProps, ...restProps } =
      (rest as { style?: React.CSSProperties }) ?? {};
    return (
      <span
        className={cn('icon-mask', classes)}
        style={{
          ...(styleFromProps ?? {}),
          maskImage: `url(${maskSrc})`,
          WebkitMaskImage: `url(${maskSrc})`,
        }}
        {...ariaProps}
        {...restProps}
      >
        {title ? <span className="sr-only">{title}</span> : null}
      </span>
    );
  }

  // 4) 일반 이미지
  if (src) {
    return (
      <img
        src={src}
        alt={decorative ? '' : alt ?? label ?? ''}
        className={classes}
        {...(decorative ? { 'aria-hidden': true } : {})}
        {...rest}
      />
    );
  }

  return null;
}
