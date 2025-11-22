// Import grouped tokens (with .value properties for easy access)
import tokens from '@dsai/tokens';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundation/Colors',
  parameters: {
    docs: {
      description: {
        component:
          'DSAi color system with 121 primitive colors (11 hues × 11 steps) and 88 semantic colors for consistent theming.',
      },
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
  textColor = '#000',
}: ColorSwatchProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '8px',
      minWidth: '160px',
      flex: '0 0 auto',
    }}
  >
    <div
      style={{
        width: '100%',
        height: '80px',
        backgroundColor: value,
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: textColor,
        fontWeight: 600,
        fontSize: '14px',
      }}
    >
      {name}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ fontSize: '11px', color: '#111827', fontFamily: 'monospace', fontWeight: 600 }}>
        {value}
      </div>
      {cssVariable && (
        <div
          style={{
            fontSize: '10px',
            color: '#6b7280',
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
            color: '#9ca3af',
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
        value: tokens.color?.blue?.['50']?.value || '#eff6ff',
        cssVar: '--dsai-color-blue-50',
        token: 'color.blue.50',
      },
      {
        name: '100',
        value: tokens.color?.blue?.['100']?.value || '#dbeafe',
        cssVar: '--dsai-color-blue-100',
        token: 'color.blue.100',
      },
      {
        name: '200',
        value: tokens.color?.blue?.['200']?.value || '#bfdbfe',
        cssVar: '--dsai-color-blue-200',
        token: 'color.blue.200',
      },
      {
        name: '300',
        value: tokens.color?.blue?.['300']?.value || '#93c5fd',
        cssVar: '--dsai-color-blue-300',
        token: 'color.blue.300',
      },
      {
        name: '400',
        value: tokens.color?.blue?.['400']?.value || '#60a5fa',
        cssVar: '--dsai-color-blue-400',
        token: 'color.blue.400',
      },
      {
        name: '500',
        value: tokens.color?.blue?.['500']?.value || '#3b82f6',
        cssVar: '--dsai-color-blue-500',
        token: 'color.blue.500',
      },
      {
        name: '600',
        value: tokens.color?.blue?.['600']?.value || '#2563eb',
        cssVar: '--dsai-color-blue-600',
        token: 'color.blue.600',
      },
      {
        name: '700',
        value: tokens.color?.blue?.['700']?.value || '#1d4ed8',
        cssVar: '--dsai-color-blue-700',
        token: 'color.blue.700',
      },
      {
        name: '800',
        value: tokens.color?.blue?.['800']?.value || '#1e40af',
        cssVar: '--dsai-color-blue-800',
        token: 'color.blue.800',
      },
      {
        name: '900',
        value: tokens.color?.blue?.['900']?.value || '#1e3a8a',
        cssVar: '--dsai-color-blue-900',
        token: 'color.blue.900',
      },
      {
        name: '950',
        value: tokens.color?.blue?.['950']?.value || '#172554',
        cssVar: '--dsai-color-blue-950',
        token: 'color.blue.950',
      },
    ];

    return (
      <div>
        <h2>Brand Colors (Blue Scale)</h2>
        <p>Primary brand color scale used for buttons, links, and interactive elements.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
          {brandColors.map((color) => (
            <ColorSwatch
              key={color.name}
              name={color.name}
              value={color.value}
              cssVariable={color.cssVar}
              tokenPath={color.token}
              textColor={parseInt(color.name) >= 500 ? '#fff' : '#000'}
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
        value: tokens.theme?.primary?.value || '#0ea5e9',
        cssVar: '--dsai-theme-primary',
        token: 'theme.primary',
        description: 'Main brand color',
        textColor: '#fff',
      },
      {
        name: 'Secondary',
        value: tokens.theme?.secondary?.value || '#64748b',
        cssVar: '--dsai-theme-secondary',
        token: 'theme.secondary',
        description: 'Secondary actions',
        textColor: '#fff',
      },
      {
        name: 'Success',
        value: tokens.theme?.success?.value || '#10b981',
        cssVar: '--dsai-theme-success',
        token: 'theme.success',
        description: 'Success states',
        textColor: '#fff',
      },
      {
        name: 'Danger',
        value: tokens.theme?.danger?.value || '#ef4444',
        cssVar: '--dsai-theme-danger',
        token: 'theme.danger',
        description: 'Error states',
        textColor: '#fff',
      },
      {
        name: 'Warning',
        value: tokens.theme?.warning?.value || '#f59e0b',
        cssVar: '--dsai-theme-warning',
        token: 'theme.warning',
        description: 'Warning states',
        textColor: '#000',
      },
      {
        name: 'Info',
        value: tokens.theme?.info?.value || '#0ea5e9',
        cssVar: '--dsai-theme-info',
        token: 'theme.info',
        description: 'Informational',
        textColor: '#fff',
      },
    ];

    return (
      <div>
        <h2>Semantic Colors</h2>
        <p>Contextual colors used for feedback, states, and semantic meaning.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
          {semanticColors.map((color) => (
            <div key={color.name} style={{ minWidth: '180px' }}>
              <ColorSwatch
                name={color.name}
                value={color.value}
                cssVariable={color.cssVar}
                tokenPath={color.token}
                textColor={color.textColor}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
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
            value: tokens.semantic?.['body-color']?.value || '#212529',
            cssVar: '--dsai-semantic-body-color',
            token: 'semantic.body-color',
            description: 'Default body text color',
            textColor: '#fff',
          },
          {
            name: 'Body Background',
            value: tokens.semantic?.['body-bg']?.value || '#ffffff',
            cssVar: '--dsai-semantic-body-bg',
            token: 'semantic.body-bg',
            description: 'Default body background',
            textColor: '#000',
          },
          {
            name: 'Emphasis',
            value: tokens.semantic?.['emphasis-color']?.value || '#000000',
            cssVar: '--dsai-semantic-emphasis-color',
            token: 'semantic.emphasis-color',
            description: 'High contrast text',
            textColor: '#fff',
          },
          {
            name: 'Secondary Text',
            value: tokens.semantic?.['secondary-color']?.value || '#6c757d',
            cssVar: '--dsai-semantic-secondary-color',
            token: 'semantic.secondary-color',
            description: 'Lighter text',
            textColor: '#fff',
          },
          {
            name: 'Tertiary Text',
            value: tokens.semantic?.['tertiary-color']?.value || '#a8adb7',
            cssVar: '--dsai-semantic-tertiary-color',
            token: 'semantic.tertiary-color',
            description: 'Lightest text',
            textColor: '#000',
          },
        ],
      },
      {
        category: 'Links',
        colors: [
          {
            name: 'Link Default',
            value: tokens.semantic?.['link-color']?.value || '#0d6efd',
            cssVar: '--dsai-semantic-link-color',
            token: 'semantic.link-color',
            description: 'Default link color',
            textColor: '#fff',
          },
          {
            name: 'Link Hover',
            value: tokens.semantic?.['link-hover-color']?.value || '#0a58ca',
            cssVar: '--dsai-semantic-link-hover-color',
            token: 'semantic.link-hover-color',
            description: 'Link hover state',
            textColor: '#fff',
          },
        ],
      },
      {
        category: 'Backgrounds',
        colors: [
          {
            name: 'Secondary BG',
            value: tokens.semantic?.['secondary-bg']?.value || '#e9ecef',
            cssVar: '--dsai-semantic-secondary-bg',
            token: 'semantic.secondary-bg',
            description: 'Secondary surface',
            textColor: '#000',
          },
          {
            name: 'Tertiary BG',
            value: tokens.semantic?.['tertiary-bg']?.value || '#f8f9fa',
            cssVar: '--dsai-semantic-tertiary-bg',
            token: 'semantic.tertiary-bg',
            description: 'Tertiary surface',
            textColor: '#000',
          },
        ],
      },
      {
        category: 'Borders',
        colors: [
          {
            name: 'Border',
            value: tokens.semantic?.['border-color']?.value || '#dee2e6',
            cssVar: '--dsai-semantic-border-color',
            token: 'semantic.border-color',
            description: 'Default borders',
            textColor: '#000',
          },
          {
            name: 'Border Translucent',
            value: tokens.semantic?.['border-color-translucent']?.value || 'rgba(0,0,0,0.175)',
            cssVar: '--dsai-semantic-border-color-translucent',
            token: 'semantic.border-color-translucent',
            description: 'Translucent borders',
            textColor: '#fff',
          },
        ],
      },
      {
        category: 'Primary Variants',
        colors: [
          {
            name: 'Text Emphasis',
            value: tokens.semantic?.['primary-text-emphasis']?.value || '#052c65',
            cssVar: '--dsai-semantic-primary-text-emphasis',
            token: 'semantic.primary-text-emphasis',
            description: 'Primary text emphasis',
            textColor: '#fff',
          },
          {
            name: 'BG Subtle',
            value: tokens.semantic?.['primary-bg-subtle']?.value || '#cfe2ff',
            cssVar: '--dsai-semantic-primary-bg-subtle',
            token: 'semantic.primary-bg-subtle',
            description: 'Primary subtle background',
            textColor: '#000',
          },
          {
            name: 'Border Subtle',
            value: tokens.semantic?.['primary-border-subtle']?.value || '#9ec5fe',
            cssVar: '--dsai-semantic-primary-border-subtle',
            token: 'semantic.primary-border-subtle',
            description: 'Primary subtle border',
            textColor: '#000',
          },
        ],
      },
      {
        category: 'Success Variants',
        colors: [
          {
            name: 'Text Emphasis',
            value: tokens.semantic?.['success-text-emphasis']?.value || '#0a3622',
            cssVar: '--dsai-semantic-success-text-emphasis',
            token: 'semantic.success-text-emphasis',
            description: 'Success text emphasis',
            textColor: '#fff',
          },
          {
            name: 'BG Subtle',
            value: tokens.semantic?.['success-bg-subtle']?.value || '#d1e7dd',
            cssVar: '--dsai-semantic-success-bg-subtle',
            token: 'semantic.success-bg-subtle',
            description: 'Success subtle background',
            textColor: '#000',
          },
          {
            name: 'Border Subtle',
            value: tokens.semantic?.['success-border-subtle']?.value || '#a3cfbb',
            cssVar: '--dsai-semantic-success-border-subtle',
            token: 'semantic.success-border-subtle',
            description: 'Success subtle border',
            textColor: '#000',
          },
        ],
      },
      {
        category: 'Danger Variants',
        colors: [
          {
            name: 'Text Emphasis',
            value: tokens.semantic?.['danger-text-emphasis']?.value || '#58151c',
            cssVar: '--dsai-semantic-danger-text-emphasis',
            token: 'semantic.danger-text-emphasis',
            description: 'Danger text emphasis',
            textColor: '#fff',
          },
          {
            name: 'BG Subtle',
            value: tokens.semantic?.['danger-bg-subtle']?.value || '#f8d7da',
            cssVar: '--dsai-semantic-danger-bg-subtle',
            token: 'semantic.danger-bg-subtle',
            description: 'Danger subtle background',
            textColor: '#000',
          },
          {
            name: 'Border Subtle',
            value: tokens.semantic?.['danger-border-subtle']?.value || '#f1aeb5',
            cssVar: '--dsai-semantic-danger-border-subtle',
            token: 'semantic.danger-border-subtle',
            description: 'Danger subtle border',
            textColor: '#000',
          },
        ],
      },
      {
        category: 'Warning Variants',
        colors: [
          {
            name: 'Text Emphasis',
            value: tokens.semantic?.['warning-text-emphasis']?.value || '#664d03',
            cssVar: '--dsai-semantic-warning-text-emphasis',
            token: 'semantic.warning-text-emphasis',
            description: 'Warning text emphasis',
            textColor: '#fff',
          },
          {
            name: 'BG Subtle',
            value: tokens.semantic?.['warning-bg-subtle']?.value || '#fff3cd',
            cssVar: '--dsai-semantic-warning-bg-subtle',
            token: 'semantic.warning-bg-subtle',
            description: 'Warning subtle background',
            textColor: '#000',
          },
          {
            name: 'Border Subtle',
            value: tokens.semantic?.['warning-border-subtle']?.value || '#ffe69c',
            cssVar: '--dsai-semantic-warning-border-subtle',
            token: 'semantic.warning-border-subtle',
            description: 'Warning subtle border',
            textColor: '#000',
          },
        ],
      },
      {
        category: 'Info Variants',
        colors: [
          {
            name: 'Text Emphasis',
            value: tokens.semantic?.['info-text-emphasis']?.value || '#055160',
            cssVar: '--dsai-semantic-info-text-emphasis',
            token: 'semantic.info-text-emphasis',
            description: 'Info text emphasis',
            textColor: '#fff',
          },
          {
            name: 'BG Subtle',
            value: tokens.semantic?.['info-bg-subtle']?.value || '#cff4fc',
            cssVar: '--dsai-semantic-info-bg-subtle',
            token: 'semantic.info-bg-subtle',
            description: 'Info subtle background',
            textColor: '#000',
          },
          {
            name: 'Border Subtle',
            value: tokens.semantic?.['info-border-subtle']?.value || '#9eeaf9',
            cssVar: '--dsai-semantic-info-border-subtle',
            token: 'semantic.info-border-subtle',
            description: 'Info subtle border',
            textColor: '#000',
          },
        ],
      },
    ];

    return (
      <div>
        <h2>Component Semantic Tokens</h2>
        <p>
          Bootstrap-compatible semantic tokens for body text, links, backgrounds, borders, and
          component variants. These 35 tokens provide consistent styling across all components.
        </p>
        {componentSemanticColors.map(({ category, colors }) => (
          <div key={category} style={{ marginTop: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>{category}</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {colors.map((color) => (
                <div key={color.name} style={{ minWidth: '180px' }}>
                  <ColorSwatch
                    name={color.name}
                    value={color.value}
                    cssVariable={color.cssVar}
                    tokenPath={color.token}
                    textColor={color.textColor}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
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
        value: tokens.color?.gray?.['50']?.value || '#f9fafb',
        cssVar: '--dsai-color-gray-50',
        token: 'color.gray.50',
      },
      {
        name: '100',
        value: tokens.color?.gray?.['100']?.value || '#f3f4f6',
        cssVar: '--dsai-color-gray-100',
        token: 'color.gray.100',
      },
      {
        name: '200',
        value: tokens.color?.gray?.['200']?.value || '#e5e7eb',
        cssVar: '--dsai-color-gray-200',
        token: 'color.gray.200',
      },
      {
        name: '300',
        value: tokens.color?.gray?.['300']?.value || '#d1d5db',
        cssVar: '--dsai-color-gray-300',
        token: 'color.gray.300',
      },
      {
        name: '400',
        value: tokens.color?.gray?.['400']?.value || '#9ca3af',
        cssVar: '--dsai-color-gray-400',
        token: 'color.gray.400',
      },
      {
        name: '500',
        value: tokens.color?.gray?.['500']?.value || '#6b7280',
        cssVar: '--dsai-color-gray-500',
        token: 'color.gray.500',
      },
      {
        name: '600',
        value: tokens.color?.gray?.['600']?.value || '#4b5563',
        cssVar: '--dsai-color-gray-600',
        token: 'color.gray.600',
      },
      {
        name: '700',
        value: tokens.color?.gray?.['700']?.value || '#374151',
        cssVar: '--dsai-color-gray-700',
        token: 'color.gray.700',
      },
      {
        name: '800',
        value: tokens.color?.gray?.['800']?.value || '#1f2937',
        cssVar: '--dsai-color-gray-800',
        token: 'color.gray.800',
      },
      {
        name: '900',
        value: tokens.color?.gray?.['900']?.value || '#111827',
        cssVar: '--dsai-color-gray-900',
        token: 'color.gray.900',
      },
      {
        name: '950',
        value: tokens.color?.gray?.['950']?.value || '#030712',
        cssVar: '--dsai-color-gray-950',
        token: 'color.gray.950',
      },
    ];

    return (
      <div>
        <h2>Neutral Colors (Gray Scale)</h2>
        <p>Used for text, backgrounds, borders, and UI elements.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
          {neutralColors.map((color) => (
            <ColorSwatch
              key={color.name}
              name={color.name}
              value={color.value}
              cssVariable={color.cssVar}
              tokenPath={color.token}
              textColor={parseInt(color.name) >= 500 ? '#fff' : '#000'}
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
        <h2>Complete Color Palette</h2>
        <p>All 11 hues × 11 steps = 121 primitive colors with CSS variables and token paths.</p>
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {hues.map((hue) => (
            <div key={hue}>
              <h3 style={{ textTransform: 'capitalize', marginBottom: '16px' }}>{hue}</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {steps.map((step) => {
                  const value = (tokens.color as any)?.[hue]?.[step]?.value || '#cccccc';
                  const cssVar = `--dsai-color-${hue}-${step}`;
                  const tokenPath = `color.${hue}.${step}`;
                  const stepNum = parseInt(step);
                  return (
                    <ColorSwatch
                      key={`${hue}-${step}`}
                      name={step}
                      value={value}
                      cssVariable={cssVar}
                      tokenPath={tokenPath}
                      textColor={stepNum >= 500 ? '#fff' : '#000'}
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
      <h2>Color Usage Guidelines</h2>

      <h3>CSS Variables</h3>
      <pre
        style={{
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}
      >
        {`.my-button {
  background-color: var(--dsai-theme-primary);
  color: var(--dsai-neutral-white);
  border: 1px solid var(--dsai-color-blue-600);
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
  backgroundColor: tokens.theme.primary,
  color: tokens.neutral.white,
  border: \`1px solid \${tokens.color.blue['600']}\`,
};`}
      </pre>

      <h3>Accessibility</h3>
      <ul>
        <li>
          All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text, 3:1 for UI)
        </li>
        <li>Use semantic colors for consistent meaning across the application</li>
        <li>Don't rely on color alone to convey information</li>
        <li>Test with color blindness simulators</li>
      </ul>

      <h3>Best Practices</h3>
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
