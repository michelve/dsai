/**
 * Typography Component
 *
 * A comprehensive typography system providing semantic heading, display,
 * and text components with Bootstrap 5 styling.
 *
 * Features:
 * - Semantic HTML elements (h1-h6, p, span, etc.)
 * - Visual sizing separate from semantic level
 * - Display headings for hero sections
 * - Lead paragraphs and body text variants
 * - Full color, alignment, and weight customization
 * - WCAG 2.2 AA compliant
 *
 * @see https://getbootstrap.com/docs/5.3/content/typography/
 * @packageDocumentation
 */

import { forwardRef, memo, useMemo } from 'react';

import { cn } from '../../utils';

import type {
  DisplayProps,
  DisplaySize,
  HeadingLevel,
  HeadingProps,
  TextProps,
  TextVariant,
  TypographyNamespace,
} from './Typography.types';
import type React from 'react';

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Maps font weight prop to Bootstrap class
 */
function getFontWeightClass(weight: HeadingProps['weight']): string | undefined {
  if (!weight) {
    return undefined;
  }

  const weightMap: Record<NonNullable<typeof weight>, string> = {
    light: 'fw-light',
    lighter: 'fw-lighter',
    normal: 'fw-normal',
    bold: 'fw-bold',
    bolder: 'fw-bolder',
    semibold: 'fw-semibold',
  };

  // Safe access - weight is validated as keyof weightMap by TypeScript
  // The weight parameter is typed as a union of valid keys
  // eslint-disable-next-line security/detect-object-injection
  return weightMap[weight];
}

/**
 * Maps text color prop to Bootstrap class
 */
function getTextColorClass(color: HeadingProps['color']): string | undefined {
  if (!color) {
    return undefined;
  }

  // Handle special cases
  if (color === 'body-secondary') {
    return 'text-body-secondary';
  }
  if (color === 'body-tertiary') {
    return 'text-body-tertiary';
  }

  return `text-${color}`;
}

/**
 * Maps text alignment prop to Bootstrap class
 */
function getTextAlignClass(align: HeadingProps['align']): string | undefined {
  if (!align) {
    return undefined;
  }
  return `text-${align}`;
}

/**
 * Maps text transform prop to Bootstrap class
 */
function getTextTransformClass(transform: HeadingProps['transform']): string | undefined {
  if (!transform || transform === 'none') {
    return undefined;
  }
  return `text-${transform}`;
}

// =============================================================================
// Heading Component
// =============================================================================

/**
 * Heading component for semantic headings (h1-h6)
 *
 * Supports visual size separate from semantic level, allowing you to
 * maintain proper document outline while controlling visual appearance.
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
export const Heading = memo(
  forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
    {
      children,
      level = 1,
      visualSize,
      color,
      align,
      transform,
      weight,
      className,
      style,
      id,
      noMargin = false,
      truncate = false,
      'data-testid': dataTestId,
      'data-test': dataTest,
      title,
    },
    ref
  ) {
    // Determine the HTML element
    const Tag = `h${level}` as const;

    // Build class list
    const classes = useMemo(
      () =>
        cn(
          // Visual size class (only if different from semantic level)
          visualSize && visualSize !== `h${level}` ? visualSize : undefined,
          // Color
          getTextColorClass(color),
          // Alignment
          getTextAlignClass(align),
          // Transform
          getTextTransformClass(transform),
          // Weight
          getFontWeightClass(weight),
          // No margin
          noMargin && 'mb-0',
          // Truncate
          truncate && 'text-truncate',
          // Custom classes
          className
        ),
      [level, visualSize, color, align, transform, weight, noMargin, truncate, className]
    );

    return (
      <Tag
        ref={ref}
        id={id}
        className={classes || undefined}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
        title={title}
      >
        {children}
      </Tag>
    );
  })
);

Heading.displayName = 'Heading';

// =============================================================================
// Display Component
// =============================================================================

/**
 * Maps display size to default semantic heading level
 */
function getDefaultLevelForDisplay(size: DisplaySize): HeadingLevel {
  // Display 1 → h1, Display 2-3 → h2, Display 4-6 → h3
  if (size === 1) {
    return 1;
  }
  if (size <= 3) {
    return 2;
  }
  return 3;
}

