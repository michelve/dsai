# DSAi Design System

[![CI](https://github.com/michelve/dsai/actions/workflows/ci.yml/badge.svg)](https://github.com/michelve/dsai/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/michelve/dsai/graph/badge.svg?token=VF7ZM3A9L1)](https://codecov.io/github/michelve/dsai)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE.md)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A522-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%E2%89%A510-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Nx](https://img.shields.io/badge/Nx-Monorepo-143055?logo=nx&logoColor=white)](https://nx.dev)
[![Storybook](https://img.shields.io/badge/Storybook-10-FF4785?logo=storybook&logoColor=white)](https://storybook.js.org)
[![Jest](https://img.shields.io/badge/Jest-30-C21325?logo=jest&logoColor=white)](https://jestjs.io)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG_2.1-AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Figma](https://img.shields.io/badge/Figma-Code_Connect-F24E1E?logo=figma&logoColor=white)](https://www.figma.com)

> **Beta** — DSAi is in active development. APIs may change between releases. [Early access & collaboration →](https://github.com/michelve/dsai)

Build beautiful, accessible interfaces - fast. DSAi gives you production-ready components, a design token pipeline, and a CLI that lets you own your code. No black-box dependencies, just copy, customize, and ship.

Accessible by default. Themeable with design tokens. Designed to work the way your team already builds, with Bootstrap styling, Figma integration, and TypeScript you can trust.

---

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@dsai-io/react`](packages/@dsai-io/react) | 1.0.2 | 33 React components with Bootstrap 5 styling and WCAG 2.1 AA compliance |
| [`@dsai-io/tools`](packages/@dsai-io/tools) | [![npm](https://img.shields.io/npm/v/@dsai-io/tools)](https://www.npmjs.com/package/@dsai-io/tools) | CLI, component registry, token pipeline, and build tooling |
| [`@dsai-io/figma-tokens`](packages/@dsai-io/figma-tokens) | [![npm](https://img.shields.io/npm/v/@dsai-io/figma-tokens)](https://www.npmjs.com/package/@dsai-io/figma-tokens) | Figma Variables API client and token synchronization |
| [`@dsai-io/storybook`](packages/@dsai-io/storybook) | 1.0.6 | Component documentation and visual testing |

## Getting Started

### For new projects (starter template)

```bash
git clone https://github.com/michelve/draft_v0.git my-app
cd my-app
pnpm install
pnpm dev
```

The [DSAi Starter Template](https://github.com/michelve/draft_v0) comes pre-configured with the full token pipeline, Bootstrap 5 compiled with DSAi tokens, and Button + Typography components installed.

### Adding components

```bash
# Add specific components, hooks, or utilities
dsai add button modal tabs use-focus-trap cn

# Browse all 80 available items
dsai add --list

# Add all hooks
dsai add --all --type hook

# Preview without writing
dsai add modal --dry-run
```

Components are copied as source files into your project. Dependencies (hooks, utils, types, npm packages) are resolved and installed automatically.

### Using components

```typescript
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Heading, Text } from '@/components/ui/typography';

function App() {
  return (
    <div>
      <Heading level={1}>Welcome</Heading>
      <Text>Build accessible UIs with DSAi components.</Text>
      <Button variant="primary">Get Started</Button>
    </div>
  );
}
```

## Token Pipeline

Design tokens flow from Figma to code through a multi-step pipeline:

```
Figma Variables --> figma-exports/ --> collections/ --> Style Dictionary --> CSS/SCSS/JS/TS
                    (dsai-figma)      (dsai tokens      (dsai tokens
                                       transform)         build)
```

```bash
# Full rebuild
dsai tokens build

# Validate token structure
dsai tokens validate

# Transform Figma exports to DTCG collections
dsai tokens transform

# Sync from Figma (requires FIGMA_TOKEN env var)
dsai-figma sync
```

The pipeline supports multi-theme builds (light + dark), SCSS compilation with Bootstrap variable injection, and CSS postprocessing.

## Development (monorepo contributors)

### Prerequisites

- Node.js >= 22
- pnpm >= 10

### Setup

```bash
git clone https://github.com/michelve/dsai.git
cd dsai
pnpm install
pnpm build
```

### Commands

```bash
pnpm build                        # Build all packages
pnpm test                         # Run all tests
pnpm lint                         # Lint all packages
pnpm storybook                    # Start Storybook

# Single package
npx nx build @dsai-io/react
npx nx test @dsai-io/tools

# Only changed packages
npx nx affected -t build
npx nx affected -t test
```

### Project Structure

```
dsai/
  packages/@dsai-io/
    react/            33 React components, 23 hooks, 23 utilities
    tools/            CLI, registry, token pipeline, build tooling
    figma-tokens/     Figma API client and token sync
    storybook/        Component documentation (Storybook 10)
    docs/             Documentation package
  apps/
    playground/       Development playground
```

### Code Quality

- TypeScript strict mode
- Biome + ESLint for linting
- Jest 30 + Testing Library for tests
- jest-axe for accessibility testing
- 80% minimum coverage threshold, 90%+ target
- GitHub Actions CI on every push and PR

## Resources

- [DSAi Starter Template](https://github.com/michelve/draft_v0) -- official starter app (React 19, Bootstrap 5, Express, Prisma)
- [@dsai-io/tools on npm](https://www.npmjs.com/package/@dsai-io/tools) -- CLI and build tooling
- [@dsai-io/figma-tokens on npm](https://www.npmjs.com/package/@dsai-io/figma-tokens) -- Figma integration
- [GitHub Issues](https://github.com/michelve/dsai/issues)

## License

[AGPL-3.0-or-later](LICENSE.md) -- individual packages may use different licenses (see each package's README).
