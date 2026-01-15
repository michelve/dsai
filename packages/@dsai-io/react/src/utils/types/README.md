# Type Utilities

Type guards, validators, and shared TypeScript types for the DSAi utilities package.

## Overview

This module provides:

- Type guard functions (runtime type checking)
- URL and link validation types
- Shared utility types across the package

## Installation

```tsx
import { isExternalUrl } from '@dsai/react';
import type { SlugifyOptions, TruncateOptions } from '@dsai/react';
```

---

## Functions

### `isExternalUrl`

Check if a URL is external (points to a different origin). Used for determining when to add security attributes or external link indicators.

**Signature:**

```tsx
function isExternalUrl(url: string | undefined): boolean;
```

**Examples:**

**External URLs:**

```tsx
isExternalUrl('https://example.com'); // true
isExternalUrl('http://external-site.com'); // true
isExternalUrl('https://different-domain.org'); // true
isExternalUrl('//example.com'); // true (protocol-relative)
isExternalUrl('ftp://files.example.com'); // true
isExternalUrl('mailto:user@example.com'); // true
```

**Internal URLs:**

```tsx
isExternalUrl('/about'); // false (relative)
isExternalUrl('../products'); // false (relative)
isExternalUrl('./contact'); // false (relative)
isExternalUrl('#section'); // false (anchor)
isExternalUrl('?query=value'); // false (query)
```

**Null/Undefined:**

```tsx
isExternalUrl(undefined); // false
isExternalUrl(''); // false
```

**Protocol Detection:**

```tsx
// HTTP/HTTPS detected as external
isExternalUrl('https://google.com'); // true
isExternalUrl('http://example.com'); // true

// Other protocols also external
isExternalUrl('ftp://ftp.example.com'); // true
isExternalUrl('ftps://secure.example.com'); // true
isExternalUrl('mailto:user@example.com'); // true
isExternalUrl('tel:+1234567890'); // true

// No protocol = internal
isExternalUrl('example.com'); // false
```

**Best Practices:**

**Link Component with External Indicator:**

```tsx
function SmartLink({ href, children }: LinkProps) {
  const isExternal = isExternalUrl(href);

  return (
    <a
      href={href}
      {...(isExternal && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
    >
      {children}
      {isExternal && <ExternalLinkIcon />}
    </a>
  );
}
```

**Navigation Component:**

```tsx
function NavLink({ to, children }: NavLinkProps) {
  const isExternal = isExternalUrl(to);

  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <Link to={to}>{children}</Link>;
}
```

**Analytics Tracking:**

```tsx
function trackLink(href: string) {
  if (isExternalUrl(href)) {
    analytics.track('external_link_click', { url: href });
  } else {
    analytics.track('internal_link_click', { url: href });
  }
}
```

**Security Attributes:**

```tsx
function getLinkProps(href: string) {
  if (isExternalUrl(href)) {
    return {
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  return {};
}

<a href={href} {...getLinkProps(href)}>
  Link
</a>;
```

**Content Security:**

```tsx
function validateLink(href: string) {
  if (isExternalUrl(href)) {
    // Apply stricter validation for external links
    if (!isSafeHref(href)) {
      throw new Error('Unsafe external link');
    }
  }
  return href;
}
```

---

## Shared Types

The package exports comprehensive TypeScript types for all utilities. Import them for type-safe usage:

```tsx
import type {
  // String utilities
  CapitalizeMode,
  CapitalizeOptions,
  TruncateOptions,
  SlugifyOptions,
  BootstrapVariant,
  VariantClassOptions,

  // Number utilities
  FormatNumberOptions,
  FormatCurrencyOptions,

  // Validation utilities
  SafeHrefOptions,

  // A11y utilities
  AnnounceOptions,
  BuildAriaLabelOptions,
  TrapFocusOptions,

  // Misc utilities
  SafeInputAttributes,
} from '@dsai/react';
```

### String Utility Types

**CapitalizeMode:**

```tsx
type CapitalizeMode = 'first' | 'words' | 'sentences';

// Usage
const mode: CapitalizeMode = 'words';
capitalize(text, { mode });
```

**CapitalizeOptions:**

```tsx
interface CapitalizeOptions {
  mode?: CapitalizeMode; // 'first' | 'words' | 'sentences'
  locale?: string | string[]; // e.g., 'en-US', 'de-DE'
  preserveAcronyms?: boolean; // Keep uppercase words
}
```

**TruncateOptions:**

```tsx
interface TruncateOptions {
  maxLength?: number; // Default: 100
  ellipsis?: string; // Default: '...'
  wordBoundary?: boolean; // Default: true
  preserveWords?: boolean; // Alias for wordBoundary
  stripHtml?: boolean; // Default: false
}
```

**SlugifyOptions:**

```tsx
interface SlugifyOptions {
  separator?: string; // Default: '-'
  lowercase?: boolean; // Default: true
  strict?: boolean; // Default: false
}
```

**BootstrapVariant:**

```tsx
type BootstrapVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'error'
  | 'default'
  | 'outlined'
  | 'elevated';
```

**VariantClassOptions:**

```tsx
interface VariantClassOptions {
  prefix?: string; // e.g., 'btn', 'card', 'alert'
  fallback?: string; // Default variant if undefined
  strict?: boolean; // Only allow known variants
}
```

### Number Utility Types

**FormatNumberOptions:**

