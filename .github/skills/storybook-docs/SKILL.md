---
name: storybook-docs
description: Creates Storybook documentation for DSAi components. Use when writing stories, documenting component props, creating interactive examples, or setting up controls and argTypes in Storybook 10.
license: Complete terms in LICENSE.txt
metadata:
  author: dsai
  version: '1.0'
---

# Storybook Documentation

Create comprehensive Storybook stories and documentation for DSAi components.

## When to Use

- Documenting new components
- Creating interactive examples
- Setting up controls for props
- Writing usage guidelines
- Showcasing component variants

## Story File Location

```text
packages/@dsai-io/storybook/src/stories/
├── components/
│   ├── Button.stories.tsx
│   ├── Card.stories.tsx
│   └── Modal.stories.tsx
└── foundations/
    ├── Colors.stories.tsx
    └── Typography.stories.tsx
```

## Story Template

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@dsai-io/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size modifier',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Primary action button with multiple variants and sizes.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;
```

## Story Examples

### Default Story

```tsx
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};
```

### All Variants

```tsx
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};
```

### All Sizes

```tsx
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
```

### With Icons

```tsx
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Icon name="plus" />
        Add Item
      </>
    ),
  },
};
```

### Loading State

```tsx
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Submitting...',
  },
};
```

## Controls Configuration

### Control Types

| Control   | Use Case               |
| --------- | ---------------------- |
| `select`  | Enum with many options |
| `radio`   | Enum with few options  |
| `boolean` | True/false toggles     |
| `text`    | String inputs          |
| `number`  | Numeric values         |
| `color`   | Color pickers          |
| `object`  | Complex objects        |

### ArgTypes Example

```tsx
argTypes: {
  // Select control
  variant: {
    control: 'select',
    options: ['primary', 'secondary'],
  },

  // Number with range
  count: {
    control: { type: 'range', min: 0, max: 10, step: 1 },
  },

  // Disable control
  className: {
    control: false,
  },

  // Hide from table
  ref: {
    table: { disable: true },
  },
},
```

## Documentation with MDX

```mdx
import { Meta, Story, Canvas, Controls, Source } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

Buttons trigger actions or navigation.

## Usage

<Canvas of={ButtonStories.Default} />

## Props

<Controls />

## Variants

<Canvas>
  <Story of={ButtonStories.Variants} />
</Canvas>

## Accessibility

- Uses native `<button>` element
- Supports keyboard activation (Enter, Space)
- Disabled state prevents interaction
```

## Parameters

```tsx
parameters: {
  // Backgrounds
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#fafbfc' },
      { name: 'dark', value: '#212529' },
    ],
  },

  // Viewport
  viewport: {
    defaultViewport: 'responsive',
  },

  // Layout
  layout: 'centered', // or 'fullscreen', 'padded'

  // A11y
  a11y: {
    config: {
      rules: [{ id: 'color-contrast', enabled: true }],
    },
  },
},
```

## Decorators

```tsx
// Component-level
const meta: Meta<typeof Modal> = {
  decorators: [
    (Story) => (
      <div style={{ minHeight: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Story-level
export const InContext: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider theme="dark">
        <Story />
      </ThemeProvider>
    ),
  ],
};
```

## Running Storybook

```bash
# Development
pnpm nx storybook @dsai-io/storybook

# Build static
pnpm nx build-storybook @dsai-io/storybook
```

## Best Practices

- Use `tags: ['autodocs']` for automatic documentation
- Provide meaningful descriptions for all props
- Show all variants in dedicated stories
- Include edge cases (empty, loading, error states)
- Add accessibility annotations
- Use actions for event handlers
