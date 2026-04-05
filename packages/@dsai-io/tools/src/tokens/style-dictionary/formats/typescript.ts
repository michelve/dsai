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
/** Build nested token tree from dictionary tokens */
function buildTokenTree(tokens: SDToken[]): TokenTreeNode {
  const tokenTree: TokenTreeNode = {};
  const hasOwn = Object.prototype.hasOwnProperty;
  const unsafeKeys = new Set(['__proto__', 'constructor', 'prototype']);

  for (const token of tokens) {
    let current: TokenTreeNode = tokenTree;
    for (let i = 0; i < token.path.length - 1; i++) {
      const key = token.path[i] as string;
      if (unsafeKeys.has(key)) {continue;}
      if (!hasOwn.call(current, key) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key] as TokenTreeNode;
    }
    const lastKey = token.path[token.path.length - 1];
    if (lastKey) {
      current[lastKey] = { _isToken: true, _type: getTypeScriptType(token) };
    }
  }
  return tokenTree;
}

/** Generate string literal types grouped by category */
function generateLiteralTypes(tokens: SDToken[]): string {
  const categories: Record<string, string[]> = {};
  for (const token of tokens) {
    const category = token.path[0];
    if (category) {
      if (!categories[category]) {categories[category] = [];}
      categories[category].push(token.path.join('.'));
    }
  }

  let output = '';
  for (const category of Object.keys(categories).sort((a, b) => a.localeCompare(b))) {
    const categoryTokens = categories[category];
    if (!categoryTokens) {continue;}
    const typeName = `${capitalize(category)}TokenName`;
    output += `/**\n * All ${category} token names as string literals\n */\n`;
    output += `export type ${typeName} =\n`;
    output += categoryTokens.map((t) => `  | '${t}'`).join('\n');
    output += ';\n\n';
  }

  const allTokenNames = tokens.map((t) => t.path.join('.'));
  output += `/**\n * All token names as string literals\n */\n`;
  output += `export type TokenName =\n`;
  output += allTokenNames.map((t) => `  | '${t}'`).join('\n');
  output += ';\n\n';

  return output;
}

/** Generate flat const declarations */
function generateFlatExports(tokens: SDToken[]): string {
  let output = '/**\n * Flat token exports (camelCase names)\n */\n';
  for (const token of tokens) {
    const type = getTypeScriptType(token);
    const name = toJsIdentifier(token.path);
    output += `export declare const ${name}: ${type};\n`;
  }
  return output;
}

export const typescriptDeclarations: FormatDefinition = {
  name: 'typescript/declarations',
  format: ({ dictionary }: SDFormatArgs): string => {
    const tokenTree = buildTokenTree(dictionary.allTokens);
    const literalTypes = generateLiteralTypes(dictionary.allTokens);
    const flatExports = generateFlatExports(dictionary.allTokens);

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
