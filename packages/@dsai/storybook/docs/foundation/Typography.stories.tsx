import tokens from '@dsai/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
        { name: 'gray', value: '#f5f5f5' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3>Base Font (Inter)</h3>
        <p
          style={{
            fontFamily: tokens.typography?.fontFamily?.base || 'Inter, sans-serif',
            fontSize: '16px',
            marginTop: '8px',
          }}
        >
          The quick brown fox jumps over the lazy dog. 0123456789
        </p>
        <code style={{ fontSize: '12px', color: '#6b7280' }}>
          var(--dsai-typography-font-family-base)
        </code>
      </div>

      <div>
        <h3>Monospace Font (Fira Code)</h3>
        <p
          style={{
            fontFamily: tokens.typography?.fontFamily?.monospace || '"Fira Code", monospace',
            fontSize: '16px',
            marginTop: '8px',
          }}
        >
          const greeting = "Hello, World!"; // Code example
        </p>
        <code style={{ fontSize: '12px', color: '#6b7280' }}>
          var(--dsai-typography-font-family-monospace)
        </code>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2>Font Size Scale</h2>
        {sizes.map(({ name, token, size }) => (
          <div key={token} style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <div style={{ minWidth: '120px', fontSize: '14px', color: '#6b7280' }}>{name}</div>
            <div style={{ fontSize: size }}>The quick brown fox jumps over the lazy dog</div>
            <code style={{ fontSize: '12px', color: '#9ca3af', marginLeft: 'auto' }}>{size}</code>
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
        token: 'display1',
        size: '80px',
        weight: '300',
        usage: 'Hero headings, landing pages',
      },
      {
        name: 'Display 2',
        token: 'display2',
        size: '72px',
        weight: '300',
        usage: 'Large marketing headers',
      },
      {
        name: 'Display 3',
        token: 'display3',
        size: '64px',
        weight: '300',
        usage: 'Section heroes',
      },
      {
        name: 'Display 4',
        token: 'display4',
        size: '56px',
        weight: '300',
        usage: 'Feature announcements',
      },
      {
        name: 'Display 5',
        token: 'display5',
        size: '48px',
        weight: '300',
        usage: 'Page titles',
      },
      {
        name: 'Display 6',
        token: 'display6',
        size: '40px',
        weight: '300',
        usage: 'Section headers',
      },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div>
          <h2>Display Typography Scale</h2>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>
            Large, attention-grabbing typography for hero sections, landing pages, and marketing
            content. Uses lighter font weight (300) for elegant, modern appearance.
          </p>
        </div>
        {displays.map(({ name, token, size, weight, usage }) => (
          <div key={token} style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{name}</span>
                <code style={{ fontSize: '12px', color: '#6b7280' }}>{size}</code>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>· Weight {weight}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>{usage}</div>
            </div>
            <div
              style={{
                fontSize: size,
                fontWeight: weight,
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}
            >
              The quick brown fox
            </div>
            <code
              style={{
                fontSize: '11px',
                color: '#9ca3af',
                marginTop: '8px',
                display: 'block',
                fontFamily: 'monospace',
              }}
            >
              var(--dsai-typography-display-{token}-font-size)
            </code>
          </div>
        ))}
        <div
          style={{
            backgroundColor: '#f0f9ff',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #0ea5e9',
            marginTop: '24px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0' }}>Usage Tips</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c4a6e' }}>
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
      { tag: 'h1', size: '48px', weight: '700' },
      { tag: 'h2', size: '40px', weight: '700' },
      { tag: 'h3', size: '32px', weight: '600' },
      { tag: 'h4', size: '24px', weight: '600' },
      { tag: 'h5', size: '20px', weight: '600' },
      { tag: 'h6', size: '16px', weight: '600' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2>Heading Scale</h2>
        {headings.map(({ tag, size, weight }) => {
          const Tag = tag as keyof JSX.IntrinsicElements;
          return (
            <div key={tag}>
              <Tag style={{ fontSize: size, fontWeight: weight, margin: 0 }}>
                {tag.toUpperCase()}: The quick brown fox
              </Tag>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                {size} · Font Weight {weight}
              </div>
            </div>
          );
        })}
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
      { name: 'Regular', value: '400' },
      { name: 'Medium', value: '500' },
      { name: 'Semibold', value: '600' },
      { name: 'Bold', value: '700' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2>Font Weights</h2>
        {weights.map(({ name, value }) => (
          <div key={value} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ minWidth: '120px', fontSize: '14px', color: '#6b7280' }}>{name}</div>
            <div style={{ fontSize: '18px', fontWeight: value }}>
              The quick brown fox jumps over the lazy dog
            </div>
            <code style={{ fontSize: '12px', color: '#9ca3af', marginLeft: 'auto' }}>{value}</code>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <h2>Line Height Scale</h2>
        {lineHeights.map(({ name, value, description }) => (
          <div key={value}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}
            >
              <strong>{name}</strong>
              <code style={{ fontSize: '12px', color: '#6b7280' }}>{value}</code>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>· {description}</span>
            </div>
            <p
              style={{
                lineHeight: value,
                fontSize: '16px',
                backgroundColor: '#f3f4f6',
                padding: '16px',
                borderRadius: '8px',
                margin: 0,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
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
      <h2>Typography Usage</h2>

      <h3>CSS Variables</h3>
      <pre
        style={{
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}
      >
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
      </pre>

      <h3>JavaScript/TypeScript</h3>
      <pre
        style={{
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}
      >
        {`import tokens from '@dsai/tokens';

const styles = {
  fontFamily: tokens.typography.fontFamily.base,
  fontSize: tokens.typography.fontSize.base,
  fontWeight: tokens.typography.fontWeight.semibold,
  lineHeight: tokens.typography.lineHeight.normal,
};`}
      </pre>

      <h3>Best Practices</h3>
      <ul>
        <li>
          <strong>Use semantic HTML:</strong> Use proper heading hierarchy (h1-h6)
        </li>
        <li>
          <strong>Maintain contrast:</strong> Ensure text meets WCAG 2.1 AA standards (4.5:1 for
          body, 3:1 for headings)
        </li>
        <li>
          <strong>Optimize line length:</strong> Keep lines between 45-75 characters for readability
        </li>
        <li>
          <strong>Use relative units:</strong> Typography tokens use rem for scalability
        </li>
        <li>
          <strong>Consider context:</strong> Use tighter line-height for headings, relaxed for body
          text
        </li>
      </ul>
    </div>
  ),
};
