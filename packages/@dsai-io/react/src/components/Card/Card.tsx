import { forwardRef, type KeyboardEvent, memo, useCallback, useMemo } from 'react';

import { cn } from '../../utils';
import { isEnterKey } from '../../utils/keyboard';
import { getVariantClass } from '../../utils/string';
import { isExternalUrl } from '../../utils/types';
import { isSafeHref } from '../../utils/validation';

import type {
  CardBodyProps,
  CardColor,
  CardFooterProps,
  CardHeaderProps,
  CardImageProps,
  CardImgOverlayProps,
  CardLinkProps,
  CardProps,
  CardSubtitleProps,
  CardTextProps,
  CardTitleProps,
  CardVariant,
} from './Card.types';

// =============================================================================
// CardHeader Component
// =============================================================================

/**
 * CardHeader component - card header section
 */
const CardHeaderComponent = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { children, className = '', style, dangerouslySetInnerHTML: _dSIH, ...rest },
  ref
) {
  const classes = useMemo(() => cn('card-header', className), [className]);

  return (
    <div ref={ref} {...rest} className={classes} style={style}>
      {children}
    </div>
  );
});

CardHeaderComponent.displayName = 'CardHeader';
export const CardHeader = memo(CardHeaderComponent);
CardHeader.displayName = 'CardHeader';

// =============================================================================
// CardBody Component
// =============================================================================

/**
 * CardBody component - card body section
 */
const CardBodyComponent = forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
  { children, className = '', style, dangerouslySetInnerHTML: _dSIH, ...rest },
  ref
) {
  const classes = useMemo(() => cn('card-body', className), [className]);

  return (
    <div ref={ref} {...rest} className={classes} style={style}>
      {children}
    </div>
  );
});

CardBodyComponent.displayName = 'CardBody';
export const CardBody = memo(CardBodyComponent);
CardBody.displayName = 'CardBody';

// =============================================================================
// CardFooter Component
// =============================================================================

/**
 * CardFooter component - card footer section
 */
const CardFooterComponent = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { children, className = '', style, dangerouslySetInnerHTML: _dSIH, ...rest },
  ref
) {
  const classes = useMemo(() => cn('card-footer', className), [className]);

  return (
    <div ref={ref} {...rest} className={classes} style={style}>
      {children}
    </div>
  );
});

CardFooterComponent.displayName = 'CardFooter';
export const CardFooter = memo(CardFooterComponent);
CardFooter.displayName = 'CardFooter';

// =============================================================================
// CardImage Component
// =============================================================================

/**
 * CardImage component - card image
 */
const CardImageComponent = forwardRef<HTMLImageElement, CardImageProps>(function CardImage(
  {
    src,
    alt,
    position = 'top',
    height,
    className = '',
    style,
    loading = 'lazy',
    dangerouslySetInnerHTML: _dSIH,
    ...rest
  },
  ref
) {
  const positionClass = useMemo(() => {
    if (position === 'top') { return 'card-img-top'; }
    if (position === 'bottom') { return 'card-img-bottom'; }
    return 'card-img';
  }, [position]);

  const classes = useMemo(() => cn(positionClass, className), [positionClass, className]);

  const imgStyle = useMemo<React.CSSProperties>(() => {
    return {
      ...style,
      height: height ?? undefined,
      objectFit: height ? 'cover' : undefined,
    };
  }, [style, height]);

  return (
    <img
      ref={ref}
      {...rest}
      src={src}
      alt={alt}
      className={classes}
      style={imgStyle}
      loading={loading}
    />
  );
});

CardImageComponent.displayName = 'CardImage';
export const CardImage = memo(CardImageComponent);
CardImage.displayName = 'CardImage';

// =============================================================================
// CardTitle Component
// =============================================================================

/**
 * CardTitle component - card title heading
 */
const CardTitleComponent = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { children, as: Component = 'h5', className = '', style, dangerouslySetInnerHTML: _dSIH, ...rest },
  ref
) {
  const classes = useMemo(() => cn('card-title', className), [className]);

  return (
    <Component ref={ref} {...rest} className={classes} style={style}>
      {children}
    </Component>
  );
});

CardTitleComponent.displayName = 'CardTitle';
export const CardTitle = memo(CardTitleComponent);
CardTitle.displayName = 'CardTitle';

// =============================================================================
// CardSubtitle Component
// =============================================================================

/**
 * CardSubtitle component - card subtitle heading
 */
const CardSubtitleComponent = forwardRef<HTMLHeadingElement, CardSubtitleProps>(
  function CardSubtitle(
    { children, as: Component = 'h6', muted = true, className = '', style, dangerouslySetInnerHTML: _dSIH, ...rest },
    ref
  ) {
    const classes = useMemo(
      () => cn('card-subtitle', muted && 'text-body-secondary', className),
      [muted, className]
    );
    return (
      <Component ref={ref} {...rest} className={classes} style={style}>
        {children}
      </Component>
    );
  }
);

CardSubtitleComponent.displayName = 'CardSubtitle';
export const CardSubtitle = memo(CardSubtitleComponent);
CardSubtitle.displayName = 'CardSubtitle';

// =============================================================================
// CardText Component
// =============================================================================

/**
 * CardText component - card text paragraph
 */
const CardTextComponent = forwardRef<HTMLElement, CardTextProps>(function CardText(
  { children, muted = false, as: Component = 'p', className = '', style, dangerouslySetInnerHTML: _dSIH, ...rest },
  ref
) {
  const classes = useMemo(
    () => cn('card-text', muted && 'text-body-secondary', className),
    [muted, className]
  );

  return (
    <Component ref={ref as React.Ref<never>} {...rest} className={classes} style={style}>
      {children}
    </Component>
  );
});

