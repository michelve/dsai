---
name: brand-guidelines
description: Applies DSAi's official brand colors and typography to artifacts. Use when brand colors, style guidelines, visual formatting, or company design standards apply. Includes primary blue (#0a58ca), accent colors (orange, green), Inter font family, and CSS variable references.
license: Proprietary. LICENSE.txt has complete terms
metadata:
  author: dsai
  version: '1.0'
---

# DSAi Brand Styling

Apply DSAi's official brand identity to any artifact that benefits from consistent visual styling.

## When to Use

- Applying brand colors to documents, presentations, or web content
- Ensuring typography consistency across materials
- Generating branded assets or templates
- Post-processing outputs to match DSAi visual identity

## Colors

> **Prefer CSS Variables**: Use CSS custom properties instead of hardcoded hex values for web projects.

### Primary Brand Color

- **Blue** `#0a58ca` → `var(--dsai-color-blue-500)`

### Main Colors

- **Dark** `#212529` → `var(--dsai-color-gray-900)` — Primary text, dark backgrounds
- **Light** `#fafbfc` → `var(--dsai-color-gray-50)` — Light backgrounds, text on dark
- **Mid Gray** `#a8adb7` → `var(--dsai-color-gray-500)` — Secondary elements
- **Light Gray** `#e8eaed` → `var(--dsai-color-gray-200)` — Subtle backgrounds

### Accent Colors

- **Orange** `#fd7e14` → `var(--dsai-color-orange-500)` — Primary accent
- **Green** `#0f5132` → `var(--dsai-color-green-500)` — Secondary accent

## Typography

> **Prefer CSS Variables**: Use `var(--dsai-typography-font-family-base)` and `var(--dsai-typography-font-family-monospace)`.

### Font Families

- **Base**: Inter (fallbacks: system-ui, Segoe UI, Roboto, Arial)
- **Monospace**: Roboto Mono (fallbacks: SFMono-Regular, Menlo, Monaco, Consolas)

### Application

- Headings: Inter with appropriate weights
- Body text: Inter
- Code blocks: Roboto Mono
- Native font stacks ensure optimal performance across all platforms

## Implementation

### Web Projects

```css
/* Colors */
color: var(--dsai-color-blue-500);
background: var(--dsai-color-gray-50);

/* Typography */
font-family: var(--dsai-typography-font-family-base);
```

### Non-Web Projects

Use the hex values directly:

- Primary: `#0a58ca`
- Text: `#212529`
- Background: `#fafbfc`

### Color Application

- Uses RGB color values for precise brand matching
- For python-pptx: Use `RGBColor` class with hex values
- Maintains color fidelity across different systems

## Edge Cases

- If custom fonts unavailable, system fonts provide automatic fallback
- Shape elements cycle through accent colors (orange → blue → green)
- Dark mode: Invert light/dark color usage
