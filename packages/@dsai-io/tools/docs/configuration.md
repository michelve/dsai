# Configuration Reference

Complete reference for all @DSAi/tools configuration options.

## Configuration File

@DSAi/tools looks for configuration in the following order:

1. `dsai.config.mjs` (recommended)
2. `dsai.config.js`
3. `dsai.config.cjs`
4. `dsai.config.ts`
5. `dsai.config.json`
6. `.dsairc.json`
7. `.dsairc`
8. `package.json` (`dsai` field)

## Basic Configuration

```javascript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    prefix: '--myapp-',
  },
});
```

## Configuration Schema

```typescript
interface DsaiConfig {
  // Extends another config
  extends?: string;

  // Global settings
  global?: GlobalConfig;

  // Token configuration
  tokens?: TokensConfig;

  // Icon configuration
  icons?: IconsConfig;

  // Build hooks
  hooks?: HooksConfig;
}
```

## Global Configuration

```typescript
interface GlobalConfig {
  // Enable debug output
  debug?: boolean; // default: false

  // Enable verbose output
  verbose?: boolean; // default: false

  // Dry run mode (no file writes)
  dryRun?: boolean; // default: false
}
```

## Tokens Configuration

### Source Configuration

```typescript
interface TokensConfig {
  // Token source type: 'theme', 'collections', or custom path
  source?: 'theme' | 'collections' | string; // default: 'theme'

  // Directory containing Figma export files
  sourceDir?: string; // default: 'figma-exports'

  // Directory containing token collection files
  collectionsDir?: string; // default: 'collections'

  // Glob patterns for finding Figma exports
  sourcePatterns?: string[]; // default: ['theme.json', 'tokens.json', '*.tokens.json']

  // Map collection names to specific file paths
  collectionMapping?: Record<string, string>;
}
```

### Output Configuration

```typescript
interface TokensConfig {
  // Output directory (applies to all formats by default)
  outputDir?: string; // default: 'dist'

  // Per-format output directories (overrides outputDir)
  outputDirs?: {
    css?: string;
    scss?: string;
    js?: string;
    ts?: string;
    json?: string;
  };

  // Per-format file names with placeholder support
  outputFileNames?: {
    css?: string; // default: 'tokens.css'
    scss?: string; // default: '_tokens.scss'
    js?: string; // default: 'tokens.js'
    ts?: string; // default: 'tokens.ts'
    json?: string; // default: 'tokens.json'
  };

  // CSS variable prefix
  prefix?: string; // default: '--dsai-'

  // Output formats to generate
  formats?: ('css' | 'scss' | 'js' | 'ts' | 'json')[]; // default: all
}
```

### Style Merge Configuration

```typescript
interface TokensConfig {
  // Additional SCSS directories to merge with token output
  additionalScssDirectories?: string[]; // default: []

  // Additional CSS directories to merge with token output
  additionalCssDirectories?: string[]; // default: []

  // Order of merging: 'before' or 'after' tokens
  mergeOrder?: 'before' | 'after'; // default: 'after'

  // Create combined bundle files
  createBundle?: boolean; // default: false

  // SCSS file to import at top of generated files
  scssImportHeader?: string | string[];
}
```

### Theme Configuration

```typescript
interface TokensConfig {
  themes?: {
    // Auto-detect available modes from Figma export
    autoDetect?: boolean; // default: true

    // Default theme mode (uses :root selector)
    default?: string; // default: 'Light'

    // Modes to ignore during build
    ignoreModes?: string[]; // default: []

    // CSS selector patterns
    selectorPattern?: {
      default?: string; // default: ':root'
      others?: string; // default: '[data-dsai-theme="{mode}"]'
    };
  };
}
```

### Build Options

```typescript
interface TokensConfig {
  // Base font size for rem calculations
  baseFontSize?: number; // default: 16

  // Output token references in CSS
  outputReferences?: boolean; // default: true

  // Generate separate files per theme
  separateThemeFiles?: boolean; // default: false

  // Watch mode for continuous building
  watch?: boolean; // default: false

  // Additional directories to watch
  watchDirectories?: string[]; // default: []
}
```

