import { forwardRef, memo, useEffect, useMemo, useRef } from 'react';

import { cn } from '../../utils';

import type { BadgeProps } from './Badge.types';

// =============================================================================
// Lookup maps — keyed by BadgeSize
// =============================================================================

const SIZE_CLASS_MAP: Readonly<Record<string, string>> = {
  sm: 'dsai-badge-sm',
  md: '',
  lg: 'dsai-badge-lg',
};

const SIZE_STYLE_MAP: Readonly<Record<string, React.CSSProperties>> = {
  sm: { fontSize: '0.65em', padding: '0.2em 0.45em' },
  md: {},
  lg: { fontSize: '0.85em', padding: '0.45em 0.85em' },
};

// =============================================================================
// Prototype-pollution-safe lookup (per CLAUDE.md security rules)
// =============================================================================

const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function safeLookup<T>(map: Readonly<Record<string, T>>, key: string, fallback: T): T {
  if (BLOCKED_KEYS.has(key)) return fallback;
  const value = Reflect.get(map, key) as T | undefined;
  return value !== undefined ? value : fallback;
}

// =============================================================================
// Badge Component
// =============================================================================

/**
 * Badge Component
 *
 * A Bootstrap 5 badge component for displaying labels, status indicators, and counts.
 * Supports sizes, style variants (solid/outline/subtle), dismissible badges,
 * max count truncation, visibility control, icon positioning, and animations.
 *
 * @see https://getbootstrap.com/docs/5.3/components/badge/
 */
