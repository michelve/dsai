# @dsai-io/storybook

> Official Storybook documentation for the DSAi Design System

## Overview

This package contains the Storybook configuration and documentation for all DSAi design tokens, components, and patterns. Built with **Storybook 10** and **React 19**, it provides an interactive development environment for building, testing, and documenting UI components.

**Package version:** 1.0.6
**License:** AGPL-3.0-or-later

## Quick Start

```bash
# Start development server
pnpm storybook

# Build static site
pnpm build

# Verify setup
pnpm verify

# Kill running instances
pnpm kill
```

Access at: **<http://localhost:6006>**

## What's Documented

### Foundation (Design Tokens)

- **Colors** — 121 primitive + 35 semantic color tokens (brand, semantic, component-semantic, neutral, all hues)
- **Typography** — Font scales, weights, line heights
- **Spacing** — Layout spacing system
- **Icons** — Icon set documentation
- **CSS Variables** — Guide to using `--dsai-` prefixed variables
- **TypeScript Types** — Type documentation for tokens

### Components (33 stories)

Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Card, CardList, Carousel, Checkbox, CheckboxGroup, Dropdown, Icon, Input, ListGroup, Modal, Navbar, Pagination, Popover, Progress, Radio, Scrollspy, Select, SelectableCard, Sheet, Spinner, Switch, Table, Tabs, TabsPro, Toast, Tooltip, Typography

Each story includes usage examples, props documentation (via autodocs), and interactive playground for all variants.

### Guides

- **Getting Started** — Installation, setup, token usage, TypeScript config, tree shaking, styling, accessibility, dark mode
- **CLI Tools** — DSAi CLI usage
- **Utilities** — Helper utilities reference

### Utilities

- **A11y** — Accessibility utility demos
- **Async** — Async utility demos

## Architecture

### Configuration Files

```text
.storybook/
├── main.ts              # Storybook config, addons, Vite aliases
├── preview.ts           # Global decorators, parameters, theme toggle
├── preview.css          # Global styles (font smoothing, padding)
├── preview-head.html    # Dynamic font loader (Google Fonts)
├── DSAiTheme.ts         # Light and dark Storybook UI themes
├── manager.ts           # Manager UI config (sidebar, toolbar, panel)
└── vitest.setup.ts      # Vitest browser testing setup
```

### Story Files

```text
docs/
├── Welcome.mdx                  # Main welcome page
├── components/                  # 33 component stories
│   ├── Button.stories.tsx
│   ├── Card.stories.tsx
│   └── ...
├── foundation/                  # Design token documentation
│   ├── Colors.stories.tsx
│   ├── Typography.stories.tsx
│   ├── Spacing.stories.tsx
│   ├── Icons.stories.tsx
│   ├── CSSVariables.mdx
│   └── TypeScriptTypes.mdx
├── guides/                      # Implementation guides
│   ├── GettingStarted.mdx
│   ├── CLITools.mdx
│   └── Utilities.mdx
└── utilities/                   # Utility demos
    ├── A11y.stories.tsx
    └── Async.stories.tsx
```

### Key Features

#### 1. Vite Alias Resolution

Resolves monorepo packages via shared Vite config with caching disabled for fast updates.

#### 2. Automatic Token + Style Building

Pre-hooks ensure tokens and styles are always fresh before dev or build:

```json
{
  "prestorybook": "pnpm styles:all",
  "prebuild": "pnpm styles:all"
}
```

`styles:all` runs the full pipeline: token validation, transformation, Style Dictionary build (light + dark), and SCSS compilation.

#### 3. Design Token Integration

Multiple CSS files loaded globally in `preview.ts`:

- `dsai-theme-bs.css` — Bootstrap theme overrides
- `tokens.css` — Light mode design tokens
- `tokens-dark.css` — Dark mode token overrides

#### 4. Light/Dark Theme System

`DSAiTheme.ts` defines both light and dark Storybook UI themes using token-derived colors. The preview includes a theme decorator that applies `data-dsai-theme` and adjusts background/text colors based on toolbar selection.

#### 5. Dynamic Font Loading

`preview-head.html` contains a smart font loader that reads CSS variables and dynamically loads the matching font from Google Fonts. Supports 11 fonts including Inter, Roboto Mono, Poppins, JetBrains Mono, and more.

