/**
 * Avatar Component
 *
 * A versatile avatar component supporting images, initials, icons, status indicators,
 * and notification badges. Built with Bootstrap 5 classes and WCAG 2.2 AA compliance.
 *
 * Features:
 * - Image with fallback chain: image → custom fallback → initials → icon → default
 * - Deterministic background colors from name hash
 * - Presence status indicators (online, busy, away, offline, dnd)
 * - Notification badges with count or dot
 * - Interactive mode with focus ring and selection state
 * - Accessible labeling and keyboard navigation
 *
 * @see https://getbootstrap.com/docs/5.3/components/
 * @packageDocumentation
 */

import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '../../utils';
import { isEnterKey } from '../../utils/keyboard';
import { PersonIcon } from '../Icon';

import {
  AVATAR_FONT_SIZE_MAP,
  AVATAR_HASH_COLORS,
  AVATAR_SIZE_MAP,
  AVATAR_STATUS_COLOR_MAP,
  AVATAR_STATUS_LABEL_MAP,
  AVATAR_STATUS_SIZE_MAP,
  AVATAR_TONE_MAP,
} from './Avatar.types';

import type { AvatarProps, AvatarSize, AvatarStatus, AvatarTone } from './Avatar.types';
import type React from 'react';

type AvatarElement = HTMLSpanElement | HTMLDivElement | HTMLButtonElement | HTMLAnchorElement;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Generates a simple hash from a string
 * Used for deterministic color selection based on name
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Gets deterministic tone based on name hash
 */
function getToneFromName(name: string): AvatarTone {
  const hash = hashString(name);
  const index = hash % AVATAR_HASH_COLORS.length;
  const safeIndex = Math.min(Math.max(index, 0), AVATAR_HASH_COLORS.length - 1);
  if (safeIndex === 0) {
    return 'brand';
  }
  if (safeIndex === 1) {
    return 'accent';
  }
  if (safeIndex === 2) {
    return 'success';
  }
  if (safeIndex === 3) {
    return 'warning';
  }
  if (safeIndex === 4) {
    return 'danger';
  }
  if (safeIndex === 5) {
    return 'info';
  }
  if (safeIndex === 6) {
    return 'neutral';
  }
  return 'inverse';
}

/**
 * Extracts initials from a name string
 * Returns up to 2 characters (first letter of first and last name)
 */
function getInitialsFromName(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '';
  }

  const [firstPart = '', secondPart = ''] = parts;

  if (parts.length === 1) {
    // Single word: take first two characters or just first
    return firstPart.substring(0, 2).toUpperCase();
  }

  // Multiple words: first letter of first and last word
  const lastPart = parts[parts.length - 1] ?? secondPart;
  const first = firstPart[0] ?? '';
  const last = lastPart[0] ?? '';
  return (first + last).toUpperCase();
}

/**
 * Gets shape class based on shape prop
 */
function getShapeClass(shape: AvatarProps['shape']): string {
  if (shape === 'square') {
    return '';
  }
  if (shape === 'rounded') {
    return 'rounded-3';
  }
  return 'rounded-circle';
}

/**
 * Safe lookup helpers to avoid object injection lint warnings
 */
function getSizeValue(size: AvatarSize): number {
  if (size === 'xs') {
    return AVATAR_SIZE_MAP.xs;
  }
  if (size === 'sm') {
    return AVATAR_SIZE_MAP.sm;
  }
  if (size === 'md') {
    return AVATAR_SIZE_MAP.md;
  }
  if (size === 'lg') {
    return AVATAR_SIZE_MAP.lg;
  }
  if (size === 'xl') {
    return AVATAR_SIZE_MAP.xl;
  }
  return AVATAR_SIZE_MAP['2xl'];
}

function getFontSize(size: AvatarSize): string {
  if (size === 'xs') {
    return AVATAR_FONT_SIZE_MAP.xs;
  }
  if (size === 'sm') {
    return AVATAR_FONT_SIZE_MAP.sm;
  }
  if (size === 'md') {
    return AVATAR_FONT_SIZE_MAP.md;
  }
  if (size === 'lg') {
    return AVATAR_FONT_SIZE_MAP.lg;
  }
  if (size === 'xl') {
    return AVATAR_FONT_SIZE_MAP.xl;
  }
  return AVATAR_FONT_SIZE_MAP['2xl'];
}

function getStatusSize(size: AvatarSize): number {
  if (size === 'xs') {
    return AVATAR_STATUS_SIZE_MAP.xs;
  }
  if (size === 'sm') {
    return AVATAR_STATUS_SIZE_MAP.sm;
  }
  if (size === 'md') {
    return AVATAR_STATUS_SIZE_MAP.md;
  }
  if (size === 'lg') {
    return AVATAR_STATUS_SIZE_MAP.lg;
  }
  if (size === 'xl') {
    return AVATAR_STATUS_SIZE_MAP.xl;
  }
  return AVATAR_STATUS_SIZE_MAP['2xl'];
}

