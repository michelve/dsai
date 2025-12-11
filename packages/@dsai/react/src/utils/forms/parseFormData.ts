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
export function parseFormData(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  formData.forEach((value, key) => {
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
