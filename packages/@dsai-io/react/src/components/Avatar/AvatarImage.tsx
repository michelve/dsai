// packages/@dsai-io/react/src/components/Avatar/AvatarImage.tsx

import { forwardRef, memo, useCallback } from 'react';

import { cn } from '../../utils';

import { useAvatarContext } from './AvatarContext';
import { getShapeClass } from './avatarUtils';

import type { AvatarImageProps } from './Avatar.types';

export const AvatarImage = memo(
  forwardRef<HTMLImageElement, AvatarImageProps>(function AvatarImage(
    {
      src,
      alt,
      srcSet,
      sizes,
      loading = 'eager',
      referrerPolicy,
      crossOrigin,
      children,
      onError,
      onLoad,
      className,
      style,
    },
    ref
  ) {
    const { shape } = useAvatarContext();

    // Attach load/error handlers via ref to avoid a11y lint false positive
    // (onError/onLoad are resource events, not user interactions)
    const imgRef = useCallback(
      (node: HTMLImageElement | null) => {
        // Forward the external ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.RefObject<HTMLImageElement | null>).current = node;
        }

        if (!node) {
          return;
        }
        if (onError) {
          node.addEventListener('error', onError as unknown as EventListener);
        }
        if (onLoad) {
          node.addEventListener('load', onLoad as unknown as EventListener);
        }
      },
      [ref, onError, onLoad],
    );

    // If children provided, render custom image element
    if (children) {
      return (
        <span
          className={cn('dsai-avatar__image-wrapper', 'w-100', 'h-100', className)}
          style={style}
        >
          {children}
        </span>
      );
    }

    return (
      <img
        ref={imgRef}
        src={src}
        alt={alt ?? ''}
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
          className
        )}
        style={style}
        data-testid="avatar-image"
      />
    );
  })
);

AvatarImage.displayName = 'Avatar.Image';