```tsx
interface FormatNumberOptions extends Intl.NumberFormatOptions {
  locale?: string | string[]; // Default: 'en-US'
  fallback?: string; // Default: '0'
  useGrouping?: boolean; // Default: true
  minimumFractionDigits?: number; // Default: 0
  maximumFractionDigits?: number; // Default: 3
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  compactDisplay?: 'short' | 'long';
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
  unit?: string; // e.g., 'meter', 'kilometer'
  unitDisplay?: 'short' | 'long' | 'narrow';
}
```

**FormatCurrencyOptions:**

```tsx
interface FormatCurrencyOptions {
  currency?: string; // Default: 'USD'
  locale?: string | string[]; // Default: 'en-US'
  fallback?: string; // Default: '$0.00'
  minimumFractionDigits?: number; // Default: 2
  maximumFractionDigits?: number; // Default: 2
  currencyDisplay?: 'symbol' | 'code' | 'name' | 'narrowSymbol';
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
  notation?: 'standard' | 'compact';
  compactDisplay?: 'short' | 'long';
}
```

### Validation Utility Types

**SafeHrefOptions:**

```tsx
interface SafeHrefOptions {
  undefinedBehavior?: 'safe' | 'unsafe'; // Default: 'safe'
}
```

### Accessibility Utility Types

**AnnounceOptions:**

```tsx
interface AnnounceOptions {
  politeness?: 'polite' | 'assertive'; // Default: 'polite'
  assertive?: boolean; // Alias for politeness: 'assertive'
  id?: string; // Default: 'dsai-live-region'
  timeoutMs?: number; // Default: 2000
}
```

**BuildAriaLabelOptions:**

```tsx
interface BuildAriaLabelOptions {
  label?: string; // Plain text label
  labelledBy?: string | string[]; // ID reference(s)
  describedBy?: string | string[]; // Description ID reference(s)
  description?: string; // Description text
}
```

**TrapFocusOptions:**

```tsx
interface TrapFocusOptions {
  initialFocus?: HTMLElement | null; // Element to focus initially
  returnFocus?: HTMLElement | null; // Element to restore focus to
  fallbackFocus?: HTMLElement | null; // Fallback if no focusable elements
}
```

### Misc Utility Types

**SafeInputAttributes:**

```tsx
// Whitelisted HTML input attributes (safe to spread)
type SafeInputAttributes = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'name'
  | 'id'
  | 'value'
  | 'defaultValue'
  | 'placeholder'
  | 'disabled'
  | 'readOnly'
  | 'required'
  | 'autoComplete'
  | 'autoFocus'
  | 'maxLength'
  | 'minLength'
  | 'pattern'
  | 'min'
  | 'max'
  | 'step'
  | 'inputMode'
  | 'enterKeyHint'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-required'
>;
```

---

## Type Guard Pattern

Type guards are functions that perform runtime type checking and narrow TypeScript types:

```tsx
// Basic type guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// URL type guard
function isExternalUrl(url: string | undefined): boolean {
  if (!url) return false;
  return /^(https?:)?\/\//.test(url) || /^(ftp|ftps|mailto|tel):/.test(url);
}

// Custom type guard for component props
function isButtonVariant(value: string): value is BootstrapVariant {
  const validVariants: BootstrapVariant[] = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ];
  return validVariants.includes(value as BootstrapVariant);
}

// Usage
function Button({ variant = 'primary' }: ButtonProps) {
  if (isButtonVariant(variant)) {
    // TypeScript knows variant is BootstrapVariant here
    const className = getVariantClass(variant);
  }
}
```

---

## Common Patterns

### Type-Safe Component Props

```tsx
import type { BootstrapVariant, VariantClassOptions } from '@dsai/react';

interface ButtonProps {
  variant?: BootstrapVariant;
  children: ReactNode;
}

function Button({ variant = 'primary', children }: ButtonProps) {
  const className = getVariantClass(variant, { prefix: 'btn' });
  return <button className={className}>{children}</button>;
}
```

### Conditional Link Rendering

```tsx
import { isExternalUrl } from '@dsai/react';

function ConditionalLink({ href, children }: LinkProps) {
  if (isExternalUrl(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <RouterLink to={href}>{children}</RouterLink>;
}
```

### Type-Safe Options

```tsx
import type { TruncateOptions, CapitalizeOptions } from '@dsai/react';

const truncateConfig: TruncateOptions = {
  maxLength: 150,
  wordBoundary: true,
  ellipsis: '…',
};

const capitalizeConfig: CapitalizeOptions = {
  mode: 'words',
  locale: 'en-US',
  preserveAcronyms: true,
};

// Type-safe usage
const preview = truncate(text, truncateConfig);
const title = capitalize(text, capitalizeConfig);
```

### Shared Configuration

```tsx
import type { FormatNumberOptions, FormatCurrencyOptions } from '@dsai/react';

// Reusable number format config
const dashboardNumberFormat: FormatNumberOptions = {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
};

// Reusable currency format config
const pricingFormat: FormatCurrencyOptions = {
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

// Usage
function Metrics() {
  return (
    <>
      <div>{formatNumber(users, dashboardNumberFormat)}</div>
      <div>{formatCurrency(revenue, pricingFormat)}</div>
    </>
  );
}
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [Validation Utilities](../validation/README.md)
- [String Utilities](../string/README.md)
- [Number Utilities](../number/README.md)
- [React Component Library](../../README.md)

---

## License

Copyright © 2026 DSAi. All rights reserved.
