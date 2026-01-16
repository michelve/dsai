import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['react', 'react-dom'],
  injectStyle: false,
  tsconfig: './tsconfig.build.json',
  splitting: false,
  treeshake: true,
});
