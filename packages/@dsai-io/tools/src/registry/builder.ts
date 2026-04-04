/**
 * Registry builder — scans @dsai-io/react source, analyzes imports,
 * inlines file content, and writes registry JSON files.
 * @module @dsai-io/tools/registry/builder
 */

/* eslint-disable security/detect-non-literal-fs-filename, no-console, security/detect-object-injection, security/detect-unsafe-regex */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

import {
  componentMap,
  directoryToRegistryName,
  hookDirectoryToRegistryName,
  hookMap,
  utilMap,
} from './component-map.js';

import type { RegistryFile, RegistryIndex, RegistryIndexEntry, RegistryItem, RegistryItemType } from './types.js';

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

export interface BuildRegistryOptions {
  /** Absolute path to the @dsai-io/react src directory. */
  reactSrcDir: string;
  /** Absolute path to the output directory for registry JSON files. */
  outputDir: string;
  /** Enable verbose logging. */
  verbose?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EXCLUDE_PATTERNS: RegExp[] = [
  /\.test\.(tsx?|jsx?)$/,
  /\.spec\.(tsx?|jsx?)$/,
  /\.stories\.(tsx?|jsx?)$/,
  /\.figma\.(tsx?|jsx?)$/,
  /\.a11y\.test\./,
  /\.security\.test\./,
  /\.integration\.test\./,
  /README\.md$/,
];

const REACT_BUILTINS = new Set(['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client']);

/**
 * Maps a util import sub-path (the part after `../../utils/`) to the
 * registry name used in `utilMap`.
 */
const UTIL_SUBPATH_TO_REGISTRY: Record<string, string> = {
  index: 'cn',
  keyboard: 'keyboard',
  dom: 'merge-refs',
  'dom/mergeRefs': 'merge-refs',
  browser: 'browser',
  validation: 'validation',
  string: 'string',
  misc: 'misc',
  a11y: 'a11y',
  types: 'types',
  async: 'async',
  collections: 'collections',
  color: 'color',
  date: 'date',
  dx: 'dx',
  forms: 'forms',
  layout: 'layout',
  motion: 'motion',
  number: 'number',
  object: 'object',
  platform: 'platform',
  responsive: 'responsive',
  safety: 'safety',
  telemetry: 'telemetry',
  timing: 'timing',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shouldIncludeFile(filePath: string): boolean {
  const ext = extname(filePath);
  if (!['.ts', '.tsx', '.css'].includes(ext)) {return false;}
  return !EXCLUDE_PATTERNS.some((pattern) => pattern.test(filePath));
}

function readSourceFiles(dirPath: string): { path: string; content: string }[] {
  if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {return [];}

  const results: { path: string; content: string }[] = [];

  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      // Only go one level deep for sub-directories within a component
      for (const sub of readdirSync(fullPath, { withFileTypes: true })) {
        if (sub.isFile()) {
          const subPath = join(fullPath, sub.name);
          if (shouldIncludeFile(subPath)) {
            results.push({ path: relative(dirPath, subPath), content: readFileSync(subPath, 'utf-8') });
          }
        }
      }
    } else if (entry.isFile() && shouldIncludeFile(fullPath)) {
      results.push({ path: entry.name, content: readFileSync(fullPath, 'utf-8') });
    }
  }

  return results;
}

/** Extract the cn function from the utils index as a standalone file. */
function extractCnSource(utilsIndexPath: string): string {
  const content = readFileSync(utilsIndexPath, 'utf-8');
  const cnPattern = /(\/\*\*[\s\S]*?\*\/\s*)?export function cn\b[\s\S]*?\n\}/;
  const match = cnPattern.exec(content);
  return match
    ? match[0]
    : 'export function cn(...classes: (string | boolean | undefined | null)[]): string {\n  return classes.filter(Boolean).join(\' \');\n}';
}

// ---------------------------------------------------------------------------
// Import analysis
// ---------------------------------------------------------------------------

interface AnalyzedDeps {
  registryDeps: Set<string>;
  npmDeps: Set<string>;
}

