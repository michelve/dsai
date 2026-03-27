/**
 * Typography Types
 *
 * Type definitions for the Typography component system including:
 * - Heading (h1-h6)
 * - Display (display-1 to display-6)
 * - Text (paragraphs, lead text, body copy)
 *
 * @module Typography/types
 */

import type { PolymorphicComponentProps } from '../../types';
import type { CSSProperties, ReactNode } from 'react';

// =============================================================================
// Shared Types
// =============================================================================

/**
 * Text alignment options
 */
export type TextAlign = 'start' | 'center' | 'end';

/**
 * Text transform options
 */
export type TextTransform = 'lowercase' | 'uppercase' | 'capitalize' | 'none';

/**
 * Text wrap options for modern CSS text-wrap
 * - 'balance': Balances line lengths for headings (best for short text)
 * - 'pretty': Prevents orphans on the last line
 * - 'nowrap': Prevents wrapping
 * - 'wrap': Default wrapping behavior (explicit)
 */
export type TextWrap = 'balance' | 'pretty' | 'nowrap' | 'wrap';

/**
 * Font weight options
 * Maps to Bootstrap 5 font weight utilities
 */
export type FontWeight = 'light' | 'lighter' | 'normal' | 'bold' | 'bolder' | 'semibold';

/**
 * Text color variants using Bootstrap semantic colors
 */
export type TextColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'body'
  | 'body-secondary'
  | 'body-tertiary'
  | 'muted'
  | 'white'
  | 'black';

/**
 * Safe HTML attributes that can be spread onto typography elements
 */
export interface TypographySafeHTMLAttributes {
  'data-testid'?: string;
  'data-test'?: string;
  title?: string;
}

// =============================================================================
// Heading Types
// =============================================================================

/**
 * Heading levels (h1-h6)
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Visual heading sizes - can differ from semantic level
 * Allows h1 to look like h3, etc.
 */
export type HeadingSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Props for the Heading component
 *
 * @example
 * ```tsx
 * // Basic heading
 * <Heading level={1}>Page Title</Heading>
 *
 * // h2 with h4 visual size
 * <Heading level={2} visualSize="h4">Section Title</Heading>
 *
 * // Styled heading
 * <Heading level={3} color="primary" align="center">
 *   Centered Primary Heading
 * </Heading>
 * ```
 */
export interface HeadingProps extends TypographySafeHTMLAttributes {
  /**
   * Heading content
   */
  children: ReactNode;

  /**
   * Semantic heading level (1-6)
   * Determines the actual HTML element (h1-h6)
   * @default 1
   */
  level?: HeadingLevel;

  /**
   * Visual size - allows visual styling to differ from semantic level
   * Use when you need h1 semantics but h3 styling
   */
  visualSize?: HeadingSize;

  /**
   * Text color
   */
  color?: TextColor;

  /**
   * Text alignment
   */
  align?: TextAlign;

  /**
   * Text transform
   */
  transform?: TextTransform;

  /**
   * Font weight override
   */
  weight?: FontWeight;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * HTML id attribute
   */
  id?: string;

  /**
   * Remove default margin
   * @default false
   */
  noMargin?: boolean;

  /**
   * Truncate text with ellipsis
   * @default false
   */
  truncate?: boolean;

  /**
   * CSS text-wrap behavior
   * Use 'balance' for headings, 'pretty' to prevent orphans
   */
  wrap?: TextWrap;

  /**
   * Enable high-contrast mode for enhanced accessibility
   * Applies stronger color contrast for WCAG AAA compliance
   * @default false
   */
  highContrast?: boolean;
}

// =============================================================================
// Display Types
// =============================================================================

/**
 * Display sizes (1-6, where 1 is largest)
 */
export type DisplaySize = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Props for the Display component
 * Display headings are larger, more opinionated heading styles
 *
 * @example
 * ```tsx
 * // Large display heading
 * <Display size={1}>Hero Title</Display>
 *
 * // Medium display with custom styling
 * <Display size={3} color="primary" align="center">
 *   Featured Section
 * </Display>
 * ```
 */
export interface DisplayProps extends TypographySafeHTMLAttributes {
  /**
   * Display content
   */
  children: ReactNode;

  /**
   * Display size (1-6, where 1 is largest)
   * @default 1
   */
  size?: DisplaySize;

  /**
   * Semantic heading level for accessibility
   * Defaults to appropriate level based on display size
   * @default varies by size (1 → h1, 2-3 → h2, 4-6 → h3)
   */
  level?: HeadingLevel;

