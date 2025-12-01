import { Display, Heading, Text, Typography } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Typography - Comprehensive text styling system
 *
 * The Typography system provides semantic and visual control over all text content:
 * - **Heading** - Semantic headings (h1-h6) with optional visual size override
 * - **Display** - Large, prominent headings for hero sections
 * - **Text** - Body copy, lead paragraphs, and inline text variants
 *
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 */
const meta: Meta<typeof Typography.Heading> = {
  title: 'Components/Typography',
  component: Typography.Heading,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive typography system with semantic headings, display headings, ' +
          'and text components for body copy and inline styling.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Headings
// =============================================================================

/**
 * All heading levels from h1 to h6
 */
export const Headings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Heading level={1}>h1. Heading Level 1</Heading>
      <Heading level={2}>h2. Heading Level 2</Heading>
      <Heading level={3}>h3. Heading Level 3</Heading>
      <Heading level={4}>h4. Heading Level 4</Heading>
      <Heading level={5}>h5. Heading Level 5</Heading>
      <Heading level={6}>h6. Heading Level 6</Heading>
    </div>
  ),
};

/**
 * Visual size can differ from semantic level.
 * Useful for maintaining document outline while controlling appearance.
 */
export const HeadingVisualSizes: Story = {
  name: 'Heading Visual Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Heading level={1} visualSize="h1">
        h1 semantic, h1 visual
      </Heading>
      <Heading level={2} visualSize="h1">
        h2 semantic, h1 visual (looks like h1)
      </Heading>
      <Heading level={1} visualSize="h4">
        h1 semantic, h4 visual (looks like h4)
      </Heading>
      <Heading level={3} visualSize="h2">
        h3 semantic, h2 visual (looks like h2)
      </Heading>
    </div>
  ),
};

/**
 * Headings with different colors
 */
export const HeadingColors: Story = {
  name: 'Heading Colors',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Heading level={3}>Default Color</Heading>
      <Heading level={3} color="primary">
        Primary Color
      </Heading>
      <Heading level={3} color="secondary">
        Secondary Color
      </Heading>
      <Heading level={3} color="success">
        Success Color
      </Heading>
      <Heading level={3} color="danger">
        Danger Color
      </Heading>
      <Heading level={3} color="warning">
        Warning Color
      </Heading>
      <Heading level={3} color="info">
        Info Color
      </Heading>
      <Heading level={3} color="muted">
        Muted Color
      </Heading>
      <Heading level={3} color="body">
        Body Color
      </Heading>
      <Heading level={3} color="body-secondary">
        Body Secondary Color
      </Heading>
      <Heading level={3} color="body-tertiary">
        Body Tertiary Color
      </Heading>
      <Heading level={3} color="dark">
        Dark Color
      </Heading>
      <div className="bg-dark p-2">
        <Heading level={3} color="white">
          White Color (on dark)
        </Heading>
        <Heading level={3} color="light">
          Light Color (on dark)
        </Heading>
        <Heading level={3} color="black">
          Black Color (on dark)
        </Heading>
      </div>
    </div>
  ),
};

/**
 * Heading alignment options
 */
export const HeadingAlignment: Story = {
  name: 'Heading Alignment',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="border p-2">
        <Heading level={4} align="start">
          Start Aligned (default)
        </Heading>
      </div>
      <div className="border p-2">
        <Heading level={4} align="center">
          Center Aligned
        </Heading>
      </div>
      <div className="border p-2">
        <Heading level={4} align="end">
          End Aligned
        </Heading>
      </div>
    </div>
  ),
};

/**
 * Heading with different font weights
 */
export const HeadingWeights: Story = {
  name: 'Heading Weights',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Heading level={3} weight="light">
        Light Weight
      </Heading>
      <Heading level={3} weight="normal">
        Normal Weight
      </Heading>
      <Heading level={3} weight="semibold">
        Semibold Weight
      </Heading>
      <Heading level={3} weight="bold">
        Bold Weight (default)
      </Heading>
      <Heading level={3} weight="bolder">
        Bolder Weight
      </Heading>
    </div>
  ),
};

// =============================================================================
// Display Headings
// =============================================================================

