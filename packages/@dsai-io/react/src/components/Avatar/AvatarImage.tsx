// packages/@dsai-io/react/src/components/Avatar/AvatarImage.tsx

import { forwardRef, memo } from 'react';

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
        ref={ref}
        src={src}
        alt={alt ?? ''}
        srcSet={srcSet}
        sizes={sizes}
        loading={loading}
        referrerPolicy={referrerPolicy}
        crossOrigin={crossOrigin}
        onError={onError}
        onLoad={onLoad}
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
