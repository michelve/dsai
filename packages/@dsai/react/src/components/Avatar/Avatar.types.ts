import type { CSSProperties, ReactNode } from 'react';

// =============================================================================
// Size Types
// =============================================================================

/**
 * Avatar size variants
 * Maps to Bootstrap 5 sizing scale with design tokens
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Avatar size mappings in pixels
 * Used for consistent sizing across avatars and groups
 */
export const AVATAR_SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
};

/**
 * Font size mappings for initials based on avatar size
 */
export const AVATAR_FONT_SIZE_MAP: Record<AvatarSize, string> = {
  xs: '0.625rem', // 10px
  sm: '0.75rem', // 12px
  md: '0.875rem', // 14px
  lg: '1rem', // 16px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
};

/**
 * Status indicator size mappings
 */
export const AVATAR_STATUS_SIZE_MAP: Record<AvatarSize, number> = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 16,
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
export const AVATAR_TONE_MAP: Record<AvatarTone, { bg: string; text: string }> = {
  neutral: { bg: 'bg-secondary', text: 'text-white' },
  brand: { bg: 'bg-primary', text: 'text-white' },
  accent: { bg: 'bg-info', text: 'text-white' },
  success: { bg: 'bg-success', text: 'text-white' },
  warning: { bg: 'bg-warning', text: 'text-dark' },
  danger: { bg: 'bg-danger', text: 'text-white' },
  info: { bg: 'bg-info', text: 'text-white' },
  muted: { bg: 'bg-light', text: 'text-dark' },
  inverse: { bg: 'bg-dark', text: 'text-white' },
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
  offline: 'bg-secondary',
  dnd: 'bg-danger',
  unknown: 'bg-secondary',
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
// Safe HTML Attributes
// =============================================================================

/**
 * Safe HTML attributes for Avatar component
 * Whitelists allowed HTML attributes to prevent unrestricted prop spreading
 */
export interface SafeAvatarHTMLAttributes {
  id?: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
  'data-testid'?: string;
  'data-test'?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
  tabIndex?: number;
}

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
