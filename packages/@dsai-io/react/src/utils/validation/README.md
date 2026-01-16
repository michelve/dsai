# Validation Utilities

Enterprise-grade validation utilities with XSS protection, security features, and comprehensive input validation.

## Overview

This module provides utilities for:

- URL and href validation
- Email address validation
- XSS protection (blocking dangerous protocols)
- Security-focused href sanitization

## Installation

```tsx
import { isSafeHref, isValidHref, isValidEmail, isValidUrl } from '@dsai-io/react';
```

---

## Functions

### `isSafeHref`

Validate that an href value is safe from XSS attacks. Blocks dangerous protocols like `javascript:`, `data:`, `vbscript:`, and `file:`.

**Signature:**

```tsx
function isSafeHref(href: string | undefined, options?: SafeHrefOptions): boolean;

interface SafeHrefOptions {
  undefinedBehavior?: 'safe' | 'unsafe'; // Default: 'safe'
}
```

**Examples:**

```tsx
// Safe URLs
isSafeHref('https://example.com'); // true
isSafeHref('http://example.com'); // true
isSafeHref('/relative/path'); // true
isSafeHref('../parent/path'); // true
isSafeHref('mailto:user@example.com'); // true
isSafeHref('tel:+1234567890'); // true
isSafeHref('#anchor'); // true

// Dangerous URLs (blocked)
isSafeHref('javascript:alert("XSS")'); // false
isSafeHref('data:text/html,<script>...</script>'); // false
isSafeHref('vbscript:msgbox("XSS")'); // false
isSafeHref('file:///etc/passwd'); // false
isSafeHref('about:blank'); // false

// Encoded payloads (detected and blocked)
isSafeHref('javascript%3Aalert%28%22XSS%22%29'); // false
isSafeHref('data%3Atext%2Fhtml%2C%3Cscript%3E'); // false

// Undefined behavior
isSafeHref(undefined); // true (default: safe)
isSafeHref(undefined, { undefinedBehavior: 'unsafe' }); // false

// Edge cases
isSafeHref(''); // true (empty is safe)
isSafeHref('   javascript:alert(1)   '); // false (trimmed)
isSafeHref('JAVASCRIPT:alert(1)'); // false (case-insensitive)
```

**Blocked Protocols:**

- `javascript:` - Execute arbitrary JavaScript
- `data:` - Embed executable content
- `vbscript:` - VBScript execution (IE)
- `file:` - Access local file system
- `about:blank` - Blank page (can be misused)
- Data URLs with `text/html` MIME type

**Security Features:**

- URI decoding to detect encoded payloads
- Case-insensitive protocol matching
- Whitespace trimming
- Comprehensive protocol blacklist
- Safe defaults (undefined = safe)

**Best Practices:**

```tsx
// In components
function SafeLink({ href, children }: { href?: string; children: ReactNode }) {
  const safeHref = isSafeHref(href) ? href : '#';

  return (
    <a
      href={safeHref}
      {...(href &&
        !isSafeHref(href) && {
          onClick: (e) => e.preventDefault(),
        })}
    >
      {children}
    </a>
  );
}

// In validation
function validateLink(href: string): ValidationError | null {
  if (!isSafeHref(href)) {
    return {
      field: 'href',
      message: 'URL contains unsafe protocol',
    };
  }
  return null;
}

// User-generated content
function sanitizeUserLinks(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!isSafeHref(href)) {
      link.setAttribute('href', '#');
      link.setAttribute('data-blocked', 'true');
    }
  });

  return doc.body.innerHTML;
}
```

---

### `isValidHref`

Check if a string is a valid href value (URL or path). Less strict than `isSafeHref` - only checks format, not security.

**Signature:**

```tsx
function isValidHref(href: string | undefined): boolean;
```

**Examples:**

```tsx
// Valid hrefs
isValidHref('https://example.com'); // true
isValidHref('http://example.com:8080'); // true
isValidHref('/absolute/path'); // true
isValidHref('../relative/path'); // true
isValidHref('mailto:test@example.com'); // true
isValidHref('tel:+1234567890'); // true
isValidHref('#section'); // true
isValidHref('?query=value'); // true

// Invalid hrefs
isValidHref(''); // false
isValidHref('   '); // false
isValidHref(undefined); // false
isValidHref('not a url'); // false (contains spaces)

// Note: Unlike isSafeHref, this allows javascript: protocol
isValidHref('javascript:void(0)'); // true (format valid, but unsafe!)
```

**Difference from `isSafeHref`:**

- `isValidHref`: Checks format only (is it a valid href string?)
- `isSafeHref`: Checks format AND security (is it safe to use?)

**When to Use:**

- `isSafeHref`: User-generated content, external links, untrusted sources
- `isValidHref`: Internal validation, checking format before processing

**Best Practices:**

