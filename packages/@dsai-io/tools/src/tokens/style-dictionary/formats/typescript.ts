/**
 * TypeScript Declarations Format
 *
 * Generates TypeScript type declarations for design tokens.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/formats/typescript
 */

/* eslint-disable security/detect-object-injection */

import type { SDFormatArgs, FormatDefinition, SDToken } from '../types.js';

/**
 * Convert a path segment to PascalCase, handling numeric segments
 */
function toPascalCaseSegment(segment: string): string {
  const needsNumericPrefix = /^\d/.test(segment);

  // Convert to PascalCase: split by non-alphanumeric, capitalize each part
  const pascal = segment
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');

  // Prefix numeric identifiers with underscore to make them valid
  return needsNumericPrefix ? `_${pascal}` : pascal;
}

/**
 * Convert token path to valid JavaScript identifier
 */
function toJsIdentifier(path: string[]): string {
  return path.map(toPascalCaseSegment).join('');
}

/**
 * Get TypeScript type from token value
 */
function getTypeScriptType(token: SDToken): string {
  const value = token.value;
  if (typeof value === 'number') {
    return 'number';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  return 'string';
}

/**
 * Token tree node for building interfaces
 */
interface TokenTreeNode {
  _isToken?: boolean;
  _type?: string;
  [key: string]: TokenTreeNode | boolean | string | undefined;
}

/**
 * Build nested interface structure
 */
function buildTokenInterface(obj: TokenTreeNode, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let output = '{\n';

  for (const key of Object.keys(obj)) {
    // Skip internal markers
    if (key.startsWith('_')) {
      continue;
    }

    const value = obj[key];
    if (!value || typeof value !== 'object') {
      continue;
    }

    // Quote keys that need it (contain hyphens or start with numbers)
    const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

    const typedValue = value as TokenTreeNode;

    // Check if this is a leaf token (has _isToken marker)
    if (typedValue._isToken) {
      output += `${spaces}  ${quotedKey}: ${typedValue._type};\n`;
    } else {
      // Nested object
      output += `${spaces}  ${quotedKey}: ${buildTokenInterface(typedValue, indent + 1)}\n`;
    }
  }

  output += `${spaces}}`;
  return output;
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * typescript/declarations format
 *
 * Generates TypeScript declarations with:
 * - DesignTokens interface with nested structure
 * - String literal types for each token category
 * - Flat token exports with proper types
 *
 * @example
 * Output:
 * ```typescript
 * export type ColorTokenName =
 *   | 'color.primary'
 *   | 'color.secondary';
 *
 * export interface DesignTokens {
 *   color: {
 *     primary: string;
 *     secondary: string;
 *   };
 * }
 *
 * export declare const colorPrimary: string;
 * export declare const tokens: DesignTokens;
 * ```
 */
export const typescriptDeclarations: FormatDefinition = {
  name: 'typescript/declarations',
  format: ({ dictionary }: SDFormatArgs): string => {
    // Build nested structure with type markers
    const tokenTree: TokenTreeNode = {};

    const hasOwn = Object.prototype.hasOwnProperty;

    for (const token of dictionary.allTokens) {
      let current: TokenTreeNode = tokenTree;
      for (let i = 0; i < token.path.length - 1; i++) {
        const key = token.path[i] as string;
        // Guard against prototype pollution
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          continue;
        }
        if (!hasOwn.call(current, key) || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key] as TokenTreeNode;
      }

      const lastKey = token.path[token.path.length - 1];
      if (lastKey) {
        current[lastKey] = {
          _isToken: true,
          _type: getTypeScriptType(token),
        };
      }
    }

    // Group tokens by category for string literal types
    const categories: Record<string, string[]> = {};
    for (const token of dictionary.allTokens) {
      const category = token.path[0];
      if (category) {
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(token.path.join('.'));
      }
    }

    // Generate category types
    let literalTypes = '';
    for (const category of Object.keys(categories).sort((a, b) => a.localeCompare(b))) {
      const categoryTokens = categories[category];
      if (!categoryTokens) {
        continue;
      }
      const typeName = `${capitalize(category)}TokenName`;
      literalTypes += `/**\n * All ${category} token names as string literals\n */\n`;
      literalTypes += `export type ${typeName} =\n`;
      literalTypes += categoryTokens.map((t) => `  | '${t}'`).join('\n');
      literalTypes += ';\n\n';
    }

    // Generate all token names type
    const allTokenNames = dictionary.allTokens.map((t) => t.path.join('.'));
    literalTypes += `/**\n * All token names as string literals\n */\n`;
    literalTypes += `export type TokenName =\n`;
    literalTypes += allTokenNames.map((t) => `  | '${t}'`).join('\n');
    literalTypes += ';\n\n';

    // Generate flat token exports
    let flatExports = '/**\n * Flat token exports (camelCase names)\n */\n';
    for (const token of dictionary.allTokens) {
      const type = getTypeScriptType(token);
      const name = toJsIdentifier(token.path); // Generate valid identifier from path
      flatExports += `export declare const ${name}: ${type};\n`;
    }

    return `/**
 * Design Tokens - TypeScript Declarations
 * Auto-generated by @dsai-io/tools
 * DO NOT EDIT DIRECTLY
 *
 * @packageDocumentation
 */

// ============================================================================
// String Literal Types (for type-safe token access)
// ============================================================================

${literalTypes}
// ============================================================================
// Nested Token Interface
// ============================================================================

/**
 * Design tokens organized by category
 */
export interface DesignTokens ${buildTokenInterface(tokenTree)}

// ============================================================================
// Flat Token Exports
// ============================================================================

${flatExports}
// ============================================================================
// Default Export
// ============================================================================

export declare const tokens: DesignTokens;
export default tokens;
`;
  },
};
