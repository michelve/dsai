# Enterprise Example

Multi-brand token setup with themes for enterprise design systems.

## Structure

```text
enterprise/
├── dsai.config.ts
├── tokens/
│   ├── core/
│   │   ├── primitives.json
│   │   ├── semantic.json
│   │   └── components.json
│   ├── brands/
│   │   ├── brand-a/
│   │   │   └── overrides.json
│   │   └── brand-b/
│   │       └── overrides.json
│   └── themes/
│       ├── light.json
│       └── dark.json
└── dist/
    ├── brand-a/
    └── brand-b/
```

## Configuration

### Configuration File

```typescript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    sources: ['./tokens/core/**/*.json'],
    brands: {
      'brand-a': {
        sources: ['./tokens/brands/brand-a/**/*.json'],
        outputDir: './dist/brand-a',
      },
      'brand-b': {
        sources: ['./tokens/brands/brand-b/**/*.json'],
        outputDir: './dist/brand-b',
      },
    },
    themes: {
      light: './tokens/themes/light.json',
      dark: './tokens/themes/dark.json',
    },
  },
  platforms: {
    web: {
      transformGroup: 'web-css',
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
        {
          destination: 'tokens.js',
          format: 'js/module',
        },
        {
          destination: 'tokens.d.ts',
          format: 'ts/declarations',
        },
      ],
    },
  },
});
```

## Token Files

### tokens/core/primitives.json

```json
{
  "color": {
    "blue": {
      "50": { "$value": "#eff6ff", "$type": "color" },
      "100": { "$value": "#dbeafe", "$type": "color" },
      "500": { "$value": "#3b82f6", "$type": "color" },
      "600": { "$value": "#2563eb", "$type": "color" },
      "900": { "$value": "#1e3a8a", "$type": "color" }
    },
    "gray": {
      "50": { "$value": "#f9fafb", "$type": "color" },
      "100": { "$value": "#f3f4f6", "$type": "color" },
      "500": { "$value": "#6b7280", "$type": "color" },
      "900": { "$value": "#111827", "$type": "color" }
    }
  }
}
```

### tokens/core/semantic.json

```json
{
  "color": {
    "primary": { "$value": "{color.blue.500}", "$type": "color" },
    "primaryHover": { "$value": "{color.blue.600}", "$type": "color" },
    "background": { "$value": "#ffffff", "$type": "color" },
    "surface": { "$value": "{color.gray.50}", "$type": "color" },
    "text": { "$value": "{color.gray.900}", "$type": "color" },
    "textMuted": { "$value": "{color.gray.500}", "$type": "color" }
  }
}
```

### tokens/brands/brand-a/overrides.json

```json
{
  "color": {
    "primary": { "$value": "#e11d48", "$type": "color" },
    "primaryHover": { "$value": "#be123c", "$type": "color" }
  }
}
```

### tokens/brands/brand-b/overrides.json

```json
{
  "color": {
    "primary": { "$value": "#059669", "$type": "color" },
    "primaryHover": { "$value": "#047857", "$type": "color" }
  }
}
```

### tokens/themes/dark.json

```json
{
  "color": {
    "background": { "$value": "{color.gray.900}", "$type": "color" },
    "surface": { "$value": "#1f2937", "$type": "color" },
    "text": { "$value": "{color.gray.50}", "$type": "color" },
    "textMuted": { "$value": "{color.gray.500}", "$type": "color" }
  }
}
```

## Usage

```bash
# Build all brands
dsai tokens build --all-brands

# Build specific brand
dsai tokens build --brand brand-a

# Build with dark theme
dsai tokens build --brand brand-a --theme dark
```

## Output

After building:

```text
dist/
├── brand-a/
│   ├── tokens.css
│   ├── tokens-dark.css
│   ├── tokens.js
│   └── tokens.d.ts
└── brand-b/
    ├── tokens.css
    ├── tokens-dark.css
    ├── tokens.js
    └── tokens.d.ts
```

### dist/brand-a/tokens.css

```css
:root {
  --color-primary: #e11d48;
  --color-primary-hover: #be123c;
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
}
```

### dist/brand-a/tokens-dark.css

```css
[data-theme='dark'] {
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  --color-text-muted: #6b7280;
}
```
