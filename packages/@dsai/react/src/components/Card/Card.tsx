import { forwardRef, type KeyboardEvent, memo, useCallback, useMemo } from 'react';

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
  CardTextProps,
  CardTitleProps,
  CardVariant,
} from './Card.types';

// =============================================================================
// Security: HREF Validation
// =============================================================================

/**
 * Validates if an href is safe to use
 * Blocks dangerous protocols like javascript:, data:, vbscript:
 * @param href - The href to validate
 * @returns true if the href is safe, false otherwise
 */

/**
 * Detects if a URL is external
 * @param href - The href to check
 * @returns true if the href is external, false otherwise
 */

// =============================================================================
// CardHeader Component
// =============================================================================

/**
 * CardHeader component - card header section
 */
const CardHeaderComponent = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { children, className = '', style },
  ref
) {
  const classes = useMemo(() => {
    return ['card-header', className].filter(Boolean).join(' ');
  }, [className]);

  return (
    <div ref={ref} className={classes} style={style}>
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
  { children, className = '', style },
  ref
) {
  const classes = useMemo(() => {
    return ['card-body', className].filter(Boolean).join(' ');
  }, [className]);

  return (
    <div ref={ref} className={classes} style={style}>
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
  { children, className = '', style },
  ref
) {
  const classes = useMemo(() => {
    return ['card-footer', className].filter(Boolean).join(' ');
  }, [className]);

  return (
    <div ref={ref} className={classes} style={style}>
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
  { src, alt, position = 'top', height, className = '', style, loading = 'lazy' },
  ref
) {
  const positionClass = useMemo(() => {
    return position === 'top'
      ? 'card-img-top'
      : position === 'bottom'
        ? 'card-img-bottom'
        : 'card-img';
  }, [position]);

  const classes = useMemo(() => {
    return [positionClass, className].filter(Boolean).join(' ');
  }, [positionClass, className]);

  const imgStyle = useMemo<React.CSSProperties>(() => {
    return {
      ...style,
      height: height ?? undefined,
      objectFit: height ? 'cover' : undefined,
    };
  }, [style, height]);

  return (
    <img ref={ref} src={src} alt={alt} className={classes} style={imgStyle} loading={loading} />
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
  { children, as: Component = 'h5', className = '', style },
  ref
) {
  const classes = useMemo(() => {
    return ['card-title', className].filter(Boolean).join(' ');
  }, [className]);

  return (
    <Component ref={ref} className={classes} style={style}>
      {children}
    </Component>
  );
});

CardTitleComponent.displayName = 'CardTitle';
export const CardTitle = memo(CardTitleComponent);
CardTitle.displayName = 'CardTitle';

// =============================================================================
// CardText Component
// =============================================================================

/**
 * CardText component - card text paragraph
 */
const CardTextComponent = forwardRef<HTMLParagraphElement, CardTextProps>(function CardText(
  { children, muted = false, className = '', style },
  ref
) {
  const classes = useMemo(() => {
    return ['card-text', muted && 'text-body-secondary', className].filter(Boolean).join(' ');
  }, [muted, className]);

  return (
    <p ref={ref} className={classes} style={style}>
      {children}
    </p>
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
  { children, href, className = '', style },
  ref
) {
  // Validate href for security
  const safeHref = isSafeHref(href) ? href : '#';
  const isExternal = isExternalUrl(safeHref);
  const relAttribute = isExternal ? 'noopener noreferrer' : undefined;

  const classes = useMemo(() => {
    return ['card-link', className].filter(Boolean).join(' ');
  }, [className]);

  return (
    <a ref={ref} href={safeHref} className={classes} style={style} rel={relAttribute}>
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
  function CardImgOverlay({ children, className = '', style }, ref) {
    const classes = useMemo(() => {
      return ['card-img-overlay', className].filter(Boolean).join(' ');
    }, [className]);

    return (
      <div ref={ref} className={classes} style={style}>
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
 * Get variant class
 */

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

    // Build card classes with memoization
    const cardClasses = useMemo(() => {
      const variantClasses: Array<string | false> = [
        variant === 'elevated' && 'shadow-sm',
        variant === 'outlined' && 'border',
        variant === 'ghost' && 'bg-transparent',
        variant === 'ghost' && 'border-0',
      ];
      return [
        'card',
        getVariantClass(variant, { prefix: 'card' }),
        color && getColorClass(color),
        horizontal && 'flex-row',
        isInteractive && 'card-interactive',
        ...variantClasses,
        className,
      ]
        .filter(Boolean)
        .join(' ');
    }, [variant, color, horizontal, isInteractive, className]);

    // Interactive card styles with memoization
    const interactiveStyle = useMemo<React.CSSProperties | undefined>(() => {
      return isInteractive
        ? {
            cursor: 'pointer',
            transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            ...style,
          }
        : style;
    }, [isInteractive, style]);

    // Handle click with useCallback
    const handleClick = useCallback((): void => {
      onClick?.();
    }, [onClick]);

    // Handle keyboard with useCallback
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLElement>): void => {
        if (e.key === 'Enter' || e.key === ' ') {
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

    // Common props with memoization
    const commonProps = useMemo(
      () => ({
        className: cardClasses,
        style: interactiveStyle,
        id,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
      }),
      [cardClasses, interactiveStyle, id, ariaLabel, ariaLabelledBy]
    );

    // Render as link
    if (safeHref) {
      if (LinkComponent) {
        return (
          <LinkComponent
            ref={ref}
            href={safeHref}
            {...commonProps}
            style={{ ...interactiveStyle, textDecoration: 'none', color: 'inherit' }}
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
          {...commonProps}
          style={{ ...interactiveStyle, textDecoration: 'none', color: 'inherit' }}
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
          {...commonProps}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          {children}
        </button>
      );
    }

    // Render as article (default)
    return (
      <article ref={ref as React.Ref<HTMLElement>} {...commonProps}>
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
  CardTextProps,
  CardTitleProps,
  CardVariant,
};
