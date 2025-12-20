/**
 * Themes & Modes Story
 *
 * Demonstrates DSAi's theming system including:
 * - Light and Dark mode support
 * - Theme color tokens
 * - How to switch themes programmatically
 * - CSS variable customization
 */

import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Heading,
  MoonFillIcon,
  SunFillIcon,
} from '@dsai/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundation/Themes & Modes',
  parameters: {
    docs: {
      description: {
        component: `DSAi supports **Light** and **Dark** modes with automatic theme switching.

## Quick Start

1. **Import the theme CSS** in your app entry point:
   \`\`\`tsx
   import '@dsai/tokens/dist/css/dsai-theme-bs.css';
   \`\`\`

2. **Set the theme** using the \`data-dsai-theme\` attribute:
   \`\`\`html
   <html data-dsai-theme="light">
   <!-- or -->
   <html data-dsai-theme="dark">
   \`\`\`

3. **Toggle programmatically**:
   \`\`\`tsx
   document.documentElement.setAttribute('data-dsai-theme', 'dark');
   \`\`\`

## Features
- All DSAi components automatically adapt to the active theme
- CSS variables update based on theme mode
- Supports scoped theming (apply \`data-dsai-theme\` to any container)
- System preference detection with \`prefers-color-scheme\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ============================================================================
// Code Block Component for displaying code snippets
// ============================================================================

interface CodeBlockProps {
  children: string;
  title?: string;
}

const CodeBlock = ({ children, title }: CodeBlockProps) => (
  <div style={{ marginBottom: '32px' }}>
    {title && <Heading level={3} style={{ color: 'var(--bs-dark)' }}>{title}</Heading>}
    <pre
      style={{
        backgroundColor: 'var(--bs-tertiary-bg)',
        padding: '16px',
        borderRadius: '8px',
        overflow: 'auto',
        margin: 0,
      }}
    >
      <code style={{ fontFamily: 'monospace', fontSize: '14px' }}>{children}</code>
    </pre>
  </div>
);

// ============================================================================
// Interactive Theme Switcher Component
// ============================================================================

const ThemeSwitcherDemo = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <Button
          variant={theme === 'light' ? 'primary' : 'outline-primary'}
          onClick={() => setTheme('light')}
          startIcon={<SunFillIcon />}
        >
          Light Mode
        </Button>
        <Button
          variant={theme === 'dark' ? 'primary' : 'outline-primary'}
          onClick={() => setTheme('dark')}
          startIcon={<MoonFillIcon />}
        >
          Dark Mode
        </Button>
      </div>

      <div
        data-dsai-theme={theme}
        style={{
          padding: '24px',
          borderRadius: '12px',
          backgroundColor: 'var(--bs-body-bg)',
          color: 'var(--bs-body-color)',
          border: '1px solid var(--bs-border-color)',
          transition: 'all 0.3s ease',
        }}
      >
        <Heading level={3}>
          Themed Container
        </Heading>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm">
            Primary
          </Button>
          <Button variant="outline-primary" size="sm">
            Outline
          </Button>
          <Button variant="secondary" size="sm">
            Secondary
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * Toggle between Light and Dark modes to see how components adapt.
 * The theme is controlled by the `data-dsai-theme` attribute on a container element.
 */
export const ThemeSwitcher: Story = {
  render: () => <ThemeSwitcherDemo />,
};

// ============================================================================
// Side-by-Side Comparison Component
// ============================================================================

const ThemeDemo = ({ mode }: { mode: 'light' | 'dark' }) => (
  <div
    data-dsai-theme={mode}
    style={{
      flex: 1,
      padding: '24px',
      borderRadius: '12px',
      backgroundColor: 'var(--bs-body-bg)',
      color: 'var(--bs-body-color)',
      border: '1px solid var(--bs-border-color)',
    }}
  >
    <Heading level={4} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {mode === 'light' ? <SunFillIcon aria-hidden /> : <MoonFillIcon aria-hidden />}
      {mode === 'light' ? 'Light Mode' : 'Dark Mode'}
    </Heading>

    <Alert variant="info" className="mb-3">
      This is an info alert in {mode} mode.
    </Alert>

    <Card style={{ marginBottom: '16px' }}>
      <CardBody>
        <CardTitle>Card Component</CardTitle>
        <CardText>Cards adapt their styling based on the current theme.</CardText>
        <Button variant="primary" size="sm">
          Learn More
        </Button>
      </CardBody>
    </Card>

    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  </div>
);

/**
 * Compare Light and Dark modes side by side to see the visual differences.
 */
export const SideBySideComparison: Story = {
  render: () => (
    <div>
      <div style={{ display: 'flex', gap: '24px' }}>
        <ThemeDemo mode="light" />
        <ThemeDemo mode="dark" />
      </div>
    </div>
  ),
};

// ============================================================================
// Theme Implementation Guide Story
// ============================================================================

/**
 * Learn how to implement theme switching in your application.
 */
export const Implementation: Story = {
  render: () => (
    <div>

      <CodeBlock title="1. Import Theme CSS">
        {`// In your main entry file (e.g., App.tsx or main.tsx)
import '@dsai/tokens/dist/css/dsai-theme-bs.css';`}
      </CodeBlock>

      <CodeBlock title="2. Set Theme Attribute">
        {`<!-- Light mode (default) -->
<html data-dsai-theme="light">

<!-- Dark mode -->
<html data-dsai-theme="dark">

<!-- Or on any container element -->
<div data-dsai-theme="dark">
  <!-- Dark themed content -->
</div>`}
      </CodeBlock>

      <CodeBlock title="3. JavaScript Theme Toggle">
        {`// Toggle between light and dark
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-dsai-theme');
  html.setAttribute('data-dsai-theme', current === 'dark' ? 'light' : 'dark');
}

// Detect system preference
function useSystemTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute(
    'data-dsai-theme',
    prefersDark ? 'dark' : 'light'
  );
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    document.documentElement.setAttribute(
      'data-dsai-theme',
      e.matches ? 'dark' : 'light'
    );
  });`}
      </CodeBlock>

      <CodeBlock title="4. React Hook Example">
        {`import { useState, useEffect } from 'react';
