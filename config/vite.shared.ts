import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { UserConfig } from 'vite'; // NOSONAR S4328 — vite is a devDependency of consuming packages (storybook, playground)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '..');

export const aliasPaths = {
  '@dsai-io/react': resolve(workspaceRoot, 'packages/@dsai-io/react/src'),
} satisfies Record<string, string>;

export const warmupClientFiles = [
  'packages/@dsai-io/react/src/**/*.tsx',
  'packages/@dsai-io/tools/src/**/*.ts',
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
    include: ['@dsai-io/react', '@dsai-io/tools'],
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
