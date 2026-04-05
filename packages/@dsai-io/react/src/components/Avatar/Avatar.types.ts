import type { ExtendedSize, SafeHTMLAttributes } from '../../types';
import type { ReactNode } from 'react';

// =============================================================================
// Size Types
// =============================================================================

/**
 * Avatar size variants
 * Maps to Bootstrap 5 sizing scale with design tokens
 * @see ExtendedSize
 */
export type AvatarSize = ExtendedSize;

/**
 * Avatar size mappings (CSS vars with fallback) for consistent sizing.
 * Values prefer CSS custom properties from the design tokens theme and fall back to px/rem literals.
 */
export const AVATAR_SIZE_MAP: Record<AvatarSize, string> = {
  xs: 'var(--dsai-avatar-size-xs, 24px)',
  sm: 'var(--dsai-avatar-size-sm, 32px)',
  md: 'var(--dsai-avatar-size-md, 40px)',
  lg: 'var(--dsai-avatar-size-lg, 48px)',
  xl: 'var(--dsai-avatar-size-xl, 64px)',
  '2xl': 'var(--dsai-avatar-size-2xl, 80px)',
  xxl: 'var(--dsai-avatar-size-xxl, 96px)',
};

/**
 * Font size mappings for initials (CSS vars with fallback)
 */
export const AVATAR_FONT_SIZE_MAP: Record<AvatarSize, string> = {
  xs: 'var(--dsai-avatar-font-size-xs, 0.625rem)', // 10px
  sm: 'var(--dsai-avatar-font-size-sm, 0.75rem)', // 12px
  md: 'var(--dsai-avatar-font-size-md, 0.875rem)', // 14px
  lg: 'var(--dsai-avatar-font-size-lg, 1rem)', // 16px
  xl: 'var(--dsai-avatar-font-size-xl, 1.25rem)', // 20px
  '2xl': 'var(--dsai-avatar-font-size-2xl, 1.5rem)', // 24px
  xxl: 'var(--dsai-avatar-font-size-xxl, 1.75rem)', // 28px
};

/**
 * Status indicator size mappings (CSS vars with fallback)
 */
export const AVATAR_STATUS_SIZE_MAP: Record<AvatarSize, string> = {
  xs: 'var(--dsai-avatar-status-size-xs, 6px)',
  sm: 'var(--dsai-avatar-status-size-sm, 8px)',
  md: 'var(--dsai-avatar-status-size-md, 10px)',
  lg: 'var(--dsai-avatar-status-size-lg, 12px)',
  xl: 'var(--dsai-avatar-status-size-xl, 14px)',
  '2xl': 'var(--dsai-avatar-status-size-2xl, 16px)',
  xxl: 'var(--dsai-avatar-status-size-xxl, 18px)',
};

// =============================================================================
// Shape Types
// =============================================================================

/**
 * Avatar shape variants
 */
export type AvatarShape = 'circle' | 'rounded' | 'square';

// =============================================================================
// Tone Types
// =============================================================================

/**
 * Avatar background tone/color variants
 * Used for initials and icon backgrounds when no image is provided
 */
export type AvatarTone =
  | 'neutral'
  | 'brand'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'muted'
  | 'inverse';

/**
 * Maps tone to Bootstrap 5 background and text classes
 */
const TEXT_WHITE = 'text-white';
const TEXT_DARK = 'text-dark';
const BG_SECONDARY = 'bg-secondary';

export const AVATAR_TONE_MAP: Record<AvatarTone, { bg: string; text: string }> = {
  neutral: { bg: BG_SECONDARY, text: TEXT_WHITE },
  brand: { bg: 'bg-primary', text: TEXT_WHITE },
  accent: { bg: 'bg-info', text: TEXT_WHITE },
  success: { bg: 'bg-success', text: TEXT_WHITE },
  warning: { bg: 'bg-warning', text: TEXT_DARK },
  danger: { bg: 'bg-danger', text: TEXT_WHITE },
  info: { bg: 'bg-info', text: TEXT_WHITE },
  muted: { bg: 'bg-light', text: TEXT_DARK },
  inverse: { bg: 'bg-dark', text: TEXT_WHITE },
};

// =============================================================================
// Status Types
// =============================================================================

/**
 * Avatar presence status values
 */
export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline' | 'dnd' | 'unknown';

/**
 * Status position options
 */
export type AvatarStatusPosition = 'bottom-right' | 'bottom-left';

/**
 * Maps status to Bootstrap 5 background classes
 */
export const AVATAR_STATUS_COLOR_MAP: Record<AvatarStatus, string> = {
  online: 'bg-success',
  busy: 'bg-danger',
  away: 'bg-warning',
  offline: BG_SECONDARY,
  dnd: 'bg-danger',
  unknown: BG_SECONDARY,
};

