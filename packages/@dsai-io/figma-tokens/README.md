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

- **Figma REST API client** with 21 methods covering variables, published components/styles, library analytics, version history, and file metadata
- **Write support** -- create, update, and delete variables via `POST /v1/files/:key/variables`
- **Library analytics** -- query component, style, and variable usage/action data with cursor-based pagination
- Fetches design token variables from the Figma REST API
- Validates Figma token exports against the DTCG spec
- Transforms Figma variable exports into Style Dictionary-compatible collections
- Syncs tokens between Figma files and your local design system
- Built-in rate limiter, circuit breaker, and retry logic

## CLI

```bash
# Fetch variables from Figma
dsai-figma fetch --file YOUR_FILE_KEY

# Sync tokens between Figma and local collections
dsai-figma sync

# Validate exported tokens
dsai-figma validate

# Show all capabilities (for humans and AI agents)
dsai-figma info
dsai-figma info --json    # Structured JSON for agent consumption
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
import { createFigmaClient } from '@dsai-io/figma-tokens';

const client = createFigmaClient({ accessToken: process.env.FIGMA_TOKEN });

// Variables
const variables = await client.getVariables(fileKey);
const published = await client.getPublishedVariables(fileKey);

// Write variables (create/update/delete -- atomic)
await client.postVariables(fileKey, {
  variables: [{ action: 'CREATE', id: 'temp-1', name: 'spacing/sm', variableCollectionId: 'coll-id', resolvedType: 'FLOAT' }],
  variableModeValues: [{ variableId: 'temp-1', modeId: 'mode-id', value: 8 }],
});

// Published library
const components = await client.getPublishedComponents(fileKey);
const styles = await client.getPublishedStyles(fileKey);

// Analytics (cursor-paginated)
const actions = await client.getComponentActions(fileKey, 'component', {
  startDate: '2025-01-01',
  endDate: '2025-12-31',
});

// File info
const versions = await client.getVersionHistory(fileKey);
const metadata = await client.getFileMetadata(fileKey);
const me = await client.getMe();
```

### Figma REST API Coverage

| Category | Endpoints |
|----------|-----------|
| Files | `GET file`, `GET nodes`, `GET metadata`, `GET versions` |
| Variables | `GET local`, `GET published`, `POST create/update/delete` |
| Library | `GET components`, `GET component_sets`, `GET styles`, `GET by key` |
| Analytics | `GET component/style/variable actions/usages` (6 endpoints) |
| User | `GET me` |

Run `dsai-figma info --json` for the full machine-readable inventory.

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
