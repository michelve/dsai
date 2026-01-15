# @dsai-io/storybook

> Official Storybook documentation for the DSAi Design System

## 📚 Overview

This package contains the Storybook configuration and documentation for all DSAi design tokens, components, and patterns. Built with Storybook 8.6.14 and React 18, it provides an interactive development environment for building, testing, and documenting UI components.

## 🚀 Quick Start

```bash
# Start development server
pnpm storybook

# Build static site
pnpm build

# Verify setup
pnpm verify
```

Access at: **<http://localhost:6006>**

## 📖 What's Documented

### Foundation (Design Tokens)

- **Colors** - 121 primitive + 35 semantic color tokens
- **Typography** - Font scales, weights, line heights
- **Spacing** - Layout spacing system
- **Shadows** - Elevation and depth
- **Border Radius** - Corner rounding scale

### Components (38 planned)

- Buttons, Forms, Navigation, Feedback, etc.
- Usage examples, props, accessibility notes
- Interactive playground for all variants

### Patterns

- Common UI patterns and best practices
- Accessibility guidelines
- Dark mode support

## 🏗️ Architecture

### Configuration Files

```
.storybook/
├── main.ts           # Main Storybook config with Vite aliases
├── preview.ts        # Global decorators, parameters, theme
└── preview.css       # Global styles
```

### Key Features

#### 1. Vite Alias Resolution

Resolves monorepo packages cleanly:

```typescript
// .storybook/main.ts
viteFinal: async (config) => ({
  ...config,
  resolve: {
    alias: {
      '@dsai-io/tools': resolve(__dirname, '../../@dsai-io/tools/src'),
      '@dsai-io/react': resolve(__dirname, '../../@dsai-io/react/src'),
    },
  },
}),
```

#### 2. Automatic Token Building

Pre-hooks ensure tokens are always fresh:

```json
{
  "prestorybook": "pnpm dsai tokens build",
  "prebuild": "pnpm dsai tokens build"
}
```

#### 3. Design Token Integration

CSS variables loaded globally from generated files:

```typescript
// .storybook/preview.ts
import './generated/dsai-theme-bs.css';
```

## 📝 Writing Stories

### Basic Story Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@dsai-io/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI button component.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};
```

### MDX Documentation

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

Interactive button component with multiple variants.

<Canvas of={ButtonStories.Primary} />
<Controls of={ButtonStories.Primary} />
```

## 🎨 Using Design Tokens in Stories

### Method 1: CSS Variables (Recommended)

```tsx
<div
  style={{
    backgroundColor: 'var(--dsai-theme-primary)',
    color: 'var(--dsai-neutral-white)',
  }}
>
  Content
</div>
```

### Method 2: JavaScript Import

```tsx
import { themePrimary, neutralWhite } from './generated/tokens';

<div
  style={{
    backgroundColor: themePrimary,
    color: neutralWhite,
  }}
>
  Content
</div>;
```

## 🧪 Testing

### Visual Regression Testing

```bash
# Run test runner
pnpm test-storybook
```

### Accessibility Testing

All stories automatically checked with `@storybook/addon-a11y`:

- Color contrast
- Keyboard navigation
- ARIA attributes
- Screen reader support

## 📦 Installed Addons

| Addon                           | Purpose                                      |
| ------------------------------- | -------------------------------------------- |
| `@storybook/addon-essentials`   | Core functionality (docs, controls, actions) |
| `@storybook/addon-a11y`         | Accessibility testing and reporting          |
| `@storybook/addon-interactions` | Component interaction testing                |
| `@storybook/addon-links`        | Navigate between stories                     |
| `@storybook/addon-designs`      | Link Figma designs to stories                |

## 🔧 Troubleshooting

### Error: "Failed to fetch dynamically imported module"

**Cause:** Tokens not built or incorrect import path

**Solution:**

```bash
pnpm dsai tokens build
pnpm storybook
```

### Colors Showing as Gray (#cccccc)

**Cause:** Accessing token object instead of `.value` property

**Solution:**

```tsx
// ❌ Wrong
const color = tokens.color.blue['500'];

// ✅ Correct
const color = tokens.color.blue['500'].value;
```

### Storybook Won't Start

**Solution:**

```bash
# Kill any running instances
pkill -9 -f storybook

# Clear caches
rm -rf node_modules/.vite
rm -rf .nx/cache

# Rebuild and restart
pnpm dsai tokens build
pnpm storybook
```

### Changes Not Appearing

**Solution:**

1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
2. Check terminal for build errors
3. Verify tokens rebuilt: Check your generated CSS files exist

## 🔗 Related Packages

- `@dsai-io/tools` - Design token build system and CLI
- `@dsai-io/react` - React component library
- `@dsai-io/figma-tokens` - Figma integration utilities

## 📚 Resources

- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Storybook + Vite](https://storybook.js.org/docs/react/builders/vite)
- [Storybook + Nx](https://nx.dev/recipes/storybook)
- [Design Token Best Practices](https://amzn.github.io/style-dictionary/)

## 📊 Current Status

- ✅ Storybook 8.6.14 configured
- ✅ Vite aliases working
- ✅ Design tokens integrated
- ✅ Color documentation complete
- ✅ A11y addon enabled
- ✅ Pre-build hooks functional
- ⏳ Component documentation (0/38)
- ⏳ Typography documentation
- ⏳ Spacing documentation

## 🎯 Next Steps

1. Complete foundation documentation (Typography, Spacing, Shadows)
2. Create component template with a11y tests
3. Document first 5 components (Button, Input, Card, Badge, Alert)
4. Setup visual regression testing
5. Configure Figma design linking

---

**Version:** 8.6.14  
**Last Updated:** November 21, 2025  
**Maintainers:** DSAi Team
