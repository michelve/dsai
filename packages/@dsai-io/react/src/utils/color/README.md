# Color Utilities

Enterprise-grade color manipulation and WCAG compliance utilities.

## Overview

This module provides utilities for:

- WCAG contrast ratio calculation
- Color accessibility compliance checking
- Color space conversions (hex, RGB, HSL)
- Shade generation (lighter/darker)
- Design token conversion

## Installation

```tsx
import {
  getContrastRatio,
  meetsWCAG,
  hexToRgb,
  rgbToHsl,
  getLighterShade,
  getDarkerShade,
} from '@dsai-io/react';
```

---

## WCAG Compliance

### `getContrastRatio`

Calculate WCAG contrast ratio between two colors.

**Signature:**

```tsx
function getContrastRatio(
  foreground: string,
  background: string,
  options?: ContrastRatioOptions
): number;
```

**Examples:**

```tsx
// Basic usage
const ratio = getContrastRatio('#000000', '#FFFFFF');
// 21:1

// With transparency
const ratio = getContrastRatio('rgba(0, 0, 0, 0.5)', '#FFFFFF', { backgroundOpacity: 1 });

// Check if meets standards
const ratio = getContrastRatio('#333', '#fff');
const passesAA = ratio >= 4.5; // true
```

---

### `meetsWCAG`

Check if color combination meets WCAG standards.

**Signature:**

```tsx
function meetsWCAG(foreground: string, background: string, options?: WCAGOptions): boolean;

interface WCAGOptions {
  level?: 'AA' | 'AAA';
  size?: 'normal' | 'large';
}
```

**Examples:**

```tsx
// AA compliance (default)
const passes = meetsWCAG('#333', '#fff');

// AAA compliance
const passes = meetsWCAG('#000', '#fff', {
  level: 'AAA',
});

// Large text (18pt+ or 14pt+ bold)
const passes = meetsWCAG('#767676', '#fff', {
  size: 'large',
});

// WCAG Requirements:
// AA Normal: 4.5:1
// AA Large: 3:1
// AAA Normal: 7:1
// AAA Large: 4.5:1
```

---

## Color Conversions

### `hexToRgb`

Convert hex color to RGB.

**Signature:**

```tsx
function hexToRgb(hex: string): { r: number; g: number; b: number } | null;
```

**Examples:**

```tsx
const rgb = hexToRgb('#ff5733');
// { r: 255, g: 87, b: 51 }

const rgb = hexToRgb('abc');
// { r: 170, g: 187, b: 204 }
```

---

### `rgbToHsl`

Convert RGB to HSL color space.

**Signature:**

```tsx
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number };
```

**Examples:**

```tsx
const hsl = rgbToHsl(255, 87, 51);
// { h: 11, s: 100, l: 60 }

// Chain conversions
const rgb = hexToRgb('#ff5733');
if (rgb) {
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
}
```

---

### `hslToHex`

Convert HSL to hex color.

**Signature:**

```tsx
function hslToHex(h: number, s: number, l: number): string;
```

**Examples:**

```tsx
const hex = hslToHex(11, 100, 60);
// '#ff5733'
```

---

## Shade Generation

### `getLighterShade`

Generate lighter shade of color.

**Signature:**

```tsx
function getLighterShade(color: string, amount?: number): string;
```

**Examples:**

```tsx
// 10% lighter
const lighter = getLighterShade('#ff5733', 0.1);

// 20% lighter
const lighter = getLighterShade('#ff5733', 0.2);

// Generate palette
const shades = [0, 0.1, 0.2, 0.3, 0.4].map((amount) => getLighterShade(baseColor, amount));
```

---

### `getDarkerShade`

Generate darker shade of color.

**Signature:**

```tsx
function getDarkerShade(color: string, amount?: number): string;
```

**Examples:**

```tsx
// 10% darker
const darker = getDarkerShade('#ff5733', 0.1);

// Hover states
const hoverColor = getDarkerShade(buttonColor, 0.15);
```

---

## Design Tokens

### `tokenToCssVar`

Convert design token to CSS custom property.

**Signature:**

```tsx
function tokenToCssVar(token: string, options?: TokenToCssVarOptions): string;
```

**Examples:**

```tsx
// Basic conversion
const cssVar = tokenToCssVar('color.primary.500');
// 'var(--color-primary-500)'

// With fallback
const cssVar = tokenToCssVar('color.brand', {
  fallback: '#0066cc',
});
// 'var(--color-brand, #0066cc)'
```

---

## Common Patterns

### Accessible Color Picker

```tsx
function ColorInput({ onChange }: Props) {
  const [color, setColor] = useState('#ffffff');
  const [bg] = useState('#000000');

  const ratio = getContrastRatio(color, bg);
  const passesAA = meetsWCAG(color, bg, { level: 'AA' });

  return (
    <div>
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      <div>
        Contrast: {ratio.toFixed(2)}:1
        {passesAA ? ' ✓ WCAG AA' : ' ✗ Fails WCAG AA'}
      </div>
    </div>
  );
}
```

### Generate Color Palette

```tsx
const generatePalette = (baseColor: string) => ({
  50: getLighterShade(baseColor, 0.4),
  100: getLighterShade(baseColor, 0.3),
  200: getLighterShade(baseColor, 0.2),
  300: getLighterShade(baseColor, 0.1),
  500: baseColor,
  700: getDarkerShade(baseColor, 0.1),
  800: getDarkerShade(baseColor, 0.2),
  900: getDarkerShade(baseColor, 0.3),
});
```

---

## Best Practices

1. **Always check accessibility:**

```tsx
if (!meetsWCAG(textColor, bgColor)) {
  console.warn('Color combination fails WCAG guidelines');
}
```

1. **Use semantic tokens:**

```tsx
const primaryVar = tokenToCssVar('color.primary.500');
```

1. **Validate color input:**

```tsx
const rgb = hexToRgb(userInput);
if (!rgb) {
  throw new Error('Invalid color format');
}
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [Design Tokens](../../tokens/README.md)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

---

## License

Copyright © 2024 DSAi. All rights reserved.
