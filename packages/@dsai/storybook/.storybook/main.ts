import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { resolve, dirname } from 'path';

const config: StorybookConfig = {
  stories: ['../docs/**/*.mdx', '../docs/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-designs'),
    getAbsolutePath('@chromatic-com/storybook'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
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

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
