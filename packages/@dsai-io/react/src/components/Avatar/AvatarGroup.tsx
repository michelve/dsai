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

import { Children, cloneElement, forwardRef, isValidElement, memo, useEffect, useMemo } from 'react';

import { cn } from '../../utils';

import { getSizeValue, resolveOverlap, resolveInlineGap } from './avatarUtils';

import type { AvatarGroupProps, AvatarSize } from './Avatar.types';

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
      total,
      renderSurplus,
      onOverflowClick,
      stackingOrder = 'lastOnTop',
    },
    ref
  ) {
    // Dev-mode warning for conflicting props
    useEffect(() => {
      if (process.env['NODE_ENV'] !== 'production' && renderSurplus && onOverflowClick) {
        console.warn(
          'AvatarGroup: onOverflowClick is ignored when renderSurplus is provided. ' +
            'Handle click events in your renderSurplus function instead.',
        );
      }
    }, [renderSurplus, onOverflowClick]);

    // Get all avatar children
    const childArray = Children.toArray(children);
    const totalCount = total ?? childArray.length;

    // Calculate visible and hidden counts
    const visibleCount = maxVisible !== undefined ? Math.min(maxVisible, childArray.length) : childArray.length;
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
    const avatarSize = getSizeValue(size);
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
          layout === 'stacked' && stackingOrder === 'lastOnTop' && 'flex-row-reverse',
          className
        ),
      [layout, stackingOrder, className]
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
      // Compute stacking style for a child avatar at the given index
      const getStackedStyle = (
        childStyle: React.CSSProperties | undefined,
        index: number
      ): React.CSSProperties => ({
        ...childStyle,
        marginLeft:
          layout === 'stacked' && stackingOrder === 'lastOnTop' && index > 0
            ? marginLeft
            : undefined,
        marginRight:
          layout === 'stacked' && stackingOrder === 'firstOnTop' && index > 0
            ? marginLeft
            : undefined,
        zIndex: layout === 'stacked' ? visibleCount - index : undefined,
      });

      return childArray.slice(0, visibleCount).map((child, index) => {
        if (!isValidElement(child)) {
          return child;
        }

        const childProps = child.props as {
          size?: AvatarSize;
          shape?: string;
          tone?: string;
          className?: string;
          style?: React.CSSProperties;
          decorative?: boolean;
        };

        const enhancedProps = {
          size: childProps.size ?? size,
          shape: childProps.shape ?? shape,
          tone: childProps.tone ?? tone,
          style: getStackedStyle(childProps.style, index),
          className: cn(
            childProps.className,
            layout === 'stacked' && 'border border-2 border-white'
          ),
          decorative: childProps.decorative ?? (index > 0 || !ariaLabel),
        };

        return cloneElement(child, enhancedProps);
      });
    }, [childArray, visibleCount, size, shape, tone, layout, stackingOrder, marginLeft, ariaLabel]);

    // Render overflow chip
    const renderOverflowChip = (): React.ReactNode => {
      if (!hasOverflow) {
        return null;
      }

      if (renderSurplus) {
        return renderSurplus(hiddenCount);
      }

      return renderDefaultOverflowChip();
    };

    // Default overflow chip rendering
    const renderDefaultOverflowChip = (): React.ReactNode => {
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
        marginLeft:
          layout === 'stacked' && stackingOrder === 'lastOnTop' ? marginLeft : undefined,
        marginRight:
          layout === 'stacked' && stackingOrder === 'firstOnTop' ? marginLeft : undefined,
        zIndex: 0,
      };

      return (
        <button
          type="button"
          className={cn(chipClasses, 'border-0', 'p-0')}
          style={chipStyle}
          aria-label={computedOverflowLabel}
          title={showOverflowTooltip ? computedOverflowLabel : undefined}
          onClick={onOverflowClick}
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
      const userWord = totalCount === 1 ? 'user' : 'users';
      if (hasOverflow) {
        return `${visibleCount} of ${totalCount} ${userWord} shown`;
      }
      return `${totalCount} ${userWord}`;
    }, [ariaLabel, hasOverflow, visibleCount, totalCount]);

    return (
      <div
        role="group"
        ref={ref}
        id={id}
        className={containerClasses}
        style={containerStyle}
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
        <span className="visually-hidden">{groupAriaLabel}</span>

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
