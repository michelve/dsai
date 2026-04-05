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
 * - Compound sub-components: Avatar.Image, Avatar.Fallback, Avatar.Badge, Avatar.Status
 *
 * @see https://getbootstrap.com/docs/5.3/components/
 * @packageDocumentation
 */

import {
  Children,
  forwardRef,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn } from '../../utils';
import { isEnterKey } from '../../utils/keyboard';
import { PersonIcon } from '../Icon';

import { AvatarBadge } from './AvatarBadge';
import { AvatarContext } from './AvatarContext';
import { AvatarFallback } from './AvatarFallback';
import { AvatarImage } from './AvatarImage';
import { AvatarStatus } from './AvatarStatus';
import {
  getFontSize,
  getInitialsFromName,
  getNumericSize,
  getShapeClass,
  getSizeValue,
  getStatusColor,
  getStatusLabel,
  getStatusSize,
  getToneClasses,
  getToneFromName,
} from './avatarUtils';

import type { AvatarContextValue, AvatarImageStatus, AvatarProps, AvatarStatus as AvatarStatusType } from './Avatar.types';
import type React from 'react';

type AvatarElement = HTMLSpanElement | HTMLDivElement | HTMLButtonElement | HTMLAnchorElement;

// =============================================================================
// Helpers to reduce component cognitive complexity
// =============================================================================

interface CompoundChildren {
  image: React.ReactNode | undefined;
  fallback: React.ReactNode | undefined;
  badge: React.ReactNode | undefined;
  status: React.ReactNode | undefined;
}

function findCompoundChild(
  childArray: ReturnType<typeof Children.toArray>,
  displayName: string
): React.ReactNode | undefined {
  return childArray.find(
    (child) =>
      isValidElement(child) &&
      (child.type as { displayName?: string }).displayName === displayName
  );
}

function scanCompoundChildren(children: React.ReactNode): CompoundChildren {
  const childArray = children ? Children.toArray(children) : [];
  return {
    image: findCompoundChild(childArray, 'Avatar.Image'),
    fallback: findCompoundChild(childArray, 'Avatar.Fallback'),
    badge: findCompoundChild(childArray, 'Avatar.Badge'),
    status: findCompoundChild(childArray, 'Avatar.Status'),
  };
}

