# DSAi Typography Tokens

Design tokens for typography in the DSAi design system. Use the Typography component or these tokens for consistent text styling.

> **Token Prefix**: CSS variables use the `--dsai-typography-*` prefix (Figma exports) or `--pg-typography-*` (playground).

## Typography Component

Always prefer the Typography component for semantic text:

```tsx
import { Typography } from '@dsai/react';

// Headings
<Typography.H1>Page Title</Typography.H1>
<Typography.H2>Section Title</Typography.H2>
<Typography.H3>Subsection Title</Typography.H3>

// Body text
<Typography.Body>Regular paragraph text</Typography.Body>
<Typography.Body size="sm">Smaller text</Typography.Body>

// Other variants
<Typography.Caption>Image caption</Typography.Caption>
<Typography.Label>Form label</Typography.Label>
<Typography.Code>inline code</Typography.Code>
```

## Font Families

| Token     | CSS Variable                              | Value                                                           | SCSS Variable            | Usage                   |
| --------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------ | ----------------------- |
| base      | `--dsai-typography-font-family-base`      | Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif | `$font-family-base`      | Body text, UI elements  |
| monospace | `--dsai-typography-font-family-monospace` | Roboto Mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace | `$font-family-monospace` | Code, technical content |

## Font Sizes

| Token     | CSS Variable                  | Size            | Usage                        |
| --------- | ----------------------------- | --------------- | ---------------------------- |
| text-base | `--dsai-typography-text-base` | 1rem (16px)     | Body text (default)          |
| text-sm   | `--dsai-typography-text-sm`   | 0.875rem (14px) | Secondary text, descriptions |
| text-lead | `--dsai-typography-text-lead` | 1.25rem (20px)  | Lead paragraphs              |

### Heading Sizes

| Token | CSS Variable                   | Size           | Usage               |
| ----- | ------------------------------ | -------------- | ------------------- |
| h1    | `--dsai-typography-heading-h1` | 2.5rem (40px)  | Page titles         |
| h2    | `--dsai-typography-heading-h2` | 2rem (32px)    | Section headings    |
| h3    | `--dsai-typography-heading-h3` | 1.75rem (28px) | Subsection headings |
| h4    | `--dsai-typography-heading-h4` | 1.5rem (24px)  | Card headings       |
| h5    | `--dsai-typography-heading-h5` | 1.25rem (20px) | Small headings      |
| h6    | `--dsai-typography-heading-h6` | 1rem (16px)    | Minimal headings    |

### Display Sizes

| Token      | CSS Variable                   | Size          | Usage            |
| ---------- | ------------------------------ | ------------- | ---------------- |
| display-h1 | `--dsai-typography-display-h1` | 5rem (80px)   | Hero headlines   |
| display-h2 | `--dsai-typography-display-h2` | 4.5rem (72px) | Large displays   |
| display-h3 | `--dsai-typography-display-h3` | 4rem (64px)   | Medium displays  |
| display-h4 | `--dsai-typography-display-h4` | 3.5rem (56px) | Small displays   |
| display-h5 | `--dsai-typography-display-h5` | 3rem (48px)   | Compact displays |
| display-h6 | `--dsai-typography-display-h6` | 2.5rem (40px) | Mini displays    |

## Font Weights

| Token       | CSS Variable                                | Value | SCSS Variable           | Usage            |
| ----------- | ------------------------------------------- | ----- | ----------------------- | ---------------- |
| thin        | `--dsai-typography-font-weight-thin`        | 100   | `$font-weight-lighter`  | Decorative text  |
| extra-light | `--dsai-typography-font-weight-extra-light` | 200   | `$font-weight-lighter`  | Light emphasis   |
| light       | `--dsai-typography-font-weight-light`       | 300   | `$font-weight-light`    | Subtle text      |
| regular     | `--dsai-typography-font-weight-regular`     | 400   | `$font-weight-normal`   | Body text        |
| medium      | `--dsai-typography-font-weight-medium`      | 500   | `$font-weight-medium`   | Buttons, labels  |
| semi-bold   | `--dsai-typography-font-weight-semi-bold`   | 600   | `$font-weight-semibold` | Subheadings      |
| bold        | `--dsai-typography-font-weight-bold`        | 700   | `$font-weight-bold`     | Headings         |
| extra-bold  | `--dsai-typography-font-weight-extra-bold`  | 800   | `$font-weight-bold`     | Strong emphasis  |
| black       | `--dsai-typography-font-weight-black`       | 900   | `$font-weight-bolder`   | Maximum emphasis |

## Heading Scale

