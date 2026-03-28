/**
 * Import path transformer for registry files.
 * @module @dsai-io/tools/registry/transformer
 */

import type { ResolvedAliasesConfig } from '../config/types.js';

export interface TransformOptions {
  aliases: ResolvedAliasesConfig;
  tsx: boolean;
}

export function transformImports(content: string, options: TransformOptions): string {
  const { aliases } = options;
  let result = content;

  // ../../hooks/<hookName> -> @/hooks/<hookName>
  result = result.replace(
    /(from\s+['"])(?:\.\.\/)+hooks\/(\w+)(['"])/g,
    `$1${aliases.importAlias}${aliases.hooks}/$2$3`
  );

  // ../../utils/<submodule> -> @/lib/utils/<submodule>
  result = result.replace(
    /(from\s+['"])(?:\.\.\/)+utils\/(\w+(?:\/\w+)?)(['"])/g,
    `$1${aliases.importAlias}${aliases.utils}/$2$3`
  );

  // ../../utils (bare) -> @/lib/utils
  result = result.replace(
    /(from\s+['"])(?:\.\.\/)+utils(['"])/g,
    `$1${aliases.importAlias}${aliases.utils}$2`
  );

  return result;
}

export function normalizeExtensions(content: string, tsx: boolean): string {
  if (!tsx) {
    return content
      .replace(/(from\s+['"][^'"]+)\.tsx(['"])/g, '$1.jsx$2')
      .replace(/(from\s+['"][^'"]+)\.ts(['"])/g, '$1.js$2');
  }
  return content;
}