function getToneClasses(tone: AvatarTone): { bg: string; text: string } {
  if (tone === 'neutral') {
    return AVATAR_TONE_MAP.neutral;
  }
  if (tone === 'brand') {
    return AVATAR_TONE_MAP.brand;
  }
  if (tone === 'accent') {
    return AVATAR_TONE_MAP.accent;
  }
  if (tone === 'success') {
    return AVATAR_TONE_MAP.success;
  }
  if (tone === 'warning') {
    return AVATAR_TONE_MAP.warning;
  }
  if (tone === 'danger') {
    return AVATAR_TONE_MAP.danger;
  }
  if (tone === 'info') {
    return AVATAR_TONE_MAP.info;
  }
  if (tone === 'muted') {
    return AVATAR_TONE_MAP.muted;
  }
  return AVATAR_TONE_MAP.inverse;
}

function getStatusLabel(status: AvatarStatus): string {
  if (status === 'online') {
    return AVATAR_STATUS_LABEL_MAP.online;
  }
  if (status === 'busy') {
    return AVATAR_STATUS_LABEL_MAP.busy;
  }
  if (status === 'away') {
    return AVATAR_STATUS_LABEL_MAP.away;
  }
  if (status === 'offline') {
    return AVATAR_STATUS_LABEL_MAP.offline;
  }
  if (status === 'dnd') {
    return AVATAR_STATUS_LABEL_MAP.dnd;
  }
  return AVATAR_STATUS_LABEL_MAP.unknown;
}

function getStatusColor(status: AvatarStatus): string {
  if (status === 'online') {
    return AVATAR_STATUS_COLOR_MAP.online;
  }
  if (status === 'busy') {
    return AVATAR_STATUS_COLOR_MAP.busy;
  }
  if (status === 'away') {
    return AVATAR_STATUS_COLOR_MAP.away;
  }
  if (status === 'offline') {
    return AVATAR_STATUS_COLOR_MAP.offline;
  }
  if (status === 'dnd') {
    return AVATAR_STATUS_COLOR_MAP.dnd;
  }
  return AVATAR_STATUS_COLOR_MAP.unknown;
}

/**
 * Default user icon SVG (silhouette)
 */
// =============================================================================
// Avatar Component
// =============================================================================

/**
 * Avatar component for displaying user images, initials, or icons
 *
 * @example
 * ```tsx
 * // Image avatar
 * <Avatar src="/user.jpg" alt="John Doe" size="md" />
 *
 * // Initials avatar with deterministic color
 * <Avatar name="John Doe" size="lg" />
 *
 * // Avatar with status indicator
 * <Avatar src="/user.jpg" alt="Jane" status="online" />
 *
 * // Interactive avatar button
 * <Avatar name="User" interactive onClick={() => openProfile()} />
 *
 * // Loading state
 * <Avatar isLoading size="md" />
 * ```
 */
