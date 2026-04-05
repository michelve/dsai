import { Display, Heading, Text } from '@dsai-io/react';

import { BackgroundWhite, ThemeLight, ThemeDark } from '../../src/generated/tokens';
import tokens from '../../src/generated/tokens-grouped';

import type { Meta, StoryObj } from '@storybook/react-vite';

const SPACING_3 = 'var(--dsai-spacing-3)';
const SPACING_4 = 'var(--dsai-spacing-4)';
const COLOR_SECONDARY = 'var(--bs-secondary)';

const meta: Meta = {
  title: 'Foundation/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Typography system with font families, sizes, weights, and line heights for consistent text styling.',
      },
    },
    // Enable background testing for readability verification
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: BackgroundWhite },
        { name: 'dark', value: ThemeDark },
        { name: 'gray', value: ThemeLight },
      ],
    },
    // Enable viewport testing for responsive typography
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Font Families
 */
export const FontFamilies: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING_4 }}>
      <div>
        <Heading level={3} noMargin>
          Base Font (Inter)
        </Heading>
        <Text
          noMargin
          style={{
            fontFamily: tokens.typography?.fontFamily?.base || 'Inter, sans-serif',
            marginTop: '8px',
          }}
        >
          The quick brown fox jumps over the lazy dog. 0123456789
        </Text>
        <Text variant="code" style={{ color: COLOR_SECONDARY }}>
          var(--dsai-typography-font-family-base)
        </Text>
      </div>

      <div>
        <Heading level={3} noMargin>
          Monospace Font (Fira Code)
        </Heading>
        <Text
          noMargin
          style={{
            fontFamily: tokens.typography?.fontFamily?.monospace || '"Fira Code", monospace',
            marginTop: '8px',
          }}
        >
          {`const greeting = "Hello, World!"; // Code example`}
        </Text>
        <Text variant="code" style={{ color: COLOR_SECONDARY }}>
          var(--dsai-typography-font-family-monospace)
        </Text>
      </div>
    </div>
  ),
};

/**
 * Font Sizes
 */
