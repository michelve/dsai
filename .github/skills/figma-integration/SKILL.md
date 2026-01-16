---
name: figma-integration
description: Syncs design tokens between Figma and code using @dsai-io/figma-tokens. Use when exporting Figma variables, importing tokens to code, syncing design-code parity, or managing the Figma Variables API workflow.
license: Complete terms in LICENSE.txt
metadata:
  author: dsai
  version: '1.0'
---

# Figma Integration

Sync design tokens between Figma and the DSAi codebase.

## When to Use

- Exporting variables from Figma to code
- Syncing local tokens back to Figma
- Setting up Figma API access
- Managing design-code parity
- Troubleshooting sync issues

## Prerequisites

1. Figma Personal Access Token from [Figma Developer Portal](https://www.figma.com/developers/api#access-tokens)
2. Environment variable set:

```bash
export FIGMA_TOKEN="figd_xxx..."
export FIGMA_FILE_KEY="ABC123xyz"  # From Figma file URL
```

## Package Location

```text
packages/@dsai-io/figma-tokens/
├── src/
│   ├── index.ts      # Main exports
│   ├── client.ts     # FigmaClient class
│   └── types.ts      # Type definitions
```

## Quick Start

### Export Tokens from Figma

```typescript
import { createFigmaClientFromEnv } from '@dsai-io/figma-tokens';

const client = createFigmaClientFromEnv();

const result = await client.exportTokens({
  fileKey: 'YOUR_FILE_KEY',
  outputDir: './src/figma-exports',
  format: 'dtcg',
  includeDescriptions: true,
  groupByCollection: true,
});

console.log(`Exported ${result.tokenCount} tokens`);
```

### Sync Tokens

```typescript
const result = await client.syncTokens({
  fileKey: 'YOUR_FILE_KEY',
  tokensDir: './src/collections',
  direction: 'pull', // 'pull' | 'push' | 'both'
  conflictResolution: 'remote',
  dryRun: true, // Preview changes first
});

console.log(`Added: ${result.added.length}`);
console.log(`Updated: ${result.updated.length}`);
```

## CLI Usage

From the playground app:

```bash
# Export tokens
node figma.config.mjs export

# Sync tokens
node figma.config.mjs sync

# Show file info
node figma.config.mjs info

# Full workflow: export → validate → transform → build
node figma.config.mjs workflow
```

## Export Options

| Option                | Type                                                  | Description                   |
| --------------------- | ----------------------------------------------------- | ----------------------------- |
| `fileKey`             | string                                                | Figma file key from URL       |
| `outputDir`           | string                                                | Output directory path         |
| `format`              | `'dtcg'` \| `'tokens-studio'` \| `'style-dictionary'` | Output format                 |
| `includeDescriptions` | boolean                                               | Include token descriptions    |
| `resolveAliases`      | boolean                                               | Resolve references to values  |
| `groupByCollection`   | boolean                                               | Separate files per collection |
| `collections`         | string[]                                              | Filter specific collections   |
| `modes`               | string[]                                              | Filter specific modes         |

## Sync Options

| Option               | Type                                  | Description               |
| -------------------- | ------------------------------------- | ------------------------- |
| `direction`          | `'pull'` \| `'push'` \| `'both'`      | Sync direction            |
| `conflictResolution` | `'local'` \| `'remote'` \| `'manual'` | How to resolve conflicts  |
| `dryRun`             | boolean                               | Preview without applying  |
| `backup`             | boolean                               | Create backup before sync |

## Output Formats

### DTCG (Recommended)

```json
{
  "color": {
    "blue": {
      "500": {
        "$value": "#0a58ca",
        "$type": "color",
        "$description": "Primary brand color"
      }
    }
  }
}
```

### Tokens Studio

```json
{
  "color": {
    "blue": {
      "500": {
        "value": "#0a58ca",
        "type": "color",
        "description": "Primary brand color"
      }
    }
  }
}
```

## Workflow

1. **Design in Figma** - Create/update variables in Figma
2. **Export** - Run `figma.config.mjs export` to fetch tokens
3. **Validate** - Tokens are validated for DTCG compliance
4. **Transform** - Convert to Style Dictionary format
5. **Build** - Generate CSS, SCSS, JS outputs

## File Structure After Export

```text
src/
├── figma-exports/           # Raw Figma exports
│   ├── colors.json
│   ├── typography.json
│   └── spacing.json
├── collections/             # Transformed tokens
│   └── color/
│       ├── primitive.json
│       └── semantic.json
└── generated/               # Built outputs
    ├── tokens.css
    ├── tokens.scss
    └── tokens.ts
```

## Troubleshooting

### Authentication Error

```text
❌ Figma client not configured!
```

Ensure `FIGMA_TOKEN` is set:

```bash
export FIGMA_TOKEN="figd_xxx..."
```

### File Not Found

Check your file key from the Figma URL:

```text
https://www.figma.com/file/ABC123xyz/Design-System
                            ^^^^^^^^^^
                            This is the file key
```

### No Variables Found

Ensure your Figma file uses the Variables feature (not just styles).

## API Reference

```typescript
// Create client
const client = createFigmaClient({
  accessToken: 'figd_xxx',
  timeout: 60000,
  retries: 3,
});

// Check if ready
client.isReady();

// Get file metadata
await client.getFile(fileKey, { depth: 1 });

// Get variables
const { variables, variableCollections } = await client.getVariables(fileKey);

// Export tokens
await client.exportTokens(options);

// Sync tokens
await client.syncTokens(options);
```
