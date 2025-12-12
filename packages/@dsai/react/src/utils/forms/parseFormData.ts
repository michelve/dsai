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

export function parseFormData(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    // Security: Skip dangerous keys that could cause prototype pollution
    if (isDangerousKey(key)) {
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
      if (!arrayKey || !index) {
        return;
      }

      // eslint-disable-next-line security/detect-object-injection
      if (!result[arrayKey]) {
        // eslint-disable-next-line security/detect-object-injection
        result[arrayKey] = [];
      }
      // eslint-disable-next-line security/detect-object-injection
      (result[arrayKey] as unknown[])[Number.parseInt(index, 10)] = value;
      return;
    }

    // Handle nested object notation: key.subkey
    if (key.includes('.')) {
      const parts = key.split('.');
      let current = result;

      for (let i = 0; i < parts.length - 1; i++) {
        // eslint-disable-next-line security/detect-object-injection
        const part = parts[i];
        if (!part) {
          continue;
        }

        // eslint-disable-next-line security/detect-object-injection
        if (!current[part] || typeof current[part] !== 'object') {
          // eslint-disable-next-line security/detect-object-injection
          current[part] = {};
        }
        // eslint-disable-next-line security/detect-object-injection
        current = current[part] as Record<string, unknown>;
      }

      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        // eslint-disable-next-line security/detect-object-injection
        current[lastPart] = value;
      }
      return;
    }

    // Handle multiple values for same key
    if (key in result) {
      // eslint-disable-next-line security/detect-object-injection
      const existing = result[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        // eslint-disable-next-line security/detect-object-injection
        result[key] = [existing, value];
      }
      return;
    }

    // Simple key-value
    // eslint-disable-next-line security/detect-object-injection
    result[key] = value;
  });

  return result;
}
