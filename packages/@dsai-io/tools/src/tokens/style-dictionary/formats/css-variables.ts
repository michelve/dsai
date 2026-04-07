/**
 * CSS Variables Format
 *
 * Generates CSS custom properties with descriptive comments.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/formats/css-variables
 */

import type { SDFormatArgs, FormatDefinition } from '../types.js';

/**
 * css/variables-with-comments format
 *
 * Generates CSS custom properties with descriptive comments.
 * Supports configurable prefix via options.
 *
 * @example
 * Output:
 * ```css
 * :root {
 *   /* Primary brand color *\/
 *   --dsai-color-primary: #007bff;
 *   --dsai-spacing-md: 1rem;
 * }
 * ```
 */
export const cssVariablesWithComments: FormatDefinition = {
  name: 'css/variables-with-comments',
  format: ({ dictionary, options }: SDFormatArgs): string => {
    const prefix = (options['prefix'] as string) ?? '--';

    const variables = dictionary.allTokens.map((token) => {
      const lines: string[] = [];

      // Add comment if present
      if (token.comment) {
        lines.push(`  /* ${token.comment} */`);
      }

      // Add description if present (DTCG $description or legacy description)
      const description = token.$description ?? token.description;
      if (description && description !== token.comment) {
        lines.push(`  /* ${description} */`);
      }

      // Get value (DTCG $value or legacy value)
      const tokenValue = token.$value ?? token.value;
      const value = typeof tokenValue === 'string' ? tokenValue : JSON.stringify(tokenValue);

      // Add variable
      lines.push(`  ${prefix}${token.name}: ${value};`);

      return lines.join('\n');
    });

    return `:root {\n${variables.join('\n')}\n}\n`;
  },
};