```tsx
// Always combine with isSafeHref for user input
function validateUserLink(href: string) {
  if (!isValidHref(href)) {
    return 'Invalid URL format';
  }
  if (!isSafeHref(href)) {
    return 'URL contains unsafe protocol';
  }
  return null;
}

// Use for format checking
function LinkInput({ value, onChange }: InputProps) {
  const isValid = isValidHref(value);

  return (
    <input
      type="url"
      value={value}
      onChange={onChange}
      className={isValid ? 'valid' : 'invalid'}
      aria-invalid={!isValid}
    />
  );
}
```

---

### `isValidEmail`

Validate email address format using comprehensive regex pattern.

**Signature:**

```tsx
function isValidEmail(email: string | undefined): boolean;
```

**Examples:**

```tsx
// Valid emails
isValidEmail('user@example.com'); // true
isValidEmail('first.last@example.com'); // true
isValidEmail('user+tag@example.co.uk'); // true
isValidEmail('123@example.com'); // true
isValidEmail('user@subdomain.example.com'); // true
isValidEmail('_user@example.com'); // true

// Invalid emails
isValidEmail(''); // false
isValidEmail('   '); // false
isValidEmail(undefined); // false
isValidEmail('invalid'); // false
isValidEmail('@example.com'); // false
isValidEmail('user@'); // false
isValidEmail('user @example.com'); // false (space)
isValidEmail('user@.com'); // false
isValidEmail('user..name@example.com'); // false (consecutive dots)

// Edge cases
isValidEmail('user@localhost'); // false (no TLD)
isValidEmail('user@example'); // false (no TLD)
isValidEmail('user@127.0.0.1'); // false (IP address)
```

**Regex Pattern:**

```regex
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

**Rules:**

- Must contain exactly one `@` symbol
- Local part (before @): Any non-whitespace characters except @
- Domain part (after @): Must contain at least one `.` with non-whitespace characters

**What It Validates:**

- Basic email structure (<local@domain.tld>)
- No spaces or @ in local/domain parts
- Presence of TLD (top-level domain)

**What It Doesn't Validate:**

- Domain exists (DNS lookup)
- Mailbox exists (SMTP verification)
- RFC 5322 full compliance (intentionally simplified)
- International domains (IDN)
- IP addresses as domain
- Localhost or local domains

**Best Practices:**

```tsx
// In forms
function EmailInput() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleBlur = () => {
    if (email && !isValidEmail(email)) {
      setError('Please enter a valid email address');
    } else {
      setError('');
    }
  };

  return (
    <>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={error ? 'email-error' : undefined}
      />
      {error && <span id="email-error">{error}</span>}
    </>
  );
}

// In validation schemas
const schema = {
  email: (value: string) => {
    if (!value) return 'Email is required';
    if (!isValidEmail(value)) return 'Invalid email format';
    return null;
  },
};

// Server-side validation
function validateEmailField(email: string): ValidationResult {
  if (!isValidEmail(email)) {
    return {
      valid: false,
      error: 'Invalid email format',
    };
  }

  // Additional checks (optional)
  if (email.length > 254) {
    return {
      valid: false,
      error: 'Email is too long',
    };
  }

  return { valid: true };
}
```

---

### `isValidUrl`

Validate that a string is a well-formed absolute URL with protocol.

**Signature:**

```tsx
function isValidUrl(url: string | undefined): boolean;
```

**Examples:**

```tsx
// Valid URLs
isValidUrl('https://example.com'); // true
isValidUrl('http://example.com:8080'); // true
isValidUrl('https://example.com/path'); // true
isValidUrl('https://sub.example.com'); // true
isValidUrl('ftp://ftp.example.com'); // true
isValidUrl('mailto:user@example.com'); // true
isValidUrl('tel:+1234567890'); // true

// Invalid URLs
isValidUrl(''); // false
isValidUrl('   '); // false
isValidUrl(undefined); // false
isValidUrl('/relative/path'); // false (no protocol)
isValidUrl('../relative/path'); // false (no protocol)
isValidUrl('example.com'); // false (no protocol)
isValidUrl('//example.com'); // false (protocol-relative)
isValidUrl('not a url'); // false
isValidUrl('ht tp://example.com'); // false (invalid protocol)