#### 6. Autodocs

All stories are tagged with `autodocs` for automatic documentation generation with prop tables and code panels.

## Design Token Pipeline

Tokens flow through a multi-stage pipeline:

```text
src/figma-exports/     →  Raw Figma token exports
src/collections/       →  Transformed token collections
src/generated/         →  Built output (CSS, JS, TS, SCSS, JSON)
```

Configuration files:

| File | Purpose |
|------|---------|
| `dsai.config.mjs` | DSAi token pipeline settings (source, output, formats) |
| `sd.config.mjs` | Style Dictionary config — light mode tokens |
| `sd.config.dark.mjs` | Style Dictionary config — dark mode overrides |

Token commands:

```bash
pnpm tokens:build      # Validate + transform + Style Dictionary (light + dark)
pnpm tokens:transform  # Transform only
pnpm scss:build        # Compile SCSS to CSS
pnpm styles:all        # Full pipeline (tokens + SCSS)
```

## Writing Stories

### Basic Story Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@dsai-io/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI button component.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};
```

### MDX Documentation

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

Interactive button component with multiple variants.

<Canvas of={ButtonStories.Primary} />
<Controls of={ButtonStories.Primary} />
```

## Using Design Tokens in Stories

### Method 1: CSS Variables (Recommended)

```tsx
<div
  style={{
    backgroundColor: 'var(--dsai-theme-primary)',
    color: 'var(--dsai-neutral-white)',
  }}
>
  Content
</div>
```

### Method 2: JavaScript Import

```tsx
import { themePrimary, neutralWhite } from './generated/tokens';

<div
  style={{
    backgroundColor: themePrimary,
    color: neutralWhite,
  }}
>
  Content
</div>;
```

## Testing

### Vitest + Playwright (Browser Testing)

```bash
pnpm test          # Run tests
pnpm test:watch    # Watch mode
```

Tests run in a real Chromium browser via `@vitest/browser-playwright` with Storybook portable stories.

### Storybook Test Runner

```bash
pnpm test-storybook
```

### Visual Regression (Chromatic)

```bash
pnpm chromatic
```

Configured via `chromatic.config.json` to only run on changed stories with zip compression.

### Accessibility Testing

All stories automatically checked with `@storybook/addon-a11y`:

- Color contrast
- Keyboard navigation
- ARIA attributes
- Screen reader support

## Installed Addons

| Addon | Purpose |
|-------|---------|
| `@storybook/addon-docs` | Documentation generation and MDX support |
| `@storybook/addon-a11y` | Accessibility testing and reporting |
| `@storybook/addon-links` | Navigate between stories |
| `@storybook/addon-designs` | Link Figma designs to stories |
| `@storybook/addon-vitest` | Vitest integration for browser testing |
| `@chromatic-com/storybook` | Chromatic visual regression testing |

## Troubleshooting

### Error: "Failed to fetch dynamically imported module"

**Cause:** Tokens not built or incorrect import path

```bash
pnpm styles:all
pnpm storybook
```

### Colors Showing as Gray (#cccccc)

**Cause:** Accessing token object instead of `.value` property

```tsx
// Wrong
const color = tokens.color.blue['500'];

// Correct
const color = tokens.color.blue['500'].value;
```

### Storybook Won't Start

```bash
# Kill any running instances
pnpm kill

# Clear caches
rm -rf node_modules/.vite
rm -rf .nx/cache

# Rebuild and restart
pnpm styles:all
pnpm storybook
```

### Changes Not Appearing

1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
2. Check terminal for build errors
3. Verify generated CSS files exist in `src/generated/`

## Related Packages

- `@dsai-io/react` — React component library (33 components, 23 hooks, 23 utilities)
- `@dsai-io/tools` — CLI tooling, token pipeline, build utilities
- `@dsai-io/figma-tokens` — Figma Variables API integration

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook + Vite](https://storybook.js.org/docs/builders/vite)
- [Storybook + Nx](https://nx.dev/recipes/storybook)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [Chromatic](https://www.chromatic.com/docs/)

---

**Last Updated:** March 29, 2026
**Maintainers:** DSAi Team
