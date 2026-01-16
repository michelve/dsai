# DSAi Color Tokens

Design tokens for colors in the DSAi design system. Use these semantic tokens instead of hardcoded color values.

> **Token Prefix**: CSS variables use the `--dsai-color-*` prefix (Figma exports) or `--pg-color-*` (playground).

## Usage

Import colors from the theme or use CSS custom properties:

```tsx
// Using CSS custom properties (recommended)
<div style={{ color: 'var(--dsai-theme-primary)' }}>
  Primary text
</div>

// Or through component variants (preferred)
<Alert variant="success">Success message</Alert>
```

## Theme Colors

Primary semantic colors for the design system:

| Token     | CSS Variable             | Value   | SCSS Variable | Usage                                         |
| --------- | ------------------------ | ------- | ------------- | --------------------------------------------- |
| primary   | `--dsai-theme-primary`   | #0a58ca | `$primary`    | Primary CTAs, links, key interactive elements |
| secondary | `--dsai-theme-secondary` | #a8adb7 | `$secondary`  | Secondary actions, muted emphasis             |
| success   | `--dsai-theme-success`   | #0f5132 | `$success`    | Positive feedback, confirmations              |
| info      | `--dsai-theme-info`      | #0a58ca | `$info`       | Informational content, tips                   |
| warning   | `--dsai-theme-warning`   | #f59e0b | `$warning`    | Cautions, important notices                   |
| danger    | `--dsai-theme-danger`    | #842029 | `$danger`     | Errors, destructive actions                   |
| light     | `--dsai-theme-light`     | #f5f6f7 | `$light`      | Light backgrounds, subtle surfaces            |
| dark      | `--dsai-theme-dark`      | #212529 | `$dark`       | Dark backgrounds, strong surfaces             |

## Brand Colors

### Blue (Primary Brand)

| Shade | CSS Variable            | Value   | Usage                                   |
| ----- | ----------------------- | ------- | --------------------------------------- |
| 50    | `--dsai-color-blue-50`  | #ebf3fc | Ultra-light backgrounds, hover states   |
| 100   | `--dsai-color-blue-100` | #d7e6f9 | Subtle backgrounds, disabled states     |
| 200   | `--dsai-color-blue-200` | #aeccf3 | Secondary backgrounds, skeleton loaders |
| 300   | `--dsai-color-blue-300` | #86b3ed | Borders, dividers, tertiary buttons     |
| 400   | `--dsai-color-blue-400` | #5d99e7 | Focus indicators, icon fills            |
| 500   | `--dsai-color-blue-500` | #0a58ca | **Base color** - Primary buttons, links |
| 600   | `--dsai-color-blue-600` | #084298 | Hover states, pressed buttons           |
| 700   | `--dsai-color-blue-700` | #063166 | Active states, secondary text           |
| 800   | `--dsai-color-blue-800` | #042144 | Body text on light, headings            |
| 900   | `--dsai-color-blue-900` | #021022 | Maximum contrast, critical alerts       |
| 950   | `--dsai-color-blue-950` | #010811 | Deep shadows, near-black                |

### Indigo (Secondary Accent)

| Shade | CSS Variable              | Value   | Usage                            |
| ----- | ------------------------- | ------- | -------------------------------- |
| 50    | `--dsai-color-indigo-50`  | #f0ebff | Ultra-light backgrounds          |
| 100   | `--dsai-color-indigo-100` | #e0cffc | Subtle backgrounds               |
| 500   | `--dsai-color-indigo-500` | #6610f2 | **Base color** - Accent elements |
| 600   | `--dsai-color-indigo-600` | #520dc2 | Hover states                     |
| 700   | `--dsai-color-indigo-700` | #3d0a91 | Active states                    |

### Additional Color Palettes

DSAi includes full color scales (50-950) for:

