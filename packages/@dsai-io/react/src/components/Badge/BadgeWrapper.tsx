import React, { forwardRef, memo, useMemo } from 'react';

import { cn } from '../../utils';

import type { BadgeWrapperProps } from './Badge.types';

// =============================================================================
// Placement CSS mapping
// =============================================================================

const PLACEMENT_STYLES: Readonly<Record<string, React.CSSProperties>> = {
  'top-end': { top: 0, right: 0, transform: 'translate(50%, -50%)' },
  'top-start': { top: 0, left: 0, transform: 'translate(-50%, -50%)' },
  'bottom-end': { bottom: 0, right: 0, transform: 'translate(50%, 50%)' },
  'bottom-start': { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' },
};

const CIRCULAR_OFFSET: Readonly<Record<string, React.CSSProperties>> = {
  'top-end': { top: '14%', right: '14%', transform: 'translate(50%, -50%)' },
  'top-start': { top: '14%', left: '14%', transform: 'translate(-50%, -50%)' },
  'bottom-end': { bottom: '14%', right: '14%', transform: 'translate(50%, 50%)' },
  'bottom-start': { bottom: '14%', left: '14%', transform: 'translate(-50%, 50%)' },
};

const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function safeLookup<T>(map: Readonly<Record<string, T>>, key: string, fallback: T): T {
  if (BLOCKED_KEYS.has(key)) {return fallback;}
  const value = Reflect.get(map, key) as T | undefined;
  return value !== undefined ? value : fallback;
}

// =============================================================================
// BadgeWrapper Component
// =============================================================================

/**
 * Badge.Wrapper — positions a badge as an overlay on a child element.
 *
 * @example
 * ```tsx
 * <Badge.Wrapper>
 *   <MailIcon />
 *   <Badge variant="danger" pill>4</Badge>
 * </Badge.Wrapper>
 *
 * <Badge.Wrapper placement="bottom-start" overlap="circular">
 *   <Avatar name="John" />
 *   <Badge variant="success" dot aria-label="Online" />
 * </Badge.Wrapper>
 * ```
 */
function BadgeWrapperComponent(
  {
    children,
    placement = 'top-end',
    overlap = 'rectangular',
    className,
    style,
  }: BadgeWrapperProps,
  ref: React.ForwardedRef<HTMLDivElement>
): React.JSX.Element {
  const offsetMap = overlap === 'circular' ? CIRCULAR_OFFSET : PLACEMENT_STYLES;
  const placementStyle = safeLookup<React.CSSProperties>(offsetMap, placement, {});

  const wrapperClasses = useMemo(
    () => cn('dsai-badge-wrapper', 'd-inline-flex', 'position-relative', className),
    [className]
  );

  return (
    <div
      ref={ref}
      className={wrapperClasses}
      style={style}
      data-placement={placement}
      data-overlap={overlap}
    >
      {/* Render children, injecting position styles onto badge children */}
      {Array.isArray(children)
        ? children.map((child, index) => {
            // The last child is assumed to be the badge; overlay it
            if (
              index === children.length - 1 &&
              child &&
              typeof child === 'object' &&
              'props' in child
            ) {
              const childStyle = {
                position: 'absolute' as const,
                zIndex: 1,
                ...placementStyle,
                ...(typeof child.props?.style === 'object' ? child.props.style : {}),
              };
              // Use cloneElement-free approach: wrap in a positioned span
              return (
                <span key={React.isValidElement(child) ? (child.key ?? `badge-overlay`) : 'badge-overlay'} className="dsai-badge-wrapper-badge" style={childStyle}>
                  {child}
                </span>
              );
            }
            return child;
          })
        : children}
    </div>
  );
}

BadgeWrapperComponent.displayName = 'BadgeWrapper';

const BadgeWrapperWithRef = forwardRef(BadgeWrapperComponent);
BadgeWrapperWithRef.displayName = 'BadgeWrapper';

export const BadgeWrapper = memo(BadgeWrapperWithRef);
BadgeWrapper.displayName = 'BadgeWrapper';
