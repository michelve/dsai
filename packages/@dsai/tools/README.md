# @DSAi/tools

> Enterprise-grade build tools for the DSAi Design System

## Installation

```bash
pnpm add @dsai/tools
```

## Features

- 🎨 **Token Management** - Build and validate design tokens using Style Dictionary
- 🔧 **Configuration** - Type-safe configuration with `dsai.config.ts`
- 🖼️ **Icon Generation** - Generate icon components from SVG files
- 📦 **CLI** - Command-line interface for build automation

## Quick Start

### Configuration

Create a `dsai.config.ts` in your project root:

```typescript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    source: ['tokens/**/*.json'],
    output: 'dist/tokens',
    formats: ['css', 'ts'],
    prefix: 'ds',
  },
  icons: {
    source: 'assets/icons',
    output: 'src/components/icons',
    framework: 'react',
    typescript: true,
  },
});
```

### CLI Usage

```bash
# Build all tokens and icons
npx dsai-tools build

# Build only tokens
npx dsai-tools build --tokens

# Build only icons
npx dsai-tools build --icons

# Validate token files
npx dsai-tools validate tokens/**/*.json

# Initialize configuration
npx dsai-tools init
```

### Programmatic Usage

```typescript
import { buildTokens, generateIcons, loadConfig } from '@dsai/tools';

// Load configuration
const config = await loadConfig();

// Build tokens
const tokenResult = await buildTokens(config.tokens);
console.log('Generated:', tokenResult.files);

// Generate icons
const iconResult = await generateIcons(config.icons);
console.log('Generated:', iconResult.files);
```

## API Reference

### Configuration

- `defineConfig(config)` - Helper for type-safe configuration
- `loadConfig(searchFrom?)` - Load configuration from filesystem
- `validateConfig(config)` - Validate configuration against schema

### Token Tools

- `validateTokens(source)` - Validate token files against DTCG spec
- `transformTokens(tokens, options)` - Transform tokens using Style Dictionary
- `buildTokens(config)` - Build tokens from source to output formats
- `syncTokens(source, destination)` - Sync tokens from external source
- `watchTokens(config, callback)` - Watch and rebuild on changes

### Icon Tools

- `generateIcons(config)` - Generate icon components from SVGs
- `optimizeSvg(source, options)` - Optimize SVG files
- `extractIconMetadata(svgPath)` - Extract metadata from SVG

### Utilities

- `logger` - Colored console logging utilities
- `resolvePath(...segments)` - Resolve path relative to cwd
- `fileExists(path)` - Check if file exists
- `formatDuration(ms)` - Format milliseconds to readable string

## Configuration Options

### TokensConfig

| Option            | Type            | Description                                        |
| ----------------- | --------------- | -------------------------------------------------- |
| `source`          | `string[]`      | Source token file patterns                         |
| `output`          | `string`        | Output directory                                   |
| `formats`         | `string[]`      | Output formats (`css`, `scss`, `ts`, `json`, `js`) |
| `prefix`          | `string`        | CSS custom property prefix                         |
| `themes`          | `ThemeConfig[]` | Theme configurations                               |
| `styleDictionary` | `object`        | Additional Style Dictionary config                 |

### IconsConfig

| Option       | Type      | Description                                    |
| ------------ | --------- | ---------------------------------------------- |
| `source`     | `string`  | Source directory containing SVGs               |
| `output`     | `string`  | Output directory for components                |
| `framework`  | `string`  | Component framework (`react`, `vue`, `svelte`) |
| `prefix`     | `string`  | Icon component prefix                          |
| `typescript` | `boolean` | Generate TypeScript                            |
| `optimize`   | `boolean` | Optimize SVGs with SVGO                        |

## Peer Dependencies

- `style-dictionary@^5.0.0` (optional) - Required for token building

## License

MIT © DSAi Design System