| Color  | Base (500) | CSS Variable Prefix     | Purpose                |
| ------ | ---------- | ----------------------- | ---------------------- |
| Purple | #432874    | `--dsai-color-purple-*` | Premium, creative      |
| Pink   | #d63384    | `--dsai-color-pink-*`   | Friendly, approachable |
| Red    | #842029    | `--dsai-color-red-*`    | Danger, error          |
| Orange | #fd7e14    | `--dsai-color-orange-*` | Energetic highlights   |
| Yellow | #f59e0b    | `--dsai-color-yellow-*` | Warning, caution       |
| Green  | #0f5132    | `--dsai-color-green-*`  | Success, positive      |
| Teal   | #20c997    | `--dsai-color-teal-*`   | Fresh, modern          |
| Cyan   | #0dcaf0    | `--dsai-color-cyan-*`   | Information            |
| Gray   | #6c757d    | `--dsai-color-gray-*`   | Neutral, disabled      |

## Status Colors

Use through component variants, not directly:

| Status  | Component Usage     | CSS Variable           | Purpose                              |
| ------- | ------------------- | ---------------------- | ------------------------------------ |
| Success | `variant="success"` | `--dsai-theme-success` | Positive feedback, completed actions |
| Danger  | `variant="danger"`  | `--dsai-theme-danger`  | Errors, destructive actions          |
| Warning | `variant="warning"` | `--dsai-theme-warning` | Caution, requires attention          |
| Info    | `variant="info"`    | `--dsai-theme-info`    | Neutral information                  |

```tsx
// Correct - use variants
<Alert variant="success">Saved successfully</Alert>
<Badge variant="danger">Error</Badge>
<Button variant="warning">Proceed with caution</Button>

// Incorrect - hardcoded colors
<div style={{ backgroundColor: '#22c55e' }}>Success</div>
```

## Interactive State Colors

Components handle these automatically. Do not override:

- **Hover**: Use 600-shade of the base color
- **Active/Pressed**: Use 700-shade of the base color
- **Focus**: Focus ring outline with primary color
- **Disabled**: Reduced opacity, no interaction

## Dark Mode

DSAi supports automatic dark mode. Tokens adjust automatically when the user's system preference changes.

```tsx
// Components adapt automatically
<Card>
  <Card.Body>Content appears correctly in both light and dark mode</Card.Body>
</Card>
```

Do not hardcode colors that break in dark mode:

```tsx
// Incorrect - breaks in dark mode
<div style={{ backgroundColor: 'white', color: 'black' }}>
  Content
</div>

// Correct - uses semantic tokens
<div style={{
  backgroundColor: 'var(--dsai-theme-light)',
  color: 'var(--dsai-theme-dark)'
}}>
  Content
</div>
```

## Color Naming Convention

Token names follow this pattern:

```txt
--dsai-color-{color}-{shade}    // Color palette (e.g., --dsai-color-blue-500)
--dsai-theme-{semantic}          // Theme colors (e.g., --dsai-theme-primary)
```

### Shade Scale (50-950)

- **50-100**: Ultra-light backgrounds, subtle states
- **200-300**: Secondary backgrounds, borders
- **400**: Icons, active states, focus indicators
- **500**: Base color (primary actions, links)
- **600**: Hover states
- **700**: Active/pressed states
- **800**: Body text, headings
- **900-950**: Maximum contrast, near-black

## Platform Syntax

Tokens are available for multiple platforms:

| Platform  | Syntax Example          |
| --------- | ----------------------- |
| Web (CSS) | `--dsai-color-blue-500` |
| SCSS      | `$color-blue-500`       |
| Android   | `color.blue.500`        |
| iOS       | `Color.Blue.shade500`   |

## Do's and Don'ts

### Do

- Use theme tokens for semantic meaning
- Use color shade 500 as base, 600 for hover, 700 for active
- Pair light backgrounds (50-200) with dark text (700+)
- Ensure 4.5:1 contrast ratio for WCAG AA compliance

### Don't

- Don't use raw hex values in components
- Don't use rgba() with hardcoded values
- Don't create new color tokens without design approval
- Don't rely on color alone to convey meaning
- Don't use shades below 500 for text (insufficient contrast)
