# @dsai-io/tools

> Enterprise-grade design token tooling with incremental builds, automatic changelog generation, and production-ready error recovery

[![npm version](https://badge.fury.io/js/@dsai-io%2Ftools.svg)](https://www.npmjs.com/package/@dsai-io/tools)
[![Test Coverage](https://img.shields.io/badge/coverage-88.4%25-brightgreen.svg)](../../docs/coverage.md)
[![Bundle Size](https://img.shields.io/badge/bundle-117B%20gzipped-success.svg)](../../BUILD.md)

## Installation

```bash
pnpm add @dsai-io/tools

# or
npm install @dsai-io/tools

# or
yarn add @dsai-io/tools
```

## Features

### 🚀 **Incremental Builds**

- SHA-256 content hashing for instant change detection
- Smart decision logic (10-100x faster than full rebuilds)
- Dependency graph analysis for minimal rebuilds
- Persistent caching in `.dsai-cache/`

### 📝 **Automatic Changelog Generation**

- Detects added, removed, modified, and type-changed tokens
- Breaking change identification and warnings
- Professional Markdown output with before/after values
- DTCG and legacy token format support

### 🛡️ **Production-Grade Error Recovery**

- Circuit breaker pattern prevents cascading failures
- Rate limiter protects external APIs (Figma)
- Snapshot service for version rollback
- Exponential backoff with jitter for retries
- Health monitoring and metrics

### 🎨 **Token Management**

- DTCG-compliant token format with legacy support
- Style Dictionary v5 integration
- Schema validation (Zod-based)
- Figma Variables API sync
- Multi-mode token support

### 🔧 **Developer Tools**

- Type-safe configuration with `dsai.config.ts`
- Comprehensive CLI with rich output
- Programmatic API for automation
- Icon component generation from SVGs

## Quick Start

### Configuration

Create a `dsai.config.ts` in your project root:

```typescript
import { defineConfig } from '@dsai-io/tools';

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

#### Token Building

```bash
# Full build
npx dsai-tools tokens build tokens/

# Incremental build (10-100x faster)
npx dsai-tools tokens build tokens/ --incremental

# Force full rebuild
npx dsai-tools tokens build tokens/ --force

# Custom cache directory
npx dsai-tools tokens build tokens/ --incremental --cache-dir .cache

# Clean outputs before build
npx dsai-tools tokens build --clean
```

#### Changelog Generation

```bash
# Generate changelog from token changes
npx dsai-tools tokens changelog old-tokens.json new-tokens.json

# With version number
npx dsai-tools tokens changelog old.json new.json --version 1.2.0

# Custom output file
npx dsai-tools tokens changelog old.json new.json --output CHANGES.md
```

#### Token Validation & Transformation

```bash
# Validate tokens against DTCG spec
npx dsai-tools tokens validate tokens/**/*.json

# Transform Figma exports to Style Dictionary format
npx dsai-tools tokens transform

# Sync tokens to flat TypeScript file
npx dsai-tools tokens sync
```

#### Figma Integration

```bash
# Sync from Figma Variables API
npx dsai-tools tokens sync --figma-file YOUR_FILE_ID

# Validate Figma export
npx dsai-tools tokens validate-figma export.json
```

#### Utilities

```bash
# Clean output directories
npx dsai-tools tokens clean

# Post-process CSS theme files
npx dsai-tools tokens postprocess

# Generate icons from SVGs
npx dsai-tools build --icons

# Initialize configuration
npx dsai-tools init
```

### Programmatic Usage

#### Incremental Builds

```typescript
import { buildTokens, CacheService } from '@dsai-io/tools/tokens';

// Incremental build with caching
const result = await buildTokens('tokens/', {
  incremental: true,
  cacheDir: '.dsai-cache',
  force: false,
});

console.log(`Built ${result.tokenCount} tokens`);
console.log(`Build time: ${result.duration}ms`);
console.log(`Cache hit rate: ${result.cacheStats?.hitRate}%`);
```

#### Changelog Generation

```typescript
import { diffTokens, generateChangelog, writeChangelog } from '@dsai-io/tools/tokens';

// Load tokens
const oldTokens = JSON.parse(fs.readFileSync('old.json', 'utf-8'));
const newTokens = JSON.parse(fs.readFileSync('new.json', 'utf-8'));

// Compute diff
const diff = diffTokens(oldTokens, newTokens);

if (diff.hasBreaking) {
  console.warn('⚠️  Breaking changes detected!');
}

// Generate and write changelog
const result = generateChangelog(diff, {
  version: '1.2.0',
  includeDescriptions: true,
  includeValues: true,
});

await writeChangelog(result.content, 'TOKENS-CHANGELOG.md');
```

#### Error Recovery

```typescript
import { 
  CircuitBreaker, 
  RateLimiter, 
  SnapshotService 
} from '@dsai-io/tools/tokens';

// Circuit breaker for external APIs
const breaker = new CircuitBreaker({
  threshold: 5,
  timeout: 30000,
  resetTimeout: 60000,
});

const data = await breaker.execute(async () => {
  return await fetchFromFigmaAPI();
});

// Rate limiter for API protection
const limiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000,
});

await limiter.acquire();

// Snapshot for rollback
const snapshotService = new SnapshotService('.snapshots');
const snapshot = await snapshotService.createSnapshot(
  'tokens/',
  'Before v2.0.0 migration'
);

// Restore if needed
await snapshotService.restoreSnapshot(snapshot.id, 'tokens/');
```

#### Configuration & Build

```typescript
import { loadConfig, buildTokens, generateIcons } from '@dsai-io/tools';

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

### Token Building

- `buildTokens(tokensDir, options)` - Build tokens with optional incremental mode
- `buildTokensCLI(args)` - CLI wrapper for token builds
- `runBuildCLI(args)` - Execute build from command line

**Options:**

- `incremental: boolean` - Enable incremental builds
- `force: boolean` - Force full rebuild
- `cacheDir: string` - Custom cache directory
- `clean: boolean` - Clean outputs before build

### Incremental Build System

- `CacheService` - SHA-256 content hashing and cache management
  - `hashFile(filePath)` - Generate content hash
  - `hasFileChanged(filePath, baseDir)` - Check if file changed
  - `getChangedFiles(directory, pattern)` - Get all changed files
  - `updateCacheEntry(filePath, baseDir)` - Update cache
  - `getCacheStats()` - Get cache metrics

- `analyzeChanges(options)` - Analyze token changes
- `buildDependencyGraph(collections)` - Build dependency graph
- `getAffectedCollections(changed, graph)` - Get affected collections
- `generateIncrementalReport(result)` - Generate build report

### Changelog Generation

- `diffTokens(oldTokens, newTokens)` - Compare token collections
- `generateChangelog(diff, options)` - Generate Markdown changelog
- `writeChangelog(content, filePath)` - Write changelog to file
- `generateAndWriteChangelog(diff, filePath, options)` - Combined operation
- `generateChangelogCLI(oldPath, newPath, output, version)` - CLI wrapper

**Diff Result:**

- `added: TokenChange[]` - Added tokens
- `removed: TokenChange[]` - Removed tokens (breaking)
- `modified: TokenChange[]` - Modified tokens
- `typeChanged: TokenChange[]` - Type-changed tokens (breaking)
- `deprecated: TokenChange[]` - Deprecated tokens
- `totalChanges: number` - Total count
- `hasBreaking: boolean` - Breaking change flag

**Helper Functions:**

- `summarizeDiff(diff)` - Text summary of changes
- `filterDiff(diff, types)` - Filter by change types
- `getBreakingChanges(diff)` - Get only breaking changes

### Error Recovery

- `CircuitBreaker` - Prevent cascading failures
  - `execute(fn)` - Execute with circuit breaker protection
  - `getState()` - Get current state (CLOSED, OPEN, HALF_OPEN)
  - `getMetrics()` - Get failure/success metrics
  - `reset()` - Manually reset circuit

- `RateLimiter` - API rate limiting
  - `acquire()` - Acquire rate limit slot
  - `getMetrics()` - Get request metrics
  - `reset()` - Reset rate limiter

- `SnapshotService` - Version snapshots for rollback
  - `createSnapshot(dir, description)` - Create snapshot
  - `listSnapshots()` - List all snapshots
  - `getSnapshot(id)` - Get snapshot by ID
  - `restoreSnapshot(id, targetDir)` - Restore snapshot
  - `deleteSnapshot(id)` - Delete snapshot
  - `cleanup(keepCount)` - Clean old snapshots

### Token Validation & Transformation

- `validateTokens(config, options)` - Validate against DTCG spec
- `validateFigmaExports(data)` - Validate Figma exports
- `transformTokens(options)` - Transform Figma to Style Dictionary
- `syncTokens(options)` - Sync to flat TypeScript file
- `cleanTokenOutputs(options)` - Clean output directories
- `postprocessCss(options)` - Post-process CSS theme files

### Schema Validation

- `validateDTCGFile(data)` - Validate DTCG file structure
- `validateDTCGTokens(tokens)` - Validate token collection
- `validateFigmaExport(data)` - Validate Figma export
- `validateStyleDictionaryInput(data)` - Validate SD input

### Icon Tools

- `generateIcons(config)` - Generate icon components from SVGs
- `optimizeSvg(source, options)` - Optimize SVG files
- `extractIconMetadata(svgPath)` - Extract metadata from SVG

### Type Guards & Utilities

- `isDTCGToken(obj)` - Check if DTCG format
- `isLegacyToken(obj)` - Check if legacy format
- `isToken(obj)` - Check if any token format
- `getTokenValue(token)` - Get value from any format
- `getTokenType(token)` - Get type from any format
- `toDTCGToken(legacy)` - Convert legacy to DTCG

## Configuration Options

### TokensConfig

| Option            | Type             | Description                                        |
| ----------------- | ---------------- | -------------------------------------------------- |
| `source`          | `string[]`       | Source token file patterns                         |
| `output`          | `string`         | Output directory                                   |
| `formats`         | `string[]`       | Output formats (`css`, `scss`, `ts`, `json`, `js`) |
| `prefix`          | `string`         | CSS custom property prefix                         |
| `themes`          | `ThemeConfig[]`  | Theme configurations                               |
| `styleDictionary` | `object`         | Additional Style Dictionary config                 |
| `pipeline`        | `PipelineConfig` | Build pipeline configuration (see below)           |

### PipelineConfig

Customize the token build pipeline for your package:

| Option                  | Type       | Description                                  |
| ----------------------- | ---------- | -------------------------------------------- |
| `steps`                 | `string[]` | Build steps to execute (see available steps) |
| `paths`                 | `object`   | Custom paths for SASS and sync operations    |
| `styleDictionaryConfig` | `string`   | Path to Style Dictionary config file         |

**Available Pipeline Steps:**

- `validate` - Validate tokens against DTCG spec
- `transform` - Transform Figma exports to Style Dictionary format
- `style-dictionary` - Build Style Dictionary outputs
- `sync` - Sync tokens-flat.ts file
- `sass-theme` - Compile Bootstrap theme SCSS
- `sass-theme-minified` - Compile minified Bootstrap theme
- `postprocess` - Post-process theme CSS
- `sass-utilities` - Compile DSAi utilities SCSS
- `sass-utilities-minified` - Compile minified utilities
- `bundle` - Bundle with tsup

**Example (for a package that only needs validation, transform, and Style Dictionary):**

```javascript
// dsai.config.mjs
export default {
  tokens: {
    pipeline: {
      steps: ['validate', 'transform', 'style-dictionary'],
      styleDictionaryConfig: 'sd.config.mjs',
    },
  },
};
```

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
