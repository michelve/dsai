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
      toc: {
        title: 'Table of Contents',
      },
    },

    // Background options using DSAi tokens
    backgrounds: {
      options: {
        light: {
          name: 'light',
          value: '#ffffff', // backgroundWhite
        },

        gray: {
          name: 'gray',
          value: '#f5f6f7', // colorGray100 / backgroundLight
        },

        dark: {
          name: 'dark',
          value: '#212529', // colorGray900 / backgroundDark
        },

        teal: {
          name: 'teal',
          value: '#06281e', // colorTeal950 - brand dark
        },
      },
    },

    // Default layout
    layout: 'centered',
  },

  // Global toolbar controls
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },

  // Decorators for story rendering
  decorators: [],

  // Initial global values
  initialGlobals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export default preview;