function analyzeImports(files: { content: string }[], knownNpmDeps: string[]): AnalyzedDeps {
  const registryDeps = new Set<string>();
  const npmDeps = new Set<string>(knownNpmDeps);

  const importPattern = /(?:import|export)\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;

  for (const file of files) {
    let m: RegExpExecArray | null;
    importPattern.lastIndex = 0;
    while ((m = importPattern.exec(file.content)) !== null) {
      const specifier = m[1] ?? '';

      // Shared types imports: ../../types or ../../types/<subpath>
      // Must be exactly TWO levels up (../../types) to target the shared type system.
      // Single level (../types) is a component-local types file (e.g., Icon/components/ -> Icon/types.ts)
      const typesPattern = /^\.\.\/\.\.\/types(?:\/.*)?$/;
      if (typesPattern.test(specifier)) {
        registryDeps.add('dsai-types');
        continue;
      }

      // Hook imports: ../../hooks/<hookName> or ../hooks/<hookName>
      const hookPattern = /\.\.\/(?:\.\.\/)?hooks\/(\w+)/;
      const hookMatch = hookPattern.exec(specifier);
      if (hookMatch && hookMatch[1]) {
        const regName = hookDirectoryToRegistryName[hookMatch[1]];
        if (regName) {registryDeps.add(regName);}
        continue;
      }

      // Util imports: ../../utils or ../../utils/<subpath>
      const utilPattern = /\.\.\/(?:\.\.\/)?utils(?:\/(.+))?$/;
      const utilMatch = utilPattern.exec(specifier);
      if (utilMatch) {
        const subpath = utilMatch[1] ?? 'index';
        const regName = UTIL_SUBPATH_TO_REGISTRY[subpath];
        if (regName) {registryDeps.add(regName);}
        continue;
      }

      // Sibling util directory imports: ../types/shared, ../keyboard/index, etc.
      // Detects when one util imports from another sibling util directory.
      // Only matches lowercase directory names (utils are lowercase, components are PascalCase)
      const siblingUtilPattern = /^\.\.\/([a-z][\w-]*)(?:\/.*)?$/;
      const siblingUtilMatch = siblingUtilPattern.exec(specifier);
      if (siblingUtilMatch && siblingUtilMatch[1]) {
        const siblingDir = siblingUtilMatch[1];
        const regName = UTIL_SUBPATH_TO_REGISTRY[siblingDir];
        if (regName) {
          registryDeps.add(regName);
          continue;
        }
      }

      // Component cross-imports: ../../components/<Dir>, ../<PascalCaseDir>, or ../<PascalCaseDir>/<file>
      // Matches: ../Icon, ../Spinner, ../Card/Card.types, ../../components/Modal
      const compPattern = /^\.\.\/(\.\.\/)?(?:components\/)?([A-Z]\w+)(?:\/.*)?$/;
      const compMatch = compPattern.exec(specifier);
      if (compMatch && compMatch[2]) {
        const compDir = compMatch[2];
        const regName = directoryToRegistryName[compDir];
        if (regName) {registryDeps.add(regName);}
        continue;
      }

      // External npm packages (not relative, not react builtins)
      if (!specifier.startsWith('.') && !specifier.startsWith('/')) {
        // Get the package name (handle scoped packages)
        const parts = specifier.split('/');
        const pkgName = specifier.startsWith('@') && parts.length >= 2
          ? `${parts[0]}/${parts[1]}`
          : (parts[0] ?? specifier);

        if (pkgName && !REACT_BUILTINS.has(pkgName) && !pkgName.startsWith('@dsai-io/')) {
          npmDeps.add(pkgName);
        }
      }
    }
  }

  return { registryDeps, npmDeps };
}

// ---------------------------------------------------------------------------
// Item builders
// ---------------------------------------------------------------------------

function buildComponentItem(
  name: string,
  dirPath: string,
  log: (msg: string) => void,
): RegistryItem | null {
  const meta = componentMap[name];
  if (!meta) {
    log(`  [WARN] No metadata for component "${name}", skipping`);
    return null;
  }

  const sourceFiles = readSourceFiles(dirPath);
  if (sourceFiles.length === 0) {
    log(`  [WARN] No source files found in ${dirPath}`);
    return null;
  }

  const { registryDeps, npmDeps } = analyzeImports(sourceFiles, meta.npmDependencies ?? []);

  const files: RegistryFile[] = sourceFiles.map((f) => ({
    path: f.path,
    type: (extname(f.path) === '.css' ? 'registry:style' : meta.type) as RegistryItemType,
    content: f.content,
  }));

  return {
    name,
    type: meta.type,
    title: meta.title,
    description: meta.description,
    dependencies: [...npmDeps].sort((a, b) => a.localeCompare(b)),
    devDependencies: [],
    registryDependencies: [...registryDeps].sort((a, b) => a.localeCompare(b)),
    files,
    categories: meta.categories,
  };
}

