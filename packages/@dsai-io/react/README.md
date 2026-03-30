# @dsai-io/react

DSAi React - Accessible, themeable React components with WCAG 2.1 AA compliance, design tokens, and TypeScript support.

## Installation

Add components to your project using the DSAi CLI:

```bash
# Add specific components
dsai add button modal tabs

# Add hooks and utilities
dsai add use-focus-trap use-debounce cn keyboard

# Browse all available items
dsai add --list

# Add all components of a type
dsai add --all                    # All UI components
dsai add --all --type hook        # All hooks
dsai add --all --type util        # All utilities

# Preview without writing files
dsai add modal --dry-run
```

Components are copied as source files into your project. Dependencies (hooks, utils, types, npm packages) are resolved and installed automatically.

> **First time?** Install the CLI and generate your design tokens first:
>
> ```bash
> pnpm add @dsai-io/tools
> npx dsai tokens build
> ```

## Requirements

- React 18.0.0 or higher
- React DOM 18.0.0 or higher

## Quick Start

```tsx
import { Button, Card, Input } from '@dsai-io/react';

function App() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Welcome to DSAi</Card.Title>
      </Card.Header>
      <Card.Body>
        <Input label="Your name" placeholder="Enter your name" />
        <Button variant="primary">Get Started</Button>
      </Card.Body>
    </Card>
  );
}
```

## Features

- ✅ **Accessible** - WCAG 2.1 AA compliant with full keyboard navigation and screen reader support
- ✅ **Themeable** - Built on design tokens for easy customization
- ✅ **TypeScript** - Full TypeScript support with comprehensive type definitions
- ✅ **Tree-shakeable** - Import only what you need
- ✅ **SSR Ready** - Works with Next.js and other SSR frameworks

## Components

### Layout & Structure

- `Card`, `CardList`, `SelectableCard`
- `Accordion`
- `Tabs`, `TabsPro`
- `Modal`, `Sheet`
- `Navbar`

### Forms & Inputs

- `Button`
- `Input`
- `Select`
- `Checkbox`, `CheckboxGroup`
- `Radio`, `RadioGroup`
- `Switch`

### Feedback & Overlays

- `Alert`
- `Badge`
- `Toast`
- `Tooltip`
- `Popover`
- `Dropdown`
- `Spinner`
- `Progress`

### Navigation

- `Breadcrumb`
- `Pagination`
- `Scrollspy`

### Data Display

- `Table`
- `Avatar`
- `Carousel`
- `Icon`
- `ListGroup`
- `Typography`

## Hooks

```tsx
import { useDisclosure, useMediaQuery, useFocusTrap } from '@dsai-io/react/hooks';
```

## Utilities

```tsx
import { cn, getArrowKeyHandler } from '@dsai-io/react/utils';
```

## Documentation

Visit our [Storybook documentation](https://dsai-storybook.chromatic.com) for live examples, API documentation, and usage guidelines.

## Related Packages

- [`@dsai-io/tools`](https://www.npmjs.com/package/@dsai-io/tools) - CLI and build tools for the design system
- [`@dsai-io/figma-tokens`](https://www.npmjs.com/package/@dsai-io/figma-tokens) - Figma integration and token synchronization

## License

UNLICENSED - Private package