/**
 * Maps status to accessible labels
 */
export const AVATAR_STATUS_LABEL_MAP: Record<AvatarStatus, string> = {
  online: 'Online',
  busy: 'Busy',
  away: 'Away',
  offline: 'Offline',
  dnd: 'Do not disturb',
  unknown: 'Status unknown',
};

// =============================================================================
// Image Loading Status
// =============================================================================

/**
 * Granular image loading status for onLoadingStatusChange callback.
 */
export type AvatarImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

// =============================================================================
// Safe HTML Attributes
// =============================================================================

/**
 * Safe HTML attributes for Avatar component
 * Whitelists allowed HTML attributes to prevent unrestricted prop spreading
 * @see {@link SafeHTMLAttributes}
 */
export type SafeAvatarHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

// =============================================================================
// Avatar Props
// =============================================================================

/**
 * Avatar component props
 *
 * @example
 * ```tsx
 * // Image avatar
 * <Avatar src="/user.jpg" alt="John Doe" size="md" />
 *
 * // Initials avatar
 * <Avatar name="John Doe" size="lg" tone="brand" />
 *
 * // Avatar with status
 * <Avatar src="/user.jpg" alt="Jane" status="online" />
 *
 * // Interactive avatar
 * <Avatar name="User" interactive onClick={() => openProfile()} />
 * ```
 */
export interface AvatarProps extends SafeAvatarHTMLAttributes {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alternative text for image (required for accessible images)
   * If decorative, set to empty string and use aria-hidden
   */
  alt?: string;

  /**
   * Source set for responsive images
   */
  srcSet?: string;

  /**
   * Sizes attribute for responsive images
   */
  sizes?: string;

  /**
   * User's full name for deriving initials
   */
  name?: string;

  /**
   * Explicit initials to display (overrides name-derived initials)
   * Max 2 characters recommended
   */
  initials?: string;

  /**
   * Custom icon to display when no image or initials
   */
  icon?: ReactNode;

  /**
   * Custom fallback content when image fails and no initials
   */
  fallback?: ReactNode;

  /**
   * Avatar shape
   * @default 'circle'
   */
  shape?: AvatarShape;

  /**
   * Avatar size
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Background tone/color for non-image avatars
   * If not provided and name is given, uses deterministic color from name hash
   */
  tone?: AvatarTone;

  /**
   * Presence status indicator
   */
  status?: AvatarStatus;

  /**
   * Position of status indicator
   * @default 'bottom-right'
   */
  statusPosition?: AvatarStatusPosition;

  /**
   * Whether avatar is interactive (clickable/focusable)
   * @default false
   */
  interactive?: boolean;

  /**
   * Whether avatar is selected (for toggle/selection states)
   * Only applies when interactive is true
   * @default false
   */
  selected?: boolean;

  /**
   * Notification badge count
   * Displays as number, or "99+" if > 99
   */
  badgeCount?: number;

  /**
   * Show notification dot instead of count
   */
  badgeDot?: boolean;

  /**
   * Image loading strategy
   * @default 'eager'
   */
  loading?: 'eager' | 'lazy';

  /**
   * Show loading/skeleton state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Mark avatar as purely decorative (hides from AT)
   * @default false
   */
  decorative?: boolean;

  /**
   * Element to render as
   * @default 'span'
   */
  as?: 'span' | 'div' | 'button' | 'a';

  /**
   * Link href (when as="a")
   */
  href?: string;

  /**
   * Click handler (for interactive avatars)
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Keyboard handler
   */
  onKeyDown?: (event: React.KeyboardEvent) => void;

  /**
   * Image error handler
   */
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;

  /**
   * Image load handler
   */
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;

  /**
   * Children for compound sub-components (Avatar.Image, Avatar.Fallback, etc.)
   * When compound children are present, they override their corresponding flat prop slot.
   */
  children?: ReactNode;

  /**
   * Delay (ms) before showing fallback content.
   * Prevents flash of initials/icon when images load quickly.
   */
  delayMs?: number;

  /**
   * Callback fired on every image loading state transition.
   * Provides granular idle → loading → loaded/error tracking.
   */
  onLoadingStatusChange?: (status: AvatarImageStatus) => void;

  /**
   * Referrer policy for the image element.
   * Controls the Referer header sent with image requests.
   */
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;

