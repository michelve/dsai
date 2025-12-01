/**
 * Figma Code Connect - Typography Components
 *
 * Maps the DSAi Typography Figma components to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Typography/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Display, Heading, Text } from './Typography';

// =============================================================================
// Heading Component - Code Connect Mapping
// =============================================================================

/**
 * DSAi Heading - Code Connect Mapping
 *
 * Maps Figma Heading component to React Heading component.
 * Supports h1-h6 semantic levels with optional visual size override.
 */
figma.connect(Heading, '<FIGMA_DSAI_HEADING>', {
  props: {
    /**
     * Semantic heading level (1-6)
     * Maps Figma "Level" property to React level prop
     */
    level: figma.enum('Level', {
      H1: 1,
      H2: 2,
      H3: 3,
      H4: 4,
      H5: 5,
      H6: 6,
    }),

    /**
     * Visual size override
     * Maps Figma "Visual Size" property to React visualSize prop
     */
    visualSize: figma.enum('Visual Size', {
      H1: 'h1',
      H2: 'h2',
      H3: 'h3',
      H4: 'h4',
      H5: 'h5',
      H6: 'h6',
      Auto: undefined,
    }),

    /**
     * Text color
     * Maps Figma "Color" property to React color prop
     */
    color: figma.enum('Color', {
      Default: undefined,
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
      Light: 'light',
      Dark: 'dark',
      Muted: 'muted',
      White: 'white',
    }),

    /**
     * Text alignment
     * Maps Figma "Align" property to React align prop
     */
    align: figma.enum('Align', {
      Start: 'start',
      Center: 'center',
      End: 'end',
      Auto: undefined,
    }),

    /**
     * Font weight
     * Maps Figma "Weight" property to React weight prop
     */
    weight: figma.enum('Weight', {
      Light: 'light',
      Normal: 'normal',
      Semibold: 'semibold',
      Bold: 'bold',
      Auto: undefined,
    }),

    /**
     * Text transform
     * Maps Figma "Transform" property to React transform prop
     */
    transform: figma.enum('Transform', {
      None: undefined,
      Uppercase: 'uppercase',
      Lowercase: 'lowercase',
      Capitalize: 'capitalize',
    }),

    /**
     * Truncate text with ellipsis
     * Maps Figma "Truncate" property to React truncate prop
     */
    truncate: figma.boolean('Truncate'),

    /**
     * Remove default margin
     * Maps Figma "No Margin" property to React noMargin prop
     */
    noMargin: figma.boolean('No Margin'),

    /**
     * Text content
     * Maps Figma text layer to children prop
     */
    children: figma.string('Text'),
  },

  example: ({
    level,
    visualSize,
    color,
    align,
    weight,
    transform,
    truncate,
    noMargin,
    children,
  }) => (
    <Heading
      level={level}
      visualSize={visualSize}
      color={color}
      align={align}
      weight={weight}
      transform={transform}
      truncate={truncate}
      noMargin={noMargin}
    >
      {children}
    </Heading>
  ),
});

// =============================================================================
// Display Component - Code Connect Mapping
// =============================================================================

/**
 * DSAi Display - Code Connect Mapping
 *
 * Maps Figma Display component to React Display component.
 * Display headings are larger, more prominent headings for hero sections.
 */
figma.connect(Display, '<FIGMA_DSAI_DISPLAY>', {
  props: {
    /**
     * Display size (1-6, where 1 is largest)
     * Maps Figma "Size" property to React size prop
     */
    size: figma.enum('Size', {
      'Display 1': 1,
      'Display 2': 2,
      'Display 3': 3,
      'Display 4': 4,
      'Display 5': 5,
      'Display 6': 6,
    }),

    /**
     * Semantic heading level override
     * Maps Figma "Semantic Level" property to React level prop
     */
    level: figma.enum('Semantic Level', {
      H1: 1,
      H2: 2,
      H3: 3,
      Auto: undefined,
    }),

    /**
     * Text color
     * Maps Figma "Color" property to React color prop
     */
    color: figma.enum('Color', {
      Default: undefined,
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
      Light: 'light',
      Dark: 'dark',
      Muted: 'muted',
      White: 'white',
    }),

    /**
     * Text alignment
     * Maps Figma "Align" property to React align prop
     */
    align: figma.enum('Align', {
      Start: 'start',
      Center: 'center',
      End: 'end',
      Auto: undefined,
    }),

    /**
     * Font weight
     * Maps Figma "Weight" property to React weight prop
     */
    weight: figma.enum('Weight', {
      Light: 'light',
      Normal: 'normal',
      Semibold: 'semibold',
      Bold: 'bold',
      Auto: undefined,
    }),

    /**
     * Text transform
     * Maps Figma "Transform" property to React transform prop
     */
    transform: figma.enum('Transform', {
      None: undefined,
      Uppercase: 'uppercase',
      Lowercase: 'lowercase',
      Capitalize: 'capitalize',
    }),

    /**
     * Remove default margin
     * Maps Figma "No Margin" property to React noMargin prop
     */
    noMargin: figma.boolean('No Margin'),

    /**
     * Text content
     * Maps Figma text layer to children prop
     */
    children: figma.string('Text'),
  },

  example: ({ size, level, color, align, weight, transform, noMargin, children }) => (
    <Display
      size={size}
      level={level}
      color={color}
      align={align}
      weight={weight}
      transform={transform}
      noMargin={noMargin}
    >
      {children}
    </Display>
  ),
});