export const Avatar = memo(
  forwardRef<AvatarElement, AvatarProps>(function Avatar(
    {
      src,
      alt,
      srcSet,
      sizes,
      name,
      initials: initialsProp,
      icon,
      fallback,
      shape = 'circle',
      size = 'md',
      tone: toneProp,
      status,
      statusPosition = 'bottom-right',
      interactive = false,
      selected = false,
      badgeCount,
      badgeDot = false,
      loading = 'eager',
      isLoading = false,
      decorative = false,
      as = 'span',
      href,
      onClick,
      onKeyDown,
      onError,
      onLoad,
      className,
      style,
      id,
      title,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-hidden': ariaHidden,
      'data-testid': dataTestId,
      'data-test': dataTest,
      tabIndex,
    },
    ref
  ) {
    // Track image loading state keyed by src
    const [imageState, setImageState] = useState<{ loadedSrc?: string; errorSrc?: string }>(
      () => ({})
    );
    const imageRef = useRef<HTMLImageElement | null>(null);
    const srcKey = src ?? '';
    const imageLoaded = imageState.loadedSrc === srcKey;
    const imageError = imageState.errorSrc === srcKey;

    // Determine if we should show image
    const showImage = src && !imageError && !isLoading;

    // Calculate initials
    const initials = useMemo(() => {
      if (initialsProp) {
        return initialsProp.substring(0, 2).toUpperCase();
      }
      if (name) {
        return getInitialsFromName(name);
      }
      return '';
    }, [initialsProp, name]);

    // Determine tone (explicit or derived from name)
    const tone = useMemo(() => {
      if (toneProp) {
        return toneProp;
      }
      if (name) {
        return getToneFromName(name);
      }
      return 'neutral';
    }, [toneProp, name]);

    // Get tone classes
    const toneClasses = getToneClasses(tone);

    // Calculate size values
    const sizeValue = getSizeValue(size);
    const fontSize = getFontSize(size);
    const statusSize = getStatusSize(size);

    // Memoize container styles
    const containerStyle = useMemo(
      () => ({
        width: `${sizeValue}px`,
        height: `${sizeValue}px`,
        fontSize,
        ...style,
      }),
      [sizeValue, fontSize, style]
    );

    // Memoize class names
    const containerClasses = useMemo(
      () =>
        cn(
          'dsai-avatar',
          'd-inline-flex',
          'align-items-center',
          'justify-content-center',
          'position-relative',
          'flex-shrink-0',
          getShapeClass(shape),
          // Background and text color for non-image avatars
          !showImage && toneClasses.bg,
          !showImage && toneClasses.text,
          // Interactive styles
          interactive && 'dsai-avatar--interactive',
          interactive && 'cursor-pointer',
          // Selection ring
          selected && 'dsai-avatar--selected',
          selected && 'ring-2',
          selected && 'ring-primary',
          // Loading skeleton
          isLoading && 'dsai-avatar--loading',
          className
        ),
      [shape, showImage, toneClasses, interactive, selected, isLoading, className]
    );

    // Handle keyboard interaction
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (interactive && isEnterKey(event)) {
          onClick?.(event as unknown as React.MouseEvent);
        }
        onKeyDown?.(event);
      },
      [interactive, onClick, onKeyDown]
    );

    // Build aria-label for accessibility
    const computedAriaLabel = useMemo(() => {
      if (decorative) {
        return undefined;
      }
      if (ariaLabel) {
        return ariaLabel;
      }
      const parts: string[] = [];
      if (name) {
        parts.push(name);
      } else if (alt) {
        parts.push(alt);
      }
      if (status) {
        parts.push(getStatusLabel(status));
      }
      if (badgeCount !== undefined) {
        parts.push(`${badgeCount} notifications`);
      } else if (badgeDot) {
        parts.push('notification');
      }
      return parts.length > 0 ? parts.join(', ') : undefined;
    }, [decorative, ariaLabel, name, alt, status, badgeCount, badgeDot]);

    // Determine element type
    const Component = as as React.ElementType;
    const isButton = as === 'button' || interactive;
    const isLink = as === 'a' && href;

    // Build accessibility attributes
    const accessibilityProps = useMemo(() => {
      const props: Record<string, unknown> = {};

      if (decorative || ariaHidden === true || ariaHidden === 'true') {
        props['aria-hidden'] = true;
      } else {
        if (computedAriaLabel) {
          props['aria-label'] = computedAriaLabel;
        }
        if (ariaDescribedBy) {
          props['aria-describedby'] = ariaDescribedBy;
        }
        if (isButton && selected) {
          props['aria-pressed'] = selected;
        }
        if (isLoading) {
          props['aria-busy'] = true;
        }
      }

      return props;
    }, [decorative, ariaHidden, computedAriaLabel, ariaDescribedBy, isButton, selected, isLoading]);

    // Determine fallback content to render
    const renderFallbackContent = (): React.ReactNode => {
      // Priority: custom fallback → initials → icon → default icon
      if (fallback) {
        return fallback;
      }
      if (initials) {
        return (
          <span className="dsai-avatar__initials fw-semibold" aria-hidden="true">
            {initials}
          </span>
        );
      }
      if (icon) {
        return (
          <span className="dsai-avatar__icon" aria-hidden="true">
            {icon}
          </span>
        );
      }
      const defaultIconSize = Math.floor(sizeValue * 0.5);
      return (
        <span className="dsai-avatar__icon" aria-hidden="true">
          <PersonIcon size={defaultIconSize} aria-hidden />
        </span>
      );
    };

    // Render status indicator
    const renderStatus = (): React.ReactNode => {
      if (!status) {
        return null;
      }

      const statusClasses = cn(
        'dsai-avatar__status',
        'position-absolute',
        'rounded-circle',
        'border',
        'border-2',
        'border-white',
        getStatusColor(status),
        statusPosition === 'bottom-left' ? 'start-0' : 'end-0',
        'bottom-0'
      );

      const statusStyle = {
        width: `${statusSize}px`,
        height: `${statusSize}px`,
        zIndex: 1,
        transform:
          statusPosition === 'bottom-left' ? 'translate(-25%, 25%)' : 'translate(25%, 25%)',
      };

      return (
        <span
          className={statusClasses}
          style={statusStyle}
          aria-hidden="true"
          data-status={status}
        />
      );
    };

    // Render badge
    const renderBadge = (): React.ReactNode => {
      if (badgeCount === undefined && !badgeDot) {
        return null;
      }

      const badgeClasses = cn(
        'dsai-avatar__badge',
        'position-absolute',
        'top-0',
        'end-0',
        'badge',
        'rounded-pill',
        'bg-danger',
        'text-white'
      );

      // Badge positioning style - offset outside the avatar circle and ensure z-index
      const badgeStyle = {
        zIndex: 1,
        transform: 'translate(25%, -25%)',
      };

      // Count takes priority over dot
      if (badgeCount !== undefined) {
        const displayCount = badgeCount > 99 ? '99+' : badgeCount;

        return (
          <span
            className={badgeClasses}
            style={{
              ...badgeStyle,
              fontSize: '0.625rem',
              minWidth: '1rem',
              padding: '0.15rem 0.35rem',
            }}
            aria-hidden="true"
            data-testid="avatar-badge-count"
          >
            {displayCount}
          </span>
        );
      }

      // Dot badge (only if no count)
      return (
        <span
          className={cn(badgeClasses, 'p-1')}
          style={badgeStyle}
          aria-hidden="true"
          data-testid="avatar-badge-dot"
        />
      );
    };

    // Render loading skeleton
    const renderSkeleton = (): React.ReactNode => {
      return (
        <div
          className="dsai-avatar__skeleton w-100 h-100 placeholder-glow"
          aria-hidden="true"
          data-testid="avatar-skeleton"
        >
          <span className="placeholder w-100 h-100 rounded-circle" />
        </div>
      );
    };

    useEffect(() => {
      const imgEl = imageRef.current;
      if (!imgEl) {
        return undefined;
      }

      const handleLoadEvent = (event: Event): void => {
        setImageState((prev) => ({
          ...prev,
          loadedSrc: srcKey,
          errorSrc: prev.errorSrc === srcKey ? undefined : prev.errorSrc,
        }));
        onLoad?.(event as unknown as React.SyntheticEvent<HTMLImageElement>);
      };

      const handleErrorEvent = (event: Event): void => {
        setImageState((prev) => ({
          ...prev,
          errorSrc: srcKey,
          loadedSrc: prev.loadedSrc === srcKey ? undefined : prev.loadedSrc,
        }));
        onError?.(event as unknown as React.SyntheticEvent<HTMLImageElement>);
      };

      imgEl.addEventListener('load', handleLoadEvent);
      imgEl.addEventListener('error', handleErrorEvent);

      return () => {
        imgEl.removeEventListener('load', handleLoadEvent);
        imgEl.removeEventListener('error', handleErrorEvent);
      };
    }, [onError, onLoad, srcKey]);

    // Determine the role for the container
    // - button: when interactive and not a semantic button/link
    // - img: when non-interactive span with aria-label (accessibility requirement)
    const containerRole = useMemo(() => {
      if (isButton && as !== 'button') {
        return 'button';
      }
      // Add role="img" to span elements with aria-label for accessibility
      if (as === 'span' && !interactive && computedAriaLabel && !decorative) {
        return 'img';
      }
      return undefined;
    }, [isButton, as, interactive, computedAriaLabel, decorative]);

    // Common props for the container element
    const baseContainerProps = {
      id,
      className: containerClasses,
      style: containerStyle,
      title,
      role: containerRole,
      href: isLink ? href : undefined,
      'data-testid': dataTestId,
      'data-test': dataTest,
      'data-size': size,
      'data-shape': shape,
      ...accessibilityProps,
    };

    const interactiveProps = interactive
      ? {
          onClick,
          onKeyDown: handleKeyDown,
          tabIndex: tabIndex ?? 0,
          role: containerRole ?? 'button',
        }
      : { tabIndex };

    return (
      <Component
        ref={ref as React.Ref<AvatarElement>}
        {...(baseContainerProps as Record<string, unknown>)}
        {...(interactiveProps as Record<string, unknown>)}
      >
        {isLoading ? (
          renderSkeleton()
        ) : showImage ? (
          <img
            ref={imageRef}
            src={src}
            alt={decorative ? '' : (alt ?? name ?? undefined)}
            srcSet={srcSet}
            sizes={sizes}
            loading={loading}
            className={cn(
              'dsai-avatar__image',
              'w-100',
              'h-100',
              'object-fit-cover',
              getShapeClass(shape),
              !imageLoaded && 'opacity-0'
            )}
            aria-hidden={decorative ? true : undefined}
            data-testid="avatar-image"
          />
        ) : (
          renderFallbackContent()
        )}

        {renderStatus()}
        {renderBadge()}
      </Component>
    );
  })
);

Avatar.displayName = 'Avatar';
