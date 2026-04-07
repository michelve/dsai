# Security — Code Examples

## Project Rules (from CLAUDE.md — NON-NEGOTIABLE)

### Dynamic property access — Reflect.get() only

Never use bracket notation for dynamic keys. This is a DSAi security requirement.

```typescript
// BAD — bracket notation
const val = obj[key];
obj[key] = value;

// GOOD
const val = Reflect.get(obj, key);
Reflect.set(obj, key, value);
```

### Prototype pollution guard

Block dangerous keys before any dynamic access:

```typescript
const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function safeGet(obj: Record<string, unknown>, key: string): unknown {
  if (BLOCKED_KEYS.has(key)) {
    throw new Error(`Blocked key: ${key}`);
  }
  return Reflect.get(obj, key);
}
```

### ReDoS prevention

No nested quantifiers in regex. These are all forbidden patterns:

```typescript
// BAD — exponential backtracking
/(a+)+/
/(a*)*b/
/(a+)*c/
/(a|b+)+/

// GOOD — linear time
/a+/
/a*b/
/(?:a|b)+/
```

### Input validation — allowlists not blocklists

```typescript
// BAD — blocklist (can be bypassed)
const BLOCKED_TAGS = ['script', 'iframe'];
if (!BLOCKED_TAGS.includes(tag)) { /* allow */ }

// GOOD — allowlist
const ALLOWED_TAGS = new Set(['p', 'span', 'div', 'a', 'strong', 'em']);
if (ALLOWED_TAGS.has(tag)) { /* allow */ }
```

## S2068 — No hard-coded credentials

```typescript
// BAD
const API_KEY = 'sk-1234567890abcdef';
const password = 'admin123';
const connectionString = 'mongodb://user:pass@host:27017';

// GOOD — use environment variables
const API_KEY = process.env.API_KEY;
const password = process.env.DB_PASSWORD;
```

## S2076 — No dynamic code execution

```typescript
// BAD
eval(userInput);
new Function(userInput)();
setTimeout(userInput, 1000); // string form

// GOOD
// Use direct function calls, not dynamic evaluation
const handler = handlers[action]; // but use Reflect.get!
const handler = Reflect.get(handlers, action);
if (typeof handler === 'function') handler();
```

## S5131 — No dynamic template construction (XSS)

```typescript
// BAD — user input in template
element.innerHTML = `<div>${userInput}</div>`;
document.write(userInput);

// GOOD — use DOM APIs or React
element.textContent = userInput;
// In React, JSX auto-escapes:
return <div>{userInput}</div>;
```

## S5148 — Opened windows should not access originator

```typescript
// BAD
window.open(url);

// GOOD — prevent reverse tabnabbing
window.open(url, '_blank', 'noopener,noreferrer');
// Or in JSX
<a href={url} target="_blank" rel="noopener noreferrer">Link</a>
```

## S5122 — Restrictive CORS policy

```typescript
// BAD — allow all origins
app.use(cors({ origin: '*' }));

// GOOD — specific origins
app.use(cors({
  origin: ['https://app.dsai.io', 'https://staging.dsai.io'],
}));
```

## S4784 — Slow regex (ReDoS)

```typescript
// BAD — catastrophic backtracking
const emailRegex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;

// GOOD — use atomic groups or limit input length
function validateEmail(input: string): boolean {
  if (input.length > 254) return false; // RFC 5321 max
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}
```

## S5542 / S5547 — Strong cryptography

```typescript
// BAD — weak algorithms
crypto.createCipheriv('des', key, iv);
crypto.createCipheriv('rc4', key, iv);

// GOOD — strong algorithms
crypto.createCipheriv('aes-256-gcm', key, iv);
```

## S5659 — JWT strong ciphers

```typescript
// BAD
jwt.sign(payload, secret, { algorithm: 'none' });
jwt.sign(payload, secret, { algorithm: 'HS256' }); // weak for asymmetric

// GOOD
jwt.sign(payload, privateKey, { algorithm: 'RS256' });
jwt.sign(payload, privateKey, { algorithm: 'ES256' });
```

## S4423 — No weak SSL/TLS

```typescript
// BAD
const options = { secureProtocol: 'TLSv1_method' };
const options = { minVersion: 'TLSv1' };

// GOOD
const options = { minVersion: 'TLSv1.2' };
```

## S5527 / S5667 — Verify server certificates

```typescript
// BAD
const options = { rejectUnauthorized: false };
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// GOOD — always verify in production
const options = { rejectUnauthorized: true };
```

## S2245 — PRNG usage

```typescript
// BAD — for security-sensitive contexts
const token = Math.random().toString(36);

// GOOD — crypto-secure random
const token = crypto.randomUUID();
const bytes = crypto.getRandomValues(new Uint8Array(32));
```

## S5332 — No clear-text protocols

```typescript
// BAD
fetch('http://api.example.com/data');
const ws = new WebSocket('ws://api.example.com');

// GOOD
fetch('https://api.example.com/data');
const ws = new WebSocket('wss://api.example.com');
```

## S5689 — Don't disclose technology fingerprints

```typescript
// BAD — Express default header
// X-Powered-By: Express

// GOOD
app.disable('x-powered-by');
// or use helmet
app.use(helmet());
```

## S5604 — Don't log confidential info

```typescript
// BAD
console.log('User password:', password);
logger.info('Token:', authToken);

// GOOD
console.log('User authenticated:', userId);
logger.info('Token refreshed for user:', userId);
```