CardTextComponent.displayName = 'CardText';
export const CardText = memo(CardTextComponent);
CardText.displayName = 'CardText';

// =============================================================================
// CardLink Component
// =============================================================================

/**
 * CardLink component - card link
 */
const CardLinkComponent = forwardRef<HTMLAnchorElement, CardLinkProps>(function CardLink(
  { children, href, className = '', style, target, rel, dangerouslySetInnerHTML: _dSIH, ...rest },
  ref
) {
  const safeHref = isSafeHref(href) ? href : '#';
  const isExternal = isExternalUrl(safeHref);
  const computedRel = rel ?? (isExternal || target === '_blank' ? 'noopener noreferrer' : undefined);
  const classes = useMemo(() => cn('card-link', className), [className]);

  return (
    <a ref={ref} {...rest} href={safeHref} className={classes} style={style} target={target} rel={computedRel}>
      {children}
    </a>
  );
});

CardLinkComponent.displayName = 'CardLink';
export const CardLink = memo(CardLinkComponent);
CardLink.displayName = 'CardLink';

// =============================================================================
// CardImgOverlay Component
// =============================================================================

/**
 * CardImgOverlay component - overlay content on card image
 */
const CardImgOverlayComponent = forwardRef<HTMLDivElement, CardImgOverlayProps>(
  function CardImgOverlay(
    { children, className = '', style, dangerouslySetInnerHTML: _dSIH, ...rest },
    ref
  ) {
    const classes = useMemo(() => cn('card-img-overlay', className), [className]);

    return (
      <div ref={ref} {...rest} className={classes} style={style}>
        {children}
      </div>
    );
  }
);

CardImgOverlayComponent.displayName = 'CardImgOverlay';
export const CardImgOverlay = memo(CardImgOverlayComponent);
CardImgOverlay.displayName = 'CardImgOverlay';

// =============================================================================
// Card Component
// =============================================================================

/**
 * Get color class
 */
const getColorClass = (color: CardColor): string => {
  return `text-bg-${color}`;
};

/**
 * Card component - flexible content container
 *
 * A Bootstrap 5 card component with subcomponents for flexible layouts.
 * Includes security validation, accessibility features, and performance optimizations.
 *
 * @see https://getbootstrap.com/docs/5.3/components/card/
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardImage src="image.jpg" alt="Card image" />
 *   <CardBody>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardText>Card content goes here.</CardText>
 *   </CardBody>
 * </Card>
 * ```
 */
export const Card = memo(
  forwardRef<HTMLElement, CardProps>(function Card(
    {
      children,
      variant = 'elevated',
      color,
      size,
      horizontal = false,
      interactive = false,
      href,
      onClick,
      linkAs: LinkComponent,
      className = '',
      style,
      dangerouslySetInnerHTML: _dSIH,
      ...rest
    },
    ref
  ) {
    const isInteractive = interactive || Boolean(href) || Boolean(onClick);

    if (Reflect.get(process.env, 'NODE_ENV') !== 'production') {
      if (interactive && !href && !onClick) {
        console.warn(
          'Card: `interactive` prop has no effect without `href` or `onClick`. ' +
          'Pass `href` or `onClick` to make the card interactive.'
        );
      }
    }

    // Build card classes with memoization
    const cardClasses = useMemo(() => {
      return cn(
        'card',
        getVariantClass(variant, { prefix: 'card' }),
        color && getColorClass(color),
        size && size !== 'md' && `card-${size}`,
        horizontal && 'flex-row',
        isInteractive && 'card-interactive',
        variant === 'elevated' && 'shadow-sm',
        variant === 'outlined' && 'border',
        variant === 'ghost' && 'bg-transparent',
        variant === 'ghost' && 'border-0',
        className
      );
    }, [variant, color, size, horizontal, isInteractive, className]);

    const mergedStyle = style;

    // Handle click with useCallback
    const handleClick = useCallback((): void => {
      onClick?.();
    }, [onClick]);

    // Handle keyboard with useCallback
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLElement>): void => {
        if (isEnterKey(e) || e.key === ' ') {
          if (!href) {
            e.preventDefault();
            handleClick();
          }
        }
      },
      [href, handleClick]
    );

    // Validate href for security
    const safeHref = isSafeHref(href) ? href : '#';
    const isExternal = isExternalUrl(safeHref);
    const relAttribute = isExternal ? 'noopener noreferrer' : undefined;

    // Render as link
    if (safeHref) {
      if (LinkComponent) {
        return (
          <LinkComponent
            ref={ref}
            href={safeHref}
            {...rest}
            className={cardClasses}
            style={{ ...mergedStyle, textDecoration: 'none', color: 'inherit' }}
            rel={relAttribute}
          >
            {children}
          </LinkComponent>
        );
      }

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={safeHref}
          {...rest}
          className={cardClasses}
          style={{ ...mergedStyle, textDecoration: 'none', color: 'inherit' }}
          rel={relAttribute}
        >
          {children}
        </a>
      );
    }

    // Render as button (interactive without href)
    if (onClick && !safeHref) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          {...rest}
          className={cardClasses}
          style={mergedStyle}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          {children}
        </button>
      );
    }

    // Render as article (default)
    return (
      <article ref={ref as React.Ref<HTMLElement>} {...rest} className={cardClasses} style={mergedStyle}>
        {children}
      </article>
    );
  })
);

Card.displayName = 'Card';

// =============================================================================
// Exports
// =============================================================================

export type {
  CardBodyProps,
  CardColor,
  CardFooterProps,
  CardHeaderProps,
  CardImageProps,
  CardImgOverlayProps,
  CardLinkProps,
  CardProps,
  CardSubtitleProps,
  CardTextProps,
  CardTitleProps,
  CardVariant,
};