import { Button, SunFillIcon, MoonFillIcon } from '@dsai/react';

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check localStorage or system preference
    const stored = localStorage.getItem('dsai-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-dsai-theme', theme);
    localStorage.setItem('dsai-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return { theme, setTheme, toggle };
}

// Usage with DSAi components
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      onClick={toggle}
      variant="outline-secondary"
      startIcon={theme === 'dark' ? <SunFillIcon /> : <MoonFillIcon />}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </Button>
  );
}`}
      </CodeBlock>

      <Alert variant="info">
        <strong>Note:</strong> The <code>data-dsai-theme</code> attribute can be applied to any
        element, allowing you to have different themes for different sections of your page.
      </Alert>
    </div>
  ),
};

// ============================================================================
// CSS Variables in Themes Component
// ============================================================================

const CSSVariablesDemo = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const variableGroups = [
    {
      title: 'Body Colors',
      vars: [
        { name: '--dsai-body-bg', light: '#ffffff', dark: '#212529' },
        { name: '--dsai-body-color', light: '#212529', dark: '#dee2e6' },
      ],
    },
    {
      title: 'Border Colors',
      vars: [
        { name: '--dsai-border-color', light: '#dee2e6', dark: '#495057' },
        {
          name: '--dsai-border-color-translucent',
          light: 'rgba(0,0,0,.175)',
          dark: 'rgba(255,255,255,.15)',
        },
      ],
    },
    {
      title: 'Emphasis Colors',
      vars: [
        { name: '--dsai-emphasis-color', light: '#000000', dark: '#ffffff' },
        {
          name: '--dsai-secondary-color',
          light: 'rgba(33,37,41,.75)',
          dark: 'rgba(222,226,230,.75)',
        },
        { name: '--dsai-tertiary-color', light: 'rgba(33,37,41,.5)', dark: 'rgba(222,226,230,.5)' },
      ],
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <Button
          variant={theme === 'light' ? 'primary' : 'outline-primary'}
          onClick={() => setTheme('light')}
          startIcon={<SunFillIcon />}
        >
          Light
        </Button>
        <Button
          variant={theme === 'dark' ? 'primary' : 'outline-primary'}
          onClick={() => setTheme('dark')}
          startIcon={<MoonFillIcon />}
        >
          Dark
        </Button>
      </div>

      <div
        data-dsai-theme={theme}
        style={{
          padding: '24px',
          borderRadius: '12px',
          backgroundColor: theme === 'dark' ? '#212529' : '#f8f9fa',
          transition: 'all 0.3s ease',
        }}
      >
        {variableGroups.map((group) => (
          <div key={group.title} style={{ marginBottom: '24px' }}>
            <Heading
              level={4}
              style={{ color: theme === 'dark' ? '#fff' : '#212529', marginBottom: '12px' }}
            >
              {group.title}
            </Heading>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${theme === 'dark' ? '#495057' : '#dee2e6'}`,
                  }}
                >
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '8px',
                      color: theme === 'dark' ? '#adb5bd' : '#6c757d',
                    }}
                  >
                    Variable
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '8px',
                      color: theme === 'dark' ? '#adb5bd' : '#6c757d',
                    }}
                  >
                    Value
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '8px',
                      color: theme === 'dark' ? '#adb5bd' : '#6c757d',
                    }}
                  >
                    Preview
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.vars.map((v) => (
                  <tr
                    key={v.name}
                    style={{
                      borderBottom: `1px solid ${theme === 'dark' ? '#343a40' : '#e9ecef'}`,
                    }}
                  >
                    <td
                      style={{
                        padding: '8px',
                        fontFamily: 'monospace',
                        color: theme === 'dark' ? '#dee2e6' : '#212529',
                      }}
                    >
                      {v.name}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        fontFamily: 'monospace',
                        color: theme === 'dark' ? '#adb5bd' : '#6c757d',
                      }}
                    >
                      {theme === 'dark' ? v.dark : v.light}
                    </td>
                    <td style={{ padding: '8px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '24px',
                          backgroundColor: theme === 'dark' ? v.dark : v.light,
                          borderRadius: '4px',
                          border: `1px solid ${theme === 'dark' ? '#495057' : '#dee2e6'}`,
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * CSS variables that change based on the active theme mode.
 */
export const CSSVariables: Story = {
  render: () => <CSSVariablesDemo />,
};