/**
 * Display heading component for hero sections and large titles
 *
 * Display headings are larger, more opinionated versions of headings
 * typically used in hero sections, landing pages, and feature highlights.
 *
 * @example
 * ```tsx
 * // Large display heading
 * <Display size={1}>Hero Title</Display>
 *
 * // Medium display with styling
 * <Display size={3} color="primary" align="center">
 *   Featured Section
 * </Display>
 *
 * // Custom semantic level
 * <Display size={1} level={2}>
 *   Big Visual, h2 Semantics
 * </Display>
 * ```
 */
export const Display = memo(
  forwardRef<HTMLHeadingElement, DisplayProps>(function Display(
    {
      children,
      size = 1,
      level,
      color,
      align,
      transform,
      weight,
      className,
      style,
      id,
      noMargin = false,
      'data-testid': dataTestId,
      'data-test': dataTest,
      title,
    },
    ref
  ) {
    // Determine semantic level
    const semanticLevel = level ?? getDefaultLevelForDisplay(size);
    const Tag = `h${semanticLevel}` as const;

    // Build class list
    const classes = useMemo(
      () =>
        cn(
          // Display class
          `display-${size}`,
          // Color
          getTextColorClass(color),
          // Alignment
          getTextAlignClass(align),
          // Transform
          getTextTransformClass(transform),
          // Weight
          getFontWeightClass(weight),
          // No margin
          noMargin && 'mb-0',
          // Custom classes
          className
        ),
      [size, color, align, transform, weight, noMargin, className]
    );

    return (
      <Tag
        ref={ref}
        id={id}
        className={classes}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
        title={title}
      >
        {children}
      </Tag>
    );
  })
);

Display.displayName = 'Display';

// =============================================================================
// Text Component
// =============================================================================

/**
 * Maps text variant to default HTML element
 */
function getElementForVariant(variant: TextVariant): React.ElementType {
  const elementMap: Record<TextVariant, React.ElementType> = {
    body: 'p',
    lead: 'p',
    small: 'small',
    mark: 'mark',
    del: 'del',
    ins: 'ins',
    strong: 'strong',
    em: 'em',
    abbr: 'abbr',
    blockquote: 'blockquote',
    code: 'code',
    kbd: 'kbd',
    pre: 'pre',
  };
  // Safe access - variant is validated as keyof elementMap by TypeScript
  // The variant parameter is typed as TextVariant union
  // eslint-disable-next-line security/detect-object-injection
  return elementMap[variant];
}

/**
 * Text component for body copy, lead paragraphs, and inline text
 *
 * Supports multiple variants for different text semantics and styling.
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
 *
 * // Blockquote with citation
 * <Text variant="blockquote" cite="https://example.com" citeAuthor="Famous Person">
 *   A famous quote goes here.
 * </Text>
 * ```
 */