function buildHookItem(
  name: string,
  dirPath: string,
  log: (msg: string) => void,
): RegistryItem | null {
  const meta = hookMap[name];
  if (!meta) {
    log(`  [WARN] No metadata for hook "${name}", skipping`);
    return null;
  }

  const sourceFiles = readSourceFiles(dirPath);
  if (sourceFiles.length === 0) {
    log(`  [WARN] No source files found in ${dirPath}`);
    return null;
  }

  const { registryDeps, npmDeps } = analyzeImports(sourceFiles, meta.npmDependencies ?? []);

  const files: RegistryFile[] = sourceFiles.map((f) => ({
    path: f.path,
    type: (extname(f.path) === '.css' ? 'registry:style' : meta.type) as RegistryItemType,
    content: f.content,
  }));

  return {
    name,
    type: meta.type,
    title: meta.title,
    description: meta.description,
    dependencies: [...npmDeps].sort((a, b) => a.localeCompare(b)),
    devDependencies: [],
    registryDependencies: [...registryDeps].sort((a, b) => a.localeCompare(b)),
    files,
    categories: meta.categories,
  };
}

function buildUtilItem(
  name: string,
  reactSrcDir: string,
  log: (msg: string) => void,
): RegistryItem | null {
  const meta = utilMap[name];
  if (!meta) {
    log(`  [WARN] No metadata for util "${name}", skipping`);
    return null;
  }

  let files: RegistryFile[];
  let registryDeps = new Set<string>();
  let npmDeps = new Set<string>();

  if (name === 'cn') {
    // Special case: extract cn from utils/index.ts
    const indexPath = join(reactSrcDir, 'utils', 'index.ts');
    const cnSource = extractCnSource(indexPath);
    files = [{ path: 'cn.ts', type: 'registry:util', content: cnSource }];
  } else if (name === 'merge-refs') {
    // merge-refs maps to utils/dom
    const dirPath = join(reactSrcDir, 'utils', 'dom');
    const sourceFiles = readSourceFiles(dirPath);
    const analyzed = analyzeImports(sourceFiles, []);
    registryDeps = analyzed.registryDeps;
    npmDeps = analyzed.npmDeps;
    files = sourceFiles.map((f) => ({
      path: `dom/${f.path}`,
      type: (extname(f.path) === '.css' ? 'registry:style' : 'registry:util') as RegistryItemType,
      content: f.content,
    }));
  } else {
    // Standard util directory
    const dirPath = join(reactSrcDir, 'utils', name);
    if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
      log(`  [WARN] Util directory not found: ${dirPath}`);
      return null;
    }
    const sourceFiles = readSourceFiles(dirPath);
    if (sourceFiles.length === 0) {
      log(`  [WARN] No source files found in ${dirPath}`);
      return null;
    }
    const analyzed = analyzeImports(sourceFiles, []);
    registryDeps = analyzed.registryDeps;
    npmDeps = analyzed.npmDeps;
    files = sourceFiles.map((f) => ({
      path: `${name}/${f.path}`,
      type: (extname(f.path) === '.css' ? 'registry:style' : 'registry:util') as RegistryItemType,
      content: f.content,
    }));
  }

  return {
    name,
    type: meta.type,
    title: meta.title,
    description: meta.description,
    dependencies: [...npmDeps].sort((a, b) => a.localeCompare(b)),
    devDependencies: [],
    registryDependencies: [...registryDeps].sort((a, b) => a.localeCompare(b)),
    files,
    categories: meta.categories,
  };
}