Use the appropriate heading level for semantic structure:

```tsx
// Correct - semantic heading hierarchy
<Typography.H1>Page Title</Typography.H1>
<Typography.H2>Section</Typography.H2>
<Typography.H3>Subsection</Typography.H3>

// Incorrect - skipping heading levels
<Typography.H1>Page Title</Typography.H1>
<Typography.H4>Section</Typography.H4>  // Skipped H2, H3
```

You can style a heading differently while maintaining semantics:

```tsx
// Visual H3 style, semantic H2
<Typography.H2 size="lg">Styled as smaller heading</Typography.H2>
```

## Line Height

Line heights are optimized for readability and WCAG compliance:

| Token   | CSS Variable                            | Value | Usage                         |
| ------- | --------------------------------------- | ----- | ----------------------------- |
| xs      | `--dsai-typography-line-height-xs`      | 1     | Compact UI, tags, badges      |
| sm      | `--dsai-typography-line-height-sm`      | 1.25  | Tight spacing, small UI       |
| tight   | `--dsai-typography-line-height-tight`   | 1.25  | Headings (h1-h6)              |
| base    | `--dsai-typography-line-height-base`    | 1.5   | Body text (WCAG AA compliant) |
| relaxed | `--dsai-typography-line-height-relaxed` | 1.75  | Long-form content             |
| lg      | `--dsai-typography-line-height-lg`      | 2     | Large UI components           |

### Display Line Heights

| Token      | CSS Variable                               | Value | Usage                     |
| ---------- | ------------------------------------------ | ----- | ------------------------- |
| display-sm | `--dsai-typography-line-height-display-sm` | 3     | Display headings (40px)   |
| display-md | `--dsai-typography-line-height-display-md` | 3.75  | Medium displays (48-56px) |
| display-lg | `--dsai-typography-line-height-display-lg` | 5     | Large displays (64px)     |

## Letter Spacing

| Token    | CSS Variable                                | Value       | Usage                  |
| -------- | ------------------------------------------- | ----------- | ---------------------- |
| tightest | `--dsai-typography-letter-spacing-tightest` | -0.0625rem  | Maximum tightening     |
| tighter  | `--dsai-typography-letter-spacing-tighter`  | -0.03125rem | Large headings         |
| tight    | `--dsai-typography-letter-spacing-tight`    | -0.01875rem | Subtle tightening      |
| normal   | `--dsai-typography-letter-spacing-normal`   | 0           | Default spacing        |
| wide     | `--dsai-typography-letter-spacing-wide`     | 0.01875rem  | Small text readability |
| wider    | `--dsai-typography-letter-spacing-wider`    | 0.03125rem  | Uppercase, buttons     |
| widest   | `--dsai-typography-letter-spacing-widest`   | 0.0625rem   | All-caps headings      |

## Usage Examples

### Headings with Typography Component

```tsx
<Typography.H1>Welcome to DSAi</Typography.H1>
<Typography.Body>
  Design System AI provides accessible, customizable components.
</Typography.Body>
```

### Custom Styled Text (use sparingly)

```tsx
// Only when Typography component doesn't fit
<span
  style={{
    fontFamily: 'var(--dsai-typography-font-family-base)',
    fontSize: 'var(--dsai-typography-text-lead)',
    fontWeight: 'var(--dsai-typography-font-weight-medium)',
    lineHeight: 'var(--dsai-typography-line-height-base)',
  }}
>
  Custom styled text
</span>
```

### SCSS Usage

```scss
@use '@dsai/tokens' as *;

.custom-heading {
  font-family: $font-family-base;
  font-size: $heading-h2;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
  letter-spacing: $letter-spacing-tight;
}
```

## Platform Syntax

Tokens are available for multiple platforms:

| Platform  | Syntax Example                       |
| --------- | ------------------------------------ |
| Web (CSS) | `--dsai-typography-font-weight-bold` |
| SCSS      | `$font-weight-bold`                  |
| Android   | `typography.fontWeight.bold`         |
| iOS       | `Typography.FontWeight.Bold`         |

## Do's and Don'ts

### Do

- Use Typography component for all text content
- Maintain heading hierarchy (H1 → H2 → H3)
- Use appropriate font sizes for context
- Ensure sufficient line height for readability (1.5 minimum for body text)
- Use the `--dsai-typography-*` CSS variables for consistency

### Don't

- Don't use raw font-size values (use tokens)
- Don't skip heading levels
- Don't use weights below 400 for body text
- Don't mix font families arbitrarily
- Don't use line heights less than 1.25 for multi-line text
- Don't hardcode font values—always reference tokens
