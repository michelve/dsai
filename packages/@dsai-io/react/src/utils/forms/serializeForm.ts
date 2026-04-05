/**
 * Serializes a form data object to URL-encoded string.
 *
 * Useful for GET requests, URL query parameters, or URL hash state.
 * Handles nested objects and arrays with standard encoding.
 *
 * **Key Features**:
 * - Nested object serialization (dot notation)
 * - Array serialization (bracket notation)
 * - URL encoding
 * - Null/undefined filtering
 * - Type-safe input
 *
 * @param data - Object to serialize
 * @param options - Serialization options
 * @returns URL-encoded query string (without leading "?")
 *
 * @example
 * ```tsx
 * const data = {
 *   name: 'John Doe',
 *   age: 30,
 *   tags: ['react', 'typescript'],
 *   user: { role: 'admin' }
 * };
 *
 * const query = serializeForm(data);
 * // "name=John%20Doe&age=30&tags%5B0%5D=react&tags%5B1%5D=typescript&user.role=admin"
 * ```
 *
 * @example
 * ```tsx
 * // With array indices option
 * const data = { tags: ['a', 'b', 'c'] };
 *
 * serializeForm(data, { arrayFormat: 'brackets' });
 * // "tags[]=a&tags[]=b&tags[]=c"
 *
 * serializeForm(data, { arrayFormat: 'repeat' });
 * // "tags=a&tags=b&tags=c"
 * ```
 */
export function serializeForm(
  data: Record<string, unknown>,
  options: {
    arrayFormat?: 'indices' | 'brackets' | 'repeat';
  } = {}
): string {
  const { arrayFormat = 'indices' } = options;
  const params: string[] = [];

  function formatArrayKey(fullKey: string, index: number): string {
    if (arrayFormat === 'indices') {
      return `${fullKey}[${index}]`;
    }
    if (arrayFormat === 'brackets') {
      return `${fullKey}[]`;
    }
    return fullKey;
  }

  function serializeArray(value: unknown[], fullKey: string): void {
    for (let i = 0; i < value.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const item = value[i];
      if (item === null || item === undefined) {
        continue;
      }
      const arrayKey = formatArrayKey(fullKey, i);
      params.push(`${encodeURIComponent(arrayKey)}=${encodeURIComponent(String(item))}`);
    }
  }

  function serialize(obj: Record<string, unknown>, prefix = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        continue;
      }

      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(value)) {
        serializeArray(value, fullKey);
        continue;
      }

      if (typeof value === 'object' && !(value instanceof File)) {
        serialize(value as Record<string, unknown>, fullKey);
        continue;
      }

      params.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`);
    }
  }

  serialize(data);
  return params.join('&');
}
