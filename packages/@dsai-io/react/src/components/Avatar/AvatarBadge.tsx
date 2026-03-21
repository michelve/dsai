// packages/@dsai-io/react/src/components/Avatar/AvatarBadge.tsx

import { forwardRef, memo } from 'react';

import { cn } from '../../utils';
import { useAvatarContext } from './AvatarContext';

import type { AvatarBadgeProps } from './Avatar.types';

export const AvatarBadge = memo(
  forwardRef<HTMLSpanElement, AvatarBadgeProps>(function AvatarBadge(
    { count, dot = false, className, style },
    ref
  ) {
    // Access context for consistency (throws if used outside Avatar)
    useAvatarContext();

    if (count === undefined && !dot) {
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
      'text-white',
      className
    );

    const badgeStyle = {
      zIndex: 1,
      transform: 'translate(25%, -25%)',
      ...style,
    };

    // Count takes priority over dot
    if (count !== undefined) {
      const displayCount = count > 99 ? '99+' : count;
      return (
        <span
          ref={ref}
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

    return (
      <span
        ref={ref}
        className={cn(badgeClasses, 'p-1')}
        style={badgeStyle}
        aria-hidden="true"
        data-testid="avatar-badge-dot"
      />
    );
  })
);

AvatarBadge.displayName = 'Avatar.Badge';
