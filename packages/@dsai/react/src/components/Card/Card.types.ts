import type { SemanticColorVariant } from '../../types';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Card variant styling
 */
export type CardVariant = 'elevated' | 'outlined' | 'ghost';

/**
 * Card color variant (background color)
 * @see SemanticColorVariant
 */
export type CardColor = SemanticColorVariant;

/**
 * Card container props
 */
export interface CardProps {
  /**
   * Card content
   */
  children: ReactNode;

  /**
   * Card variant
   * @default 'elevated'
   */
  variant?: CardVariant;

  /**
   * Background color variant
   */
  color?: CardColor;

  /**
   * Horizontal layout (image on side)
   * @default false
   */
  horizontal?: boolean;

  /**
   * Make card interactive (clickable)
   * @default false
   */
  interactive?: boolean;

  /**
   * URL for link cards
   */
  href?: string;

  /**
   * Click handler for interactive cards
   */
  onClick?: () => void;

  /**
   * Custom link component (for router integration)
   */
  linkAs?: React.ElementType;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Accessible label
   */
  'aria-label'?: string;

  /**
   * ID of element that labels this card
   */
  'aria-labelledby'?: string;
}

/**
 * CardHeader props
 */
export interface CardHeaderProps {
  /**
   * Header content
   */
  children: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;
}

/**
 * CardBody props
 */
export interface CardBodyProps {
  /**
   * Body content
   */
  children: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;
}

/**
 * CardFooter props
 */
export interface CardFooterProps {
  /**
   * Footer content
   */
  children: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;
}

/**
 * CardImage props
 */
export interface CardImageProps {
  /**
   * Image source URL
   */
  src: string;

  /**
   * Alt text for accessibility
   */
  alt: string;

  /**
   * Image position
   * @default 'top'
   */
  position?: 'top' | 'bottom' | 'overlay';

  /**
   * Image height
   */
  height?: string | number;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Loading strategy
   * @default 'lazy'
   */
  loading?: 'lazy' | 'eager';
}

/**
 * CardTitle props
 */
export interface CardTitleProps {
  /**
   * Title content
   */
  children: ReactNode;

  /**
   * Heading level
   * @default 'h5'
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;
}

/**
 * CardText props
 */
export interface CardTextProps {
  /**
   * Text content
   */
  children: ReactNode;

  /**
   * Muted text style
   * @default false
   */
  muted?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;
}

/**
 * CardLink props
 */
export interface CardLinkProps {
  /**
   * Link content
   */
  children: ReactNode;

  /**
   * Link URL
   */
  href: string;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;
}

/**
 * CardImgOverlay props
 */
export interface CardImgOverlayProps {
  /**
   * Overlay content
   */
  children: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;
}
