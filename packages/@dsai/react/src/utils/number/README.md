# Number Utilities

Enterprise-grade number formatting and manipulation utilities with internationalization support, caching, and SSR safety.

## Overview

This module provides utilities for:

- Number formatting with locale support
- Currency formatting with symbols
- Number clamping within ranges

## Installation

```tsx
import { formatNumber, formatCurrency, clamp } from '@dsai/react';
```

---

## Functions

### `formatNumber`

Format numbers with comprehensive internationalization support using `Intl.NumberFormat`. Includes caching for performance and SSR-safe fallbacks.

**Signature:**

```tsx
function formatNumber(value: number | null | undefined, options?: FormatNumberOptions): string;

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

**Examples:**

**Basic Formatting:**

```tsx
formatNumber(1234567); // "1,234,567"
formatNumber(1234567.89); // "1,234,567.89"
formatNumber(42); // "42"
formatNumber(0); // "0"
```

**Null/Undefined Handling:**

```tsx
formatNumber(null); // "0" (default fallback)
formatNumber(undefined); // "0"
formatNumber(null, { fallback: 'N/A' }); // "N/A"
formatNumber(undefined, { fallback: '--' }); // "--"
```

**Decimal Places:**

```tsx
// Minimum digits
formatNumber(42, { minimumFractionDigits: 2 });
// "42.00"

// Maximum digits
formatNumber(42.123456, { maximumFractionDigits: 2 });
// "42.12"

// Range
formatNumber(42.5, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 3,
});
// "42.5"

