import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { UserConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '..');

export const aliasPaths = {
  '@dsai/react': resolve(workspaceRoot, 'packages/@dsai/react/src'),
} satisfies Record<string, string>;

export const warmupClientFiles = [
  'packages/@dsai/react/src/**/*.tsx',
  'packages/@dsai/tokens/src/**/*.ts',
];

const corsOrigins = ['http://localhost:5173', 'http://localhost:6006'];

/**
 * Shared Vite defaults for Storybook and Playground.
 * Includes dev server hardening (GHSA-vg6x-rcgg-rjx6) and common DX optimizations.
 */
export const sharedViteConfig: UserConfig = {
  resolve: {
    alias: aliasPaths,
  },
  optimizeDeps: {
    include: ['@dsai/react', '@dsai/tokens'],
  },
  server: {
    allowedHosts: ['localhost', '127.0.0.1'],
    cors: {
      origin: corsOrigins,
    },
    fs: {
      strict: true,
      deny: ['.env', '.env.*', '*.pem', '*.crt', '**/.git/**'],
    },
    warmup: {
      clientFiles: warmupClientFiles,
    },
  },
  build: {
    license: true,
    chunkSizeWarningLimit: 3000,
  },
};
