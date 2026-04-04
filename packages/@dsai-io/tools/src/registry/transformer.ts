/**
 * Import path transformer for registry files.
 * @module @dsai-io/tools/registry/transformer
 */

/* eslint-disable security/detect-unsafe-regex */

import type { ResolvedAliasesConfig } from '../config/types.js';

export interface TransformOptions {
  aliases: ResolvedAliasesConfig;
  tsx: boolean;
}

export function transformImports(content: string, options: TransformOptions): string {
  const { aliases } = options;
  let result = content;

  // ../../types or ../../types/<subpath> -> @/components/types
  // Requires exactly ../../ (two levels up) to match only the shared type system.
  // Single-level ../types is a component-local file and must NOT be rewritten.
  result = result.replace(
    /(from\s+['"])\.\.\/\.\.\/types(?:\/([^'"]+))?(['"])/g,
    (_match, prefix, subpath, suffix) => {
      if (subpath) {
        return `${prefix}${aliases.importAlias}${aliases.components}/types/${subpath}${suffix}`;
      }
      return `${prefix}${aliases.importAlias}${aliases.components}/types${suffix}`;
    }
  );

  // ../../hooks/<hookName> -> @/hooks/<hookName>
  // Requires ../../ to avoid matching component-local ../hooks imports
  result = result.replace(
    /(from\s+['"])\.\.\/\.\.\/hooks\/(\w+)(['"])/g,
    `$1${aliases.importAlias}${aliases.hooks}/$2$3`
  );

  // ../../utils/<submodule> -> @/lib/utils/<submodule>
  result = result.replace(
    /(from\s+['"])\.\.\/\.\.\/utils\/(\w+(?:\/\w+)?)(['"])/g,
    `$1${aliases.importAlias}${aliases.utils}/$2$3`
  );

  // ../../utils (bare) -> @/lib/utils
  result = result.replace(
    /(from\s+['"])\.\.\/\.\.\/utils(['"])/g,
    `$1${aliases.importAlias}${aliases.utils}$2`
  );

  // ../<PascalCaseDir> or ../<PascalCaseDir>/<file> -> @/components/ui/<dir>/<file>
  // Handles cross-component imports like ../Spinner, ../Icon, ../Card/Card.types
  // Placed AFTER the ../../ rules so those match first (more specific wins)
  result = result.replace(
    /(from\s+['"])\.\.\/(([A-Z]\w+)(\/[^'"]+)?)(['"])/g,
    (_match, prefix, _fullPath, dirName, subPath, suffix) => {
      const kebab = dirName.replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      if (subPath) {
        return `${prefix}${aliases.importAlias}${aliases.ui}/${kebab}${subPath}${suffix}`;
      }
      return `${prefix}${aliases.importAlias}${aliases.ui}/${kebab}${suffix}`;
    }
  );

  return result;
}

export function normalizeExtensions(content: string, tsx: boolean): string {
  if (!tsx) {
    return content
      .replaceAll(/(from\s+['"][^'"]+)\.tsx(['"])/g, '$1.jsx$2')
      .replaceAll(/(from\s+['"][^'"]+)\.ts(['"])/g, '$1.js$2');
  }
  return content;
}
