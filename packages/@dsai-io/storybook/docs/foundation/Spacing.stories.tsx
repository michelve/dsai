import { Heading } from '@dsai-io/react';

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
                gap: 'var(--sb-spacing-4)',
                marginBottom: '16px',
                padding: 'var(--sb-spacing-2)',
                backgroundColor: 'var(--bs-gray-100)',
                borderRadius: 'var(--sb-border-radius-lg)',
              }}
            >
              <div style={{ minWidth: '80px', fontWeight: 'var(--sb-typography-font-weight-semi-bold)' }}>spacing-{token}</div>
              <div
                style={{
                  width: value,
                  height: '32px',
                  backgroundColor: 'var(--bs-info)',
                  borderRadius: 'var(--sb-border-radius-sm)',
                  border: '1px solid var(--bs-info-border-subtle)',
                }}
              />
              <div style={{ fontSize: '14px', color: 'var(--bs-secondary)' }}>
                {value} ({rem})
              </div>
              <code
                style={{
                  fontSize: '12px',
                  color: 'var(--bs-tertiary-color)',
                  marginLeft: 'auto',
                  backgroundColor: 'var(--bs-white)',
                  padding: '4px 8px',
                  borderRadius: 'var(--sb-border-radius-sm)',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sb-spacing-3)', marginTop: '24px' }}>
          {paddingExamples.map(({ name, token, value }) => (
            <div key={token}>
              <div style={{ fontSize: '14px', fontWeight: 'var(--sb-typography-font-weight-semi-bold)', marginBottom: '8px' }}>
                {name} (spacing-{token}: {value})
              </div>
              <div
                style={{
                  padding: value,
                  backgroundColor: 'var(--bs-info-bg-subtle)',
                  border: '2px dashed var(--bs-info)',
                  borderRadius: 'var(--sb-border-radius-lg)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--bs-info)',
                    color: 'white',
                    padding: 'var(--sb-spacing-2)',
                    borderRadius: 'var(--sb-border-radius-sm)',
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
          padding: 'var(--sb-spacing-4)',
          backgroundColor: 'var(--bs-gray-100)',
          borderRadius: 'var(--sb-border-radius-lg)',
        }}
      >
        <Heading level={3} noMargin>
          Heading
        </Heading>
        <p style={{ marginTop: '8px', marginBottom: '0', color: 'var(--bs-secondary)' }}>
          margin-top: spacing-2 (8px)
        </p>

        <div
          style={{
            marginTop: '16px',
            padding: 'var(--sb-spacing-3)',
            backgroundColor: 'var(--bs-white)',
            borderRadius: 'var(--sb-border-radius-lg)',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          Content block with spacing-3 (16px) top margin
        </div>

        <div
          style={{
            marginTop: '24px',
            padding: 'var(--sb-spacing-3)',
            backgroundColor: 'var(--bs-white)',
            borderRadius: 'var(--sb-border-radius-lg)',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          Content block with spacing-4 (24px) top margin
        </div>

        <div
          style={{
            marginTop: '32px',
            padding: 'var(--sb-spacing-3)',
            backgroundColor: 'var(--bs-white)',
            borderRadius: 'var(--sb-border-radius-lg)',
            border: '1px solid var(--bs-border-color)',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sb-spacing-4)', marginTop: '24px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'var(--sb-typography-font-weight-semi-bold)', marginBottom: '8px' }}>
            Gap: spacing-2 (8px)
          </div>
          <div style={{ display: 'flex', gap: 'var(--sb-spacing-2)' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: 'var(--sb-spacing-3)',
                  backgroundColor: 'var(--bs-info)',
                  color: 'white',
                  borderRadius: 'var(--sb-border-radius-lg)',
                  textAlign: 'center',
                }}
              >
                Item {i}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: 'var(--sb-typography-font-weight-semi-bold)', marginBottom: '8px' }}>
            Gap: spacing-4 (24px)
          </div>
          <div style={{ display: 'flex', gap: 'var(--sb-spacing-4)' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: 'var(--sb-spacing-3)',
                  backgroundColor: 'var(--bs-success)',
                  color: 'white',
                  borderRadius: 'var(--sb-border-radius-lg)',
                  textAlign: 'center',
                }}
              >
                Item {i}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: 'var(--sb-typography-font-weight-semi-bold)', marginBottom: '8px' }}>
            Gap: spacing-6 (48px)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sb-spacing-5)' }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  padding: 'var(--sb-spacing-4)',
                  backgroundColor: 'var(--bs-primary)',
                  color: 'white',
                  borderRadius: 'var(--sb-border-radius-lg)',
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
          backgroundColor: 'var(--bs-gray-100)',
          padding: 'var(--sb-spacing-3)',
          borderRadius: 'var(--sb-border-radius-lg)',
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
          backgroundColor: 'var(--bs-gray-100)',
          padding: 'var(--sb-spacing-3)',
          borderRadius: 'var(--sb-border-radius-lg)',
          overflow: 'auto',
        }}
      >
        {`import { spacing2, spacing3, spacing4 } from './generated/tokens';

const styles = {
  padding: spacing4,
  marginBottom: spacing3,
  gap: spacing2,
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
