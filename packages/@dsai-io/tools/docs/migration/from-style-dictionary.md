# Migrating from Style Dictionary

Guide for migrating from Amazon Style Dictionary to `@dsai-io/tools`.

## Overview

`@dsai-io/tools` is compatible with Style Dictionary concepts but offers:

- TypeScript configuration
- Built-in multi-brand support
- Icon generation
- Faster builds

---

## Quick Comparison

| Feature        | Style Dictionary | @dsai-io/tools     |
| -------------- | ---------------- | --------------- |
| Config format  | JSON/JS          | TypeScript      |
| Token format   | Custom           | DTCG-compatible |
| Transforms     | ✓                | ✓               |
| Custom formats | ✓                | ✓               |
| Multi-brand    | Manual           | Built-in        |
| Icons          | ✗                | ✓               |
| Watch mode     | ✓                | ✓               |

---

## Step 1: Install

```bash
# Remove Style Dictionary
pnpm remove style-dictionary

# Install @dsai-io/tools
pnpm add -D @dsai-io/tools
```

---

## Step 2: Convert Configuration

### Style Dictionary Config

```javascript
// config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/module',
        },
      ],
    },
  },
};
```

### `@dsai-io/tools` Config

```typescript
// dsai.config.ts
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    sources: ['tokens/**/*.json'],
    outputDir: './build',
  },
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'js/module',
        },
      ],
    },
  },
});
```

---

## Step 3: Convert Tokens

### Style Dictionary Format

```json
{
  "color": {
    "base": {
      "blue": {
        "value": "#007bff"
      }
    },
    "primary": {
      "value": "{color.base.blue}"
    }
  }
}
```

### DTCG Format (Recommended)

```json
{
  "color": {
    "base": {
      "blue": {
        "$value": "#007bff",
        "$type": "color"
      }
    },
    "primary": {
      "$value": "{color.base.blue}",
      "$type": "color"
    }
  }
}
```

### Migration Script

```typescript
// scripts/migrate-tokens.ts
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('tokens/**/*.json');

for (const file of files) {
  const content = JSON.parse(readFileSync(file, 'utf-8'));
  const migrated = migrateToken(content);
  writeFileSync(file, JSON.stringify(migrated, null, 2));
}

function migrateToken(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;

  // Convert to DTCG format
  if ('value' in obj && !('$value' in obj)) {
    return {
      $value: obj.value,
      $type: obj.type,
      $description: obj.comment || obj.description,
      ...Object.fromEntries(
        Object.entries(obj)
          .filter(([k]) => !['value', 'type', 'comment', 'description'].includes(k))
          .map(([k, v]) => [k, migrateToken(v)])
      ),
    };
  }

  // Recurse into nested objects
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, migrateToken(v)]));
}
```

---

## Step 4: Convert Transforms

### Style Dictionary Transform

```javascript
StyleDictionary.registerTransform({
  name: 'size/px',
  type: 'value',
  matcher: (token) => token.attributes.category === 'size',
  transformer: (token) => `${token.value}px`,
});
```

### `@dsai-io/tools` Transform

```typescript
// dsai.config.ts
export default defineConfig({
  transforms: {
    customTransforms: [
      {
        name: 'size/px',
        type: 'value',
        matcher: (token) => token.type === 'size',
        transformer: (token) => `${token.value}px`,
      },
    ],
  },
});
```

---

## Step 5: Convert Formats

### Style Dictionary Format

```javascript
StyleDictionary.registerFormat({
  name: 'custom/json',
  formatter: ({ dictionary }) => {
    return JSON.stringify(dictionary.tokens, null, 2);
  },
});
```

### `@dsai-io/tools` Format

```typescript
// dsai.config.ts
export default defineConfig({
  formats: {
    customFormats: [
      {
        name: 'custom/json',
        formatter: ({ tokens }) => {
          return JSON.stringify(tokens, null, 2);
        },
      },
    ],
  },
});
```

---

## Step 6: Update Scripts

### package.json

```json
{
  "scripts": {
    "tokens:build": "dsai tokens build",
    "tokens:validate": "dsai tokens validate",
    "tokens:watch": "dsai tokens build --watch"
  }
}
```

---

## Step 7: Update CI/CD

### Before (Style Dictionary)

```yaml
- run: npx style-dictionary build
```

### After (@dsai-io/tools)

```yaml
- run: pnpm dsai tokens build
```

---

## Transform Group Mapping

| Style Dictionary | @dsai-io/tools      |
| ---------------- | ---------------- |
| `css`            | `web-css`        |
| `scss`           | `web-scss`       |
| `js`             | `web-js`         |
| `ios`            | `ios-swift`      |
| `android`        | `android-kotlin` |

---

## Format Mapping

| Style Dictionary              | @dsai-io/tools       |
| ----------------------------- | ----------------- |
| `css/variables`               | `css/variables`   |
| `scss/variables`              | `scss/variables`  |
| `javascript/module`           | `js/module`       |
| `javascript/es6`              | `js/module`       |
| `typescript/es6-declarations` | `ts/declarations` |
| `json`                        | `json/flat`       |
| `json/nested`                 | `json/nested`     |

---

## Common Issues

### References Not Resolving

**Style Dictionary:** Uses `{path.to.token.value}`
**@dsai-io/tools:** Uses `{path.to.token}` (without `.value`)

```json
// Before
{ "value": "{color.primary.value}" }

// After
{ "$value": "{color.primary}" }
```

### Category Attributes

**Style Dictionary:** Auto-generates `attributes.category`
**@dsai-io/tools:** Use `$type` or explicit attributes

```json
// Before
{
  "size": {
    "font": {
      "base": { "value": "16" }
    }
  }
}
// token.attributes.category === 'size'

// After
{
  "size": {
    "font": {
      "base": { "$value": "16", "$type": "size" }
    }
  }
}
// token.type === 'size'
```

---

## See Also

- [Configuration Reference](../configuration.md)
- [Custom Transforms](../guides/custom-transforms.md)
- [Custom Formats](../guides/custom-formats.md)
