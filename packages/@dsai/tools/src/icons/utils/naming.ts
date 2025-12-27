/**
 * Icon naming utilities
 *
 * @packageDocumentation
 */

/**
 * Convert string to PascalCase component name
 *
 * @param input - Input string (e.g., file name)
 * @returns PascalCase component name
 *
 * @example
 * ```typescript
 * toComponentName('arrow-left') // 'ArrowLeft'
 * toComponentName('24px-icon') // 'Icon24px'
 * toComponentName('my_icon') // 'MyIcon'
 * toComponentName('chevron-down-small') // 'ChevronDownSmall'
 * ```
 */
export function toComponentName(input: string): string {
  // Handle numbers at start by prefixing with 'Icon'
  let processed = input;
  if (/^\d/.test(processed)) {
    processed = `icon-${processed}`;
  }

  return (
    processed
      // Split on non-alphanumeric characters
      .split(/[^a-zA-Z0-9]+/)
      // Filter empty strings
      .filter((word) => word.length > 0)
      // Capitalize each word
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      // Join into single string
      .join('')
  );
}

/**
 * Convert string to kebab-case icon name
 *
 * @param input - Input string (e.g., component name)
 * @returns kebab-case icon name
 *
 * @example
 * ```typescript
 * toIconName('ArrowLeft') // 'arrow-left'
 * toIconName('ChevronDownSmall') // 'chevron-down-small'
 * toIconName('Icon24px') // 'icon-24px'
 * ```
 */
export function toIconName(input: string): string {
  return (
    input
      // Insert hyphen before uppercase letters
      .replace(/([A-Z])/g, '-$1')
      // Insert hyphen before number sequences
      .replace(/(\d+)/g, '-$1')
      // Clean up multiple hyphens
      .replace(/-+/g, '-')
      // Remove leading hyphen
      .replace(/^-/, '')
      // Lowercase
      .toLowerCase()
  );
}

/**
 * Validate icon name
 *
 * @param name - Icon name to validate
 * @returns True if valid, false otherwise
 */
export function isValidIconName(name: string): boolean {
  // Must be non-empty
  if (!name || name.length === 0) {
    return false;
  }

  // Must be valid identifier-like (alphanumeric, hyphens, underscores)
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return false;
  }

  return true;
}

/**
 * Normalize icon name from file name
 *
 * @param fileName - File name (without extension)
 * @returns Normalized icon name
 */
export function normalizeIconName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}