function buildAriaLabel(
  decorative: boolean,
  ariaLabel: string | undefined,
  name: string | undefined,
  alt: string | undefined,
  status: AvatarStatusType | undefined,
  badgeCount: number | undefined,
  badgeDot: boolean,
): string | undefined {
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
}

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
 *
 * // Compound sub-components
 * <Avatar name="John">
 *   <Avatar.Image src="/john.jpg" alt="John Doe" />
 *   <Avatar.Fallback delayMs={300}>JD</Avatar.Fallback>
 *   <Avatar.Status value="online" />
 * </Avatar>
 * ```
 */
const AvatarRoot = memo(
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
      children,
      delayMs,
      onLoadingStatusChange,
      referrerPolicy,
      crossOrigin,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-hidden': ariaHidden,
      'data-testid': dataTestId,
      'data-test': dataTest,
      tabIndex,
    },
    ref
  ) {
    // Scan children for compound sub-components (per-slot override)
    const { image: compoundImage, fallback: compoundFallback, badge: compoundBadge, status: compoundStatus } = scanCompoundChildren(children);

    // Track image loading status
    const [imageStatus, setImageStatus] = useState<AvatarImageStatus>(() =>
      src ? 'loading' : 'idle'
    );
    const imageRef = useRef<HTMLImageElement | null>(null);

    // Fire onLoadingStatusChange on transitions
    const prevStatusRef = useRef<AvatarImageStatus>(src ? 'loading' : 'idle');
    useEffect(() => {
      if (imageStatus !== prevStatusRef.current) {
        prevStatusRef.current = imageStatus;
        onLoadingStatusChange?.(imageStatus);
      }
    }, [imageStatus, onLoadingStatusChange]);

    // Reset status when src changes — derive synchronously to avoid cascading renders
    // Uses state (not ref) to track previous value per React recommended pattern
    const [prevSrc, setPrevSrc] = useState(src);
    if (prevSrc !== src) {
      setPrevSrc(src);
      setImageStatus(src ? 'loading' : 'idle');
    }

    const imageLoaded = imageStatus === 'loaded';
    const imageError = imageStatus === 'error';

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

    // delayMs for flat API (compound child handles its own delay)
    const effectiveDelayMs = compoundFallback ? undefined : delayMs;
    const [delayElapsed, setDelayElapsed] = useState(
      effectiveDelayMs === undefined || effectiveDelayMs === 0
    );

    // Synchronize delayElapsed when effectiveDelayMs changes
    const [prevEffectiveDelayMs, setPrevEffectiveDelayMs] = useState(effectiveDelayMs);
    if (prevEffectiveDelayMs !== effectiveDelayMs) {
      setPrevEffectiveDelayMs(effectiveDelayMs);
      if (effectiveDelayMs === undefined || effectiveDelayMs === 0) {
        setDelayElapsed(true);
      }
    }

    useEffect(() => {
      if (effectiveDelayMs === undefined || effectiveDelayMs === 0) {
        return undefined;
      }
      const timer = window.setTimeout(() => setDelayElapsed(true), effectiveDelayMs);
      return () => window.clearTimeout(timer);
    }, [effectiveDelayMs]);

    // Memoize container styles
    const containerStyle = useMemo(
      () => ({
        width: sizeValue,
        height: sizeValue,
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
        if (interactive && (isEnterKey(event) || event.key === ' ')) {
          event.preventDefault(); // Prevent scroll on Space
          onClick?.(event as unknown as React.MouseEvent);
        }
        onKeyDown?.(event);
      },
      [interactive, onClick, onKeyDown]
    );

    // Build aria-label for accessibility
    const computedAriaLabel = useMemo(
      () => buildAriaLabel(decorative, ariaLabel, name, alt, status, badgeCount, badgeDot),
      [decorative, ariaLabel, name, alt, status, badgeCount, badgeDot]
    );

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
      const defaultIconSize = Math.floor(getNumericSize(size) * 0.5);
      return (
        <span className="dsai-avatar__icon" role="img" aria-label="Default avatar icon">
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
        width: statusSize,
        height: statusSize,
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

    // Render main avatar content (image, fallback, or skeleton)
    const renderMainContent = (): React.ReactNode => {
      if (isLoading) {
        return renderSkeleton();
      }
      if (compoundImage) {
        return compoundImage;
      }
      if (showImage) {
        return (
          <img
            ref={imageRef}
            src={src}
            alt={decorative ? '' : (alt ?? name ?? undefined)}
            srcSet={srcSet}
            sizes={sizes}
            loading={loading}
            referrerPolicy={referrerPolicy}
            crossOrigin={crossOrigin}
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
        );
      }
      if (compoundFallback) {
        return compoundFallback;
      }
      return delayElapsed && renderFallbackContent();
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
        setImageStatus('loaded');
        onLoad?.(event as unknown as React.SyntheticEvent<HTMLImageElement>);
      };

      const handleErrorEvent = (event: Event): void => {
        setImageStatus('error');
        onError?.(event as unknown as React.SyntheticEvent<HTMLImageElement>);
      };

      imgEl.addEventListener('load', handleLoadEvent);
      imgEl.addEventListener('error', handleErrorEvent);

      return () => {
        imgEl.removeEventListener('load', handleLoadEvent);
        imgEl.removeEventListener('error', handleErrorEvent);
      };
    }, [onError, onLoad]);

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

    // Build context value for compound sub-components
    const contextValue = useMemo<AvatarContextValue>(
      () => ({
        size,
        shape: shape ?? 'circle',
        tone,
        imageStatus,
      }),
      [size, shape, tone, imageStatus]
    );

    return (
      <Component
        ref={ref as React.Ref<AvatarElement>}
        {...(baseContainerProps as Record<string, unknown>)}
        {...(interactiveProps as Record<string, unknown>)}
      >
        <AvatarContext.Provider value={contextValue}>
          {renderMainContent()}

          {compoundStatus ?? renderStatus()}
          {compoundBadge ?? renderBadge()}
        </AvatarContext.Provider>
      </Component>
    );
  })
);

AvatarRoot.displayName = 'Avatar';

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Badge: AvatarBadge,
  Status: AvatarStatus,
});
