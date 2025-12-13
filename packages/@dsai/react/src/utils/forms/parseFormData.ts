/**
 * Converts FormData to a plain JavaScript object.
 *
 * Supports nested objects using dot notation (e.g., "user.name")
 * and arrays using bracket notation (e.g., "tags[0]").
 *
 * **Key Features**:
 * - Nested object support (dot notation)
 * - Array support (bracket notation)
 * - Multiple values for same key (converted to array)
 * - File upload handling
 * - Type-safe output
 * - **Security**: Guards against prototype pollution (rejects dangerous keys)
 *
 * @param formData - FormData instance to parse
 * @returns Plain object with nested structure
 *
 * @example
 * ```tsx
 * const formData = new FormData();
 * formData.append('name', 'John');
 * formData.append('email', 'john@example.com');
 * formData.append('user.age', '30');
 * formData.append('tags[0]', 'react');
 * formData.append('tags[1]', 'typescript');
 *
 * const data = parseFormData(formData);
 * // {
 * //   name: 'John',
 * //   email: 'john@example.com',
 * //   user: { age: '30' },
 * //   tags: ['react', 'typescript']
 * // }
 * ```
 *
 * @example
 * ```tsx
 * // With file uploads
 * const formData = new FormData();
 * formData.append('avatar', fileInput.files[0]);
 * formData.append('name', 'Jane');
 *
 * const data = parseFormData(formData);
 * // { avatar: File, name: 'Jane' }
 * ```
 */

/**
 * Set of keys that could be used for prototype pollution attacks.
 * These are always rejected when parsing FormData.
 */
const DANGEROUS_KEYS = new Set([
  '__proto__',
  'constructor',
  'prototype',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
]);

// Only allow alphanumeric keys with common separators
const SAFE_KEY_PATTERN = /^[a-zA-Z0-9_.[\]-]+$/;

/**
 * Check if a key or any of its parts is dangerous (prototype pollution risk)
 */
function isDangerousKey(key: string): boolean {
  // Check if the full key matches
  if (DANGEROUS_KEYS.has(key)) {
    return true;
  }

  // Check array notation base key
  const arrayMatch = key.match(/^(.+)\[\d+\]$/);
  if (arrayMatch?.[1] && DANGEROUS_KEYS.has(arrayMatch[1])) {
    return true;
  }

  // Check each part of dot-notation keys
  if (key.includes('.')) {
    const parts = key.split('.');
    for (const part of parts) {
      if (DANGEROUS_KEYS.has(part)) {
        return true;
      }
    }
  }

  return false;
}

function createSafeObject(): Record<string, unknown> {
  // Null-prototype object to avoid prototype pollution and inherited props
  return Object.create(null) as Record<string, unknown>;
}

function isSafeKey(key: string): boolean {
  return SAFE_KEY_PATTERN.test(key) && !DANGEROUS_KEYS.has(key);
}

function getProperty<T = unknown>(obj: Record<string, unknown>, key: string): T | undefined {
  if (!isSafeKey(key)) {
    return undefined;
  }
  return Reflect.get(obj, key) as T | undefined;
}

function setProperty(obj: Record<string, unknown>, key: string, value: unknown): void {
  if (!isSafeKey(key)) {
    return;
  }
  Reflect.set(obj, key, value);
}

export function parseFormData(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = createSafeObject();

  formData.forEach((value, key) => {
    if (!isSafeKey(key) || isDangerousKey(key)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[parseFormData] Skipping dangerous key "${key}" (prototype pollution protection)`
        );
      }
      return;
    }

    // Handle array notation: key[index]
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      const arrayKey = arrayMatch[1];
      const index = arrayMatch[2];
      if (!arrayKey || !index || !isSafeKey(arrayKey)) {
        return;
      }

      const existing = getProperty<unknown[]>(result, arrayKey);
      const arr = Array.isArray(existing) ? existing : [];
      setProperty(result, arrayKey, arr);
      arr[Number.parseInt(index, 10)] = value;
      return;
    }

    // Handle nested object notation: key.subkey
    if (key.includes('.')) {
      const parts = key.split('.').filter((part) => part && isSafeKey(part));
      if (parts.length === 0) {
        return;
      }
      let current = result;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (typeof part !== 'string' || part.length === 0 || !isSafeKey(part)) {
          continue;
        }

        const existing = getProperty<Record<string, unknown>>(current, part);
        if (!existing || typeof existing !== 'object') {
          setProperty(current, part, createSafeObject());
        }
        current = getProperty<Record<string, unknown>>(current, part) ?? createSafeObject();
      }

      const lastPart = parts[parts.length - 1];
      if (typeof lastPart !== 'string' || lastPart.length === 0) {
        return;
      }
      if (isSafeKey(lastPart)) {
        setProperty(current, lastPart, value);
      }
      return;
    }

    // Handle multiple values for same key
    if (key in result) {
      const existing = getProperty<unknown>(result, key);
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        setProperty(result, key, [existing, value]);
      }
      return;
    }

    // Simple key-value
    setProperty(result, key, value);
  });

  return result;
}
