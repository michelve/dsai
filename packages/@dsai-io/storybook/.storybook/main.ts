// This file has been automatically migrated to valid ESM format by Storybook.
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import remarkGfm from 'remark-gfm';

import type { StorybookConfig } from '@storybook/react-vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../docs/**/*.mdx', '../docs/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    {
      name: getAbsolutePath('@storybook/addon-docs'),
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-designs'),
    {
      name: getAbsolutePath('@storybook/addon-vitest'),
      options: {
        // CLI testing is enabled; browser UI integration is experimental
        // Run tests with: cd packages/@dsai-io/storybook && pnpm vitest --run
      },
    },
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
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    const { sharedViteConfig } = await import(
      resolve(__dirname, '../../../../config/vite.shared.ts')
    );

    const withShared = mergeConfig(config, sharedViteConfig);

    return mergeConfig(withShared, {
      plugins: [react()],
      // Disable Vite cache in development for faster dependency updates
      cacheDir: undefined,
      optimizeDeps: {
        force: true, // Force re-optimization on every dev server start
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

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
