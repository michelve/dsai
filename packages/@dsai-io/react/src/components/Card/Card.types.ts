import type { SemanticColorVariant } from '../../types';
import type { ReactNode } from 'react';

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
 * Card size
 */
export type CardSize = 'sm' | 'md' | 'lg';

/**
 * Card container props
 */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
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
   * Card size
   */
  size?: CardSize;

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
   * Click handler for interactive cards.
   * Intentionally () => void, not MouseEventHandler — Card onClick is a semantic action,
   * not a DOM mouse event. Omitted from HTMLAttributes to avoid type conflict.
   */
  onClick?: () => void;

  /**
   * Custom link component (for router integration)
   */
  linkAs?: React.ElementType;
}

/**
 * CardHeader props
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Header content
   */
  children: ReactNode;
}

/**
 * CardBody props
 */
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Body content
   */
  children: ReactNode;
}

/**
 * CardFooter props
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Footer content
   */
  children: ReactNode;
}

/**
 * CardImage props
 */
export interface CardImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'height'> {
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
}

/**
 * CardTitle props
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Title content
   */
  children: ReactNode;

  /**
   * Heading level
   * @default 'h5'
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * CardSubtitle props
 */
export interface CardSubtitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Subtitle content
   */
  children: ReactNode;

  /**
   * Heading level
   * @default 'h6'
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  /**
   * Muted text style
   * @default true
   */
  muted?: boolean;
}

/**
 * CardText props
 */
export interface CardTextProps extends React.HTMLAttributes<HTMLElement> {
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
   * Element type to render as
   * @default 'p'
   */
  as?: 'p' | 'span' | 'small' | 'div';
}

/**
 * CardLink props
 */
export interface CardLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Link content
   */
  children: ReactNode;

  /**
   * Link URL
   */
  href: string;
}

/**
 * CardImgOverlay props
 */
export interface CardImgOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Overlay content
   */
  children: ReactNode;
}
