# Basic Example

A simple single-brand token setup.

## Structure

```text
basic/
├── dsai.config.ts
├── tokens/
│   ├── colors.json
│   ├── typography.json
│   └── spacing.json
└── dist/
    └── (generated output)
```

## Usage

```bash
# Install
pnpm add -D @dsai-io/tools

# Build
pnpm dsai tokens build
```

## Files

### Configuration File

```typescript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    sources: ['./tokens/**/*.json'],
    outputDir: './dist',
  },
  platforms: {
    web: {
      transformGroup: 'web-css',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
        },
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
      ],
    },
  },
});
```

### tokens/colors.json

```json
{
  "color": {
    "primary": {
      "$value": "#007bff",
      "$type": "color",
      "$description": "Primary brand color"
    },
    "secondary": {
      "$value": "#6c757d",
      "$type": "color"
    },
    "success": {
      "$value": "#28a745",
      "$type": "color"
    },
    "danger": {
      "$value": "#dc3545",
      "$type": "color"
    },
    "warning": {
      "$value": "#ffc107",
      "$type": "color"
    },
    "info": {
      "$value": "#17a2b8",
      "$type": "color"
    }
  }
}
```

### tokens/typography.json

```json
{
  "fontFamily": {
    "sans": {
      "$value": "system-ui, -apple-system, sans-serif",
      "$type": "fontFamily"
    },
    "mono": {
      "$value": "ui-monospace, monospace",
      "$type": "fontFamily"
    }
  },
  "fontSize": {
    "xs": { "$value": "0.75rem", "$type": "fontSize" },
    "sm": { "$value": "0.875rem", "$type": "fontSize" },
    "base": { "$value": "1rem", "$type": "fontSize" },
    "lg": { "$value": "1.125rem", "$type": "fontSize" },
    "xl": { "$value": "1.25rem", "$type": "fontSize" },
    "2xl": { "$value": "1.5rem", "$type": "fontSize" }
  }
}
```

### tokens/spacing.json

```json
{
  "spacing": {
    "0": { "$value": "0", "$type": "dimension" },
    "1": { "$value": "0.25rem", "$type": "dimension" },
    "2": { "$value": "0.5rem", "$type": "dimension" },
    "3": { "$value": "0.75rem", "$type": "dimension" },
    "4": { "$value": "1rem", "$type": "dimension" },
    "5": { "$value": "1.25rem", "$type": "dimension" },
    "6": { "$value": "1.5rem", "$type": "dimension" },
    "8": { "$value": "2rem", "$type": "dimension" },
    "10": { "$value": "2.5rem", "$type": "dimension" },
    "12": { "$value": "3rem", "$type": "dimension" }
  }
}
```

## Output

After running `dsai tokens build`:

### dist/tokens.css

```css
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;
  --font-family-sans: system-ui, -apple-system, sans-serif;
  --font-family-mono: ui-monospace, monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
}
```
