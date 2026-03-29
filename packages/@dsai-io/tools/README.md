# @dsai-io/tools

> Build tooling, component registry, and CLI for the [DSAi Design System](https://github.com/michelve/dsai)

[![npm version](https://img.shields.io/npm/v/@dsai-io/tools)](https://www.npmjs.com/package/@dsai-io/tools)

> **Beta** -- DSAi is currently in active development and not yet generally available. APIs and interfaces may change between releases. For early access or collaboration inquiries, see the [DSAi repository](https://github.com/michelve/dsai).

## Installation

```bash
pnpm add -D @dsai-io/tools
# or
npm install -D @dsai-io/tools
```

## CLI Commands

### Add Components

Install DSAi components, hooks, and utilities directly into your project source code.

```bash
# Add UI components
dsai add button modal tabs

# Add hooks and utilities
dsai add use-focus-trap use-debounce cn keyboard

# Add all UI components
dsai add --all

# Add all hooks
dsai add --all --type hook

# List everything available
dsai add --list

# List only hooks
dsai add --list --type hook

# Preview without writing files
dsai add button --dry-run

# Overwrite existing files
dsai add button --overwrite
```

Components are copied as source files into your project (not installed from `node_modules`). Dependencies are resolved automatically -- adding `modal` also installs `use-focus-trap`, `use-scroll-lock`, `cn`, `keyboard`, and the shared type definitions.

### Build Tokens

Transform and compile design tokens from Figma exports into CSS, SCSS, JS, TS, and JSON.

```bash
# Full build pipeline
dsai tokens build

# Validate token structure
dsai tokens validate

# Transform Figma exports to DTCG collections
dsai tokens transform
```

The pipeline is configured via `dsai.config.mjs` and supports multi-theme builds (light + dark), SCSS compilation with Bootstrap integration, and CSS postprocessing.

### Build Registry

Regenerate the component registry from `@dsai-io/react` source (monorepo maintainers only).

```bash
dsai registry build
dsai registry build --verbose
```

### Other Commands

```bash
# Initialize configuration
dsai init

# Show resolved configuration
dsai config

# Generate icon components from SVGs
dsai icons build --format react

# Show full tool inventory (for humans and AI agents)
dsai info
dsai info --json    # Structured JSON for agent consumption
```

## Configuration

Create `dsai.config.mjs` in your project root:

```javascript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    source: 'theme',
    sourceDir: './src/figma-exports',
    collectionsDir: './src',
    outputDir: './src/generated',
    prefix: '--dsai-',
    formats: ['css', 'scss', 'js', 'ts', 'json'],
    separateThemeFiles: true,
    scss: {
      themeEntry: 'src/scss/dsai-theme-bs.scss',
      cssOutputDir: 'src/generated/css',
      framework: 'bootstrap',
    },
    themes: {
      enabled: true,
      default: 'light',
      definitions: {
        light: { isDefault: true, selector: ':root' },
        dark: {
          suffix: '-dark',
          selector: '[data-dsai-theme="dark"]',
          mediaQuery: '(prefers-color-scheme: dark)',
        },
      },
    },
    pipeline: {
      steps: ['validate', 'transform', 'multi-theme', 'sass-theme', 'postprocess'],
    },
  },
  aliases: {
    importAlias: '@/',
    ui: 'src/components/ui',
    hooks: 'src/hooks',
    utils: 'src/lib/utils',
    components: 'src/components',
    lib: 'src/lib',
  },
  components: {
    tsx: true,
    overwrite: false,
  },
});
```

### Aliases

The `aliases` section controls where `dsai add` writes files:

| Alias | Default | Description |
|-------|---------|-------------|
| `importAlias` | `@/` | Import prefix used in tsconfig paths |
| `ui` | `src/components/ui` | UI component target directory |
| `hooks` | `src/hooks` | Hook target directory |
| `utils` | `src/lib/utils` | Utility target directory |
| `components` | `src/components` | Higher-level component directory |
| `lib` | `src/lib` | Library file directory |

### Pipeline Steps

| Step | Description |
|------|-------------|
| `validate` | Validate tokens against DTCG spec |
| `transform` | Transform Figma exports to DTCG collections |
| `style-dictionary` | Build Style Dictionary outputs |
| `multi-theme` | Generate light + dark theme outputs |
| `sync` | Sync tokens to flat TypeScript file |
| `sass-theme` | Compile Bootstrap theme SCSS |
| `sass-theme-minified` | Compile minified Bootstrap theme |
| `postprocess` | Post-process CSS (e.g., replace `data-bs-theme` with `data-dsai-theme`) |
| `sass-utilities` | Compile DSAi utilities SCSS |
| `sass-utilities-minified` | Compile minified utilities |
| `bundle` | Bundle with tsup |

## Component Registry

The registry contains 81 items:

- **33 UI components** -- Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Card, Carousel, Checkbox, Dropdown, Icon, Input, ListGroup, Modal, Navbar, Pagination, Popover, Progress, Radio, Scrollspy, Select, Sheet, Spinner, Switch, Table, Tabs, Toast, Tooltip, Typography, and more
- **23 hooks** -- useAsync, useClickOutside, useControllableState, useDarkMode, useDebounce, useFocusTrap, useForm, useHover, useMediaQuery, useReducedMotion, useResizeObserver, useRovingFocus, useScrollLock, useThrottle, and more
- **24 utilities** -- cn, keyboard helpers, mergeRefs, browser detection, validation, string utils, accessibility helpers, and more
- **1 shared type system** -- SafeHTMLAttributes, ComponentSize, SemanticColorVariant, PolymorphicComponentProps

Each item declares its dependencies. When you add a component, all required hooks, utils, types, and npm packages are resolved and installed automatically.

## Programmatic API

```typescript
import { loadConfig, buildRegistry, resolveTree, writeRegistryItems } from '@dsai-io/tools';

// Load configuration
const { config } = await loadConfig();

// Resolve dependencies for a set of components
const tree = resolveTree(['modal', 'tabs'], registryDir);
// tree.items: all items in install order
// tree.dependencies: npm packages needed

// Write files to a project
writeRegistryItems(tree, {
  projectDir: process.cwd(),
  aliases: config.aliases,
  components: config.components,
});
```

## Peer Dependencies

- `style-dictionary@^5.0.0` (optional) -- required for token building

## Resources

- [DSAi Design System](https://github.com/michelve/dsai) -- monorepo with components, tools, tokens, and Storybook
- [DSAi Starter Template](https://github.com/michelve/draft_v0) -- official starter app (React 19, Bootstrap 5, Express, Prisma)
- [@dsai-io/tools on npm](https://www.npmjs.com/package/@dsai-io/tools)
- [@dsai-io/figma-tokens on npm](https://www.npmjs.com/package/@dsai-io/figma-tokens)

## License

MIT
