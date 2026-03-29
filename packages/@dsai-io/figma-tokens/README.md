# @dsai-io/figma-tokens

> Figma integration, token synchronization, and API client for the [DSAi Design System](https://github.com/michelve/dsai)

[![npm version](https://img.shields.io/npm/v/@dsai-io/figma-tokens)](https://www.npmjs.com/package/@dsai-io/figma-tokens)

> **Beta** -- DSAi is currently in active development and not yet generally available. APIs and interfaces may change between releases. For early access or collaboration inquiries, see the [DSAi repository](https://github.com/michelve/dsai).

## Installation

```bash
pnpm add -D @dsai-io/figma-tokens
# or
npm install -D @dsai-io/figma-tokens
```

Requires [`@dsai-io/tools`](https://www.npmjs.com/package/@dsai-io/tools) as a dependency (installed automatically).

## What This Package Does

- Fetches design token variables from the Figma REST API
- Validates Figma token exports against the DTCG spec
- Transforms Figma variable exports into Style Dictionary-compatible collections
- Syncs tokens between Figma files and your local design system
- Includes a rate limiter to stay within Figma API limits

## CLI

```bash
# Fetch variables from Figma
dsai-figma fetch --file YOUR_FILE_KEY

# Sync tokens between Figma and local collections
dsai-figma sync

# Validate exported tokens
dsai-figma validate
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FIGMA_TOKEN` | Yes | Figma personal access token |
| `FIGMA_FILE_KEY` | No | Default Figma file key (can also pass via `--file`) |

## Configuration

Configure via `dsai.config.mjs` or set environment variables:

```javascript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    source: 'theme',
    sourceDir: './src/figma-exports',
    collectionsDir: './src',
    outputDir: './src/generated',
  },
});
```

## Programmatic API

### Validate Figma Exports

```typescript
import { validateFigmaExports } from '@dsai-io/figma-tokens';

const result = await validateFigmaExports({
  exportsDir: './figma-exports',
  strict: true,
});

if (!result.valid) {
  console.error('Validation failed:', result.errors);
}
```

### Transform Tokens

```typescript
import { transformTokens } from '@dsai-io/figma-tokens';

await transformTokens({
  sourceDir: './figma-exports',
  outputDir: './tokens/collections',
});
```

### Figma API Client

```typescript
import { FigmaClient } from '@dsai-io/figma-tokens/client';

const client = new FigmaClient({ token: process.env.FIGMA_TOKEN });
const variables = await client.getVariables(fileKey);
```

## Typical Workflow

```bash
# 1. Set your Figma token
export FIGMA_TOKEN=your_token_here

# 2. Fetch tokens from Figma
dsai-figma fetch --file YOUR_FILE_KEY

# 3. Transform to DTCG collections
dsai tokens transform

# 4. Build CSS, SCSS, JS, TS outputs
dsai tokens build
```

## Dependencies

- [`@dsai-io/tools`](https://www.npmjs.com/package/@dsai-io/tools) -- build tooling and token pipeline

## Resources

- [DSAi Design System](https://github.com/michelve/dsai) -- monorepo with components, tools, tokens, and Storybook
- [DSAi Starter Template](https://github.com/michelve/draft_v0) -- official starter app
- [@dsai-io/tools on npm](https://www.npmjs.com/package/@dsai-io/tools) -- CLI and build tooling

## License

MIT