### Extensibility

```typescript
interface TokensConfig {
  // Custom Style Dictionary transforms
  transforms?: CustomTransform[];

  // Custom Style Dictionary formats
  customFormats?: CustomFormat[];

  // Custom preprocessors
  preprocessors?: CustomPreprocessor[];

  // Custom filters
  filters?: CustomFilter[];
}
```

## Icons Configuration

```typescript
interface IconsConfig {
  // Source directory for SVG files
  sourceDir?: string; // default: './icons'

  // Output directory for generated components
  outputDir?: string; // default: './dist/icons'

  // Output format
  format?: 'react' | 'vue' | 'svg' | 'svg-sprite'; // default: 'react'

  // Optimize SVGs with SVGO
  optimize?: boolean; // default: true

  // SVGO plugins configuration
  svgoPlugins?: SVGOPlugin[];

  // Custom component template
  template?: (icon: OptimizedSVG) => string;

  // Custom index template
  indexTemplate?: (icons: OptimizedSVG[]) => string;
}
```

## Hooks Configuration

```typescript
interface HooksConfig {
  // Called before build starts
  onBuildStart?: (context: HookContext) => Promise<void> | void;

  // Called after build completes
  onBuildEnd?: (context: HookContext & { result: BuildResult }) => Promise<void> | void;

  // Called on build error
  onBuildError?: (context: HookContext & { error: Error }) => Promise<void> | void;

  // Called after each file is written
  onFileWrite?: (context: HookContext & { file: FileInfo }) => Promise<void> | void;
}

interface HookContext {
  config: ResolvedConfig;
  cwd: string;
}
```

## Example Configurations

### Minimal Configuration

```javascript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    prefix: '--myapp-',
  },
});
```

### Full Configuration

```javascript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  global: {
    debug: process.env.NODE_ENV === 'development',
  },

  tokens: {
    sourceDir: './design-tokens',
    outputDir: './dist/tokens',
    prefix: '--acme-',
    baseFontSize: 16,
    outputReferences: true,
    formats: ['css', 'js', 'scss'],

    transforms: [
      {
        name: 'custom/uppercase-name',
        type: 'name',
        transform: (token) => token.path.join('_').toUpperCase(),
      },
    ],
  },

  icons: {
    sourceDir: './assets/icons',
    outputDir: './dist/icons',
    format: 'react',
    optimize: true,
  },

  hooks: {
    onBuildEnd: async ({ result }) => {
      console.log(`Generated ${result.filesWritten} files`);
    },
  },
});
```

### Enterprise Configuration

```javascript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  extends: '@acme/design-tokens-config',

  tokens: {
    prefix: '--acme-',

    // Custom output locations per format
    outputDirs: {
      css: 'public/styles',
      scss: 'packages/styles/src/tokens',
      js: 'packages/tokens/dist',
      ts: 'packages/tokens/src',
    },

    // Merge with existing stylesheets
    additionalScssDirectories: ['src/styles/overrides', 'src/styles/custom-mixins'],
    mergeOrder: 'after',
    createBundle: true,

    // Theme configuration
    themes: {
      autoDetect: true,
      default: 'Light',
      selectorPattern: {
        default: ':root',
        others: '[data-theme="{mode}"]',
      },
    },
  },

  hooks: {
    onBuildEnd: async ({ result }) => {
      // Upload to CDN
      if (process.env.NODE_ENV === 'production') {
        await uploadToCDN(result.files);
      }
    },
  },
});
```

## Config Resolution Order

Configuration is resolved in layers (later overrides earlier):

1. **Defaults** - Built-in defaults
2. **Extends** - Extended configuration files
3. **File** - Your `dsai.config.mjs`
4. **Environment** - Environment variables
5. **CLI** - Command line flags