// Financial (2 decimals)
formatNumber(1234.567, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
// "1,234.57"
```

**Locale-Specific Formatting:**

```tsx
// US English (commas)
formatNumber(1234567.89, { locale: 'en-US' });
// "1,234,567.89"

// German (dots and commas)
formatNumber(1234567.89, { locale: 'de-DE' });
// "1.234.567,89"

// French (spaces and commas)
formatNumber(1234567.89, { locale: 'fr-FR' });
// "1 234 567,89"

// Indian (lakhs and crores)
formatNumber(1234567, { locale: 'en-IN' });
// "12,34,567"

// Arabic (Eastern Arabic numerals)
formatNumber(1234567, { locale: 'ar-EG' });
// "١٬٢٣٤٬٥٦٧"
```

**Compact Notation:**

```tsx
// Short compact
formatNumber(1200, { notation: 'compact', compactDisplay: 'short' });
// "1.2K"

formatNumber(1200000, { notation: 'compact', compactDisplay: 'short' });
// "1.2M"

formatNumber(1200000000, { notation: 'compact', compactDisplay: 'short' });
// "1.2B"

// Long compact
formatNumber(1200, { notation: 'compact', compactDisplay: 'long' });
// "1.2 thousand"

formatNumber(1200000, { notation: 'compact', compactDisplay: 'long' });
// "1.2 million"

// Locale-specific compact
formatNumber(1200, {
  locale: 'de-DE',
  notation: 'compact',
  compactDisplay: 'short',
});
// "1,2 Tsd." (German)
```

**Scientific and Engineering Notation:**

```tsx
// Scientific
formatNumber(123456, { notation: 'scientific' });
// "1.235E5"

formatNumber(0.00012, { notation: 'scientific' });
// "1.2E-4"

// Engineering (multiples of 3)
formatNumber(123456, { notation: 'engineering' });
// "123.456E3"
```

**Sign Display:**

```tsx
// Always show sign
formatNumber(42, { signDisplay: 'always' });
// "+42"

formatNumber(-42, { signDisplay: 'always' });
// "-42"

// Never show sign
formatNumber(-42, { signDisplay: 'never' });
// "42"

// Except zero
formatNumber(0, { signDisplay: 'exceptZero' });
// "0"

formatNumber(42, { signDisplay: 'exceptZero' });
// "+42"
```

**Units:**

```tsx
// Distance
formatNumber(5, {
  unit: 'kilometer',
  unitDisplay: 'long',
});
// "5 kilometers"

formatNumber(5, {
  unit: 'kilometer',
  unitDisplay: 'short',
});
// "5 km"

// Weight
formatNumber(10, {
  unit: 'kilogram',
  unitDisplay: 'short',
});
// "10 kg"

// Speed
formatNumber(60, {
  unit: 'kilometer-per-hour',
  unitDisplay: 'short',
});
// "60 km/h"

// Temperature
formatNumber(22, {
  unit: 'celsius',
  unitDisplay: 'short',
});
// "22°C"
```

**No Grouping:**

```tsx
formatNumber(1234567, { useGrouping: false });
// "1234567"

formatNumber(1234567.89, {
  useGrouping: false,
  maximumFractionDigits: 2,
});
// "1234567.89"
```

**Performance (Caching):**

```tsx
// First call: creates formatter
formatNumber(1234); // ~0.5ms

// Subsequent calls with same options: uses cached formatter
formatNumber(5678); // ~0.01ms (50x faster)

// Different options: creates new cached formatter
formatNumber(1234, { locale: 'de-DE' }); // ~0.5ms
formatNumber(5678, { locale: 'de-DE' }); // ~0.01ms (uses cache)
```

**Best Practices:**

```tsx
// Data tables (consistent decimals)
const formattedPrice = formatNumber(product.price, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// User counts (compact)
const followers = formatNumber(user.followers, {
  notation: 'compact',
  compactDisplay: 'short',
});
// 1234567 → "1.2M"

// Percentages
const percentage = formatNumber(0.8542, {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
// "85.4%"

// Locale-aware dashboard
function DashboardMetric({ value, locale }: Props) {
  return <span>{formatNumber(value, { locale })}</span>;
}

// Nullable data
const displayValue = formatNumber(apiData?.count, {
  fallback: 'Loading...',
});
```

---

### `formatCurrency`

Format currency values with proper symbols, decimal places, and locale-specific formatting.

**Signature:**

```tsx
function formatCurrency(value: number | null | undefined, options?: FormatCurrencyOptions): string;

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

**Examples:**

**Basic Currency Formatting:**

```tsx
formatCurrency(1234.56); // "$1,234.56"
formatCurrency(42); // "$42.00"
formatCurrency(0); // "$0.00"
formatCurrency(null); // "$0.00" (fallback)
```

**Different Currencies:**

```tsx
// Euro
formatCurrency(1234.56, { currency: 'EUR', locale: 'en-US' });
// "€1,234.56"

formatCurrency(1234.56, { currency: 'EUR', locale: 'de-DE' });
// "1.234,56 €"

// British Pound
formatCurrency(1234.56, { currency: 'GBP', locale: 'en-GB' });
// "£1,234.56"

// Japanese Yen (no decimals by default)
formatCurrency(1234, { currency: 'JPY', locale: 'ja-JP' });
// "¥1,234"

// Indian Rupee
formatCurrency(1234.56, { currency: 'INR', locale: 'en-IN' });
// "₹1,234.56"

// Swiss Franc
formatCurrency(1234.56, { currency: 'CHF', locale: 'de-CH' });
// "CHF 1'234.56"
```

**Currency Display Options:**

```tsx
// Symbol (default)
formatCurrency(100, {
  currency: 'USD',
  currencyDisplay: 'symbol',
});
// "$100.00"

// Code
formatCurrency(100, {
  currency: 'USD',
  currencyDisplay: 'code',
});
// "USD 100.00"

// Name
formatCurrency(100, {
  currency: 'USD',
  currencyDisplay: 'name',
});
// "100.00 US dollars"

// Narrow symbol (when available)
formatCurrency(100, {
  currency: 'CAD',
  currencyDisplay: 'narrowSymbol',
});
// "$100.00" (instead of CA$)
```

**Compact Currency:**

```tsx
// Large amounts
formatCurrency(1234567, {
  notation: 'compact',
  compactDisplay: 'short',
});
// "$1.2M"

formatCurrency(1200, {
  notation: 'compact',
  compactDisplay: 'short',
});
// "$1.2K"

// Long format
formatCurrency(1200000, {
  notation: 'compact',
  compactDisplay: 'long',
});
// "$1.2 million"
```

**Custom Decimal Places:**

```tsx
// Cryptocurrency (8 decimals)
formatCurrency(0.00012345, {
  currency: 'BTC',
  minimumFractionDigits: 8,
  maximumFractionDigits: 8,
});
// "BTC 0.00012345"

// No decimals
formatCurrency(1234.56, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
// "$1,235" (rounded)

// 3 decimal places
formatCurrency(1234.567, {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});
// "$1,234.567"
```

**Sign Display:**

```tsx
// Accounting format (show negative in parentheses)
formatCurrency(-1234.56, { signDisplay: 'never' });
// "$1,234.56" (sign hidden, use with custom wrapper for parens)

// Always show sign
formatCurrency(1234.56, { signDisplay: 'always' });
// "+$1,234.56"

formatCurrency(-1234.56, { signDisplay: 'always' });
// "-$1,234.56"
```

**Fallback Values:**

```tsx
formatCurrency(null); // "$0.00"
formatCurrency(undefined); // "$0.00"
formatCurrency(null, { fallback: 'N/A' }); // "N/A"
formatCurrency(null, { fallback: '--' }); // "--"
```

**Best Practices:**

```tsx
// E-commerce prices
function ProductPrice({ price, currency }: Props) {
  return <span className="price">{formatCurrency(price, { currency })}</span>;
}

// Multi-currency support
function Price({ amount, currencyCode, userLocale }: Props) {
  return (
    <span>
      {formatCurrency(amount, {
        currency: currencyCode,
        locale: userLocale,
      })}
    </span>
  );
}

// Financial reports (consistent decimals)
const revenue = formatCurrency(report.revenue, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Dashboard metrics (compact)
function RevenueMetric({ value }: { value: number }) {
  return (
    <div className="metric">
      <h3>Revenue</h3>
      <p className="value">
        {formatCurrency(value, {
          notation: 'compact',
          compactDisplay: 'short',
        })}
      </p>
    </div>
  );
}

// Invoice totals
function InvoiceTotal({ amount, currency }: Props) {
  return (
    <div className="total">
      <strong>Total:</strong>
      <span>{formatCurrency(amount, { currency })}</span>
    </div>
  );
}

// Nullable data from API
function OrderSummary({ order }: { order: Order | null }) {
  const total = formatCurrency(order?.total, {
    fallback: 'Calculating...',
  });

  return <div>Total: {total}</div>;
}
```

---

### `clamp`

Constrain a number within a specified range. Returns value if within bounds, otherwise returns min or max.

**Signature:**

```tsx
function clamp(value: number, min: number, max: number): number;
```

**Examples:**

**Basic Clamping:**

```tsx
clamp(50, 0, 100); // 50 (within range)
clamp(150, 0, 100); // 100 (exceeds max)
clamp(-50, 0, 100); // 0 (below min)
clamp(0, 0, 100); // 0 (at min)
clamp(100, 0, 100); // 100 (at max)
```

**Percentage Clamping:**

```tsx
function normalizePercentage(value: number): number {
  return clamp(value, 0, 100);
}

normalizePercentage(50); // 50
normalizePercentage(150); // 100
normalizePercentage(-10); // 0
```

**Opacity/Alpha Values:**

```tsx
function normalizeOpacity(value: number): number {
  return clamp(value, 0, 1);
}

normalizeOpacity(0.5); // 0.5
normalizeOpacity(1.5); // 1.0
normalizeOpacity(-0.5); // 0.0
```

**Volume Control:**

```tsx
function setVolume(level: number): number {
  return clamp(level, 0, 11); // This one goes to 11
}

setVolume(5); // 5
setVolume(15); // 11
setVolume(-1); // 0
```

**Negative Ranges:**

```tsx
clamp(0, -100, 100); // 0
clamp(-150, -100, 100); // -100
clamp(150, -100, 100); // 100
```

**Float Values:**

```tsx
clamp(3.14159, 0, 3); // 3
clamp(0.5, 0.25, 0.75); // 0.5
clamp(0.1, 0.25, 0.75); // 0.25
```

**NaN Handling:**

```tsx
// Returns min if value is NaN
clamp(NaN, 0, 100); // 0

// This behavior prevents NaN from propagating
function safeClamp(value: number | undefined, min: number, max: number) {
  return clamp(value ?? min, min, max);
}
```

**Best Practices:**

```tsx
// Input validation
function RangeInput({ value, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = clamp(Number(e.target.value), 0, 100);
    onChange(newValue);
  };

  return <input type="number" value={value} onChange={handleChange} />;
}

// Zoom level
function handleZoom(delta: number, currentZoom: number): number {
  const newZoom = currentZoom + delta;
  return clamp(newZoom, 0.1, 5); // 10% to 500%
}

// Progress bar
function ProgressBar({ current, total }: Props) {
  const percentage = clamp((current / total) * 100, 0, 100);

  return (
    <div className="progress">
      <div className="progress-bar" style={{ width: `${percentage}%` }} />
    </div>
  );
}

// Color channel values
function normalizeRGB(r: number, g: number, b: number) {
  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255),
  };
}

// Animation duration
function getAnimationDuration(speed: number): number {
  // Ensure duration is between 100ms and 5000ms
  return clamp(speed, 100, 5000);
}

// Pagination
function normalizePage(page: number, totalPages: number): number {
  return clamp(page, 1, totalPages);
}
```

**Common Use Cases:**

```tsx
// Slider component
function Slider({ min = 0, max = 100, value, onChange }: SliderProps) {
  const handleChange = (newValue: number) => {
    onChange(clamp(newValue, min, max));
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => handleChange(Number(e.target.value))}
    />
  );
}

// Rating component
function Rating({ value, onChange }: RatingProps) {
  const handleClick = (stars: number) => {
    onChange(clamp(stars, 1, 5));
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => handleClick(star)}>
          ★
        </button>
      ))}
    </div>
  );
}

// Brightness control
function adjustBrightness(current: number, delta: number): number {
  return clamp(current + delta, 0, 100);
}
```

---

## Performance Notes

### Formatter Caching

Both `formatNumber` and `formatCurrency` use internal caching:

```tsx
// Cache key: locale + options
const cacheKey = `${locale}-${JSON.stringify(options)}`;

// First call: creates and caches formatter
formatNumber(1234, { locale: 'en-US' }); // ~0.5ms

// Subsequent calls: reuses cached formatter
formatNumber(5678, { locale: 'en-US' }); // ~0.01ms (50x faster)
```

**Cache Benefits:**

- Reduces `Intl.NumberFormat` instantiation overhead
- Ideal for data tables, lists, and dashboards
- Automatic cache key generation
- Memory-efficient (LRU cache with size limit)

**Best Practices:**

- Reuse the same options object when formatting multiple numbers
- Don't create new options objects in render loops
- Consider memoization for complex formatting logic

---

## SSR Safety

All utilities are SSR-safe:

```tsx
// formatNumber and formatCurrency
if (typeof Intl === 'undefined') {
  return fallback; // Returns fallback if Intl unavailable
}

// clamp
// Pure function, no browser APIs
```

---

## Common Patterns

### Data Table Formatting

```tsx
function DataTable({ rows }: Props) {
  return (
    <table>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{formatNumber(row.quantity)}</td>
            <td>{formatCurrency(row.price)}</td>
            <td>{formatCurrency(row.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Dashboard Metrics

```tsx
function MetricCard({ label, value, change }: MetricProps) {
  const displayValue = formatNumber(value, {
    notation: 'compact',
    compactDisplay: 'short',
  });

  const changeColor = change >= 0 ? 'success' : 'danger';
  const changeSymbol = change >= 0 ? '+' : '';

  return (
    <div className="metric-card">
      <h4>{label}</h4>
      <p className="value">{displayValue}</p>
      <p className={changeColor}>
        {changeSymbol}
        {formatNumber(change, { signDisplay: 'always' })}%
      </p>
    </div>
  );
}
```

### Financial Calculations

```tsx
function InvoiceCalculator({ items }: Props) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div>
      <div>Subtotal: {formatCurrency(subtotal)}</div>
      <div>Tax (8%): {formatCurrency(tax)}</div>
      <div>Total: {formatCurrency(total)}</div>
    </div>
  );
}
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [String Utilities](../string/README.md)
- [React Component Library](../../README.md)

---

## License

Copyright © 2026 DSAi. All rights reserved.
