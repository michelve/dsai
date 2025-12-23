import { backgroundWhite, colorGray900 } from '@dsai/tokens';
import React from 'react';

import { lightTheme } from './DSAiTheme';

import type { Preview } from '@storybook/react-vite';

// DSAi is a Bootstrap-first design system
// Load Bootstrap theme (customized with DSAi tokens) as the primary framework
import '../../../@dsai/tokens/dist/css/dsai-theme-bs.css';

// Preview-specific styles (minimal overrides)
import './preview.css';

/**
 * Storybook Preview Configuration
 *
 * Controls how stories are rendered in the canvas.
 * Uses DSAi design tokens for consistent styling.
 */
const preview: Preview = {
  // Enable automatic documentation for all stories
  tags: ['autodocs'],

  parameters: {
    // Sort stories alphabetically in the sidebar
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Introduction', 'Foundation', 'Guides', 'Components', '*'],
      },
    },

    // Actions configuration
    actions: { argTypesRegex: '^on[A-Z].*' },

    // Controls configuration
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
      sort: 'requiredFirst',
    },

    // Documentation configuration
    docs: {
      theme: lightTheme,
      codePanel: true,
      toc: {
        title: 'Table of Contents',
      },
    },

    // Background options using DSAi tokens
    backgrounds: {
      options: {
        light: {
          name: 'Light',
          value: backgroundWhite || '#ffffff',
        },
        dark: {
          name: 'Dark',
          value: colorGray900 || '#212529',
        },
      },
    },

    // Default layout
    layout: 'centered',

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },

  // Global toolbar controls
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },

  // Decorators for story rendering
  decorators: [
    // Theme decorator - applies data-dsai-theme attribute based on toolbar selection
    (Story, context) => {
      const theme = (context.globals['theme'] as string) || 'light';

      // Create a wrapper component to properly use React hooks
      const ThemedWrapper: React.FC = () => {
        // Apply theme to document for CSS variable cascading
        React.useEffect(() => {
          document.documentElement.setAttribute('data-dsai-theme', theme);
          document.body.setAttribute('data-dsai-theme', theme);

          // Apply background color based on theme for the Storybook canvas
          if (theme === 'dark') {
            document.body.style.backgroundColor = '#212529';
            document.body.style.color = '#dfe1e5';
          } else {
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#212529';
          }
        }, [theme]);

        return React.createElement(
          'div',
          {
            'data-dsai-theme': theme,
            style: {
              backgroundColor: theme === 'dark' ? '#212529' : '#ffffff',
              color: theme === 'dark' ? '#dfe1e5' : '#212529',
              minHeight: '100%',
              padding: '1rem',
            },
          },
          React.createElement(Story, null)
        );
      };

      return React.createElement(ThemedWrapper);
    },
  ],

  // Initial global values
  initialGlobals: {
    theme: 'light',
    backgrounds: {
      value: 'light',
    },
  },
};

export default preview;
