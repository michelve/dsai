import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  stories: ['../docs/**/*.mdx', '../docs/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-links',
    // Note: @storybook/addon-designs temporarily removed - not compatible with Storybook 9+
    // Tracking issue: https://github.com/storybookjs/addon-designs/issues
    '@storybook/addon-a11y',
    '@storybook/addon-designs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    defaultName: 'Documentation',
  },
  core: {
    disableTelemetry: true, // Disable anonymous usage tracking
  },
  staticDirs: ['../public'], // Serve static assets like logo

  // Vite configuration for monorepo setup
  viteFinal: async (config, { configType }) => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@dsai/tokens': resolve(process.cwd(), '../../@dsai/tokens/src'),
          '@dsai/tokens/css': resolve(process.cwd(), '../../@dsai/tokens/dist/css'),
          '@dsai/tokens/js': resolve(process.cwd(), '../../@dsai/tokens/dist/js'),
          '@dsai/react': resolve(process.cwd(), '../../@dsai/react/src'),
        },
      },
    });
  },

  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        if (prop.declarations !== undefined && prop.declarations.length > 0) {
          const hasPropAdditionalDescription = prop.declarations.find((declaration) => {
            return !declaration.fileName.includes('node_modules');
          });
          return Boolean(hasPropAdditionalDescription);
        }
        return true;
      },
    },
  },
};

export default config;
