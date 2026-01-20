# DSAi Playground

Development playground for testing DSAi components and building custom design tokens with Bootstrap 5.3 theme compilation.

## Overview

The playground app serves as:

1. **Component Sandbox**: Test and preview DSAi React components
2. **Token Pipeline**: Transform Figma exports into usable CSS/SCSS/JS/TS tokens
3. **Theme Builder**: Compile Bootstrap 5.3 themes using DSAi design tokens
4. **Style Development**: Iterate on SCSS and CSS without affecting the core packages

## Architecture

```plaintext
apps/playground/
├── src/
│   ├── scss/                    # SCSS source files
│   │   ├── _variables.scss      # Compatibility layer (maps token names)
│   │   ├── _mixins.scss         # Utility mixins
│   │   ├── dsai-theme-bs.scss   # Bootstrap 5.3 theme entry
│   │   └── components/          # Component-specific tokens
│   │       ├── _index.scss
│   │       └── _avatar.scss
│   ├── generated/               # Build outputs (auto-generated)
│   │   ├── _variables.scss      # Generated from Style Dictionary
│   │   ├── tokens.css           # CSS custom properties
│   │   ├── tokens.js            # JavaScript tokens
│   │   ├── tokens.ts            # TypeScript tokens
│   │   ├── tokens.json          # JSON tokens
│   │   └── dsai-theme-bs.css    # Compiled Bootstrap theme
│   └── figma-exports/           # Figma token exports
│       └── theme.json
├── sd.config.mjs                # Style Dictionary configuration
├── dsai.config.mjs              # DSAi tools configuration
└── package.json
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Build everything (tokens + styles)
pnpm styles:all

# Development mode with watch
pnpm styles:watch

# Start the playground app
pnpm dev
```

## Token Pipeline

The playground has its own complete token pipeline using `@dsai-io/tools`:

### 1. Figma Exports → DTCG Collections

```bash
pnpm tokens:transform
```

Converts Figma Token Studio exports (`src/figma-exports/theme.json`) into DTCG-compliant collections in `src/collections/`.

### 2. Collections → Multi-format Outputs

```bash
pnpm tokens:build
```

Generates from `src/collections/`:

| Output         | Path                            | Description                     |
| -------------- | ------------------------------- | ------------------------------- |
| SCSS Variables | `src/generated/_variables.scss` | SCSS `$variable` format         |
| CSS Properties | `src/generated/tokens.css`      | CSS custom properties (`--var`) |
| JavaScript     | `src/generated/tokens.js`       | ES6 module                      |
| TypeScript     | `src/generated/tokens.ts`       | TypeScript with types           |
| JSON           | `src/generated/tokens.json`     | Raw JSON format                 |

### 3. SCSS → Bootstrap Theme CSS

```bash
pnpm scss:build
```

Compiles `src/scss/dsai-theme-bs.scss` → `src/generated/dsai-theme-bs.css`:

- Imports generated `_variables.scss` from Step 2
- Applies compatibility layer for naming differences
- Customizes all Bootstrap 5.3 components
- Outputs compressed CSS (~13,000 lines)

## Available Scripts

### Token Management

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `tokens:transform`      | Convert Figma exports → DTCG collections         |
| `tokens:build`          | 🚀 Build tokens (incremental, 10-100x faster)   |
| `tokens:build:full`     | Force full rebuild (ignore cache)                |
| `tokens:build:fast`     | Incremental build + skip validation (fastest)    |
| `tokens:validate`       | Validate token files against DTCG spec           |
| `tokens:changelog`      | Generate changelog from token changes            |
| `tokens:all`            | Transform + build                                |
| `tokens:full`           | Fetch from Figma + transform + build             |

### Style Compilation

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `scss:build`            | Compile SCSS → CSS (Bootstrap theme)             |
| `scss:watch`            | Watch SCSS files for changes                     |
| `styles:all`            | Build tokens + compile SCSS                      |
| `styles:watch`          | Watch tokens + SCSS (concurrent)                 |

### Figma Integration

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `figma:fetch`           | Download tokens from Figma Variables API         |
| `figma:sync`            | Sync local tokens with Figma                     |
| `figma:info`            | Display Figma file information                   |
| `figma:workflow`        | Complete Figma → tokens workflow                 |

