/**
 * CSS Dark Mode Variables Format
 *
 * Generates CSS custom properties scoped to [data-bs-theme="dark"]
 * following Bootstrap 5.3+ color mode pattern.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/formats/css-dark-mode
 * @see https://getbootstrap.com/docs/5.3/customize/color-modes/
 */

import type { SDFormatArgs, FormatDefinition } from '../types.js';

/**
 * css/variables-dark-mode format
 *
 * Generates CSS custom properties scoped to [data-bs-theme="dark"]
 * for Bootstrap-compatible dark mode theming.
 *
 * @example
 * Output:
 * ```css
 * [data-bs-theme="dark"] {
 *   --dsai-body-bg: #212529;
 *   --dsai-body-color: #dee2e6;
 * }
 * ```
 */
export const cssDarkModeVariables: FormatDefinition = {
  name: 'css/variables-dark-mode',
  format: ({ dictionary, options }: SDFormatArgs): string => {
    const prefix = (options['prefix'] as string) ?? '--';
    const selector = (options['selector'] as string) ?? '[data-bs-theme="dark"]';

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
      const tokenValue = token.$value !== undefined ? token.$value : token.value;
      const value = typeof tokenValue === 'string' ? tokenValue : JSON.stringify(tokenValue);

      // Add variable
      lines.push(`  ${prefix}${token.name}: ${value};`);

      return lines.join('\n');
    });

    return `${selector} {\n${variables.join('\n')}\n}\n`;
  },
};