/**
 * Display headings for hero sections and prominent titles
 */
export const DisplayHeadings: Story = {
  name: 'Display Headings',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Display size={1}>Display 1</Display>
      <Display size={2}>Display 2</Display>
      <Display size={3}>Display 3</Display>
      <Display size={4}>Display 4</Display>
      <Display size={5}>Display 5</Display>
      <Display size={6}>Display 6</Display>
    </div>
  ),
};

/**
 * Display headings with colors
 */
export const DisplayColors: Story = {
  name: 'Display Colors',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Display size={4}>Default Display</Display>
      <Display size={4} color="primary">
        Primary Display
      </Display>
      <Display size={4} color="secondary">
        Secondary Display
      </Display>
      <Display size={4} color="success">
        Success Display
      </Display>
      <Display size={4} color="muted">
        Muted Display
      </Display>
    </div>
  ),
};

/**
 * Display with custom semantic level
 */
export const DisplaySemanticLevel: Story = {
  name: 'Display Semantic Level',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Display size={1} level={1}>
        Display 1 with h1 semantic (default)
      </Display>
      <Display size={1} level={2}>
        Display 1 with h2 semantic
      </Display>
      <Display size={2} level={3}>
        Display 2 with h3 semantic
      </Display>
      <p className="text-muted">
        Use level prop to control accessibility hierarchy while maintaining visual size.
      </p>
    </div>
  ),
};

// =============================================================================
// Text / Body Copy
// =============================================================================

/**
 * Standard body text
 */
export const BodyText: Story = {
  name: 'Body Text',
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Text>
        This is standard body text. It uses the default paragraph styling with appropriate line
        height and spacing for comfortable reading. Body text should be used for the main content of
        your application.
      </Text>
      <Text>
        Multiple paragraphs maintain proper spacing. This ensures readability and visual hierarchy
        in your content. The default styling follows Bootstrap 5 conventions.
      </Text>
    </div>
  ),
};

/**
 * Lead paragraphs for introductory text
 */
export const LeadText: Story = {
  name: 'Lead Paragraph',
  render: () => (
    <div style={{ maxWidth: '700px' }}>
      <Text variant="lead">
        This is a lead paragraph. It stands out from regular paragraphs and is typically used for
        introductory text or to highlight key information at the beginning of a section.
      </Text>
      <Text>
        Regular body text follows the lead paragraph. Notice the size difference that creates visual
        hierarchy and draws attention to the introductory content.
      </Text>
    </div>
  ),
};

/**
 * Text size variations
 */
export const TextSizes: Story = {
  name: 'Text Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Text size="lg">Large text for emphasis</Text>
      <Text size="base">Base text (default size)</Text>
      <Text size="sm">Small text for fine print or secondary information</Text>
    </div>
  ),
};

/**
 * Text with different colors
 */
export const TextColors: Story = {
  name: 'Text Colors',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <Text>Default body color</Text>
      <Text color="primary">Primary color text</Text>
      <Text color="secondary">Secondary color text</Text>
      <Text color="success">Success color text</Text>
      <Text color="danger">Danger color text</Text>
      <Text color="warning">Warning color text</Text>
      <Text color="info">Info color text</Text>
      <Text color="muted">Muted color text</Text>
      <Text color="body">Body color text</Text>
      <Text color="body-secondary">Body secondary color text</Text>
      <Text color="body-tertiary">Body tertiary color text</Text>
      <Text color="dark">Dark color text</Text>
      <div className="bg-dark p-2">
        <Text color="white">White color text (on dark)</Text>
        <Text color="light">Light color text (on dark)</Text>
        <Text color="black">Black color text (on dark)</Text>
      </div>
    </div>
  ),
};

/**
 * Text alignment
 */
export const TextAlignment: Story = {
  name: 'Text Alignment',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div className="border p-2">
        <Text align="start" noMargin>
          Start aligned text (default)
        </Text>
      </div>
      <div className="border p-2">
        <Text align="center" noMargin>
          Center aligned text
        </Text>
      </div>
      <div className="border p-2">
        <Text align="end" noMargin>
          End aligned text
        </Text>
      </div>
    </div>
  ),
};