function buildTypesItem(
  reactSrcDir: string,
  log: (msg: string) => void,
): RegistryItem | null {
  const typesDir = join(reactSrcDir, 'types');
  const sourceFiles = readSourceFiles(typesDir);
  if (sourceFiles.length === 0) {
    log('  [WARN] No type files found');
    return null;
  }

  // Strip runtime re-exports that don't belong in a types-only registry item.
  // 1. responsive.ts re-exports runtime helpers from ../utils/responsive — remove those
  // 2. index.ts re-exports those same runtime helpers from ./responsive — remove those too
  const files: RegistryFile[] = sourceFiles.map((f) => {
    let content = f.content;
    // Remove re-exports of runtime helpers from utils (e.g., in responsive.ts)
    content = content.replaceAll(/export \{[^}]*\} from ['"]\.\.\/utils\/[^'"]+['"];?\n?/g, '');
    // Remove non-type re-exports of runtime helpers from local modules (e.g., in index.ts)
    // Matches: export { getResponsiveValue, isResponsiveValue } from './responsive';
    // Does NOT match: export type { ... } from './responsive';
    // The negative lookahead (?!type) ensures we only strip value exports, not type exports
    content = content.replaceAll(/export\s+(?!type)\{[^}]*\}\s+from\s+['"]\.\/[^'"]+['"];?\n?/g, '');
    // Remove @deprecated JSDoc blocks that precede the removed exports
    content = content.replaceAll(/\/\*\*\s*\n\s*\*\s*@deprecated[^*]*\*\/\s*\n/g, '');
    return {
      path: `types/${f.path}`,
      type: 'registry:type' as RegistryItemType,
      content,
    };
  });

  return {
    name: 'dsai-types',
    type: 'registry:type',
    title: 'Shared Types',
    description: 'Shared type definitions (SafeHTMLAttributes, ComponentSize, PolymorphicComponentProps, etc.)',
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    files,
    categories: ['types'],
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function buildRegistry(options: BuildRegistryOptions): RegistryIndex {
  const { reactSrcDir, outputDir, verbose = false } = options;
  const log = verbose ? (msg: string) => console.log(msg) : (_msg: string) => {};

  const componentsDir = join(reactSrcDir, 'components');
  const hooksDir = join(reactSrcDir, 'hooks');

  const allItems: RegistryItem[] = [];

  // --- Components ---
  log('[registry] Scanning components...');
  if (existsSync(componentsDir)) {
    for (const entry of readdirSync(componentsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) {continue;}
      const dirName = entry.name;
      const registryName = directoryToRegistryName[dirName];
      if (!registryName) {
        log(`  [SKIP] Unknown component directory: ${dirName}`);
        continue;
      }
      log(`  Building ${registryName}...`);
      const item = buildComponentItem(registryName, join(componentsDir, dirName), log);
      if (item) {allItems.push(item);}
    }
  }

  // --- Hooks ---
  log('[registry] Scanning hooks...');
  if (existsSync(hooksDir)) {
    for (const entry of readdirSync(hooksDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) {continue;}
      const dirName = entry.name;
      const registryName = hookDirectoryToRegistryName[dirName];
      if (!registryName) {
        log(`  [SKIP] Unknown hook directory: ${dirName}`);
        continue;
      }
      log(`  Building ${registryName}...`);
      const item = buildHookItem(registryName, join(hooksDir, dirName), log);
      if (item) {allItems.push(item);}
    }
  }

  // --- Utils ---
  log('[registry] Scanning utils...');
  for (const name of Object.keys(utilMap)) {
    log(`  Building ${name}...`);
    const item = buildUtilItem(name, reactSrcDir, log);
    if (item) {allItems.push(item);}
  }

  // --- Shared Types ---
  log('[registry] Building shared types...');
  const typesItem = buildTypesItem(reactSrcDir, log);
  if (typesItem) {
    allItems.push(typesItem);
    log(`  Built dsai-types (${typesItem.files.length} files)`);
  }

  // --- Write output ---
  log(`[registry] Writing ${allItems.length} items to ${outputDir}...`);

  // Ensure output directories exist
  for (const sub of ['components', 'hooks', 'utils', 'types']) {
    const dir = join(outputDir, sub);
    if (!existsSync(dir)) {mkdirSync(dir, { recursive: true });}
  }

  const typeToSubdir: Record<string, string> = {
    'registry:ui': 'components',
    'registry:component': 'components',
    'registry:hook': 'hooks',
    'registry:util': 'utils',
    'registry:lib': 'utils',
    'registry:type': 'types',
  };

  for (const item of allItems) {
    const subdir = typeToSubdir[item.type] ?? 'utils';
    const filePath = join(outputDir, subdir, `${item.name}.json`);
    writeFileSync(filePath, JSON.stringify(item, null, 2) + '\n', 'utf-8');
    log(`  Wrote ${relative(outputDir, filePath)}`);
  }

  // --- Build index ---
  const indexEntries: RegistryIndexEntry[] = allItems.map((item) => ({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    categories: item.categories,
  }));

  const registryIndex: RegistryIndex = {
    version: '0.1.0',
    count: indexEntries.length,
    items: indexEntries,
  };

  writeFileSync(join(outputDir, 'index.json'), JSON.stringify(registryIndex, null, 2) + '\n', 'utf-8');
  log(`[registry] Wrote index.json (${registryIndex.count} items)`);

  return registryIndex;
}
