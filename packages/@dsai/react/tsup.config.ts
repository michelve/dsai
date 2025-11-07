import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    resolve: true,
  },
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['react', 'react-dom', '@dsai/tokens'],
  injectStyle: false,
  tsconfig: './tsconfig.build.json',
  splitting: false,
  treeshake: true,
});