/**
 * Text font weights
 */
export const TextWeights: Story = {
  name: 'Text Weights',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <Text weight="light">Light weight text</Text>
      <Text weight="normal">Normal weight text (default)</Text>
      <Text weight="semibold">Semibold weight text</Text>
      <Text weight="bold">Bold weight text</Text>
      <Text weight="bolder">Bolder weight text</Text>
    </div>
  ),
};

/**
 * Text transforms
 */
export const TextTransforms: Story = {
  name: 'Text Transforms',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <Text transform="lowercase">LOWERCASE TRANSFORM</Text>
      <Text transform="uppercase">uppercase transform</Text>
      <Text transform="capitalize">capitalize transform</Text>
    </div>
  ),
};

// =============================================================================
// Inline Text Variants
// =============================================================================

/**
 * Inline text styling variants
 */
export const InlineVariants: Story = {
  name: 'Inline Text Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <Text as="span">You can use </Text>
        <Text as="span" variant="strong">
          strong text
        </Text>
        <Text as="span"> for importance.</Text>
      </div>
      <div>
        <Text as="span">Use </Text>
        <Text as="span" variant="em">
          emphasized text
        </Text>
        <Text as="span"> for stress emphasis.</Text>
      </div>
      <div>
        <Text as="span">Highlight with </Text>
        <Text as="span" variant="mark">
          marked text
        </Text>
        <Text as="span"> to draw attention.</Text>
      </div>
      <div>
        <Text as="span">Show </Text>
        <Text as="span" variant="del">
          deleted text
        </Text>
        <Text as="span"> with strikethrough.</Text>
      </div>
      <div>
        <Text as="span">Show </Text>
        <Text as="span" variant="ins">
          inserted text
        </Text>
        <Text as="span"> with underline.</Text>
      </div>
      <div>
        <Text as="span">Use </Text>
        <Text as="span" variant="small">
          small text
        </Text>
        <Text as="span"> for fine print.</Text>
      </div>
    </div>
  ),
};

/**
 * Code and keyboard text
 */
export const CodeAndKeyboard: Story = {
  name: 'Code and Keyboard',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <Text as="span">Inline code: </Text>
        <Text as="span" variant="code">
          const x = 42;
        </Text>
      </div>
      <div>
        <Text as="span">Keyboard input: Press </Text>
        <Text as="span" variant="kbd">
          Ctrl
        </Text>
        <Text as="span"> + </Text>
        <Text as="span" variant="kbd">
          C
        </Text>
        <Text as="span"> to copy.</Text>
      </div>
      <div>
        <Text variant="pre">{`function greet(name) {
  return \`Hello, \${name}!\`;
}`}</Text>
      </div>
    </div>
  ),
};

/**
 * Abbreviations with tooltips
 */
export const Abbreviations: Story = {
  render: () => (
    <Text>
      <Text as="span">The </Text>
      <Text as="span" variant="abbr" title="World Wide Web">
        WWW
      </Text>
      <Text as="span"> is built on </Text>
      <Text as="span" variant="abbr" title="HyperText Markup Language">
        HTML
      </Text>
      <Text as="span">, </Text>
      <Text as="span" variant="abbr" title="Cascading Style Sheets">
        CSS
      </Text>
      <Text as="span">, and </Text>
      <Text as="span" variant="abbr" title="JavaScript">
        JS
      </Text>
      <Text as="span">.</Text>
    </Text>
  ),
};

// =============================================================================
// Blockquotes
// =============================================================================

/**
 * Blockquote with citation
 */
export const Blockquotes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Text variant="blockquote">A well-known quote, contained in a blockquote element.</Text>

      <Text variant="blockquote" citeAuthor="Albert Einstein" cite="https://example.com/einstein">
        Imagination is more important than knowledge. Knowledge is limited. Imagination encircles
        the world.
      </Text>

      <Text variant="blockquote" citeAuthor="Source Title" align="center">
        A centered blockquote for visual emphasis in your design.
      </Text>
    </div>
  ),
};

// =============================================================================
// Text Truncation
// =============================================================================

/**
 * Text truncation for overflow handling
 */
