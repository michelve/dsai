import { forwardRef, type KeyboardEvent } from 'react';

import type {
  CardBodyProps,
  CardColor,
  CardFooterProps,
  CardHeaderProps,
  CardImageProps,
  CardImgOverlayProps,
  CardLinkProps,
  CardProps,
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
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { children, className = '', style },
  ref
) {
  const classes = ['card-header', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} style={style}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

// =============================================================================
// CardBody Component
// =============================================================================

/**
 * CardBody component - card body section
 */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
  { children, className = '', style },
  ref
) {
  const classes = ['card-body', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} style={style}>
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

// =============================================================================
// CardFooter Component
// =============================================================================

/**
 * CardFooter component - card footer section
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { children, className = '', style },
  ref
) {
  const classes = ['card-footer', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} style={style}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

// =============================================================================
// CardImage Component
// =============================================================================

/**
 * CardImage component - card image
 */
export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(function CardImage(
  { src, alt, position = 'top', height, className = '', style, loading = 'lazy' },
  ref
) {
  const positionClass =
    position === 'top' ? 'card-img-top' : position === 'bottom' ? 'card-img-bottom' : 'card-img';

  const classes = [positionClass, className].filter(Boolean).join(' ');

  const imgStyle: React.CSSProperties = {
    ...style,
    height: height ?? undefined,
    objectFit: height ? 'cover' : undefined,
  };

  return (
    <img ref={ref} src={src} alt={alt} className={classes} style={imgStyle} loading={loading} />
  );
});

CardImage.displayName = 'CardImage';

// =============================================================================
// CardTitle Component
// =============================================================================

/**
 * CardTitle component - card title heading
 */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { children, as: Component = 'h5', className = '', style },
  ref
) {
  const classes = ['card-title', className].filter(Boolean).join(' ');

  return (
    <Component ref={ref} className={classes} style={style}>
      {children}
    </Component>
  );
});

CardTitle.displayName = 'CardTitle';

// =============================================================================
// CardText Component
// =============================================================================

/**
 * CardText component - card text paragraph
 */
export const CardText = forwardRef<HTMLParagraphElement, CardTextProps>(function CardText(
  { children, muted = false, className = '', style },
  ref
) {
  const classes = ['card-text', muted && 'text-body-secondary', className]
    .filter(Boolean)
    .join(' ');

  return (
    <p ref={ref} className={classes} style={style}>
      {children}
    </p>
  );
});

CardText.displayName = 'CardText';

// =============================================================================
// CardLink Component
// =============================================================================

/**
 * CardLink component - card link
 */
export const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(function CardLink(
  { children, href, className = '', style },
  ref
) {
  const classes = ['card-link', className].filter(Boolean).join(' ');

  return (
    <a ref={ref} href={href} className={classes} style={style}>
      {children}
    </a>
  );
});

CardLink.displayName = 'CardLink';

// =============================================================================
// CardImgOverlay Component
// =============================================================================

/**
 * CardImgOverlay component - overlay content on card image
 */
export const CardImgOverlay = forwardRef<HTMLDivElement, CardImgOverlayProps>(
  function CardImgOverlay({ children, className = '', style }, ref) {
    const classes = ['card-img-overlay', className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} style={style}>
        {children}
      </div>
    );
  }
);

CardImgOverlay.displayName = 'CardImgOverlay';

// =============================================================================
// Card Component
// =============================================================================

/**
 * Get variant class
 */
const getVariantClass = (variant: CardVariant): string => {
  switch (variant) {
    case 'outlined':
      return 'border';
    case 'ghost':
      return 'bg-transparent border-0 shadow-none';
    case 'elevated':
    default:
      return 'shadow-sm';
  }
};

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
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    children,
    variant = 'elevated',
    color,
    horizontal = false,
    interactive = false,
    href,
    onClick,
    linkAs: LinkComponent,
    className = '',
    style,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
  },
  ref
) {
  const isInteractive = interactive || Boolean(href) || Boolean(onClick);

  // Build card classes
  const cardClasses = [
    'card',
    getVariantClass(variant),
    color && getColorClass(color),
    horizontal && 'flex-row',
    isInteractive && 'card-interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Interactive card styles
  const interactiveStyle: React.CSSProperties | undefined = isInteractive
    ? {
        cursor: 'pointer',
        transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        ...style,
      }
    : style;

  // Handle click
  const handleClick = (): void => {
    onClick?.();
  };

  // Handle keyboard
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (!href) {
        e.preventDefault();
        onClick?.();
      }
    }
  };

  // Common props
  const commonProps = {
    className: cardClasses,
    style: interactiveStyle,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
  };

  // Render as link
  if (href) {
    if (LinkComponent) {
      return (
        <LinkComponent
          ref={ref}
          href={href}
          {...commonProps}
          style={{ ...interactiveStyle, textDecoration: 'none', color: 'inherit' }}
        >
          {children}
        </LinkComponent>
      );
    }

    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        {...commonProps}
        style={{ ...interactiveStyle, textDecoration: 'none', color: 'inherit' }}
      >
        {children}
      </a>
    );
  }

  // Render as clickable div (interactive without href)
  if (onClick && !href) {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...commonProps}
      >
        {children}
      </div>
    );
  }

  // Render as article (default)
  return (
    <article ref={ref as React.Ref<HTMLElement>} {...commonProps}>
      {children}
    </article>
  );
});

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
  CardTextProps,
  CardTitleProps,
  CardVariant,
};
