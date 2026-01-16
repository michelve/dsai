# Multi-Brand Architecture

Set up a scalable multi-brand token system for enterprise design systems.

## Overview

Multi-brand architecture allows you to:

- Share core tokens across brands
- Override brand-specific values
- Maintain consistency while allowing customization
- Scale to multiple products and themes

---

## Architecture

### Recommended Structure

```text
tokens/
├── core/                    # Shared foundation
│   ├── primitives.json      # Base values
│   ├── semantic.json        # Semantic tokens
│   └── components.json      # Component tokens
├── brands/
│   ├── brand-a/
│   │   ├── overrides.json   # Brand A overrides
│   │   └── extensions.json  # Brand A additions
│   ├── brand-b/
│   │   ├── overrides.json   # Brand B overrides
│   │   └── extensions.json  # Brand B additions
│   └── brand-c/
│       ├── overrides.json
│       └── extensions.json
└── themes/
    ├── light.json
    └── dark.json
```

---

## Configuration

### Multi-Brand Setup

```typescript
// dsai.config.ts
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    // Core tokens (shared)
    sources: ['./tokens/core/**/*.json'],

    // Brand-specific configuration
    brands: {
      'brand-a': {
        sources: ['./tokens/brands/brand-a/**/*.json'],
        outputDir: './dist/brand-a',
      },
      'brand-b': {
        sources: ['./tokens/brands/brand-b/**/*.json'],
        outputDir: './dist/brand-b',
      },
      'brand-c': {
        sources: ['./tokens/brands/brand-c/**/*.json'],
        outputDir: './dist/brand-c',
      },
    },

    // Theme support
    themes: {
      light: './tokens/themes/light.json',
      dark: './tokens/themes/dark.json',
    },
  },
});
```

---

## Token Inheritance

### Core Primitives

```json
// tokens/core/primitives.json
{
  "color": {
    "blue": {
      "50": { "value": "#eff6ff" },
      "100": { "value": "#dbeafe" },
      "500": { "value": "#3b82f6" },
      "900": { "value": "#1e3a8a" }
    }
  }
}
```

### Semantic Tokens

```json
// tokens/core/semantic.json
{
  "color": {
    "primary": { "value": "{color.blue.500}" },
    "primaryHover": { "value": "{color.blue.600}" },
    "background": { "value": "#ffffff" },
    "text": { "value": "#1f2937" }
  }
}
```

### Brand Overrides

```json
// tokens/brands/brand-a/overrides.json
{
  "color": {
    "primary": { "value": "#e11d48" },
    "primaryHover": { "value": "#be123c" }
  }
}
```

---

## Building Brands

### Build All Brands

```bash
# Build all configured brands
dsai tokens build --all-brands

# Build specific brand
dsai tokens build --brand brand-a

# Build with theme
dsai tokens build --brand brand-a --theme dark
```

### Programmatic Build

```typescript
import { buildTokens, loadConfig } from '@dsai-io/tools';

async function buildAllBrands() {
  const { config } = await loadConfig();

  for (const [brandName, brandConfig] of Object.entries(config.tokens.brands)) {
    console.log(`Building ${brandName}...`);

    await buildTokens({
      ...config,
      tokens: {
        ...config.tokens,
        sources: [...config.tokens.sources, ...brandConfig.sources],
        outputDir: brandConfig.outputDir,
      },
    });

    console.log(`✓ ${brandName} complete`);
  }
}
```

---

## Output Structure

### Per-Brand Output

```
dist/
├── brand-a/
│   ├── css/
│   │   ├── tokens.css
│   │   └── tokens-dark.css
│   ├── js/
│   │   └── tokens.js
│   └── json/
│       └── tokens.json
├── brand-b/
│   ├── css/
│   ├── js/
│   └── json/
└── brand-c/
    ├── css/
    ├── js/
    └── json/
```

---

## Component Tokens

### Shared Component Tokens

```json
// tokens/core/components.json
{
  "button": {
    "padding": {
      "sm": { "value": "8px 16px" },
      "md": { "value": "12px 24px" },
      "lg": { "value": "16px 32px" }
    },
    "borderRadius": { "value": "4px" },
    "backgroundColor": { "value": "{color.primary}" },
    "textColor": { "value": "#ffffff" }
  }
}
```

### Brand-Specific Components

```json
// tokens/brands/brand-a/components.json
{
  "button": {
    "borderRadius": { "value": "9999px" },
    "fontWeight": { "value": "700" }
  }
}
```

---

## Theme Switching

### Light/Dark Themes

```json
// tokens/themes/dark.json
{
  "color": {
    "background": { "value": "#111827" },
    "text": { "value": "#f9fafb" },
    "border": { "value": "#374151" }
  }
}
```

### Build with Themes

```typescript
export default defineConfig({
  tokens: {
    themes: {
      light: './tokens/themes/light.json',
      dark: './tokens/themes/dark.json',
    },
  },
  platforms: {
    web: {
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { selector: ':root' },
        },
        {
          destination: 'tokens-dark.css',
          format: 'css/variables',
          filter: (token) => token.theme === 'dark',
          options: { selector: '[data-theme="dark"]' },
        },
      ],
    },
  },
});
```

---

## Brand Validation

### Ensure Brand Completeness

```typescript
import { validateBrand } from '@dsai-io/tools';

async function validateAllBrands() {
  const brands = ['brand-a', 'brand-b', 'brand-c'];

  for (const brand of brands) {
    const result = await validateBrand(brand, {
      requiredTokens: ['color.primary', 'color.background', 'typography.fontFamily'],
    });

    if (!result.valid) {
      console.error(`${brand}: Missing tokens:`, result.missing);
    }
  }
}
```

---

## Monorepo Integration

### Per-Package Brands

```
packages/
├── @brand-a/tokens/
│   ├── package.json
│   └── src/
├── @brand-b/tokens/
│   ├── package.json
│   └── src/
└── @shared/tokens/
    ├── package.json
    └── src/
```

### Shared Configuration

```typescript
// packages/@shared/tokens/dsai.config.ts
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    sources: ['./src/**/*.json'],
    outputDir: './dist',
  },
});
```

### Brand Package

```typescript
// packages/@brand-a/tokens/dsai.config.ts
import { defineConfig } from '@dsai-io/tools';
import sharedConfig from '@shared/tokens/dsai.config';

export default defineConfig({
  ...sharedConfig,
  tokens: {
    ...sharedConfig.tokens,
    sources: [...sharedConfig.tokens.sources, './src/**/*.json'],
  },
});
```

---

## Best Practices

1. **Core First** - Define all tokens in core, override in brands
2. **Semantic Tokens** - Use semantic naming, not color values
3. **Consistent Structure** - Same token paths across all brands
4. **Validation** - Validate brand completeness in CI
5. **Documentation** - Document brand-specific tokens

---

## See Also

- [CI/CD Integration](./ci-cd.md)
- [Configuration Reference](../configuration.md)
- [Tokens API Reference](../api/tokens.md)
