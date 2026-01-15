# DSAi Icon Tokens

Design tokens for icon sizing in the DSAi design system. Use these tokens for consistent icon dimensions across components.

> **Token Prefix**: Icon sizes follow the standard sizing convention.

## Icon Sizes

| Size | CSS Variable | Value | Usage |
| ---- | ------------ | ----- | ----- |
| sm | `--dsai-icon-size-sm` | 16px | Inline text, compact UI |
| md | `--dsai-icon-size-md` | 24px | Default size, buttons |
| lg | `--dsai-icon-size-lg` | 32px | Prominent icons, headers |

## Extended Sizes

For additional sizing flexibility:

| Size | Value | Usage |
| ---- | ----- | ----- |
| xs | 12px | Very small indicators |
| sm | 16px | Inline with small text |
| md | 24px | Standard (default) |
| lg | 32px | Headers, feature icons |
| xl | 48px | Hero sections |
| 2xl | 64px | Empty states, illustrations |

## Usage Examples

### With Icon Component

```tsx
import { Icon } from '@dsai-io/react';

// Default size (24px)
<Icon name="home" />

// Small size (16px)
<Icon name="home" size="sm" />

// Large size (32px)
<Icon name="home" size="lg" />

// Custom size
<Icon name="home" size={20} />
```

### With Lucide Icons

```tsx
import { Home, Settings, User } from 'lucide-react';

// Match DSAi sizing
<Home size={16} />  // sm
<Settings size={24} />  // md (default)
<User size={32} />  // lg
```

### Button with Icon

```tsx
// Icon matches button size
<Button size="sm">
  <Icon name="plus" size="sm" />
  Add
</Button>

<Button size="md">
  <Icon name="plus" size="md" />
  Add
</Button>

<Button size="lg">
  <Icon name="plus" size="lg" />
  Add
</Button>
```

### Icon-Only Buttons

```tsx
// Always include aria-label for accessibility
<Button variant="ghost" aria-label="Settings">
  <Icon name="settings" />
</Button>

<Button variant="ghost" aria-label="Close" size="sm">
  <Icon name="x" size="sm" />
</Button>
```

## Icon-Button Size Mapping

| Button Size | Icon Size | Button Height |
| ----------- | --------- | ------------- |
| sm | 16px | 32px |
| md | 20px | 40px |
| lg | 24px | 48px |

## SCSS Usage

```scss
@use '@dsai-io/tokens' as *;

.icon-sm {
  width: 16px;
  height: 16px;
}

.icon-md {
  width: 24px;
  height: 24px;
}

.icon-lg {
  width: 32px;
  height: 32px;
}
```

## Icon Spacing

Use spacing tokens for consistent icon spacing:

| Context | Gap | Token |
| ------- | --- | ----- |
| Icon + text (inline) | 8px | `--dsai-spacing-2` |
| Icon button padding | 8px | `--dsai-spacing-2` |
| Icon in form input | 12px | `--dsai-spacing-12` |

```tsx
// Proper spacing between icon and text
<Button>
  <Icon name="download" />
  <span style={{ marginLeft: 'var(--dsai-spacing-2)' }}>
    Download
  </span>
</Button>

// Or use flex gap
<Button style={{ display: 'flex', gap: 'var(--dsai-spacing-2)' }}>
  <Icon name="download" />
  Download
</Button>
```

## Platform Syntax

| Platform | Syntax Example |
| -------- | -------------- |
| Web (CSS) | `--dsai-icon-size-md` |
| React | `<Icon size="md" />` or `<Icon size={24} />` |
| Android | `icon.size.md` |
| iOS | `Icon.Size.Md` |

## Accessibility

### Icon-Only Elements

Always provide accessible names for icon-only interactive elements:

```tsx
// Correct - has accessible label
<Button aria-label="Delete item" variant="ghost">
  <Icon name="trash" />
</Button>

// Correct - using sr-only text
<Button variant="ghost">
  <Icon name="trash" aria-hidden="true" />
  <span className="visually-hidden">Delete item</span>
</Button>

// Incorrect - no accessible name
<Button variant="ghost">
  <Icon name="trash" />
</Button>
```

### Decorative Icons

Hide decorative icons from screen readers:

```tsx
// Icon is decorative (text provides meaning)
<Button>
  <Icon name="save" aria-hidden="true" />
  Save Changes
</Button>
```

## Do's and Don'ts

### Do

- Use consistent icon sizes from the token scale
- Match icon size to component size (sm, md, lg)
- Provide aria-label for icon-only buttons
- Use `aria-hidden="true"` for decorative icons
- Maintain 8px minimum spacing between icon and text

### Don't

- Don't use arbitrary icon sizes
- Don't forget accessibility labels on icon-only buttons
- Don't make icons too small (minimum 16px for touch targets)
- Don't use icons without clear meaning
- Don't mix icon libraries with inconsistent sizing
