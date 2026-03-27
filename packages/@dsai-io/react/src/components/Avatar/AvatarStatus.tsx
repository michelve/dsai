// packages/@dsai-io/react/src/components/Avatar/AvatarStatus.tsx

import { forwardRef, memo } from 'react';

import { cn } from '../../utils';

import { useAvatarContext } from './AvatarContext';
import { getStatusColor, getStatusSize } from './avatarUtils';

import type { AvatarStatusProps } from './Avatar.types';

export const AvatarStatus = memo(
  forwardRef<HTMLSpanElement, AvatarStatusProps>(function AvatarStatus(
    { value, position = 'bottom-right', className, style },
    ref
  ) {
    const { size } = useAvatarContext();
    const statusSize = getStatusSize(size);

    const statusClasses = cn(
      'dsai-avatar__status',
      'position-absolute',
      'rounded-circle',
      'border',
      'border-2',
      'border-white',
      getStatusColor(value),
      position === 'bottom-left' ? 'start-0' : 'end-0',
      'bottom-0',
      className
    );

    const statusStyle = {
      width: statusSize,
      height: statusSize,
      zIndex: 1,
      transform:
        position === 'bottom-left' ? 'translate(-25%, 25%)' : 'translate(25%, 25%)',
      ...style,
    };

    // aria-hidden="true" — the parent Avatar's computed aria-label already
    // includes the status text (e.g., "John Doe, Online"), so this indicator
    // is purely visual. Matches the flat-API pattern.
    return (
      <span
        ref={ref}
        className={statusClasses}
        style={statusStyle}
        aria-hidden="true"
        data-status={value}
      />
    );
  })
);

AvatarStatus.displayName = 'Avatar.Status';