// =============================================================================
// Text Component - Code Connect Mapping
// =============================================================================

/**
 * DSAi Text - Code Connect Mapping
 *
 * Maps Figma Text component to React Text component.
 * Supports body, lead, and various inline text variants.
 */
figma.connect(Text, '<FIGMA_DSAI_TEXT>', {
  props: {
    /**
     * Text variant
     * Maps Figma "Variant" property to React variant prop
     */
    variant: figma.enum('Variant', {
      Body: 'body',
      Lead: 'lead',
      Small: 'small',
      Strong: 'strong',
      Emphasis: 'em',
      Mark: 'mark',
      Deleted: 'del',
      Inserted: 'ins',
      Code: 'code',
      Keyboard: 'kbd',
      Blockquote: 'blockquote',
    }),

    /**
     * Text size
     * Maps Figma "Size" property to React size prop
     */
    size: figma.enum('Size', {
      Small: 'sm',
      Base: 'base',
      Large: 'lg',
      Auto: undefined,
    }),

    /**
     * Text color
     * Maps Figma "Color" property to React color prop
     */
    color: figma.enum('Color', {
      Default: undefined,
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
      Light: 'light',
      Dark: 'dark',
      Muted: 'muted',
      'Body Secondary': 'body-secondary',
      'Body Tertiary': 'body-tertiary',
      White: 'white',
    }),

    /**
     * Text alignment
     * Maps Figma "Align" property to React align prop
     */
    align: figma.enum('Align', {
      Start: 'start',
      Center: 'center',
      End: 'end',
      Auto: undefined,
    }),

    /**
     * Font weight
     * Maps Figma "Weight" property to React weight prop
     */
    weight: figma.enum('Weight', {
      Light: 'light',
      Normal: 'normal',
      Semibold: 'semibold',
      Bold: 'bold',
      Auto: undefined,
    }),

    /**
     * Text transform
     * Maps Figma "Transform" property to React transform prop
     */
    transform: figma.enum('Transform', {
      None: undefined,
      Uppercase: 'uppercase',
      Lowercase: 'lowercase',
      Capitalize: 'capitalize',
    }),

    /**
     * Truncate text with ellipsis
     * Maps Figma "Truncate" property to React truncate prop
     */
    truncate: figma.boolean('Truncate'),

    /**
     * Number of lines before truncation (multi-line clamp)
     * Maps Figma "Lines" property to React lines prop
     */
    lines: figma.enum('Lines', {
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      Auto: undefined,
    }),

    /**
     * Remove default margin
     * Maps Figma "No Margin" property to React noMargin prop
     */
    noMargin: figma.boolean('No Margin'),

    /**
     * Text content
     * Maps Figma text layer to children prop
     */
    children: figma.string('Text'),
  },

  example: ({
    variant,
    size,
    color,
    align,
    weight,
    transform,
    truncate,
    lines,
    noMargin,
    children,
  }) => (
    <Text
      variant={variant}
      size={size}
      color={color}
      align={align}
      weight={weight}
      transform={transform}
      truncate={truncate}
      lines={lines}
      noMargin={noMargin}
    >
      {children}
    </Text>
  ),
});

// =============================================================================
// Lead Paragraph - Specific Mapping
// =============================================================================

/**
 * DSAi Lead Paragraph - Code Connect Mapping
 *
 * Separate mapping for lead paragraphs as they're commonly used in Figma.
 */
figma.connect(Text, '<FIGMA_DSAI_LEAD>', {
  props: {
    color: figma.enum('Color', {
      Default: undefined,
      Muted: 'muted',
      'Body Secondary': 'body-secondary',
    }),
    align: figma.enum('Align', {
      Start: 'start',
      Center: 'center',
      End: 'end',
      Auto: undefined,
    }),
    children: figma.string('Text'),
  },

  example: ({ color, align, children }) => (
    <Text variant="lead" color={color} align={align}>
      {children}
    </Text>
  ),
});

// =============================================================================
// Blockquote - Specific Mapping
// =============================================================================

/**
 * DSAi Blockquote - Code Connect Mapping
 *
 * Separate mapping for blockquotes with citation support.
 */
figma.connect(Text, '<FIGMA_DSAI_BLOCKQUOTE>', {
  props: {
    children: figma.string('Quote'),
    citeAuthor: figma.string('Author'),
    cite: figma.string('Source URL'),
  },

  example: ({ children, citeAuthor, cite }) => (
    <Text variant="blockquote" citeAuthor={citeAuthor} cite={cite}>
      {children}
    </Text>
  ),
});
