import { Heading } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundation/Spacing',
  parameters: {
    docs: {
      description: {
        component:
          'Consistent spacing scale (0-10) for margins, padding, and gaps. Base unit: 4px, Bootstrap-compatible. Tip: Use the Measure & Outline tool in the toolbar to see actual spacing values.',
      },
    },
    // Encourage use of Measure & Outline tools for precise spacing verification
    options: {
      showPanel: true,
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Spacing Scale
 */
export const SpacingScale: Story = {
  render: () => {
    const spacingValues = [
      { token: '0', value: '0px', rem: '0' },
      { token: '1', value: '4px', rem: '0.25rem' },
      { token: '2', value: '8px', rem: '0.5rem' },
      { token: '3', value: '16px', rem: '1rem' },
      { token: '4', value: '24px', rem: '1.5rem' },
      { token: '5', value: '32px', rem: '2rem' },
      { token: '6', value: '48px', rem: '3rem' },
      { token: '7', value: '64px', rem: '4rem' },
      { token: '8', value: '80px', rem: '5rem' },
      { token: '9', value: '96px', rem: '6rem' },
      { token: '10', value: '128px', rem: '8rem' },
    ];

    return (
      <div>
        <Heading level={2}>Spacing Scale</Heading>
        <p>Base 4px scale for consistent spacing throughout the design system.</p>
        <div style={{ marginTop: '24px' }}>
          {spacingValues.map(({ token, value, rem }) => (
            <div
              key={token}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
              }}
            >
              <div style={{ minWidth: '80px', fontWeight: 600 }}>spacing-{token}</div>
              <div
                style={{
                  width: value,
                  height: '32px',
                  backgroundColor: '#0ea5e9',
                  borderRadius: '4px',
                  border: '1px solid #0284c7',
                }}
              />
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {value} ({rem})
              </div>
              <code
                style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginLeft: 'auto',
                  backgroundColor: '#fff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                var(--dsai-spacing-{token})
              </code>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Padding Examples
 */
export const PaddingExamples: Story = {
  render: () => {
    const paddingExamples = [
      { name: 'Small', token: '2', value: '8px' },
      { name: 'Medium', token: '3', value: '16px' },
      { name: 'Large', token: '4', value: '24px' },
      { name: 'Extra Large', token: '6', value: '48px' },
    ];

    return (
      <div>
        <Heading level={2}>Padding Examples</Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
          {paddingExamples.map(({ name, token, value }) => (
            <div key={token}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                {name} (spacing-{token}: {value})
              </div>
              <div
                style={{
                  padding: value,
                  backgroundColor: '#eff6ff',
                  border: '2px dashed #0ea5e9',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '4px',
                    textAlign: 'center',
                  }}
                >
                  Content with {value} padding
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Margin Examples
 */
export const MarginExamples: Story = {
  render: () => (
    <div>
      <Heading level={2}>Margin Examples</Heading>
      <p>Consistent vertical rhythm using margin tokens.</p>
      <div
        style={{
          marginTop: '24px',
          padding: '24px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
        }}
      >
        <Heading level={3} noMargin>
          Heading
        </Heading>
        <p style={{ marginTop: '8px', marginBottom: '0', color: '#6b7280' }}>
          margin-top: spacing-2 (8px)
        </p>

        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          Content block with spacing-3 (16px) top margin
        </div>

        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          Content block with spacing-4 (24px) top margin
        </div>

        <div
          style={{
            marginTop: '32px',
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          Content block with spacing-5 (32px) top margin
        </div>
      </div>
    </div>
  ),
};

/**
 * Gap Examples (Flexbox/Grid)
 */
export const GapExamples: Story = {
  render: () => (
    <div>
      <Heading level={2}>Gap Examples (Flexbox/Grid)</Heading>
      <p>Using spacing tokens for gap in flex and grid layouts.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
            Gap: spacing-2 (8px)
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                Item {i}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
            Gap: spacing-4 (24px)
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                Item {i}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
            Gap: spacing-6 (48px)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  padding: '24px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                Grid Item {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Usage Guidelines
 */
export const Usage: Story = {
  render: () => (
    <div style={{ maxWidth: '800px' }}>
      <Heading level={2}>Spacing Usage Guidelines</Heading>

      <Heading level={3}>CSS Variables</Heading>
      <pre
        style={{
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}
      >
        {`.card {
  padding: var(--dsai-spacing-4);
  margin-bottom: var(--dsai-spacing-3);
  gap: var(--dsai-spacing-2);
}

.section {
  padding-top: var(--dsai-spacing-6);
  padding-bottom: var(--dsai-spacing-6);
}`}
      </pre>

      <Heading level={3}>JavaScript/TypeScript</Heading>
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
  padding: tokens.spacing['4'],
  marginBottom: tokens.spacing['3'],
  gap: tokens.spacing['2'],
};`}
      </pre>

      <Heading level={3}>Best Practices</Heading>
      <ul>
        <li>
          <strong>Use spacing scale consistently:</strong> Stick to the defined tokens for
          predictable layouts
        </li>
        <li>
          <strong>Smaller gaps for related content:</strong> Use spacing-1 or spacing-2 within
          components
        </li>
        <li>
          <strong>Larger gaps for sections:</strong> Use spacing-5 to spacing-8 between major
          sections
        </li>
        <li>
          <strong>Vertical rhythm:</strong> Maintain consistent vertical spacing throughout the page
        </li>
        <li>
          <strong>Responsive spacing:</strong> Consider adjusting spacing for different breakpoints
        </li>
      </ul>

      <Heading level={3}>Bootstrap Compatibility</Heading>
      <p>DSAi spacing tokens align with Bootstrap&apos;s spacing utilities:</p>
      <ul>
        <li>
          <code>spacing-0</code> = Bootstrap <code>$spacer * 0</code>
        </li>
        <li>
          <code>spacing-1</code> = Bootstrap <code>$spacer * 0.25</code>
        </li>
        <li>
          <code>spacing-2</code> = Bootstrap <code>$spacer * 0.5</code>
        </li>
        <li>
          <code>spacing-3</code> = Bootstrap <code>$spacer * 1</code> (base 16px)
        </li>
        <li>
          <code>spacing-4</code> = Bootstrap <code>$spacer * 1.5</code>
        </li>
        <li>
          <code>spacing-5</code> = Bootstrap <code>$spacer * 2</code>
        </li>
      </ul>
    </div>
  ),
};