### Development

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `dev`                   | Start Vite dev server (<http://localhost:5173>)    |
| `build`                 | Production build                                 |
| `preview`               | Preview production build                         |

## ✨ New Features

### 🚀 Incremental Builds (TASK-122)

**10-100x faster builds** through intelligent caching.

```bash
# First build (full)
pnpm tokens:build

# Subsequent builds (incremental)
pnpm tokens:build
# ⚡ ~45ms vs 2,500ms (55x faster!)

# Force full rebuild
pnpm tokens:build:full
```

**How it works:**

- SHA-256 content hashing detects changes
- Only rebuilds modified files
- Persistent cache in `.dsai-cache/`
- Dependency graph ensures affected files rebuild

**Performance:**

- No changes: 45ms (55x faster)
- 1 file changed: 250ms (10x faster)
- 10 files changed: 850ms (3x faster)

### 📝 Changelog Generation (TASK-124)

**Automatic documentation** of token changes with breaking change detection.

```bash
# Generate changelog
pnpm tokens:changelog old-tokens.json new-tokens.json

# With version number
pnpm tokens:changelog old.json new.json --version 2.0.0

# Custom output
pnpm tokens:changelog old.json new.json --output TOKENS-CHANGELOG.md
```

**Features:**

- Detects added, removed, modified, type-changed tokens
- Identifies breaking changes (removals, type changes)
- Professional Markdown output with before/after values
- Supports DTCG and legacy formats

**Example Output:**

```markdown
# Token Changelog - v2.0.0

⚠️ **This release contains breaking changes**

## 🚨 Breaking Changes (3)

### Removed Tokens (2)
- `color.deprecated.old` (color)

### Type Changes (1)
- `border.width.default`
  - Old Type: dimension → New Type: number
```

### 🛡️ Error Recovery (TASK-119)

**Production-grade resilience** with circuit breakers, rate limiting, and rollback.

**Automatic Snapshots:**

```bash
# Snapshots created automatically before builds
# Stored in .snapshots/ directory
```

**Manual Rollback:**

```typescript
import { SnapshotService } from '@dsai-io/tools/tokens';

const snapshots = new SnapshotService('.snapshots');

// List available snapshots
const list = await snapshots.listSnapshots();

// Restore previous version
await snapshots.restoreSnapshot(snapshotId, 'src/collections/');
```

**Features:**

- **Circuit Breaker**: Prevents cascading failures (opens after 5 failures)
- **Rate Limiter**: Protects Figma API (10 req/min)
- **Snapshot Service**: Version rollback (keeps last 10 snapshots)
- **Exponential Backoff**: Smart retry with jitter

## Configuration

### [dsai.config.mjs](dsai.config.mjs)

Main configuration for `@dsai-io/tools`:

```javascript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    source: 'theme',
    sourceDir: './src/figma-exports',
    collectionsDir: './src',
    outputDir: './src/generated',
    prefix: '--dsai-',
    formats: ['css', 'js', 'ts', 'scss', 'json'],
    
    // NEW: Incremental build cache
    cache: {
      enabled: true,
      directory: '.dsai-cache',
      hashType: 'content',
      maxAge: 86400000, // 24 hours
    },
    
    // NEW: Error recovery
    snapshot: {
      enabled: true,
      directory: '.snapshots',
      maxSnapshots: 10,
    },
    
    circuitBreaker: {
      enabled: true,
      threshold: 5,
      timeout: 30000,
    },
    
    rateLimiter: {
      enabled: true,
      maxRequests: 10,
      windowMs: 60000,
    },
    
    pipeline: {
      steps: ['validate', 'snapshot', 'transform', 'style-dictionary', 'sync'],
    },
  },
  
  // NEW: Automatic changelog generation
  changelog: {
    enabled: true,
    outputPath: 'TOKENS-CHANGELOG.md',
    includeDescriptions: true,
    includeValues: true,
    groupByType: true,
  },
});
```

| ----------------------- | ----------------------------------- |
| `pnpm dev`              | Start Vite dev server               |
| `pnpm build`            | Build for production                |
| `pnpm preview`          | Preview production build            |
| `pnpm tokens:transform` | Convert Figma exports → collections |
| `pnpm tokens:build`     | Generate tokens from collections    |
| `pnpm tokens:validate`  | Validate token structure            |
| `pnpm tokens:watch`     | Watch and rebuild tokens            |
| `pnpm tokens:all`       | Transform + build tokens            |
| `pnpm scss:build`       | Compile Bootstrap theme             |
| `pnpm scss:watch`       | Watch and recompile SCSS            |
| `pnpm styles:all`       | Full pipeline (tokens + scss)       |
| `pnpm styles:watch`     | Watch everything                    |

## SCSS Architecture

### Variable Naming Compatibility

Figma exports use different naming conventions than the Bootstrap theme expects. The compatibility layer in `src/scss/_variables.scss` bridges this gap:

```scss
// Generated token (from Figma):
$typography-text-base: 1rem;

// Bootstrap theme expects:
$typography-font-size-base: $typography-text-base;
```

### Bootstrap 5.3 Customization

The `dsai-theme-bs.scss` file customizes Bootstrap using DSAi tokens:

```scss
// Import generated tokens
@use '../generated/variables' as gen;
// Import compatibility layer
@use './variables' as dsai;

// Bootstrap configuration
$enable-dark-mode: true;
$enable-shadows: true;

// Override Bootstrap variables
$primary: dsai.$semantic-primary;
$font-family-base: dsai.$typography-font-family-base;

// Custom theme attribute (not data-bs-theme)
@mixin color-mode($mode: light) {
  [data-dsai-theme='#{$mode}'] & {
    @content;
  }
}

// Import Bootstrap
@import 'bootstrap/scss/bootstrap';

// Import custom components
@import './components';
```

### Theme Switching

DSAi uses `data-dsai-theme` instead of Bootstrap's `data-bs-theme`:

```html
<!-- Light mode (default) -->
<html data-dsai-theme="light">
  <!-- Dark mode -->
  <html data-dsai-theme="dark">
    <!-- Per-component theming -->
    <div data-dsai-theme="dark">
      <button class="btn btn-primary">Dark themed</button>
    </div>
  </html>
</html>
```

```javascript
// JavaScript theme toggle
document.documentElement.setAttribute('data-dsai-theme', 'dark');
```

## Custom Components

### Avatar Component

The avatar component tokens are defined in `src/scss/components/_avatar.scss`:

```scss
:root {
  // Size scale
  --dsai-avatar-size-xs: 24px;
  --dsai-avatar-size-sm: 32px;
  --dsai-avatar-size-md: 40px;
  --dsai-avatar-size-lg: 48px;
  --dsai-avatar-size-xl: 64px;
  --dsai-avatar-size-xxl: 96px;

  // Font sizes for initials
  --dsai-avatar-font-size-xs: 10px;
  --dsai-avatar-font-size-sm: 12px;
  // ...
}
```

To add new components:

1. Create `src/scss/components/_component-name.scss`
2. Add `@forward 'component-name';` to `src/scss/components/_index.scss`
3. Run `pnpm scss:build`

## Configuration

### Style Dictionary (`sd.config.mjs`)

```javascript
export default {
  source: ['src/collections/**/*.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'src/generated/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: { outputReferences: true },
        },
      ],
    },
    css: {
      /* ... */
    },
    js: {
      /* ... */
    },
    ts: {
      /* ... */
    },
    json: {
      /* ... */
    },
  },
};
```

### DSAi Config (`dsai.config.mjs`)

```javascript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    sourceDir: './src/collections',
    outputDir: './src/generated',
    figmaExports: './src/figma-exports',
    formats: ['css', 'scss', 'js', 'ts', 'json'],
  },
});
```

## Development Workflow

### Adding New Tokens from Figma

1. Export from Figma Token Studio to `src/figma-exports/theme.json`
2. Run `pnpm tokens:transform` to convert to collections
3. Run `pnpm styles:all` to rebuild everything
4. Update compatibility layer if needed (`src/scss/_variables.scss`)

### Modifying Bootstrap Theme

1. Edit `src/scss/dsai-theme-bs.scss`
2. Run `pnpm scss:build` (or use `pnpm scss:watch`)
3. Refresh playground to see changes

### Adding Custom Component Tokens

1. Create component SCSS in `src/scss/components/`
2. Add forward to `_index.scss`
3. Run `pnpm scss:build`

## Output Files

After running `pnpm styles:all`:

```plaintext
src/generated/
├── _variables.scss       # SCSS variables (for theme compilation)
├── tokens.css            # CSS custom properties
├── tokens.js             # JavaScript tokens
├── tokens.ts             # TypeScript tokens
├── tokens.json           # JSON tokens
├── dsai-theme-bs.css     # Compiled Bootstrap theme (~13,000 lines)
└── dsai-theme-bs.css.map # Source map
```

## Dependencies

| Package            | Version      | Purpose                 |
| ------------------ | ------------ | ----------------------- |
| `bootstrap`        | ^5.3.3       | Bootstrap 5.3 framework |
| `sass`             | ^1.77.8      | SCSS compiler           |
| `style-dictionary` | ^5.1.1       | Token transformation    |
| `@dsai-io/tools`      | workspace:\* | DSAi build tooling      |

## Troubleshooting

### "Cannot find variable" errors in SCSS

The generated `_variables.scss` may use different naming than expected. Check the compatibility layer in `src/scss/_variables.scss`.

### Bootstrap compilation errors

Ensure Bootstrap is installed and the `--load-path=node_modules` flag is set in the sass command.

### Tokens not updating

Clear and rebuild:

```bash
rm -rf src/generated/*
pnpm styles:all
```

---

**Version**: 1.0.0  
**Last Updated**: January 2026
