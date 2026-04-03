# @dsai-io/icons

Bootstrap Icons as accessible React components. 2000+ icons with full accessibility support.

## Installation

```bash
npm install @dsai-io/icons
# or
pnpm add @dsai-io/icons
```

React 18+ is required as a peer dependency.

## Usage

```tsx
import { ArrowLeftIcon, SearchIcon } from '@dsai-io/icons';

// Decorative (inside a labelled element)
<Button startIcon={<ArrowLeftIcon />}>Go back</Button>

// Semantic (standalone, needs label)
<SearchIcon aria-label="Search" />

// With tooltip
<WarningIcon title="Warning" />
```

## Props

| Prop          | Type               | Default          | Description                           |
| ------------- | ------------------ | ---------------- | ------------------------------------- |
| `size`        | `number \| string` | `16`             | Icon size in pixels or CSS value      |
| `color`       | `string`           | `'currentColor'` | Fill color                            |
| `className`   | `string`           | -                | Additional CSS classes                |
| `title`       | `string`           | -                | Tooltip/title (renders `<title>` tag) |
| `aria-label`  | `string`           | -                | Accessible label for screen readers   |
| `aria-hidden` | `boolean`          | auto             | Hide from assistive technology        |

## Accessibility

Icons follow WAI-ARIA best practices for SVG accessibility:

### Decorative Icons (default)

When used inside buttons, alerts, or next to text labels — no additional props needed. The icon is hidden from assistive technology automatically via `aria-hidden="true"`.

```tsx
<Button startIcon={<ArrowLeftIcon />}>Go back</Button>
```

### Semantic Icons

When used standalone or as the only content, pass `aria-label` for screen reader announcement:

```tsx
<ArrowLeftIcon aria-label="Navigate back" />
```

### Icons with Title

Pass `title` for tooltip and basic AT support. Renders a `<title>` element inside the SVG:

```tsx
<WarningIcon title="Warning" />
```

## Generating Icons

Icons are auto-generated from Bootstrap Icons SVG files:

```bash
# Generate React components
pnpm icons:generate

# Generate Figma Code Connect mappings
pnpm icons:figma
```

## File Structure

```text
packages/@dsai-io/icons/
├── src/
│   ├── index.ts               # Barrel export
│   ├── types.ts               # IconProps and IconComponent types
│   ├── Icon.figma.tsx          # Figma Code Connect mapping
│   └── components/            # Auto-generated icon components
│       ├── index.ts
│       ├── ActivityIcon.tsx
│       ├── AlarmIcon.tsx
│       └── ...
├── scripts/
│   └── generate-figma-code-connect.cjs
├── tsup.config.ts
└── package.json
```
