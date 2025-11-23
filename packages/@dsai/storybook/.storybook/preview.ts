import type { Preview } from '@storybook/react-vite';
import DSAiTheme from './DSAiTheme';

// Import design tokens CSS - use relative path for reliability
import '../../../@dsai/tokens/dist/css/variables.css';
import './preview.css';

const preview: Preview = {
  // Enable automatic documentation for all stories
  tags: ['autodocs'],

  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      theme: DSAiTheme,
      toc: {
        title: 'Table of Contents',
      },
    },
    backgrounds: {
      options: {
        light: {
          name: 'light',
          value: '#ffffff',
        },

        dark: {
          name: 'dark',
          value: '#1a1a1a',
        },

        gray: {
          name: 'gray',
          value: '#f5f5f5',
        },
      },
    },
    layout: 'centered',
  },

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

  decorators: [],

  initialGlobals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export default preview;
