// Import grouped tokens (with .value properties for easy access)
import { Heading } from '@dsai-io/react';
import { backgroundWhite, themeLight, themeDark, themePrimary } from '../../src/generated/tokens';
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
        { name: 'light', value: backgroundWhite },
        { name: 'dark', value: themeDark },
        { name: 'gray', value: themeLight },
        { name: 'brand', value: themePrimary },
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
      gap: 'var(--sb-spacing-2)',
      minWidth: '160px',
      flex: '0 0 auto',
    }}
  >
    <div
      style={{
        width: '100%',
        height: '80px',
        backgroundColor: value,
        borderRadius: 'var(--sb-border-radius-lg)',
        border: '1px solid var(--bs-border-color)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: textColor,
        fontWeight: 'var(--sb-typography-font-weight-semi-bold)',
        fontSize: '14px',
      }}
    >
      {name}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sb-spacing-1)' }}>
      <div
        style={{
          fontSize: '11px',
          color: 'var(--bs-body-color)',
          fontFamily: 'monospace',
          fontWeight: 'var(--sb-typography-font-weight-semi-bold)',
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
    const brandColors = [
      {
        name: '50',
        value: tokens.color?.blue?.[50]?.value,
        cssVar: '--dsai-color-blue-50',
        token: 'color.blue.50',
      },
      {
        name: '100',
        value: tokens.color?.blue?.[100]?.value,
        cssVar: '--dsai-color-blue-100',
        token: 'color.blue.100',
      },
      {
        name: '200',
        value: tokens.color?.blue?.[200]?.value,
        cssVar: '--dsai-color-blue-200',
        token: 'color.blue.200',
      },
      {
        name: '300',
        value: tokens.color?.blue?.[300]?.value,
        cssVar: '--dsai-color-blue-300',
        token: 'color.blue.300',
      },
      {
        name: '400',
        value: tokens.color?.blue?.[400]?.value,
        cssVar: '--dsai-color-blue-400',
        token: 'color.blue.400',
      },
      {
        name: '500',
        value: tokens.color?.blue?.[500]?.value,
        cssVar: '--dsai-color-blue-500',
        token: 'color.blue.500',
      },
      {
        name: '600',
        value: tokens.color?.blue?.[600]?.value,
        cssVar: '--dsai-color-blue-600',
        token: 'color.blue.600',
      },
      {
        name: '700',
        value: tokens.color?.blue?.[700]?.value,
        cssVar: '--dsai-color-blue-700',
        token: 'color.blue.700',
      },
      {
        name: '800',
        value: tokens.color?.blue?.[800]?.value,
        cssVar: '--dsai-color-blue-800',
        token: 'color.blue.800',
      },
      {
        name: '900',
        value: tokens.color?.blue?.[900]?.value,
        cssVar: '--dsai-color-blue-900',
        token: 'color.blue.900',
      },
      {
        name: '950',
        value: tokens.color?.blue?.[950]?.value,
        cssVar: '--dsai-color-blue-950',
        token: 'color.blue.950',
      },
    ];

    return (
      <div>
        <Heading level={2}>Brand Colors (Blue Scale)</Heading>
        <p>Primary brand color scale used for buttons, links, and interactive elements.</p>
        <div style={{ display: 'flex', gap: 'var(--sb-spacing-3)', flexWrap: 'wrap', marginTop: '24px' }}>
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
      {
        name: 'Primary',
        value: tokens.theme?.primary?.value,
        cssVar: '--dsai-theme-primary',
        token: 'theme.primary',
        description: 'Main brand color',
        textColor: 'var(--bs-white)',
      },
      {
        name: 'Secondary',
        value: tokens.theme?.secondary?.value,
        cssVar: '--dsai-theme-secondary',
        token: 'theme.secondary',
        description: 'Secondary actions',
        textColor: 'var(--bs-dark)',
      },
      {
        name: 'Success',
        value: tokens.theme?.success?.value,
        cssVar: '--dsai-theme-success',
        token: 'theme.success',
        description: 'Success states',
        textColor: 'var(--bs-white)',
      },
      {
        name: 'Danger',
        value: tokens.theme?.danger?.value,
        cssVar: '--dsai-theme-danger',
        token: 'theme.danger',
        description: 'Error states',
        textColor: 'var(--bs-white)',
      },
      {
        name: 'Warning',
        value: tokens.theme?.warning?.value,
        cssVar: '--dsai-theme-warning',
        token: 'theme.warning',
        description: 'Warning states',
        textColor: 'var(--bs-dark)',
      },
      {
        name: 'Info',
        value: tokens.theme?.info?.value,
        cssVar: '--dsai-theme-info',
        token: 'theme.info',
        description: 'Informational',
        textColor: 'var(--bs-white)',
      },
    ];

    return (
      <div>
        <Heading level={2}>Semantic Colors</Heading>
        <p>Contextual colors used for feedback, states, and semantic meaning.</p>
        <div style={{ display: 'flex', gap: 'var(--sb-spacing-3)', flexWrap: 'wrap', marginTop: '24px' }}>
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
    const componentSemanticColors = [
      {
        category: 'Body & Text',
        colors: [
          {
            name: 'Body Text',
            value: tokens.semantic?.['body-color']?.value,
            cssVar: '--dsai-semantic-body-color',
            token: 'semantic.body-color',
            description: 'Default body text color',
            textColor: 'var(--bs-white)',
          },
          {
            name: 'Body Background',
            value: tokens.semantic?.['body-bg']?.value,
            cssVar: '--dsai-semantic-body-bg',
            token: 'semantic.body-bg',
            description: 'Default body background',
            textColor: 'var(--bs-dark)',
          },
          {
            name: 'Emphasis',
            value: tokens.semantic?.['emphasis-color']?.value,
            cssVar: '--dsai-semantic-emphasis-color',
            token: 'semantic.emphasis-color',
            description: 'High contrast text',
            textColor: 'var(--bs-white)',
          },
          {
            name: 'Secondary Text',
            value: tokens.semantic?.['secondary-color']?.value || 'var(--bs-secondary)',
            cssVar: '--dsai-semantic-secondary-color',
            token: 'semantic.secondary-color',
            description: 'Lighter text',
            textColor: 'var(--bs-dark)',
          },
          {
            name: 'Tertiary Text',
            value: tokens.semantic?.['tertiary-color']?.value,
            cssVar: '--dsai-semantic-tertiary-color',
            token: 'semantic.tertiary-color',
            description: 'Lightest text',
            textColor: 'var(--bs-dark)',
          },
        ],
      },
      {
        category: 'Links',
        colors: [
          {
            name: 'Link Default',
            value: tokens.semantic?.['link-color']?.value,
            cssVar: '--dsai-semantic-link-color',
            token: 'semantic.link-color',
            description: 'Default link color',
            textColor: 'var(--bs-white)',
          },
          {
            name: 'Link Hover',
            value: tokens.semantic?.['link-hover-color']?.value,
            cssVar: '--dsai-semantic-link-hover-color',
            token: 'semantic.link-hover-color',
            description: 'Link hover state',
            textColor: 'var(--bs-white)',
          },
        ],
      },
      {
        category: 'Backgrounds',
        colors: [
          {
            name: 'Secondary BG',
            value: tokens.semantic?.['secondary-bg']?.value,
            cssVar: '--dsai-semantic-secondary-bg',
            token: 'semantic.secondary-bg',
            description: 'Secondary surface',
            textColor: 'var(--bs-dark)',
          },
          {
            name: 'Tertiary BG',
            value: tokens.semantic?.['tertiary-bg']?.value,
            cssVar: '--dsai-semantic-tertiary-bg',
            token: 'semantic.tertiary-bg',
            description: 'Tertiary surface',
            textColor: 'var(--bs-dark)',
          },
        ],
      },
      {
        category: 'Borders',
        colors: [
          {
            name: 'Border',
            value: tokens.semantic?.['border-color']?.value,
            cssVar: '--dsai-semantic-border-color',
            token: 'semantic.border-color',
            description: 'Default borders',
            textColor: 'var(--bs-dark)',
          },
          {
            name: 'Border Translucent',
            value: tokens.semantic?.['border-color-translucent']?.value || 'rgba(0,0,0,0.175)',
            cssVar: '--dsai-semantic-border-color-translucent',
            token: 'semantic.border-color-translucent',
            description: 'Translucent borders',
            textColor: 'var(--bs-white)',
          },
        ],
      },
      {
        category: 'Primary Variants',
        colors: [
          {
            name: 'Text Emphasis',
            value: tokens.semantic?.['primary-text-emphasis']?.value,
            cssVar: '--dsai-semantic-primary-text-emphasis',
            token: 'semantic.primary-text-emphasis',
            description: 'Primary text emphasis',
            textColor: 'var(--bs-white)',
          },
          {
            name: 'BG Subtle',
            value: tokens.semantic?.['primary-bg-subtle']?.value,
            cssVar: '--dsai-semantic-primary-bg-subtle',
            token: 'semantic.primary-bg-subtle',
            description: 'Primary subtle background',
            textColor: 'var(--bs-dark)',
          },
          {
            name: 'Border Subtle',
            value: tokens.semantic?.['primary-border-subtle']?.value,
            cssVar: '--dsai-semantic-primary-border-subtle',
            token: 'semantic.primary-border-subtle',
            description: 'Primary subtle border',
            textColor: 'var(--bs-dark)',
          },
        ],
      },
      {
        category: 'Success Variants',
        colors: [
          {
            name: 'Text Emphasis',
            value: tokens.semantic?.['success-text-emphasis']?.value,
            cssVar: '--dsai-semantic-success-text-emphasis',
            token: 'semantic.success-text-emphasis',
            description: 'Success text emphasis',
            textColor: 'var(--bs-white)',
          },
          {
            name: 'BG Subtle',
            value: tokens.semantic?.['success-bg-subtle']?.value,
            cssVar: '--dsai-semantic-success-bg-subtle',
            token: 'semantic.success-bg-subtle',
            description: 'Success subtle background',
            textColor: 'var(--bs-dark)',
          },
          {
            name: 'Border Subtle',
            value: tokens.semantic?.['success-border-subtle']?.value,
            cssVar: '--dsai-semantic-success-border-subtle',
            token: 'semantic.success-border-subtle',
            description: 'Success subtle border',
            textColor: 'var(--bs-dark)',
          },
        ],
      },
      {
        category: 'Danger Variants',
        colors: [
          {
            name: 'Text Emphasis',
            value: tokens.semantic?.['danger-text-emphasis']?.value,
            cssVar: '--dsai-semantic-danger-text-emphasis',
            token: 'semantic.danger-text-emphasis',
            description: 'Danger text emphasis',
            textColor: 'var(--bs-white)',
          },
          {
            name: 'BG Subtle',
            value: tokens.semantic?.['danger-bg-subtle']?.value,
            cssVar: '--dsai-semantic-danger-bg-subtle',
            token: 'semantic.danger-bg-subtle',
            description: 'Danger subtle background',
            textColor: 'var(--bs-dark)',
          },
          {
            name: 'Border Subtle',
            value: tokens.semantic?.['danger-border-subtle']?.value,
            cssVar: '--dsai-semantic-danger-border-subtle',
            token: 'semantic.danger-border-subtle',
            description: 'Danger subtle border',
            textColor: 'var(--bs-dark)',
          },
        ],
      },
      {
        category: 'Warning Variants',
        colors: [
          {
            name: 'Text Emphasis',
            value: tokens.semantic?.['warning-text-emphasis']?.value,
            cssVar: '--dsai-semantic-warning-text-emphasis',
            token: 'semantic.warning-text-emphasis',
            description: 'Warning text emphasis',
            textColor: 'var(--bs-white)',
          },
          {
            name: 'BG Subtle',
            value: tokens.semantic?.['warning-bg-subtle']?.value,
            cssVar: '--dsai-semantic-warning-bg-subtle',
            token: 'semantic.warning-bg-subtle',
            description: 'Warning subtle background',
            textColor: 'var(--bs-dark)',
          },
          {
            name: 'Border Subtle',
            value: tokens.semantic?.['warning-border-subtle']?.value,
            cssVar: '--dsai-semantic-warning-border-subtle',
            token: 'semantic.warning-border-subtle',
            description: 'Warning subtle border',
            textColor: 'var(--bs-dark)',
          },
        ],
      },
      {
        category: 'Info Variants',
        colors: [
          {
            name: 'Text Emphasis',
            value: tokens.semantic?.['info-text-emphasis']?.value,
            cssVar: '--dsai-semantic-info-text-emphasis',
            token: 'semantic.info-text-emphasis',
            description: 'Info text emphasis',
            textColor: 'var(--bs-white)',
          },
          {
            name: 'BG Subtle',
            value: tokens.semantic?.['info-bg-subtle']?.value,
            cssVar: '--dsai-semantic-info-bg-subtle',
            token: 'semantic.info-bg-subtle',
            description: 'Info subtle background',
            textColor: 'var(--bs-dark)',
          },
          {
            name: 'Border Subtle',
            value: tokens.semantic?.['info-border-subtle']?.value,
            cssVar: '--dsai-semantic-info-border-subtle',
            token: 'semantic.info-border-subtle',
            description: 'Info subtle border',
            textColor: 'var(--bs-dark)',
          },
        ],
      },
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
            <Heading level={3} style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'var(--sb-typography-font-weight-semi-bold)' }}>
              {category}
            </Heading>
            <div style={{ display: 'flex', gap: 'var(--sb-spacing-3)', flexWrap: 'wrap' }}>
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
    const neutralColors = [
      {
        name: '50',
        value: tokens.color?.gray?.[50]?.value,
        cssVar: '--dsai-color-gray-50',
        token: 'color.gray.50',
      },
      {
        name: '100',
        value: tokens.color?.gray?.[100]?.value,
        cssVar: '--dsai-color-gray-100',
        token: 'color.gray.100',
      },
      {
        name: '200',
        value: tokens.color?.gray?.[200]?.value,
        cssVar: '--dsai-color-gray-200',
        token: 'color.gray.200',
      },
      {
        name: '300',
        value: tokens.color?.gray?.[300]?.value,
        cssVar: '--dsai-color-gray-300',
        token: 'color.gray.300',
      },
      {
        name: '400',
        value: tokens.color?.gray?.[400]?.value || 'var(--bs-tertiary-color)',
        cssVar: '--dsai-color-gray-400',
        token: 'color.gray.400',
      },
      {
        name: '500',
        value: tokens.color?.gray?.[500]?.value || 'var(--bs-secondary)',
        cssVar: '--dsai-color-gray-500',
        token: 'color.gray.500',
      },
      {
        name: '600',
        value: tokens.color?.gray?.[600]?.value,
        cssVar: '--dsai-color-gray-600',
        token: 'color.gray.600',
      },
      {
        name: '700',
        value: tokens.color?.gray?.[700]?.value,
        cssVar: '--dsai-color-gray-700',
        token: 'color.gray.700',
      },
      {
        name: '800',
        value: tokens.color?.gray?.[800]?.value,
        cssVar: '--dsai-color-gray-800',
        token: 'color.gray.800',
      },
      {
        name: '900',
        value: tokens.color?.gray?.[900]?.value,
        cssVar: '--dsai-color-gray-900',
        token: 'color.gray.900',
      },
      {
        name: '950',
        value: tokens.color?.gray?.[950]?.value,
        cssVar: '--dsai-color-gray-950',
        token: 'color.gray.950',
      },
    ];

    return (
      <div>
        <Heading level={2}>Neutral Colors (Gray Scale)</Heading>
        <p>Used for text, backgrounds, borders, and UI elements.</p>
        <div style={{ display: 'flex', gap: 'var(--sb-spacing-3)', flexWrap: 'wrap', marginTop: '24px' }}>
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
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: 'var(--sb-spacing-4)' }}>
          {hues.map((hue) => (
            <div key={hue}>
              <Heading level={3} style={{ textTransform: 'capitalize', marginBottom: '16px' }}>
                {hue}
              </Heading>
              <div style={{ display: 'flex', gap: 'var(--sb-spacing-2)', flexWrap: 'wrap' }}>
                {steps.map((step) => {
                  // eslint-disable-next-line security/detect-object-injection -- Safe: hue and step are from static arrays, not user input
                  const value = tokens.color?.[hue]?.[step]?.value;
                  const cssVar = `--dsai-color-${hue}-${step}`;
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
          padding: 'var(--sb-spacing-3)',
          borderRadius: 'var(--sb-border-radius-lg)',
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
          padding: 'var(--sb-spacing-3)',
          borderRadius: 'var(--sb-border-radius-lg)',
          overflow: 'auto',
        }}
      >
        {`import { themePrimary, neutralWhite, colorBlue600 } from './generated/tokens';

const styles = {
  backgroundColor: themePrimary,
  color: neutralWhite,
  border: \`1px solid \${colorBlue600}\`,
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
