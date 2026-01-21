/**
 * JavaScript Format
 *
 * Custom JavaScript ES6 format that uses the transformed token.name
 * to ensure valid JavaScript identifiers.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/formats/javascript
 */

import type { FormatDefinition } from '../types.js';

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
 * JavaScript ES6 format with valid identifiers
 *
 * Manually applies the name transformation to ensure valid JS variable names.
 */
export const javascriptEsm: FormatDefinition = {
  name: 'javascript/esm-safe',
  format: ({ dictionary, file, options }) => {
    const tokens = dictionary.allTokens;
    // Check if tokens are in DTCG format (auto-detected by Style Dictionary)
    const usesDtcg = options?.['usesDtcg'] ?? false;

    let output = `/**\n * ${file.destination}\n * Design Tokens - Generated\n * DO NOT EDIT\n */\n\n`;

    for (const token of tokens) {
      // Use the transformed name or generate it from path
      const name = toJsIdentifier(token.path);

      // For DTCG tokens, use $value; for regular tokens, use value
      const tokenValue = usesDtcg ? token.$value : token.value;
      const value = JSON.stringify(tokenValue);

      // Handle DTCG $description or regular description/comment
      const comment = token.comment || token.$description || token.description || '';

      if (comment) {
        output += `// ${comment}\n`;
      }
      output += `export const ${name} = ${value};\n`;
    }

    return output;
  },
};
