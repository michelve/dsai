/**
 * AvatarGroup Component
 *
 * A container component for displaying multiple avatars in stacked or inline layouts.
 * Supports overflow with "+N" chip and accessible labeling for truncated members.
 *
 * Features:
 * - Stacked (overlapping) and inline (spaced) layouts
 * - Max visible avatars with overflow chip
 * - Inherited size, shape, and tone defaults
 * - Accessible labeling for hidden avatars
 * - Keyboard navigable overflow chip
 *
 * @see https://getbootstrap.com/docs/5.3/components/
 * @packageDocumentation
 */

import { Children, cloneElement, forwardRef, isValidElement, memo, useMemo } from 'react';

import { cn } from '../../utils';

import {
  AVATAR_GROUP_GAP_MAP,
  AVATAR_GROUP_OVERLAP_MAP,
  AVATAR_SIZE_MAP,
  type AvatarGroupProps,
  type AvatarGroupSpacing,
  type AvatarSize,
} from './Avatar.types';

// =============================================================================
// Spacing Constants
// =============================================================================

function resolveAvatarSize(size: AvatarSize): string {
  switch (size) {
    case 'xs':
      return AVATAR_SIZE_MAP.xs;
    case 'sm':
      return AVATAR_SIZE_MAP.sm;
    case 'md':
      return AVATAR_SIZE_MAP.md;
    case 'lg':
      return AVATAR_SIZE_MAP.lg;
    case 'xl':
      return AVATAR_SIZE_MAP.xl;
    case '2xl':
      return AVATAR_SIZE_MAP['2xl'];
    case 'xxl':
      return AVATAR_SIZE_MAP.xxl;
    default:
      return AVATAR_SIZE_MAP.md;
  }
}

function resolveOverlap(spacing: AvatarGroupSpacing): string {
  switch (spacing) {
    case 'compact':
      return AVATAR_GROUP_OVERLAP_MAP.compact;
    case 'normal':
      return AVATAR_GROUP_OVERLAP_MAP.normal;
    case 'loose':
      return AVATAR_GROUP_OVERLAP_MAP.loose;
    default:
      return AVATAR_GROUP_OVERLAP_MAP.normal;
  }
}

