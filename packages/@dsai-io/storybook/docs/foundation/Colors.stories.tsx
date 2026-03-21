// Import grouped tokens (with .value properties for easy access)
import { Heading } from '@dsai-io/react';
import { BackgroundWhite, ThemeLight, ThemeDark, ThemePrimary } from '../../src/generated/tokens';
import tokens from '../../src/generated/tokens-grouped';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundation/Colors',
  parameters: {
    docs: {
      description: {
        component:
          'DSAi color system with 121 primitive colors (11 hues × 11 steps) and 88 semantic colors for consistent theming.',
      },
    },
    // Enable background testing for color contrast verification
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: BackgroundWhite },
        { name: 'dark', value: ThemeDark },
        { name: 'gray', value: ThemeLight },
        { name: 'brand', value: ThemePrimary },
      ],
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Color Swatch Component
 */
interface ColorSwatchProps {
  name: string;
  value: string;
  cssVariable?: string;
  tokenPath?: string;
  textColor?: string;
}

const ColorSwatch = ({
  name,
  value,
  cssVariable,
  tokenPath,
  textColor = 'var(--bs-dark)',
}: ColorSwatchProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 'var(--dsai-spacing-2)',
      minWidth: '160px',
      flex: '0 0 auto',
    }}
  >
    <div
      style={{
        width: '100%',
        height: '80px',
        backgroundColor: cssVariable ? `var(${cssVariable})` : value,
        borderRadius: 'var(--dsai-border-radius-lg)',
        border: '1px solid var(--bs-border-color)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: textColor,
        fontWeight: 'var(--dsai-typography-font-weight-semi-bold)',
        fontSize: '14px',
      }}
    >
      {name}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dsai-spacing-1)' }}>
      <div
        style={{
          fontSize: '11px',
          color: 'var(--bs-body-color)',
          fontFamily: 'monospace',
          fontWeight: 'var(--dsai-typography-font-weight-semi-bold)',
        }}
      >
        {value}
      </div>
      {cssVariable && (
        <div
          style={{
            fontSize: '10px',
            color: 'var(--bs-body-color)',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
          }}
        >
          {cssVariable}
        </div>
      )}
      {tokenPath && (
        <div
          style={{
            fontSize: '10px',
            color: 'var(--bs-body-color)',
            fontFamily: 'monospace',
            fontStyle: 'italic',
            wordBreak: 'break-all',
          }}
        >
          {tokenPath}
        </div>
      )}
    </div>
  </div>
);

/**
 * Brand Colors - Primary teal colors for main interactive elements
 */