export const FontSizes: Story = {
  render: () => {
    const sizes = [
      { name: 'Extra Small', token: 'xs', size: '12px' },
      { name: 'Small', token: 'sm', size: '14px' },
      { name: 'Base', token: 'base', size: '16px' },
      { name: 'Large', token: 'lg', size: '18px' },
      { name: 'Extra Large', token: 'xl', size: '20px' },
      { name: '2X Large', token: '2xl', size: '24px' },
      { name: '3X Large', token: '3xl', size: '30px' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING_3 }}>
        <Heading level={2}>Font Size Scale</Heading>
        {sizes.map(({ name, token, size }) => (
          <div key={token} style={{ display: 'flex', alignItems: 'baseline', gap: SPACING_3 }}>
            <Text as="span" color="muted" style={{ minWidth: '120px' }}>
              {name}
            </Text>
            <Text as="span" noMargin style={{ fontSize: size }}>
              The quick brown fox jumps over the lazy dog
            </Text>
            <Text variant="code" style={{ color: 'var(--bs-tertiary-color)', marginLeft: 'auto' }}>
              {size}
            </Text>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Display Typography - Large, attention-grabbing text for hero sections
 */
export const DisplayTypography: Story = {
  render: () => {
    const displays = [
      {
        name: 'Display 1',
        size: 1 as const,
        sizeStr: '80px',
        weight: '300',
        usage: 'Hero headings, landing pages',
      },
      {
        name: 'Display 2',
        size: 2 as const,
        sizeStr: '72px',
        weight: '300',
        usage: 'Large marketing headers',
      },
      {
        name: 'Display 3',
        size: 3 as const,
        sizeStr: '64px',
        weight: '300',
        usage: 'Section heroes',
      },
      {
        name: 'Display 4',
        size: 4 as const,
        sizeStr: '56px',
        weight: '300',
        usage: 'Feature announcements',
      },
      {
        name: 'Display 5',
        size: 5 as const,
        sizeStr: '48px',
        weight: '300',
        usage: 'Page titles',
      },
      {
        name: 'Display 6',
        size: 6 as const,
        sizeStr: '40px',
        weight: '300',
        usage: 'Section headers',
      },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING_4 }}>
        <div>
          <Heading level={2}>Display Typography Scale</Heading>
          <Text color="muted" style={{ marginTop: '8px' }}>
            Large, attention-grabbing typography for hero sections, landing pages, and marketing
            content. Uses lighter font weight (300) for elegant, modern appearance.
          </Text>
        </div>
        {displays.map(({ name, size, sizeStr, weight, usage }) => (
          <div
            key={size}
            style={{ borderTop: '1px solid var(--bs-border-color)', paddingTop: '24px' }}
          >
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--dsai-spacing-2)', marginBottom: '4px' }}
              >
                <Text as="span" weight="semibold">
                  {name}
                </Text>
                <Text variant="code" style={{ color: COLOR_SECONDARY }}>
                  {sizeStr}
                </Text>
                <Text as="span" color="muted" size="sm">
                  · Weight {weight}
                </Text>
              </div>
              <Text as="span" color="muted" size="sm" style={{ fontStyle: 'italic' }}>
                {usage}
              </Text>
            </div>
            <Display size={size} noMargin>
              The quick brown fox
            </Display>
            <Text
              variant="code"
              style={{
                color: 'var(--bs-tertiary-color)',
                marginTop: '8px',
                display: 'block',
              }}
            >
              {`var(--dsai-typography-display-display${size}-font-size)`}
            </Text>
          </div>
        ))}
        <div
          style={{
            backgroundColor: 'var(--bs-info-bg-subtle)',
            padding: SPACING_3,
            borderRadius: 'var(--dsai-border-radius-lg)',
            borderLeft: '4px solid var(--bs-info)',
            marginTop: '24px',
          }}
        >
          <Heading level={3} noMargin style={{ marginBottom: '8px' }}>
            Usage Tips
          </Heading>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--bs-info-text-emphasis)' }}>
            <li>Use display typography sparingly for maximum impact</li>
            <li>Pair with generous white space for breathing room</li>
            <li>Apply negative letter-spacing (-0.02em) for better visual balance</li>
            <li>Consider responsive scaling on smaller screens</li>
            <li>Use line-height of 1.1-1.2 for tighter, more impactful presentation</li>
          </ul>
        </div>
      </div>
    );
  },
};

/**
 * Headings
 */
export const Headings: Story = {
  render: () => {
    const headings = [
      { level: 1 as const, size: '48px', weight: '700' },
      { level: 2 as const, size: '40px', weight: '700' },
      { level: 3 as const, size: '32px', weight: '600' },
      { level: 4 as const, size: '24px', weight: '600' },
      { level: 5 as const, size: '20px', weight: '600' },
      { level: 6 as const, size: '16px', weight: '600' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING_4 }}>
        <Heading level={2}>Heading Scale</Heading>
        {headings.map(({ level, size, weight }) => (
          <div key={level}>
            <Heading level={level} noMargin>
              H{level}: The quick brown fox
            </Heading>
            <Text color="muted" size="sm" style={{ marginTop: '4px' }}>
              {size} · Font Weight {weight}
            </Text>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Font Weights
 */
export const FontWeights: Story = {
  render: () => {
    const weights = [
      { name: 'Light', value: 'light' as const },
      { name: 'Normal', value: 'normal' as const },
      { name: 'Semibold', value: 'semibold' as const },
      { name: 'Bold', value: 'bold' as const },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING_3 }}>
        <Heading level={2}>Font Weights</Heading>
        {weights.map(({ name, value }) => (
          <div key={value} style={{ display: 'flex', alignItems: 'center', gap: SPACING_4 }}>
            <Text as="span" color="muted" style={{ minWidth: '120px' }}>
              {name}
            </Text>
            <Text as="span" weight={value} size="lg" noMargin>
              The quick brown fox jumps over the lazy dog
            </Text>
            <Text variant="code" style={{ color: 'var(--bs-tertiary-color)', marginLeft: 'auto' }}>
              fw-{value}
            </Text>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Line Heights
 */
export const LineHeights: Story = {
  render: () => {
    const lineHeights = [
      { name: 'Tight', value: '1.25', description: 'For headings and short text' },
      { name: 'Normal', value: '1.5', description: 'Default for body text' },
      { name: 'Relaxed', value: '1.75', description: 'For comfortable reading' },
      { name: 'Loose', value: '2', description: 'For spacious layouts' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING_4 }}>
        <Heading level={2}>Line Height Scale</Heading>
        {lineHeights.map(({ name, value, description }) => (
          <div key={value}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: SPACING_3, marginBottom: '8px' }}
            >
              <Text as="span" weight="bold">
                {name}
              </Text>
              <Text variant="code" style={{ color: COLOR_SECONDARY }}>
                {value}
              </Text>
              <Text as="span" color="muted">
                · {description}
              </Text>
            </div>
            <Text
              noMargin
              style={{
                lineHeight: value,
                backgroundColor: 'var(--bs-gray-100)',
                padding: SPACING_3,
                borderRadius: 'var(--dsai-border-radius-lg)',
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Usage Examples
 */
export const Usage: Story = {
  render: () => (
    <div style={{ maxWidth: '800px' }}>
      <Heading level={2}>Typography Usage</Heading>

      <Heading level={3}>CSS Variables</Heading>
      <Text variant="pre">
        {`.heading {
  font-family: var(--dsai-typography-font-family-base);
  font-size: var(--dsai-typography-font-size-2xl);
  font-weight: var(--dsai-typography-font-weight-bold);
  line-height: var(--dsai-typography-line-height-tight);
}

.body-text {
  font-size: var(--dsai-typography-font-size-base);
  line-height: var(--dsai-typography-line-height-normal);
}

.code {
  font-family: var(--dsai-typography-font-family-monospace);
  font-size: var(--dsai-typography-font-size-sm);
}`}
      </Text>

      <Heading level={3}>JavaScript/TypeScript</Heading>
      <Text variant="pre">
        {`import {
  typographyFontFamilyBase,
  typographyTextBase,
  typographyFontWeightSemiBold,
  typographyLineHeightBase,
} from './generated/tokens';

const styles = {
  fontFamily: typographyFontFamilyBase,
  fontSize: typographyTextBase,
  fontWeight: typographyFontWeightSemiBold,
  lineHeight: typographyLineHeightBase,
};`}
      </Text>

      <Heading level={3}>Using Typography Components</Heading>
      <Text variant="pre">
        {`import { Heading, Display, Text } from '@dsai-io/react';

// Semantic heading with visual override
<Heading level={2} visualSize="h4">Section Title</Heading>

// Display heading for hero sections
<Display size={1} color="primary">Welcome</Display>

// Body text with variants
<Text variant="lead">Lead paragraph</Text>
<Text>Regular body text</Text>
<Text variant="code">Inline code</Text>`}
      </Text>

      <Heading level={3}>Best Practices</Heading>
      <ul>
        <li>
          <Text as="span" weight="bold">
            Use semantic HTML:
          </Text>{' '}
          <Text as="span">Use proper heading hierarchy (h1-h6)</Text>
        </li>
        <li>
          <Text as="span" weight="bold">
            Maintain contrast:
          </Text>{' '}
          <Text as="span">
            Ensure text meets WCAG 2.1 AA standards (4.5:1 for body, 3:1 for headings)
          </Text>
        </li>
        <li>
          <Text as="span" weight="bold">
            Optimize line length:
          </Text>{' '}
          <Text as="span">Keep lines between 45-75 characters for readability</Text>
        </li>
        <li>
          <Text as="span" weight="bold">
            Use relative units:
          </Text>{' '}
          <Text as="span">Typography tokens use rem for scalability</Text>
        </li>
        <li>
          <Text as="span" weight="bold">
            Consider context:
          </Text>{' '}
          <Text as="span">Use tighter line-height for headings, relaxed for body text</Text>
        </li>
      </ul>
    </div>
  ),
};

/**
 * Text Wrap - Modern CSS text-wrap control
 */
export const TextWrapExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING_4, maxWidth: '400px' }}>
      <Heading level={2}>Text Wrap</Heading>

      <div>
        <Text as="span" weight="semibold">Default (no wrap prop)</Text>
        <Heading level={3} noMargin>
          This Is a Long Heading That Will Wrap Naturally Across Lines
        </Heading>
      </div>

      <div>
        <Text as="span" weight="semibold">wrap=&quot;balance&quot;</Text>
        <Heading level={3} noMargin wrap="balance">
          This Is a Long Heading That Will Wrap With Balanced Line Lengths
        </Heading>
      </div>

      <div>
        <Text as="span" weight="semibold">wrap=&quot;pretty&quot;</Text>
        <Text wrap="pretty">
          This paragraph demonstrates the pretty text-wrap option which prevents
          orphaned words from appearing alone on the last line of a paragraph.
        </Text>
      </div>
    </div>
  ),
};

/**
 * High Contrast Mode - Enhanced accessibility
 */
export const HighContrastMode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING_4 }}>
      <Heading level={2}>High Contrast Mode</Heading>
      <Text color="muted">
        The highContrast prop enhances color contrast for WCAG AAA compliance.
      </Text>

      <div style={{ display: 'flex', gap: SPACING_4 }}>
        <div>
          <Text as="span" weight="semibold">Normal</Text>
          <Heading level={3} color="muted">Muted Heading</Heading>
          <Text color="body-secondary">Secondary body text</Text>
        </div>
        <div>
          <Text as="span" weight="semibold">High Contrast</Text>
          <Heading level={3} color="muted" highContrast>Muted Heading</Heading>
          <Text color="body-secondary" highContrast>Secondary body text</Text>
        </div>
      </div>
    </div>
  ),
};

/**
 * Display Truncation
 */
export const DisplayTruncation: Story = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <Heading level={2}>Display Truncation</Heading>
      <Display size={3} truncate>
        This Very Long Display Heading Will Be Truncated With An Ellipsis
      </Display>
      <Text color="muted" size="sm">Constrained to 500px container</Text>
    </div>
  ),
};
