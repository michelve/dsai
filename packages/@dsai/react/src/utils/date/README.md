# Date Utilities

Locale-aware date and time formatting utilities using Intl APIs.

## Overview

This module provides utilities for:

- Date formatting with locale support
- Relative time formatting ("2 hours ago")

## Installation

```tsx
import { formatDate, formatRelativeTime } from '@dsai/react';
```

---

## Functions

### `formatDate`

Format dates using Intl.DateTimeFormat with locale support.

**Signature:**

```tsx
function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions & { locale?: string }
): string;
```

**Examples:**

```tsx
// Basic formatting
const formatted = formatDate(new Date());
// '12/25/2024' (US locale)

// With locale
const formatted = formatDate(new Date(), {
  locale: 'en-GB',
});
// '25/12/2024'

// Full date
const formatted = formatDate(new Date(), {
  dateStyle: 'full',
});
// 'Wednesday, December 25, 2024'

// Time only
const formatted = formatDate(new Date(), {
  timeStyle: 'short',
});
// '10:30 AM'

// Custom format
const formatted = formatDate(new Date(), {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
// 'December 25, 2024'

// With timezone
const formatted = formatDate(new Date(), {
  timeZone: 'America/New_York',
  timeStyle: 'long',
});
```

---

### `formatRelativeTime`

Format relative time ("2 hours ago", "in 3 days").

**Signature:**

```tsx
function formatRelativeTime(date: Date | string | number, options?: RelativeTimeOptions): string;

interface RelativeTimeOptions {
  locale?: string;
  baseDate?: Date;
  style?: 'long' | 'short' | 'narrow';
  numeric?: 'always' | 'auto';
}
```

**Examples:**

```tsx
// Basic usage
const relative = formatRelativeTime(new Date('2024-12-23'));
// '2 days ago' (if today is Dec 25)

// Future dates
const relative = formatRelativeTime(new Date('2024-12-27'));
// 'in 2 days'

// With custom base date
const relative = formatRelativeTime(new Date('2024-12-20'), { baseDate: new Date('2024-12-25') });
// '5 days ago'

// Short style
const relative = formatRelativeTime(date, {
  style: 'short',
});
// '2 hr ago'

// Auto numeric ("yesterday" vs "1 day ago")
const relative = formatRelativeTime(date, {
  numeric: 'auto',
});
// 'yesterday'

// Different locale
const relative = formatRelativeTime(date, {
  locale: 'es',
});
// 'hace 2 días'
```

---

## Common Patterns

### Timestamp Component

```tsx
function Timestamp({ date }: { date: Date }) {
  const [relative, setRelative] = useState('');

  useEffect(() => {
    const updateRelative = () => {
      setRelative(formatRelativeTime(date));
    };

    updateRelative();
    const interval = setInterval(updateRelative, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [date]);

  return (
    <time
      dateTime={date.toISOString()}
      title={formatDate(date, { dateStyle: 'full', timeStyle: 'long' })}
    >
      {relative}
    </time>
  );
}
```

### Date Range Formatter

```tsx
function formatDateRange(start: Date, end: Date, locale = 'en-US') {
  const startStr = formatDate(start, {
    locale,
    month: 'short',
    day: 'numeric',
  });

  const endStr = formatDate(end, {
    locale,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${startStr} – ${endStr}`;
}

// Usage
formatDateRange(new Date('2024-12-20'), new Date('2024-12-25'));
// 'Dec 20 – Dec 25, 2024'
```

---

## Best Practices

1. **Always specify locale for consistency:**

```tsx
const formatted = formatDate(date, {
  locale: userLocale,
});
```

2. **Use relative time for recent dates:**

```tsx
const isRecent = Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000;
const display = isRecent ? formatRelativeTime(date) : formatDate(date);
```

3. **Include ISO datetime for accessibility:**

```tsx
<time dateTime={date.toISOString()}>{formatRelativeTime(date)}</time>
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)

---

## License

Copyright © 2024 DSAi. All rights reserved.
