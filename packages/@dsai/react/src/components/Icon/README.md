# DSAI Icon Components

Bootstrap Icons as React components with full accessibility support.

## Overview

All SVG icon components are auto-generated from Bootstrap Icons SVG files and live in:

```text
packages/@dsai/react/src/components/Icon/components/
```

## Icon Component Rules

Each icon component **must**:

### 1. Accept `IconProps`

```tsx
import type { IconProps } from '../types';
```

### 2. Use `forwardRef<SVGSVGElement, IconProps>`

```tsx
export const MyIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  // ...
});
```

### 3. Support Standard Props

| Prop          | Type               | Default          | Description                           |
| ------------- | ------------------ | ---------------- | ------------------------------------- |
| `size`        | `number \| string` | `16`             | Icon size in pixels or CSS value      |
| `color`       | `string`           | `'currentColor'` | Fill color                            |
| `className`   | `string`           | —                | Additional CSS classes                |
| `title`       | `string`           | —                | Tooltip/title (renders `<title>` tag) |
| `aria-label`  | `string`           | —                | Accessible label for screen readers   |
| `aria-hidden` | `boolean`          | auto             | Hide from assistive technology        |

### 4. Use the ALLOWED_PROPS Pattern for Extra Props

When passing extra props down to `<svg>`, **always** use a controlled allow-list:

```tsx
const ALLOWED_PROPS = [
  'id',
  'data-testid',
  'data-icon',
  'focusable',
  'preserveAspectRatio',
  'transform',
  'opacity',
] as const;

// Inside the component:
const allowedProps: Record<string, unknown> = {};
for (const key of ALLOWED_PROPS) {
  if (key in rest) {
    // Dynamic access is safe here because key comes from ALLOWED_PROPS.
    // eslint-disable-next-line security/detect-object-injection
    allowedProps[key] = rest[key as keyof typeof rest];
  }
}

// Spread only allowedProps into <svg>:
<svg
  ref={ref}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 16 16"
  fill={color}
  className={className}
  style={style}
  aria-hidden={computedAriaHidden}
  aria-label={ariaLabel}
  role={ariaLabel ? 'img' : undefined}
  focusable="false"
  {...allowedProps}
>
  {title && <title>{title}</title>}
  {/* paths here */}
</svg>;
```

### 5. Security Rules

- **Never** access arbitrary object keys in icons
- **No** `something[dynamicKey]` except for the controlled `ALLOWED_PROPS` pattern above
- All icons **must** compile and pass ESLint with `security/detect-object-injection` enabled globally
- Only the icon components folder (`packages/@dsai/react/src/components/Icon/components/**/*.tsx`) is allowed to use the allow-list pattern with the ESLint override

## Accessibility

Icons follow WAI-ARIA best practices:

### Decorative Icons (default)

When used inside buttons, alerts, or next to text labels:

- No `aria-label` or `title` → `aria-hidden="true"` automatically
- Let the parent component provide the accessible name

```tsx
<Button startIcon={<ArrowLeftIcon />}>Go back</Button>
```

### Semantic Icons

When used standalone or as the only content:

- Pass `aria-label` for screen reader announcement
- Icon will have `role="img"` and the label

```tsx
<ArrowLeftIcon aria-label="Navigate back" />
```

### Icons with Title

Pass `title` for tooltip and basic AT support:

```tsx
<WarningIcon title="Warning" />
```

## Generating Icons

Icons are auto-generated from Bootstrap Icons SVG files using:

```bash
# First, fetch icon metadata (optional, for enriched JSDoc)
node tools/scripts/icons/fetch-icon-metadata.js

# Generate React components
node tools/scripts/icons/generate-icons.js
```

The generator script outputs:

- Individual icon components in `components/`
- Barrel export file (`index.ts`)

## ESLint Configuration

The ESLint config includes a specific override for icon components:

```javascript
// eslint.config.cjs
{
  files: ['packages/@dsai/react/src/components/Icon/components/**/*.tsx'],
  rules: {
    // Icon components use a controlled allow-list (ALLOWED_PROPS) to filter
    // SVG props, so this rule is too noisy here.
    'security/detect-object-injection': 'off',
  },
}
```

This allows the `ALLOWED_PROPS` pattern **only** in icon components while keeping the security rule enabled everywhere else.

## File Structure

```text
packages/@dsai/react/src/components/Icon/
├── README.md              # This file
├── index.ts               # Main barrel export
├── types.ts               # IconProps and IconComponent types
├── Icon.figma.tsx         # Figma Code Connect mapping
└── components/            # Auto-generated icon components
    ├── index.ts           # Components barrel export
    ├── ActivityIcon.tsx
    ├── AlarmIcon.tsx
    └── ...
```