export const Text = memo(
  forwardRef<HTMLElement, TextProps>(function Text(
    {
      children,
      variant = 'body',
      size,
      as,
      color,
      align,
      transform,
      weight,
      className,
      style,
      id,
      noMargin = false,
      truncate = false,
      lines,
      title,
      cite,
      citeAuthor,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) {
    // Build size class
    const sizeClass = useMemo(() => {
      if (!size || variant === 'lead') {
        return undefined;
      }
      if (size === 'sm') {
        return 'small';
      }
      if (size === 'lg') {
        return 'fs-5';
      }
      return undefined;
    }, [size, variant]);

    // Build truncate styles for multi-line
    const truncateStyles = useMemo(() => {
      if (!truncate || !lines || lines <= 1) {
        return undefined;
      }
      return {
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
      };
    }, [truncate, lines]);

    // Build class list
    const classes = useMemo(
      () =>
        cn(
          // Variant-specific class
          variant === 'lead' && 'lead',
          variant === 'blockquote' && 'blockquote',
          // Size class
          sizeClass,
          // Color
          getTextColorClass(color),
          // Alignment
          getTextAlignClass(align),
          // Transform
          getTextTransformClass(transform),
          // Weight
          getFontWeightClass(weight),
          // No margin
          noMargin && 'mb-0',
          // Single-line truncate
          truncate && !lines && 'text-truncate',
          // Custom classes
          className
        ),
      [variant, sizeClass, color, align, transform, weight, noMargin, truncate, lines, className]
    );

    // Combine styles
    const combinedStyle = useMemo(
      () => (truncateStyles ? { ...truncateStyles, ...style } : style),
      [truncateStyles, style]
    );

    // Handle blockquote special case with citation
    if (variant === 'blockquote' && (cite || citeAuthor)) {
      return (
        <figure className={noMargin ? 'mb-0' : undefined}>
          <blockquote
            ref={ref as React.Ref<HTMLQuoteElement>}
            id={id}
            className={classes || 'blockquote'}
            style={combinedStyle}
            cite={cite}
            data-testid={dataTestId}
            data-test={dataTest}
          >
            {children}
          </blockquote>
          {citeAuthor && (
            <figcaption className="blockquote-footer">
              {citeAuthor}
              {cite && <cite title={cite} />}
            </figcaption>
          )}
        </figure>
      );
    }

    // Handle abbr special case
    if (variant === 'abbr') {
      return (
        <abbr
          ref={ref as React.Ref<HTMLElement>}
          id={id}
          className={classes || undefined}
          style={combinedStyle}
          title={title}
          data-testid={dataTestId}
          data-test={dataTest}
        >
          {children}
        </abbr>
      );
    }

    // Common props for all variants
    const commonProps = {
      id,
      className: classes || undefined,
      style: combinedStyle,
      title,
      'data-testid': dataTestId,
      'data-test': dataTest,
    };

    // Render based on final tag (as prop takes precedence)
    const finalTag = as ?? getElementForVariant(variant);

    switch (finalTag) {
      case 'p':
        return (
          <p ref={ref as React.Ref<HTMLParagraphElement>} {...commonProps}>
            {children}
          </p>
        );
      case 'span':
        return (
          <span ref={ref as React.Ref<HTMLSpanElement>} {...commonProps}>
            {children}
          </span>
        );
      case 'small':
        return (
          <small ref={ref as React.Ref<HTMLElement>} {...commonProps}>
            {children}
          </small>
        );
      case 'mark':
        return (
          <mark ref={ref as React.Ref<HTMLElement>} {...commonProps}>
            {children}
          </mark>
        );
      case 'del':
        return (
          <del ref={ref as React.Ref<HTMLModElement>} {...commonProps}>
            {children}
          </del>
        );
      case 'ins':
        return (
          <ins ref={ref as React.Ref<HTMLModElement>} {...commonProps}>
            {children}
          </ins>
        );
      case 'strong':
        return (
          <strong ref={ref as React.Ref<HTMLElement>} {...commonProps}>
            {children}
          </strong>
        );
      case 'em':
        return (
          <em ref={ref as React.Ref<HTMLElement>} {...commonProps}>
            {children}
          </em>
        );
      case 'code':
        return (
          <code ref={ref as React.Ref<HTMLElement>} {...commonProps}>
            {children}
          </code>
        );
      case 'kbd':
        return (
          <kbd ref={ref as React.Ref<HTMLElement>} {...commonProps}>
            {children}
          </kbd>
        );
      case 'pre':
        return (
          <pre ref={ref as React.Ref<HTMLPreElement>} {...commonProps}>
            {children}
          </pre>
        );
      case 'blockquote':
        return (
          <blockquote ref={ref as React.Ref<HTMLQuoteElement>} {...commonProps}>
            {children}
          </blockquote>
        );
      case 'div':
        return (
          <div ref={ref as React.Ref<HTMLDivElement>} {...commonProps}>
            {children}
          </div>
        );
      default:
        // Fallback to paragraph
        return (
          <p ref={ref as React.Ref<HTMLParagraphElement>} {...commonProps}>
            {children}
          </p>
        );
    }
  })
);

Text.displayName = 'Text';

// =============================================================================
// Typography Namespace
// =============================================================================

/**
 * Typography compound component
 *
 * Provides access to all typography components through a single namespace.
 *
 * @example
 * ```tsx
 * import { Typography } from '@dsai/react';
 *
 * // Using namespace
 * <Typography.Heading level={1}>Title</Typography.Heading>
 * <Typography.Display size={2}>Hero</Typography.Display>
 * <Typography.Text variant="lead">Lead text</Typography.Text>
 *
 * // Or import components directly
 * import { Heading, Display, Text } from '@dsai/react';
 * ```
 */
export const Typography: TypographyNamespace = {
  Heading,
  Display,
  Text,
};

// =============================================================================
// Exports
// =============================================================================

export type {
  DisplayProps,
  DisplaySize,
  FontWeight,
  HeadingLevel,
  HeadingProps,
  HeadingSize,
  TextAlign,
  TextColor,
  TextProps,
  TextSize,
  TextTransform,
  TextVariant,
} from './Typography.types';
