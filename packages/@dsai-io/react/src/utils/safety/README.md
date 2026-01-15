# Safety Utilities

Enterprise-grade data safety utilities for secure input handling, sanitization, and token generation.

## Overview

This module provides utilities for:

- HTML sanitization (XSS prevention)
- URL sanitization
- Clipboard operations
- Cryptographically secure token generation

## Installation

```tsx
import {
  sanitizeHtml,
  sanitizeUrl,
  copyToClipboard,
  readFromClipboard,
  generateToken,
  generateCryptoId,
} from '@dsai/react';
```

---

## HTML Sanitization

### `sanitizeHtml`

Sanitize HTML content to prevent XSS attacks.

**Signature:**

```tsx
function sanitizeHtml(html: string, options?: SanitizeHtmlOptions): string;

interface SanitizeHtmlOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowedProtocols?: string[];
}
```

**Examples:**

```tsx
// Basic sanitization
const clean = sanitizeHtml('<script>alert("xss")</script>');
// ''

// Allow specific tags
const clean = sanitizeHtml(userInput, {
  allowedTags: ['p', 'br', 'strong', 'em'],
});

// With attributes
const clean = sanitizeHtml(content, {
  allowedTags: ['a', 'img'],
  allowedAttributes: {
    a: ['href', 'title'],
    img: ['src', 'alt'],
  },
  allowedProtocols: ['http', 'https'],
});
```

---

## URL Sanitization

### `sanitizeUrl`

Sanitize URLs to prevent XSS and protocol attacks.

**Signature:**

```tsx
function sanitizeUrl(url: string, options?: SanitizeUrlOptions): string;

interface SanitizeUrlOptions {
  allowedProtocols?: string[];
  allowDataUrls?: boolean;
  allowedDataMimeTypes?: string[];
}
```

**Examples:**

```tsx
// Blocks dangerous protocols
sanitizeUrl('javascript:alert(1)');
// 'about:blank'

sanitizeUrl('data:text/html,<script>alert(1)</script>');
// 'about:blank'

// Allow safe URLs
sanitizeUrl('https://example.com');
// 'https://example.com'

sanitizeUrl('/relative/path');
// '/relative/path'

// Allow data URLs with specific MIME types
sanitizeUrl('data:image/png;base64,...', {
  allowDataUrls: true,
  allowedDataMimeTypes: ['image/png', 'image/jpeg'],
});
```

---

## Clipboard

### `copyToClipboard`

Copy text to clipboard with fallback.

**Signature:**

```tsx
function copyToClipboard(text: string, options?: CopyToClipboardOptions): Promise<ClipboardResult>;

interface ClipboardResult {
  success: boolean;
  error?: Error;
}
```

**Examples:**

```tsx
// Basic copy
const result = await copyToClipboard('Hello, World!');
if (result.success) {
  showNotification('Copied to clipboard');
}

// With success callback
await copyToClipboard(codeSnippet, {
  onSuccess: () => {
    setShowCheckmark(true);
  },
  onError: (error) => {
    console.error('Copy failed:', error);
  },
});

// In button
async function handleCopy() {
  const { success } = await copyToClipboard(textToCopy);
  setButtonText(success ? 'Copied!' : 'Failed');
}
```

---

### `readFromClipboard`

Read text from clipboard.

**Signature:**

```tsx
function readFromClipboard(options?: ReadFromClipboardOptions): Promise<ClipboardReadResult>;

interface ClipboardReadResult {
  success: boolean;
  text?: string;
  error?: Error;
}
```

**Examples:**

```tsx
const result = await readFromClipboard();
if (result.success) {
  console.log('Clipboard content:', result.text);
}
```

---

## Token Generation

### `generateToken`

Generate secure random tokens.

**Signature:**

```tsx
function generateToken(options?: GenerateTokenOptions): string;

interface GenerateTokenOptions {
  length?: number; // Default: 32
  encoding?: TokenEncoding; // 'base64' | 'hex' | 'base64url'
  alphabet?: string;
}
```

**Examples:**

```tsx
// Default: 32 chars, base64url
const token = generateToken();
// 'x4F9k2L8m3N7p1Q6r5S8t2U3v7W1x9Y4'

// Custom length
const shortToken = generateToken({ length: 16 });

// Hex encoding
const hexToken = generateToken({
  length: 32,
  encoding: 'hex',
});

// Custom alphabet
const pinCode = generateToken({
  length: 6,
  alphabet: '0123456789',
});
```

---

### `generateCryptoId`

Generate cryptographically secure IDs (nanoid alternative).

**Signature:**

```tsx
function generateCryptoId(options?: GenerateCryptoIdOptions): string;

interface GenerateCryptoIdOptions {
  length?: number; // Default: 21
  format?: CryptoIdFormat; // 'nano' | 'uuid' | 'short'
}
```

**Examples:**

```tsx
// Default nanoid-style ID
const id = generateCryptoId();
// 'V1StGXR8_Z5jdHi6B-myT'

// Short ID
const shortId = generateCryptoId({
  format: 'short',
  length: 10,
});

// UUID format
const uuid = generateCryptoId({ format: 'uuid' });
```

---

## Common Patterns

### Safe User Content Display

```tsx
function UserComment({ comment }: Props) {
  const safeHtml = sanitizeHtml(comment.content, {
    allowedTags: ['p', 'br', 'strong', 'em', 'a'],
    allowedAttributes: { a: ['href'] },
    allowedProtocols: ['http', 'https'],
  });

  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}
```

### Safe Link Component

```tsx
function SafeLink({ href, children }: Props) {
  const safeHref = sanitizeUrl(href);

  if (safeHref === 'about:blank') {
    return <span>{children}</span>;
  }

  return <a href={safeHref}>{children}</a>;
}
```

### Copy Button

```tsx
function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const result = await copyToClipboard(text);
    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>;
}
```

### Secure Session IDs

```tsx
function createSession() {
  return {
    id: generateCryptoId(),
    token: generateToken({ length: 64 }),
    createdAt: Date.now(),
  };
}
```

---

## Best Practices

1. **Always sanitize user-generated content:**

```tsx
const safe = sanitizeHtml(userInput);
```

1. **Validate URLs before use:**

```tsx
const safeUrl = sanitizeUrl(url);
if (safeUrl !== 'about:blank') {
  window.location.href = safeUrl;
}
```

1. **Use crypto IDs for security-sensitive contexts:**

```tsx
const sessionId = generateCryptoId();
```

1. **Handle clipboard API permissions:**

```tsx
const result = await copyToClipboard(text);
if (!result.success) {
  // Show fallback UI
}
```

---

## Security Notes

- `sanitizeHtml` removes all script tags and event handlers
- `sanitizeUrl` blocks JavaScript:, data:, vbscript:, file: protocols
- Token generation uses `crypto.getRandomValues()` (cryptographically secure)
- Clipboard API requires user gesture and HTTPS

---

## Related Documentation

- [Main Utils README](../README.md)
- [Validation Utilities](../validation/README.md)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

## License

Copyright © 2024 DSAi. All rights reserved.
