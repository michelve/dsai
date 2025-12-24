import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'config/index': 'src/config/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'icons/index': 'src/icons/index.ts',
    'cli/index': 'src/cli/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: {
    compilerOptions: {
      composite: false,
    },
  },
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ['style-dictionary'],
  banner: {
    js: '/* @dsai/tools - DSAi Design System Build Tools */',
  },
  outDir: 'dist',
  target: 'es2022',
  platform: 'node',
});