export const Truncation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      <div className="border p-2">
        <Heading level={5} truncate>
          This is a very long heading that will be truncated with an ellipsis
        </Heading>
      </div>
      <div className="border p-2">
        <Text truncate noMargin>
          This is a very long paragraph that will be truncated to a single line with an ellipsis at
          the end.
        </Text>
      </div>
      <div className="border p-2">
        <Text truncate lines={2} noMargin>
          This paragraph uses multi-line truncation. It will show up to 2 lines of text before being
          truncated with an ellipsis. This is useful for card descriptions or preview text.
        </Text>
      </div>
      <div className="border p-2">
        <Text truncate lines={3} noMargin>
          This paragraph uses 3-line truncation. It allows for a bit more content to be shown while
          still maintaining a consistent height. Perfect for content previews, article excerpts, or
          product descriptions that need to fit in a fixed space.
        </Text>
      </div>
    </div>
  ),
};

// =============================================================================
// No Margin
// =============================================================================

/**
 * Remove default margins
 */
export const NoMargin: Story = {
  name: 'No Margin',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="border p-2">
        <Heading level={3}>Heading with default margin</Heading>
        <Text>Following text</Text>
      </div>
      <div className="border p-2">
        <Heading level={3} noMargin>
          Heading with no margin
        </Heading>
        <Text noMargin>Following text with no margin</Text>
      </div>
    </div>
  ),
};

// =============================================================================
// Typography Namespace
// =============================================================================

/**
 * Using the Typography namespace
 */
export const TypographyNamespace: Story = {
  name: 'Typography Namespace',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography.Heading level={1}>Using Typography.Heading</Typography.Heading>
      <Typography.Display size={4}>Using Typography.Display</Typography.Display>
      <Typography.Text variant="lead">Using Typography.Text with lead variant</Typography.Text>
      <Typography.Text>Using Typography.Text for body copy</Typography.Text>
    </div>
  ),
};

// =============================================================================
// Complete Showcase
// =============================================================================

/**
 * Complete typography showcase
 */
export const CompleteShowcase: Story = {
  name: 'Complete Showcase',
  render: () => (
    <div style={{ maxWidth: '800px' }}>
      {/* Hero Section */}
      <section className="mb-5">
        <Display size={1} align="center" color="primary">
          Welcome to DSAi
        </Display>
        <Text variant="lead" align="center" color="muted">
          A comprehensive design system with accessible, well-crafted components.
        </Text>
      </section>

      {/* Content Section */}
      <section className="mb-4">
        <Heading level={2}>Getting Started</Heading>
        <Text>
          The DSAi typography system provides a complete set of text styles for building consistent,
          accessible user interfaces. Every component follows Bootstrap 5 conventions while
          maintaining WCAG 2.2 AA compliance.
        </Text>
      </section>

      <section className="mb-4">
        <Heading level={3}>Semantic Structure</Heading>
        <Text>
          Proper heading hierarchy is essential for accessibility. Use{' '}
          <Text as="span" variant="code">
            level
          </Text>{' '}
          for semantic structure and{' '}
          <Text as="span" variant="code">
            visualSize
          </Text>{' '}
          when you need different visual styling.
        </Text>

        <Heading level={4}>Example Usage</Heading>
        <Text variant="pre">{`<Heading level={2} visualSize="h4">
  Semantic h2, Visual h4
</Heading>`}</Text>
      </section>

      <section className="mb-4">
        <Heading level={3}>Inline Styling</Heading>
        <Text>
          Combine inline variants for rich text:{' '}
          <Text as="span" variant="strong">
            bold
          </Text>
          ,{' '}
          <Text as="span" variant="em">
            italic
          </Text>
          ,{' '}
          <Text as="span" variant="mark">
            highlighted
          </Text>
          , and{' '}
          <Text as="span" variant="code">
            code
          </Text>
          .
        </Text>
      </section>

      <section>
        <Heading level={3}>Blockquotes</Heading>
        <Text variant="blockquote" citeAuthor="Design System Team">
          Good typography is invisible. It communicates without drawing attention to itself.
        </Text>
      </section>
    </div>
  ),
};
