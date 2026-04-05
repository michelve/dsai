// packages/@dsai-io/react/src/components/Avatar/AvatarFallback.tsx

import { forwardRef, memo, useEffect, useState } from 'react';

import { cn } from '../../utils';

import { useAvatarContext } from './AvatarContext';

import type { AvatarFallbackProps } from './Avatar.types';

export const AvatarFallback = memo(
  forwardRef<HTMLSpanElement, AvatarFallbackProps>(function AvatarFallback(
    { delayMs, children, className, style },
    ref
  ) {
    const { imageStatus } = useAvatarContext();
    const [delayElapsed, setDelayElapsed] = useState(delayMs === undefined || delayMs === 0);

    // Synchronize when delayMs changes (state-based, not effect-based)
    const [prevDelayMs, setPrevDelayMs] = useState(delayMs);
    if (prevDelayMs !== delayMs) {
      setPrevDelayMs(delayMs);
      setDelayElapsed(delayMs === undefined || delayMs === 0);
    }

    useEffect(() => {
      if (delayMs === undefined || delayMs === 0) {
        return undefined;
      }

      const timer = globalThis.setTimeout(() => {
        setDelayElapsed(true);
      }, delayMs);

      return () => {
        globalThis.clearTimeout(timer);
      };
    }, [delayMs]);

    // Only show fallback when image is not loaded
    if (imageStatus === 'loaded') {
      return null;
    }

    // Respect delay
    if (!delayElapsed) {
      return null;
    }

    return (
      <span
        ref={ref}
        className={cn('dsai-avatar__fallback', className)}
        style={style}
        data-testid="avatar-fallback"
      >
        {children}
      </span>
    );
  })
);

AvatarFallback.displayName = 'Avatar.Fallback';
