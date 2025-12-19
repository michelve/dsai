# Build Configuration

This document explains the build setup for the DSAi Design System monorepo.

## Build Tool: tsup

We chose **tsup** over Rollup for the following reasons:

- **Simplicity**: Zero-config defaults with sensible settings
- **Speed**: Built on esbuild, significantly faster than Rollup
- **TypeScript-first**: Excellent TypeScript declaration generation
- **Modern**: Built for ESM-first workflows with CJS compatibility

## Build Outputs

Each package generates the following outputs:

```
dist/
  ├── index.js          # CommonJS bundle (minified)
  ├── index.js.map      # CJS sourcemap
  ├── index.mjs         # ES Module bundle (minified)
  ├── index.mjs.map     # ESM sourcemap
  ├── index.d.ts        # TypeScript declarations (CJS)
  └── index.d.mts       # TypeScript declarations (ESM)
```

### Module Formats

- **ESM (.mjs)**: Modern, tree-shakeable format for optimal bundle sizes
- **CJS (.js)**: Legacy compatibility for older Node.js versions
- Both formats include sourcemaps for debugging

### Current Bundle Sizes

| Package            | ESM (gzipped) | CJS (gzipped) | Status |
| ------------------ | ------------- | ------------- | ------ |
| @DSAi/tokens       | 117 B         | 163 B         | ✅     |
| @DSAi/React        | 156 B         | 185 B         | ✅     |
| @DSAi/figma-tokens | 129 B         | 174 B         | ✅     |

**Target**: < 50KB gzipped per package (all packages well under target)

## Configuration Files

### tsup.config.ts

Each package has a `tsup.config.ts` file:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true, // Generate .d.ts files
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  external: ['react', 'react-dom', '@dsai/tokens'], // Don't bundle these
  tsconfig: './tsconfig.build.json', // Use build-specific config
});
```

### tsconfig.build.json (Critical)

Each package has a `tsconfig.build.json` that removes path mappings:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "paths": {}
  }
}
```

**Why this is needed**:

1. **IDE Experience**: `tsconfig.base.json` defines path mappings like:

   ```json
   {
     "@dsai/tokens": ["packages/@dsai/tokens/src"]
   }
   ```

   This allows IDEs to resolve imports to source files for development.

2. **Build Issue**: TypeScript's declaration generator follows these path mappings
   and tries to include source files from other packages, causing errors:

   ```
   TS6059: File '.../tokens/src/index.ts' is not under 'rootDir'
   ```

3. **Solution**: `tsconfig.build.json` removes path mappings during build,
   forcing TypeScript to resolve packages via `node_modules` or the built `dist/` folders.

This allows us to maintain the best of both worlds:

- **Development**: Fast IDE navigation with path mappings
- **Build**: Clean package boundaries without cross-package source inclusion

## Build Commands

### Individual Package

```bash
# Build a single package
pnpm nx build @dsai/tokens
pnpm nx build @dsai/react
pnpm nx build @dsai/figma-tokens

# Watch mode for development
pnpm nx run @dsai/tokens:dev
```

### All Packages

```bash
# Build all packages
pnpm nx run-many --target=build --all

# Build specific packages
pnpm nx run-many --target=build --projects=@dsai/tokens,@dsai/react
```

### Build Order

Nx automatically handles build order based on dependencies:

1. `@dsai/tokens` (no dependencies)
2. `@dsai/react` (depends on tokens)
3. `@dsai/figma-tokens` (depends on tokens)

## Package.json Scripts

Each package has:

```json
{
  "scripts": {
    "build": "tsup",
    "build:watch": "tsup --watch",
    "dev": "tsup --watch"
  }
}
```

## Nx Integration

Each package's `project.json` uses the `nx:run-commands` executor:

```json
{
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": {
        "command": "tsup",
        "cwd": "packages/@dsai/tokens"
      }
    }
  }
}
```

This allows Nx to:

- Cache build outputs
- Run builds in parallel
- Handle dependency ordering
- Provide build task visualization

## Tree-Shaking

All packages are configured for optimal tree-shaking:

1. **ESM format**: Default export format supports tree-shaking
2. **Named exports**: Use named exports instead of default exports
3. **Pure annotations**: tsup automatically adds /*#**PURE***/ comments
4. **Side-effect free**: All packages marked as `"sideEffects": false` in package.json

Example tree-shaking verification:

```typescript
// Consumer only imports what they need
import { tokens } from '@dsai/react';

// Only tokens code is bundled, not other exports
```

## External Dependencies

External dependencies are not bundled:

- **@DSAi/tokens**: Marked as external in dependent packages
- **React, React-dom**: Marked as peer dependencies and external
- Consumers must install these separately

This:

- Prevents duplicate React instances
- Reduces bundle sizes
- Allows version flexibility
- Follows best practices for React libraries

## Troubleshooting

### Error: File not under 'rootDir'

**Problem**: TypeScript trying to include source files from other packages during DTS generation.

**Solution**: Ensure `tsup.config.ts` uses `tsconfig: './tsconfig.build.json'` which removes path mappings.

### Error: Cannot find module '@DSAi/tokens'

**Problem**: Package not built or not in node_modules.

**Solution**:

```bash
# Build dependencies first
pnpm nx build @dsai/tokens

# Then build dependent packages
pnpm nx build @dsai/react
```

### Build cache issues

**Problem**: Builds not reflecting recent changes.

**Solution**:

```bash
# Clear Nx cache
pnpm nx reset

# Rebuild
pnpm nx run-many --target=build --all
```

### TypeScript path mapping issues in consumers

**Problem**: Consuming applications have same rootDir issues.

**Solution**: Create `tsconfig.build.json` in the consuming app too:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "paths": {}
  }
}
```

## Performance

Build times (measured on development machine):

- `@dsai/tokens`: ~2s
- `@dsai/react`: ~2s
- `@dsai/figma-tokens`: ~2s
- **All packages**: ~2s (parallel execution)

Nx caching makes subsequent builds nearly instant when files haven't changed.

## Best Practices

1. **Always build dependencies first**: Use `nx build` which handles this automatically
2. **Use watch mode during development**: `pnpm nx run @dsai/tokens:dev`
3. **Check bundle sizes regularly**: Use `pnpm gzip-size` to monitor
4. **Keep external dependencies external**: Don't bundle React or other shared dependencies
5. **Test builds before committing**: Run `pnpm nx run-many --target=build --all`
