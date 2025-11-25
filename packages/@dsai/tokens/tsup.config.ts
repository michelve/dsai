import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/tokens-grouped.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: false, // Don't clean dist - Style Dictionary outputs are there
});