function BadgeComponent(
  {
    children,
    variant = 'primary',
    size = 'md',
    appearance = 'solid',
    pill = false,
    dot = false,
    icon,
    iconPosition = 'start',
    className = '',
    style,
    'aria-label': ariaLabel,
    'data-testid': dataTestId,
    'data-test': dataTest,
    title,
    id,
    as: Component = 'span',
    onDismiss,
    dismissLabel = 'Remove',
    max,
    invisible = false,
    showZero = true,
    animated = false,
  }: BadgeProps,
  ref: React.ForwardedRef<HTMLSpanElement | HTMLDivElement>
): React.JSX.Element | null {
  // ---------------------------------------------------------------------------
  // showZero gate — return null before any hooks that depend on children
  // ---------------------------------------------------------------------------
  const isZeroHidden =
    !showZero && (children === 0 || children === '0');

  // ---------------------------------------------------------------------------
  // Max count truncation
  // ---------------------------------------------------------------------------
  const displayContent = useMemo(() => {
    if (isZeroHidden) return null;
    if (max !== undefined && typeof children === 'number' && children > max) {
      return `${max}+`;
    }
    return children;
  }, [children, max, isZeroHidden]);

  // Determine if badge has visible content
  const hasVisibleContent = useMemo(() => {
    return !!displayContent || !!icon;
  }, [displayContent, icon]);

  // ---------------------------------------------------------------------------
  // Appearance classes
  // ---------------------------------------------------------------------------
  const appearanceClasses = useMemo(() => {
    if (appearance === 'outline') {
      return `border border-${variant} text-${variant} bg-transparent`;
    }
    if (appearance === 'subtle') {
      return `bg-${variant}-subtle text-${variant}-emphasis`;
    }
    // solid (default)
    return `text-bg-${variant}`;
  }, [appearance, variant]);

  // ---------------------------------------------------------------------------
  // Size styles
  // ---------------------------------------------------------------------------
  const sizeClass = safeLookup<string>(SIZE_CLASS_MAP, size, '');
  const sizeStyle = safeLookup<React.CSSProperties>(SIZE_STYLE_MAP, size, {});

  // ---------------------------------------------------------------------------
  // Memoize class name construction
  // ---------------------------------------------------------------------------
  const bootstrapClasses = useMemo(
    () =>
      cn(
        'badge',
        appearanceClasses,
        pill && 'rounded-pill',
        sizeClass,
        invisible && 'dsai-badge-invisible',
        animated && 'dsai-badge-animated',
        className
      ),
    [appearanceClasses, pill, sizeClass, invisible, animated, className]
  );

  // ---------------------------------------------------------------------------
  // Merged styles (size + custom + invisible + animation)
  // ---------------------------------------------------------------------------
  const mergedStyle = useMemo<React.CSSProperties>(() => {
    const base: React.CSSProperties = { ...sizeStyle, ...style };
    if (invisible) {
      base.opacity = 0;
      base.pointerEvents = 'none';
    }
    return base;
  }, [sizeStyle, style, invisible]);

  // ---------------------------------------------------------------------------
  // Dev warning: dot-only badge without aria-label (fires once per mount)
  // ---------------------------------------------------------------------------
  const isDev =
    typeof process !== 'undefined' &&
    // biome-ignore lint/complexity/useLiteralKeys: noPropertyAccessFromIndexSignature requires bracket access
    (process.env?.['NODE_ENV'] === 'development' || process.env?.['NODE_ENV'] === 'test');

  useEffect(() => {
    if (isDev && dot && !hasVisibleContent && !ariaLabel) {
      console.warn(
        'Badge: Dot-only badges must have an aria-label for accessibility. ' +
          'Example: <Badge dot aria-label="Online status" />'
      );
    }
  }, [isDev, dot, hasVisibleContent, ariaLabel]);

  // ---------------------------------------------------------------------------
  // Animation: scale pulse on content change
  // ---------------------------------------------------------------------------
  const badgeRef = useRef<HTMLSpanElement | HTMLDivElement | null>(null);
  const prevContentRef = useRef<React.ReactNode>(displayContent);

  useEffect(() => {
    if (!animated || !badgeRef.current) return;
    if (prevContentRef.current !== displayContent) {
      const el = badgeRef.current;
      el.classList.add('dsai-badge-pulse');
      const handleEnd = (): void => {
        el.classList.remove('dsai-badge-pulse');
        el.removeEventListener('animationend', handleEnd);
      };
      el.addEventListener('animationend', handleEnd);
      prevContentRef.current = displayContent;
    }
  }, [animated, displayContent]);

  // ---------------------------------------------------------------------------
  // showZero: return null after hooks
  // ---------------------------------------------------------------------------
  if (isZeroHidden) return null;

  // ---------------------------------------------------------------------------
  // ARIA
  // ---------------------------------------------------------------------------
  const role = dot && !hasVisibleContent ? 'status' : undefined;
  const ariaProps = role
    ? { role, 'aria-label': ariaLabel }
    : ariaLabel
      ? { 'aria-label': ariaLabel }
      : {};

  // ---------------------------------------------------------------------------
  // Badge content assembly
  // ---------------------------------------------------------------------------
  const iconElement = icon ? (
    <span className="d-inline-flex align-items-center" aria-hidden="true">
      {icon}
    </span>
  ) : null;

  const dotElement = dot ? (
    <span
      className="d-inline-block rounded-circle"
      style={{
        width: '0.5em',
        height: '0.5em',
        backgroundColor: 'currentColor',
        ...(hasVisibleContent ? { marginRight: '0.25em' } : {}),
      }}
      aria-hidden={hasVisibleContent ? 'true' : undefined}
    />
  ) : null;

  const dismissElement = onDismiss ? (
    <button
      type="button"
      className="dsai-badge-dismiss"
      aria-label={dismissLabel}
      onClick={onDismiss}
      style={{
        background: 'none',
        border: 'none',
        color: 'inherit',
        padding: '0 0 0 0.35em',
        cursor: 'pointer',
        fontSize: 'inherit',
        lineHeight: 1,
        opacity: 0.7,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      ×
    </button>
  ) : null;

  const badgeContent = (
    <>
      {dotElement}
      {iconPosition === 'start' && iconElement}
      {iconElement && iconPosition === 'start' && displayContent ? (
        <span style={{ marginLeft: '0.25em' }}>{displayContent}</span>
      ) : iconElement && iconPosition === 'end' && displayContent ? (
        <span style={{ marginRight: '0.25em' }}>{displayContent}</span>
      ) : (
        displayContent
      )}
      {iconPosition === 'end' && iconElement}
      {dismissElement}
    </>
  );

  // ---------------------------------------------------------------------------
  // Ref merging (forward ref + internal animation ref)
  // ---------------------------------------------------------------------------
  const setRefs = (node: HTMLSpanElement | HTMLDivElement | null): void => {
    badgeRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLSpanElement | HTMLDivElement | null>).current = node;
    }
  };

  // ---------------------------------------------------------------------------
  // Render — unified to avoid JSX duplication
  // ---------------------------------------------------------------------------
  const sharedProps = {
    className: bootstrapClasses,
    style: mergedStyle,
    id,
    title,
    'data-testid': dataTestId,
    'data-test': dataTest,
    ...ariaProps,
  };

  if (Component === 'div') {
    return (
      <div ref={setRefs as React.Ref<HTMLDivElement>} {...sharedProps}>
        {badgeContent}
      </div>
    );
  }

  return (
    <span ref={setRefs as React.Ref<HTMLSpanElement>} {...sharedProps}>
      {badgeContent}
    </span>
  );
}

BadgeComponent.displayName = 'Badge';

const BadgeWithRef = forwardRef(BadgeComponent);
BadgeWithRef.displayName = 'Badge';

export const BadgeBase = memo(BadgeWithRef);
BadgeBase.displayName = 'Badge';