  /**
   * Text color
   */
  color?: TextColor;

  /**
   * Text alignment
   */
  align?: TextAlign;

  /**
   * Text transform
   */
  transform?: TextTransform;

  /**
   * Font weight override
   */
  weight?: FontWeight;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * HTML id attribute
   */
  id?: string;

  /**
   * Remove default margin
   * @default false
   */
  noMargin?: boolean;

  /**
   * Truncate text with ellipsis
   * @default false
   */
  truncate?: boolean;

  /**
   * CSS text-wrap behavior
   * Use 'balance' for headings, 'pretty' to prevent orphans
   */
  wrap?: TextWrap;

  /**
   * Enable high-contrast mode for enhanced accessibility
   * Applies stronger color contrast for WCAG AAA compliance
   * @default false
   */
  highContrast?: boolean;
}

// =============================================================================
// Text Types
// =============================================================================

/**
 * Text variants for different content types
 */
export type TextVariant =
  | 'body' // Default body text
  | 'lead' // Lead paragraph (larger, lighter)
  | 'small' // Small text
  | 'mark' // Highlighted text
  | 'del' // Deleted/strikethrough text
  | 'ins' // Inserted/underlined text
  | 'strong' // Bold/important text
  | 'em' // Emphasized/italic text
  | 'abbr' // Abbreviation with dotted underline
  | 'blockquote' // Block quotation
  | 'code' // Inline code
  | 'kbd' // Keyboard input
  | 'pre'; // Preformatted text

/**
 * Text size options
 */
export type TextSize = 'sm' | 'base' | 'lg';

/**
 * Supported element types for Text polymorphism
 */
export type TextElement =
  | 'p'
  | 'span'
  | 'small'
  | 'mark'
  | 'del'
  | 'ins'
  | 'strong'
  | 'em'
  | 'code'
  | 'kbd'
  | 'pre'
  | 'blockquote'
  | 'div'
  | 'abbr';

/**
 * Props for the Text component
 *
 * @example
 * ```tsx
 * // Body paragraph
 * <Text>Regular paragraph text content.</Text>
 *
 * // Lead paragraph
 * <Text variant="lead">
 *   This is a lead paragraph. It stands out from regular paragraphs.
 * </Text>
 *
 * // Styled text
 * <Text color="muted" size="sm" align="center">
 *   Small centered muted text
 * </Text>
 *
 * // Inline text styling
 * <Text as="span" variant="strong">Bold inline text</Text>
 * ```
 */
export interface TextOwnProps extends TypographySafeHTMLAttributes {
  /**
   * Text content
   */
  children: ReactNode;

  /**
   * Text variant - determines semantic element and styling
   * @default 'body'
   */
  variant?: TextVariant;

  /**
   * Text size
   * @default 'base'
   */
  size?: TextSize;

  /**
   * Text color
   */
  color?: TextColor;

  /**
   * Text alignment
   */
  align?: TextAlign;

  /**
   * Text transform
   */
  transform?: TextTransform;

  /**
   * Font weight
   */
  weight?: FontWeight;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * HTML id attribute
   */
  id?: string;

  /**
   * Remove default margin (for paragraphs)
   * @default false
   */
  noMargin?: boolean;

  /**
   * Truncate text with ellipsis (single line)
   * @default false
   */
  truncate?: boolean;

  /**
   * Number of lines before truncation (multi-line truncation)
   * Only applies when truncate is true
   */
  lines?: number;

  /**
   * CSS text-wrap behavior
   * Use 'balance' for headings, 'pretty' to prevent orphans
   */
  wrap?: TextWrap;

  /**
   * Enable high-contrast mode for enhanced accessibility
   * Applies stronger color contrast for WCAG AAA compliance
   * @default false
   */
  highContrast?: boolean;

  /**
   * For abbr variant - full text shown in tooltip
   */
  title?: string;

  /**
   * For blockquote variant - citation source
   */
  cite?: string;

  /**
   * For blockquote variant - citation author/source name
   */
  citeAuthor?: string;
}

export type TextProps = PolymorphicComponentProps<TextElement, TextOwnProps>;

// =============================================================================
// Compound Component Types
// =============================================================================

/**
 * Typography compound component namespace
 */
export interface TypographyNamespace {
  Heading: React.NamedExoticComponent<HeadingProps & React.RefAttributes<HTMLHeadingElement>>;
  Display: React.NamedExoticComponent<DisplayProps & React.RefAttributes<HTMLHeadingElement>>;
  Text: React.NamedExoticComponent<TextProps & React.RefAttributes<HTMLElement>>;
}