// Edge cases
isValidUrl('javascript:void(0)'); // true (valid format, but unsafe!)
isValidUrl('data:text/plain,Hello'); // true (valid format, but check safety!)
```

**Implementation:**
Uses native `URL` constructor with try-catch:

```tsx
function isValidUrl(url: string | undefined): boolean {
  if (!url?.trim()) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

**What It Validates:**

- Absolute URLs with protocol
- Valid URL structure per WHATWG URL Standard
- Protocol + domain + optional path/query/fragment

**What It Doesn't Validate:**

- Security (use `isSafeHref` for that)
- Domain exists (DNS lookup)
- Server is reachable
- Relative URLs (returns false)

**Difference from Other Validators:**

- `isValidUrl`: Absolute URLs only (must have protocol)
- `isValidHref`: URLs or paths (relative ok)
- `isSafeHref`: Security check (blocks dangerous protocols)

**Best Practices:**

```tsx
// Combine with isSafeHref for security
function validateExternalLink(url: string) {
  if (!isValidUrl(url)) {
    return 'Must be a complete URL with protocol';
  }
  if (!isSafeHref(url)) {
    return 'URL contains unsafe protocol';
  }
  return null;
}

// In API validation
function validateWebhookUrl(url: string): boolean {
  return (
    isValidUrl(url) && isSafeHref(url) && (url.startsWith('http://') || url.startsWith('https://'))
  );
}

// Check before fetch
async function fetchData(url: string) {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL');
  }
  if (!isSafeHref(url)) {
    throw new Error('Unsafe URL');
  }

  return fetch(url);
}

// Form validation
function UrlInput() {
  const [url, setUrl] = useState('');
  const isValid = url === '' || isValidUrl(url);

  return (
    <input
      type="url"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="https://example.com"
      aria-invalid={!isValid}
    />
  );
}
```

---

## Security Comparison Matrix

| Function       | Relative Paths | Fragments (#) | mailto:/tel: | JavaScript: | data:    | Empty/Undefined   |
| -------------- | -------------- | ------------- | ------------ | ----------- | -------- | ----------------- |
| `isSafeHref`   | ✅ true        | ✅ true       | ✅ true      | ❌ false    | ❌ false | ✅ true (default) |
| `isValidHref`  | ✅ true        | ✅ true       | ✅ true      | ⚠️ true     | ⚠️ true  | ❌ false          |
| `isValidUrl`   | ❌ false       | ❌ false      | ✅ true      | ⚠️ true     | ⚠️ true  | ❌ false          |
| `isValidEmail` | N/A            | N/A           | N/A          | N/A         | N/A      | ❌ false          |

**Legend:**

- ✅ Allowed/Valid
- ❌ Blocked/Invalid
- ⚠️ Allowed but potentially unsafe

---

## Common Patterns

### Complete Link Validation

```tsx
function validateLink(href: string): string | null {
  // 1. Check format
  if (!isValidHref(href)) {
    return 'Invalid link format';
  }

  // 2. Check security
  if (!isSafeHref(href)) {
    return 'Link contains unsafe protocol';
  }

  // 3. Check if absolute URL when required
  if (requireAbsolute && !isValidUrl(href)) {
    return 'Must be a complete URL with protocol';
  }

  return null;
}
```

### Safe Link Component

```tsx
function SafeLink({ href, children, external }: SafeLinkProps) {
  // Validate and sanitize
  const isValid = isValidHref(href);
  const isSafe = isSafeHref(href);
  const isExternal = external || (isValidUrl(href) && !href.startsWith(window.location.origin));

  // Fallback to # for unsafe links
  const finalHref = isSafe ? href : '#';

  // External link props
  const externalProps = isExternal
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  return (
    <a
      href={finalHref}
      {...externalProps}
      onClick={(e) => {
        if (!isSafe) {
          e.preventDefault();
          console.warn('Blocked unsafe link:', href);
        }
      }}
    >
      {children}
      {isExternal && <ExternalIcon />}
    </a>
  );
}
```

### Form Validation

```tsx
function ContactForm() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (website && !isValidUrl(website)) {
      newErrors.website = 'Invalid website URL';
    } else if (website && !isSafeHref(website)) {
      newErrors.website = 'Website URL contains unsafe protocol';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Submit form
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={!!errors.email}
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        type="url"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        aria-invalid={!!errors.website}
      />
      {errors.website && <span>{errors.website}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## XSS Protection Examples

### Blocked Attack Vectors

```tsx
// Direct JavaScript execution
<a href="javascript:alert('XSS')">Click</a>
// isSafeHref returns false ❌

// Encoded JavaScript
<a href="javascript%3Aalert('XSS')">Click</a>
// isSafeHref decodes and returns false ❌

// Data URL with HTML
<a href="data:text/html,<script>alert('XSS')</script>">Click</a>
// isSafeHref returns false ❌

// VBScript (IE)
<a href="vbscript:msgbox('XSS')">Click</a>
// isSafeHref returns false ❌

// File protocol
<a href="file:///etc/passwd">View</a>
// isSafeHref returns false ❌
```

### Allowed Safe Links

```tsx
// HTTPS
<a href="https://example.com">Safe</a>
// isSafeHref returns true ✅

// Relative paths
<a href="/about">Safe</a>
// isSafeHref returns true ✅

// Anchors
<a href="#section">Safe</a>
// isSafeHref returns true ✅

// mailto
<a href="mailto:user@example.com">Safe</a>
// isSafeHref returns true ✅

// tel
<a href="tel:+1234567890">Safe</a>
// isSafeHref returns true ✅
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [Security Utilities](../safety/README.md)
- [React Component Library](../../README.md)

---

## License

Copyright © 2026 DSAi. All rights reserved.