export const BrandColors: Story = {
  render: () => {
    const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    const brandColors = steps.map((step) => {
      const t = tokens.color?.blue?.[step];
      return {
        name: step,
        value: t?.value,
        cssVar: t?.cssVar,
        token: `color.blue.${step}`,
      };
    });

    return (
      <div>
        <Heading level={2}>Brand Colors (Blue Scale)</Heading>
        <p>Primary brand color scale used for buttons, links, and interactive elements.</p>
        <div style={{ display: 'flex', gap: 'var(--dsai-spacing-3)', flexWrap: 'wrap', marginTop: '24px' }}>
          {brandColors.map((color) => (
            <ColorSwatch
              key={color.name}
              name={color.name}
              value={color.value}
              cssVariable={color.cssVar}
              tokenPath={color.token}
              textColor={parseInt(color.name, 10) >= 500 ? 'var(--bs-white)' : 'var(--bs-dark)'}
            />
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Semantic Colors - Contextual colors with meaning
 */
export const SemanticColors: Story = {
  render: () => {
    const semanticColors = [
      { name: 'Primary', key: 'primary', description: 'Main brand color', textColor: 'var(--bs-white)' },
      { name: 'Secondary', key: 'secondary', description: 'Secondary actions', textColor: 'var(--bs-dark)' },
      { name: 'Success', key: 'success', description: 'Success states', textColor: 'var(--bs-white)' },
      { name: 'Danger', key: 'danger', description: 'Error states', textColor: 'var(--bs-white)' },
      { name: 'Warning', key: 'warning', description: 'Warning states', textColor: 'var(--bs-dark)' },
      { name: 'Info', key: 'info', description: 'Informational', textColor: 'var(--bs-white)' },
    ].map(({ key, ...rest }) => {
      const t = tokens.theme?.[key];
      return {
        ...rest,
        value: t?.value,
        cssVar: t?.cssVar,
        token: `theme.${key}`,
      };
    });

    return (
      <div>
        <Heading level={2}>Semantic Colors</Heading>
        <p>Contextual colors used for feedback, states, and semantic meaning.</p>
        <div style={{ display: 'flex', gap: 'var(--dsai-spacing-3)', flexWrap: 'wrap', marginTop: '24px' }}>
          {semanticColors.map((color) => (
            <div key={color.name} style={{ minWidth: '180px' }}>
              <ColorSwatch
                name={color.name}
                value={color.value}
                cssVariable={color.cssVar}
                tokenPath={color.token}
                textColor={color.textColor}
              />
              <p style={{ fontSize: '12px', color: 'var(--bs-secondary)', marginTop: '8px' }}>
                {color.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Component Semantic Colors - Bootstrap-compatible semantic tokens
 */
export const ComponentSemanticColors: Story = {
  render: () => {
    /** Helper to build a semantic color entry from the grouped tokens */
    const sem = (name: string, key: string, description: string, textColor = 'var(--bs-dark)') => {
      const t = tokens.semantic?.[key];
      return { name, value: t?.value, cssVar: t?.cssVar, token: `semantic.${key}`, description, textColor };
    };

    const componentSemanticColors = [
      {
        category: 'Body & Text',
        colors: [
          sem('Body Text', 'body-color', 'Default body text color', 'var(--bs-white)'),
          sem('Body Background', 'body-bg', 'Default body background'),
          sem('Emphasis', 'emphasis-color', 'High contrast text', 'var(--bs-white)'),
          sem('Secondary Text', 'secondary-color', 'Lighter text'),
          sem('Tertiary Text', 'tertiary-color', 'Lightest text'),
        ],
      },
      {
        category: 'Links',
        colors: [
          sem('Link Default', 'link-color', 'Default link color', 'var(--bs-white)'),
          sem('Link Hover', 'link-hover-color', 'Link hover state', 'var(--bs-white)'),
        ],
      },
      {
        category: 'Backgrounds',
        colors: [
          sem('Secondary BG', 'secondary-bg', 'Secondary surface'),
          sem('Tertiary BG', 'tertiary-bg', 'Tertiary surface'),
        ],
      },
      {
        category: 'Borders',
        colors: [
          sem('Border', 'border-color', 'Default borders'),
          sem('Border Translucent', 'border-color-translucent', 'Translucent borders', 'var(--bs-white)'),
        ],
      },
      ...['Primary', 'Success', 'Danger', 'Warning', 'Info'].map((variant) => {
        const prefix = variant.toLowerCase();
        return {
          category: `${variant} Variants`,
          colors: [
            sem('Text Emphasis', `${prefix}-text-emphasis`, `${variant} text emphasis`, 'var(--bs-white)'),
            sem('BG Subtle', `${prefix}-bg-subtle`, `${variant} subtle background`),
            sem('Border Subtle', `${prefix}-border-subtle`, `${variant} subtle border`),
          ],
        };
      }),
    ];

    return (
      <div>
        <Heading level={2}>Component Semantic Tokens</Heading>
        <p>
          Bootstrap-compatible semantic tokens for body text, links, backgrounds, borders, and
          component variants. These 35 tokens provide consistent styling across all components.
        </p>
        {componentSemanticColors.map(({ category, colors }) => (
          <div key={category} style={{ marginTop: '32px' }}>
            <Heading level={3} style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'var(--dsai-typography-font-weight-semi-bold)' }}>
              {category}
            </Heading>
            <div style={{ display: 'flex', gap: 'var(--dsai-spacing-3)', flexWrap: 'wrap' }}>
              {colors.map((color) => (
                <div key={color.name} style={{ minWidth: '180px' }}>
                  <ColorSwatch
                    name={color.name}
                    value={color.value}
                    cssVariable={color.cssVar}
                    tokenPath={color.token}
                    textColor={color.textColor}
                  />
                  <p style={{ fontSize: '12px', color: 'var(--bs-secondary)', marginTop: '8px' }}>
                    {color.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Neutral Colors - Gray scale for text, backgrounds, borders
 */
export const NeutralColors: Story = {
  render: () => {
    const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    const neutralColors = steps.map((step) => {
      const t = tokens.color?.gray?.[step];
      return {
        name: step,
        value: t?.value,
        cssVar: t?.cssVar,
        token: `color.gray.${step}`,
      };
    });

    return (
      <div>
        <Heading level={2}>Neutral Colors (Gray Scale)</Heading>
        <p>Used for text, backgrounds, borders, and UI elements.</p>
        <div style={{ display: 'flex', gap: 'var(--dsai-spacing-3)', flexWrap: 'wrap', marginTop: '24px' }}>
          {neutralColors.map((color) => (
            <ColorSwatch
              key={color.name}
              name={color.name}
              value={color.value}
              cssVariable={color.cssVar}
              tokenPath={color.token}
              textColor={parseInt(color.name, 10) >= 500 ? 'var(--bs-white)' : 'var(--bs-dark)'}
            />
          ))}
        </div>
      </div>
    );
  },
};

/**
 * All Color Hues - Complete color palette
 */
export const AllColorHues: Story = {
  render: () => {
    const hues = [
      'blue',
      'cyan',
      'gray',
      'green',
      'indigo',
      'orange',
      'pink',
      'purple',
      'red',
      'teal',
      'yellow',
    ];
    const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

    return (
      <div>
        <Heading level={2}>Complete Color Palette</Heading>
        <p>All 11 hues × 11 steps = 121 primitive colors with CSS variables and token paths.</p>
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: 'var(--dsai-spacing-4)' }}>
          {hues.map((hue) => (
            <div key={hue}>
              <Heading level={3} style={{ textTransform: 'capitalize', marginBottom: '16px' }}>
                {hue}
              </Heading>
              <div style={{ display: 'flex', gap: 'var(--dsai-spacing-2)', flexWrap: 'wrap' }}>
                {steps.map((step) => {
                  // eslint-disable-next-line security/detect-object-injection -- Safe: hue and step are from static arrays, not user input
                  const t = tokens.color?.[hue]?.[step];
                  const value = t?.value;
                  const cssVar = t?.cssVar;
                  const tokenPath = `color.${hue}.${step}`;
                  const stepNum = parseInt(step, 10);
                  return (
                    <ColorSwatch
                      key={`${hue}-${step}`}
                      name={step}
                      value={value}
                      cssVariable={cssVar}
                      tokenPath={tokenPath}
                      textColor={stepNum >= 500 ? 'var(--bs-white)' : 'var(--bs-dark)'}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Usage Guidelines
 */
export const Usage: Story = {
  render: () => (
    <div style={{ maxWidth: '800px' }}>
      <Heading level={2}>Color Usage Guidelines</Heading>

      <Heading level={3}>CSS Variables</Heading>
      <pre
        style={{
          backgroundColor: 'var(--bs-gray-100)',
          padding: 'var(--dsai-spacing-3)',
          borderRadius: 'var(--dsai-border-radius-lg)',
          overflow: 'auto',
        }}
      >
        {`.my-button {
  background-color: var(--dsai-theme-primary);
  color: var(--dsai-neutral-white);
  border: 1px solid var(--dsai-color-blue-600);
}`}
      </pre>

      <Heading level={3}>JavaScript/TypeScript</Heading>
      <pre
        style={{
          backgroundColor: 'var(--bs-gray-100)',
          padding: 'var(--dsai-spacing-3)',
          borderRadius: 'var(--dsai-border-radius-lg)',
          overflow: 'auto',
        }}
      >
        {`import { ThemePrimary, NeutralWhite, ColorBlue_600 } from './generated/tokens';

const styles = {
  backgroundColor: ThemePrimary,
  color: NeutralWhite,
  border: \`1px solid \${ColorBlue_600}\`,
};`}
      </pre>

      <Heading level={3}>Accessibility</Heading>
      <ul>
        <li>
          All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text, 3:1 for UI)
        </li>
        <li>Use semantic colors for consistent meaning across the application</li>
        <li>Do not rely on color alone to convey information</li>
        <li>Test with color blindness simulators</li>
      </ul>

      <Heading level={3}>Best Practices</Heading>
      <ul>
        <li>
          <strong>Use semantic colors first:</strong> theme.primary instead of color.blue.500
        </li>
        <li>
          <strong>Maintain contrast:</strong> Ensure text is readable on all backgrounds
        </li>
        <li>
          <strong>Be consistent:</strong> Use the same color for the same purpose
        </li>
        <li>
          <strong>Consider dark mode:</strong> Semantic tokens adapt automatically
        </li>
      </ul>
    </div>
  ),
};
