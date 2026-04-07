# Regex — Code Examples

## S4784 — Slow regex (ReDoS prevention)

Never use nested quantifiers — they cause catastrophic backtracking.

```typescript
// BAD — exponential time complexity
/(a+)+/           // nested + inside +
/(a*)*b/          // nested * inside *
/(a+)*c/          // nested + inside *
/(a|b+)+/         // alternation with quantifier inside quantifier
/(\w+\s*)+$/      // common real-world ReDoS pattern

// GOOD — linear time
/a+/
/a*b/
/(?:a|b)+/
/[\w\s]+$/        // character class instead of alternation
```

Always limit input length before applying regex:

```typescript
function safeMatch(input: string, pattern: RegExp): RegExpExecArray | null {
  if (input.length > 10_000) return null;
  return pattern.exec(input);
}
```

## S5843 — Complex regex (max complexity 20)

Break complex patterns into simpler, documented parts.

```typescript
// BAD — complexity 26+
const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

// GOOD — break into parts or use URL constructor
function isValidUrl(input: string): boolean {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
}
```

## S5856 — Valid regex syntax

```typescript
// BAD
new RegExp('[');      // unterminated character class
new RegExp('\\');     // trailing backslash

// GOOD
new RegExp('\\[');    // escaped bracket
new RegExp('\\\\');   // escaped backslash
```

## S5868 — No Unicode grapheme clusters in character classes

```typescript
// BAD — flag emoji is multi-codepoint
/[🇺🇸]/

// GOOD — use Unicode property escapes
/\p{Emoji}/u
```

## S5869 — No control characters in regex

```typescript
// BAD
/\x00/   // null character — usually a mistake

// GOOD — if intentional, use a named variable
const NULL_CHAR = '\x00';
const pattern = new RegExp(NULL_CHAR);
```

## S6326 — Single-char alternations to character class

```typescript
// BAD
/a|b|c/

// GOOD
/[abc]/
```

## S6328 — No unnecessary character escapes

```typescript
// BAD
/\a/     // \a is not a special escape
/\:/     // colon doesn't need escaping

// GOOD
/a/
/:/
```

## S6353 — No empty character classes

```typescript
// BAD — always fails to match
/[]/

// GOOD
/./     // match any character
/[\s\S]/ // match any character including newline
```

## S5852 — No duplicate characters in character classes

```typescript
// BAD
/[aab]/    // duplicate 'a'
/[0-90-9]/ // duplicate range

// GOOD
/[ab]/
/[0-9]/
```

## S6351 — Regex quantifiers should be concise

```typescript
// BAD
/[0-9][0-9][0-9]/

// GOOD
/[0-9]{3}/
// or
/\d{3}/
```

## S6325 — Character class for single characters

```typescript
// BAD
/[a]/

// GOOD
/a/
```

## S6594 — Use RegExp.exec() not String.match()

```typescript
// BAD
const result = str.match(pattern);

// GOOD
const result = pattern.exec(str);
```

## General regex best practices

1. **Prefer `.replaceAll()` over `/pattern/g`** for simple string replacements
2. **Use regex literals** (`/pattern/`) over `new RegExp()` when the pattern is static
3. **Use named groups** for readability: `/(?<year>\d{4})-(?<month>\d{2})/`
4. **Use `String.raw`** for patterns with many backslashes
5. **Always use `u` flag** for Unicode-aware matching when handling user input
