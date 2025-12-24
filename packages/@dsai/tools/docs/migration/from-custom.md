# Migrating from Custom Systems

Guide for migrating from custom or proprietary token systems to `@dsai/tools`.

## Overview

This guide helps you migrate from:

- Custom JSON/YAML token formats
- Spreadsheet-based token systems
- Figma-only token workflows
- Sass/Less variable files

---

## Step 1: Audit Your Current System

### Document Token Structure

Create an inventory of your current tokens:

| Category   | Count | Format Example              |
| ---------- | ----- | --------------------------- |
| Colors     | 50    | `#007bff`                   |
| Typography | 20    | `{ family, size, weight }`  |
| Spacing    | 12    | `8px`, `16px`               |
| Shadows    | 5     | `0 2px 4px rgba(0,0,0,0.1)` |

### Identify Token Types

Map your current token categories to DTCG types:

| Your Category | DTCG Type     |
| ------------- | ------------- |
| colors        | `color`       |
| fonts         | `fontFamily`  |
| font-sizes    | `fontSize`    |
| spacing       | `dimension`   |
| shadows       | `shadow`      |
| borders       | `border`      |
| radii         | `dimension`   |
| durations     | `duration`    |
| easings       | `cubicBezier` |

---

## Step 2: Convert Token Format

### From Sass Variables

**Before:**

```scss
// _variables.scss
$color-primary: #007bff;
$color-secondary: #6c757d;
$font-size-base: 16px;
$font-size-lg: 20px;
$spacing-sm: 8px;
$spacing-md: 16px;
```

**After:**

```json
{
  "color": {
    "primary": { "$value": "#007bff", "$type": "color" },
    "secondary": { "$value": "#6c757d", "$type": "color" }
  },
  "fontSize": {
    "base": { "$value": "16px", "$type": "fontSize" },
    "lg": { "$value": "20px", "$type": "fontSize" }
  },
  "spacing": {
    "sm": { "$value": "8px", "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" }
  }
}
```

### From CSS Variables

**Before:**

```css
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --font-size-base: 16px;
}
```

**After:**

```json
{
  "color": {
    "primary": { "$value": "#007bff", "$type": "color" },
    "secondary": { "$value": "#6c757d", "$type": "color" }
  },
  "fontSize": {
    "base": { "$value": "16px", "$type": "fontSize" }
  }
}
```

### From Spreadsheets

**Before (CSV):**

```csv
name,value,category
color-primary,#007bff,color
color-secondary,#6c757d,color
spacing-sm,8px,spacing
```

**Migration Script:**

```typescript
// scripts/migrate-csv.ts
import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync } from 'fs';

const csv = readFileSync('tokens.csv', 'utf-8');
const records = parse(csv, { columns: true });

const tokens: Record<string, any> = {};

for (const record of records) {
  const { name, value, category } = record;
  const [group, item] = name.split('-').slice(1);

  if (!tokens[category]) tokens[category] = {};
  if (!tokens[category][group]) tokens[category][group] = {};

  tokens[category][group][item || 'default'] = {
    $value: value,
    $type: mapType(category),
  };
}

writeFileSync('tokens/tokens.json', JSON.stringify(tokens, null, 2));

function mapType(category: string): string {
  const typeMap: Record<string, string> = {
    color: 'color',
    spacing: 'dimension',
    fontSize: 'fontSize',
    fontFamily: 'fontFamily',
  };
  return typeMap[category] || 'string';
}
```

---

## Step 3: Create Configuration

```typescript
// dsai.config.ts
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    sources: ['./tokens/**/*.json'],
    outputDir: './dist/tokens',
  },
  platforms: {
    web: {
      transformGroup: 'web-css',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
        {
          destination: 'tokens.scss',
          format: 'scss/variables',
        },
      ],
    },
  },
});
```

---

## Step 4: Validate Migration

### Compare Output