  /**
   * Cross-origin setting for the image element.
   * Controls CORS for images loaded from external CDNs.
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
}

// =============================================================================
// Compound Sub-Component Props
// =============================================================================

/**
 * Props for Avatar.Image compound sub-component.
 * Allows custom image elements (e.g., Next.js Image).
 */
export interface AvatarImageProps {
  src?: string;
  alt?: string;
  srcSet?: string;
  sizes?: string;
  loading?: 'eager' | 'lazy';
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  children?: ReactNode;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props for Avatar.Fallback compound sub-component.
 */
export interface AvatarFallbackProps {
  delayMs?: number;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props for Avatar.Badge compound sub-component.
 */
export interface AvatarBadgeProps {
  count?: number;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props for Avatar.Status compound sub-component.
 */
export interface AvatarStatusProps {
  value: AvatarStatus;
  position?: AvatarStatusPosition;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Context value shared from Avatar root to compound children.
 */
export interface AvatarContextValue {
  size: AvatarSize;
  shape: AvatarShape;
  tone: AvatarTone;
  imageStatus: AvatarImageStatus;
}

// =============================================================================
// AvatarGroup Types
// =============================================================================

/**
 * Avatar group layout variants
 */
export type AvatarGroupLayout = 'stacked' | 'inline';

/**
 * Spacing between avatars in group
 */
export type AvatarGroupSpacing = 'compact' | 'normal' | 'loose';

/**
 * Default overlap ratios for stacked layout (percentage of avatar size)
 */
export const AVATAR_GROUP_OVERLAP_MAP: Record<AvatarGroupSpacing, string> = {
  compact: 'var(--dsai-avatar-overlap-compact, 0.4)',
  normal: 'var(--dsai-avatar-overlap-normal, 0.3)',
  loose: 'var(--dsai-avatar-overlap-loose, 0.2)',
};

/**
 * Default gaps for inline layout (rem units)
 */
export const AVATAR_GROUP_GAP_MAP: Record<AvatarGroupSpacing, string> = {
  compact: 'var(--dsai-avatar-gap-compact, 0.25rem)',
  normal: 'var(--dsai-avatar-gap-normal, 0.5rem)',
  loose: 'var(--dsai-avatar-gap-loose, 0.75rem)',
};

/**
 * Avatar group props
 *
 * @example
 * ```tsx
 * // Stacked avatar group with overflow
 * <AvatarGroup maxVisible={3}>
 *   <Avatar src="/user1.jpg" alt="User 1" />
 *   <Avatar src="/user2.jpg" alt="User 2" />
 *   <Avatar src="/user3.jpg" alt="User 3" />
 *   <Avatar src="/user4.jpg" alt="User 4" />
 * </AvatarGroup>
 *
 * // Inline layout
 * <AvatarGroup layout="inline" spacing="normal">
 *   <Avatar name="Alice" />
 *   <Avatar name="Bob" />
 * </AvatarGroup>
 * ```
 */
export interface AvatarGroupProps extends SafeAvatarHTMLAttributes {
  /**
   * Avatar children
   */
  children: ReactNode;

  /**
   * Maximum number of avatars to show before overflow
   * Remaining avatars shown as "+N" chip
   */
  maxVisible?: number;

  /**
   * Layout style
   * @default 'stacked'
   */
  layout?: AvatarGroupLayout;

  /**
   * Spacing between avatars
   * @default 'normal'
   */
  spacing?: AvatarGroupSpacing;

  /**
   * Default size for child avatars (can be overridden per avatar)
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Default shape for child avatars (can be overridden per avatar)
   * @default 'circle'
   */
  shape?: AvatarShape;

  /**
   * Default tone for child avatars (can be overridden per avatar)
   */
  tone?: AvatarTone;

  /**
   * Custom label for overflow chip
   * If not provided, defaults to names of hidden users or "+N"
   */
  overflowLabel?: string;

  /**
   * Show tooltip on overflow chip with hidden user names
   * @default true
   */
  showOverflowTooltip?: boolean;

  /**
   * Server-side total count, independent of rendered children.
   * When set, overflow chip shows +(total - visibleCount).
   */
  total?: number;

  /**
   * Custom render function for the overflow chip.
   * Receives surplus count, returns custom ReactNode.
   */
  renderSurplus?: (surplusCount: number) => ReactNode;

  /**
   * Click handler for the default overflow chip.
   * Ignored when renderSurplus is provided.
   */
  onOverflowClick?: (event: React.MouseEvent) => void;

  /**
   * Controls which avatar appears on top in stacked layout.
   * @default 'lastOnTop'
   */
  stackingOrder?: 'firstOnTop' | 'lastOnTop';
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Deterministic color mapping for name-based backgrounds
 * Uses hash of name to select consistent color
 */
export const AVATAR_HASH_COLORS: AvatarTone[] = [
  'brand',
  'accent',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
  'inverse',
];
