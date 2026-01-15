# Getting Started

This guide will help you set up @DSAi/tools in your project.

## Prerequisites

- Node.js 18 or higher
- npm, pnpm, or yarn

## Installation

```bash
# Using npm
npm install @dsai/tools

# Using pnpm
pnpm add @dsai/tools

# Using yarn
yarn add @dsai/tools
```

## Quick Setup

### 1. Initialize Configuration

Run the init command to create a configuration file:

```bash
npx dsai init
```

This will:

- Create a `dsai.config.mjs` file
- Ask about your preferences
- Set up default paths

### 2. Add Your Tokens

Create a `collections/` directory with your token files:

```plaintext
collections/
├── color/
│   ├── brand.json
│   └── semantic.json
├── typography/
│   └── fonts.json
└── spacing/
    └── scale.json
```

Token files should follow the [DTCG format](https://design-tokens.github.io/community-group/format/):

```json
{
  "color": {
    "blue": {
      "500": {
        "$value": "#3b82f6",
        "$type": "color"
      }
    }
  }
}
```

### 3. Build Tokens

```bash
npx dsai tokens build
```

This generates:

- `dist/css/variables.css` - CSS custom properties
- `dist/js/tokens.js` - JavaScript ES modules
- `dist/scss/_variables.scss` - SCSS variables
- `dist/json/tokens.json` - JSON format

### 4. Use in Your Project

#### CSS

```css
@import '@yourpackage/tokens/css';

.button {
  background: var(--dsai-color-blue-500);
}
```

#### JavaScript/TypeScript

```typescript
import { tokens } from '@yourpackage/tokens';

const primaryColor = tokens.color.blue[500];
```

#### SCSS

```scss
@use '@yourpackage/tokens/scss' as tokens;

.button {
  background: tokens.$color-blue-500;
}
```

## Basic Configuration

Create a `dsai.config.mjs` file in your project root:

```javascript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Token source directory
    sourceDir: './tokens',

    // Output directory
    outputDir: './dist/tokens',

    // CSS variable prefix
    prefix: '--mycompany-',

    // Base font size for rem calculations
    baseFontSize: 16,
  },
  icons: {
    // Icon source directory
    sourceDir: './icons',

    // Output directory
    outputDir: './dist/icons',

    // Output format
    format: 'react',
  },
});
```

## CLI Commands

| Command                | Description                 |
| ---------------------- | --------------------------- |
| `dsai init`            | Initialize configuration    |
| `dsai tokens build`    | Build design tokens         |
| `dsai tokens validate` | Validate token files        |
| `dsai tokens sync`     | Sync tokens flat file       |
| `dsai icons build`     | Generate icon components    |
| `dsai config`          | Show resolved configuration |

## Next Steps

- [Configuration Reference](./configuration.md) - Learn all config options
- [CLI Reference](./cli.md) - Explore CLI commands
- [Custom Transforms](./guides/custom-transforms.md) - Add custom transforms
- [Multi-Brand Setup](./guides/multi-brand.md) - Support multiple brands