```typescript
// scripts/validate-migration.ts
import { readFileSync } from 'fs';

// Read old output
const oldVars = parseScssVariables(readFileSync('old/_variables.scss', 'utf-8'));

// Read new output
const newVars = parseCssVariables(readFileSync('dist/tokens/variables.css', 'utf-8'));

// Compare
const missing = [];
const different = [];

for (const [name, value] of Object.entries(oldVars)) {
  const newName = convertName(name); // $color-primary -> --color-primary
  if (!(newName in newVars)) {
    missing.push(name);
  } else if (normalizeValue(newVars[newName]) !== normalizeValue(value)) {
    different.push({ name, old: value, new: newVars[newName] });
  }
}

console.log('Missing tokens:', missing);
console.log('Different values:', different);
```

### Visual Comparison

Create a comparison page:

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="old/styles.css" />
    <link rel="stylesheet" href="dist/tokens/variables.css" />
    <style>
      .swatch {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 1px solid #ccc;
      }
    </style>
  </head>
  <body>
    <h2>Color Comparison</h2>
    <div>
      <span class="swatch" style="background: var(--color-primary)"></span>
      <span class="swatch" style="background: #007bff"></span>
      <span>Primary (new vs old)</span>
    </div>
  </body>
</html>
```

---

## Step 5: Update Codebase

### Find and Replace

```bash
# Find all Sass variable usages
grep -r '\$color-' src/

# Find all CSS variable usages
grep -r 'var(--' src/
```

### Codemod Example

```typescript
// scripts/update-imports.ts
import { Project } from 'ts-morph';

const project = new Project();
project.addSourceFilesAtPaths('src/**/*.scss');

for (const file of project.getSourceFiles()) {
  let content = file.getFullText();

  // Replace Sass imports
  content = content.replace(/@import ['"].*_variables['"];/g, "@import '@dsai/tokens/scss';");

  // Replace variable names
  content = content.replace(/\$color-primary/g, '$color-primary');

  file.replaceWithText(content);
}

project.saveSync();
```

---

## Common Migration Patterns

### Nested to Flat

**Before:**

```json
{
  "colors": {
    "brand": {
      "primary": {
        "base": "#007bff",
        "light": "#66b2ff",
        "dark": "#0056b3"
      }
    }
  }
}
```

**After:**

```json
{
  "color": {
    "brand": {
      "primary": {
        "base": { "$value": "#007bff", "$type": "color" },
        "light": { "$value": "#66b2ff", "$type": "color" },
        "dark": { "$value": "#0056b3", "$type": "color" }
      }
    }
  }
}
```

### Hardcoded to References

**Before:**

```json
{
  "button": {
    "background": "#007bff"
  }
}
```

**After:**

```json
{
  "color": {
    "primary": { "$value": "#007bff", "$type": "color" }
  },
  "button": {
    "background": { "$value": "{color.primary}", "$type": "color" }
  }
}
```

---

## Handling Special Cases

### Composite Tokens

```json
{
  "typography": {
    "heading": {
      "$value": {
        "fontFamily": "{fontFamily.heading}",
        "fontSize": "32px",
        "fontWeight": "700",
        "lineHeight": "1.2",
        "letterSpacing": "-0.02em"
      },
      "$type": "typography"
    }
  }
}
```

### Shadow Tokens

```json
{
  "shadow": {
    "sm": {
      "$value": {
        "offsetX": "0",
        "offsetY": "1px",
        "blur": "2px",
        "spread": "0",
        "color": "rgba(0, 0, 0, 0.1)"
      },
      "$type": "shadow"
    }
  }
}
```

---

## Testing Migration

### Unit Tests

```typescript
import { buildTokens, loadConfig } from '@dsai/tools';

describe('Token Migration', () => {
  it('generates expected CSS output', async () => {
    const { config } = await loadConfig();
    const result = await buildTokens(config);

    expect(result.success).toBe(true);

    const css = readFileSync('dist/tokens/variables.css', 'utf-8');
    expect(css).toContain('--color-primary: #007bff');
  });
});
```

---

## Rollback Plan

1. Keep old token system in parallel initially
2. Use feature flags to switch between systems
3. Gradually migrate components
4. Remove old system after validation

---

## See Also

- [Configuration Reference](../configuration.md)
- [Troubleshooting](../troubleshooting.md)
- [Getting Started](../getting-started.md)