function resolveInlineGap(spacing: AvatarGroupSpacing): string {
  switch (spacing) {
    case 'compact':
      return AVATAR_GROUP_GAP_MAP.compact;
    case 'normal':
      return AVATAR_GROUP_GAP_MAP.normal;
    case 'loose':
      return AVATAR_GROUP_GAP_MAP.loose;
    default:
      return AVATAR_GROUP_GAP_MAP.normal;
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Gets names from avatar children for accessible labeling
 */
function getHiddenAvatarNames(children: React.ReactNode, startIndex: number): string[] {
  const names: string[] = [];
  const childArray = Children.toArray(children);

  // Slice from startIndex to get hidden children safely
  const hiddenChildren = childArray.slice(startIndex);
  for (const child of hiddenChildren) {
    if (isValidElement(child)) {
      const props = child.props as { name?: string; alt?: string };
      if (props.name) {
        names.push(props.name);
      } else if (props.alt) {
        names.push(props.alt);
      }
    }
  }

  return names;
}

// =============================================================================
// AvatarGroup Component
// =============================================================================

/**
 * AvatarGroup component for displaying multiple avatars
 *
 * @example
 * ```tsx
 * // Stacked avatar group with overflow
 * <AvatarGroup maxVisible={3} size="md">
 *   <Avatar src="/user1.jpg" alt="User 1" />
 *   <Avatar src="/user2.jpg" alt="User 2" />
 *   <Avatar src="/user3.jpg" alt="User 3" />
 *   <Avatar src="/user4.jpg" alt="User 4" />
 *   <Avatar src="/user5.jpg" alt="User 5" />
 * </AvatarGroup>
 *
 * // Inline layout with spacing
 * <AvatarGroup layout="inline" spacing="normal">
 *   <Avatar name="Alice" />
 *   <Avatar name="Bob" />
 *   <Avatar name="Charlie" />
 * </AvatarGroup>
 * ```
 */
export const AvatarGroup = memo(
  forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
    {
      children,
      maxVisible,
      layout = 'stacked',
      spacing = 'normal',
      size = 'md',
      shape = 'circle',
      tone,
      overflowLabel,
      showOverflowTooltip = true,
      className,
      style,
      id,
      title,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) {
    // Get all avatar children
    const childArray = Children.toArray(children);
    const totalCount = childArray.length;

    // Calculate visible and hidden counts
    const visibleCount = maxVisible !== undefined ? Math.min(maxVisible, totalCount) : totalCount;
    const hiddenCount = totalCount - visibleCount;
    const hasOverflow = hiddenCount > 0;

    // Get names of hidden avatars for accessible labeling
    const hiddenNames = useMemo(() => {
      if (!hasOverflow) {
        return [];
      }
      return getHiddenAvatarNames(children, visibleCount);
    }, [children, visibleCount, hasOverflow]);

    // Build overflow label
    const computedOverflowLabel = useMemo(() => {
      if (overflowLabel) {
        return overflowLabel;
      }
      if (hiddenNames.length > 0 && hiddenNames.length <= 5) {
        return `${hiddenNames.join(', ')} and ${hiddenCount} more`;
      }
      return `+${hiddenCount} more`;
    }, [overflowLabel, hiddenNames, hiddenCount]);

    // Calculate sizing - safe object access with validated enum types
    const avatarSize = resolveAvatarSize(size);
    const overlap = layout === 'stacked' ? resolveOverlap(spacing) : '0';
    const marginLeft = layout === 'stacked' ? `calc(${avatarSize} * -1 * ${overlap})` : '0';
    const gap = layout === 'inline' ? resolveInlineGap(spacing) : '0';

    // Memoize container classes
    const containerClasses = useMemo(
      () =>
        cn(
          'dsai-avatar-group',
          'd-inline-flex',
          'align-items-center',
          layout === 'stacked' && 'flex-row-reverse',
          className
        ),
      [layout, className]
    );

    // Memoize container styles
    const containerStyle = useMemo(
      () => ({
        gap: layout === 'inline' ? gap : undefined,
        ...style,
      }),
      [layout, gap, style]
    );

    // Clone and enhance visible children
    const visibleChildren = useMemo(() => {
      return childArray.slice(0, visibleCount).map((child, index) => {
        if (!isValidElement(child)) {
          return child;
        }

        // Type assertion for avatar props
        const childProps = child.props as {
          size?: AvatarSize;
          shape?: string;
          tone?: string;
          className?: string;
          style?: React.CSSProperties;
          decorative?: boolean;
        };

        // Apply inherited props if not explicitly set
        const enhancedProps = {
          size: childProps.size ?? size,
          shape: childProps.shape ?? shape,
          tone: childProps.tone ?? tone,
          // Add margin for stacked layout (except first in reversed order)
          style: {
            ...childProps.style,
            marginLeft: layout === 'stacked' && index > 0 ? marginLeft : undefined,
            // Add z-index for stacking order
            zIndex: layout === 'stacked' ? visibleCount - index : undefined,
          },
          className: cn(
            childProps.className,
            layout === 'stacked' && 'border border-2 border-white'
          ),
          // Mark as decorative for group unless specifically semantic
          decorative: childProps.decorative ?? (index > 0 || !ariaLabel),
        };

        return cloneElement(child, enhancedProps);
      });
    }, [childArray, visibleCount, size, shape, tone, layout, marginLeft, ariaLabel]);

    // Render overflow chip
    const renderOverflowChip = (): React.ReactNode => {
      if (!hasOverflow) {
        return null;
      }

      const chipClasses = cn(
        'dsai-avatar-group__overflow',
        'd-inline-flex',
        'align-items-center',
        'justify-content-center',
        'bg-secondary',
        'text-white',
        'fw-semibold',
        shape === 'circle' && 'rounded-circle',
        shape === 'rounded' && 'rounded-3',
        layout === 'stacked' && 'border border-2 border-white'
      );

      const chipStyle: React.CSSProperties = {
        width: avatarSize,
        height: avatarSize,
        fontSize: `calc(${avatarSize} * 0.35)`,
        marginLeft: layout === 'stacked' ? marginLeft : undefined,
        zIndex: 0,
      };

      return (
        <button
          type="button"
          className={cn(chipClasses, 'border-0', 'p-0')}
          style={chipStyle}
          aria-label={computedOverflowLabel}
          title={showOverflowTooltip ? computedOverflowLabel : undefined}
          data-testid="avatar-group-overflow"
        >
          +{hiddenCount}
        </button>
      );
    };

    // Build group aria-label
    const groupAriaLabel = useMemo(() => {
      if (ariaLabel) {
        return ariaLabel;
      }
      if (hasOverflow) {
        return `${visibleCount} of ${totalCount} users shown`;
      }
      return `${totalCount} users`;
    }, [ariaLabel, hasOverflow, visibleCount, totalCount]);

    return (
      <div
        ref={ref}
        id={id}
        className={containerClasses}
        style={containerStyle}
        role="group"
        aria-label={groupAriaLabel}
        aria-hidden={ariaHidden}
        title={title}
        data-testid={dataTestId}
        data-test={dataTest}
        data-layout={layout}
        data-spacing={spacing}
        data-visible-count={visibleCount}
        data-total-count={totalCount}
      >
        {/* Render overflow chip first for stacked (reversed) layout */}
        {layout === 'stacked' && renderOverflowChip()}

        {/* Render visible avatars */}
        {visibleChildren}

        {/* Render overflow chip last for inline layout */}
        {layout === 'inline' && renderOverflowChip()}
      </div>
    );
  })
);

AvatarGroup.displayName = 'AvatarGroup';
