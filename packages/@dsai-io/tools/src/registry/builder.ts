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

/** File encoding for all read/write operations */
const FILE_ENCODING = 'utf-8' as const;

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

/** Registry item type for CSS style files */
const REGISTRY_STYLE: RegistryItemType = 'registry:style';

/** Registry item type for utility files */
const REGISTRY_UTIL: RegistryItemType = 'registry:util';

/** Registry item type for type-only files */
const TYPE_TYPE: RegistryItemType = 'registry:type';

/** Maps registry item type to output subdirectory */
const TYPE_TO_SUBDIR: Record<string, string> = {
  'registry:ui': 'components',
  'registry:component': 'components',
  'registry:hook': 'hooks',
  'registry:util': 'utils',
  'registry:lib': 'utils',
  'registry:type': 'types',
  'registry:style': 'components',
};

/** Registry name for the merge-refs utility */
const MERGE_REFS = 'merge-refs';

/**
 * Maps a util import sub-path (the part after `../../utils/`) to the
 * registry name used in `utilMap`.
 */
const UTIL_SUBPATH_TO_REGISTRY: Record<string, string> = {
  index: 'cn',
  keyboard: 'keyboard',
  dom: MERGE_REFS,
  'dom/mergeRefs': MERGE_REFS,
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

/** Read includable files from a single sub-directory (one level deep) */
function readSubdirectoryFiles(
  subDirPath: string,
  baseDirPath: string,
): { path: string; content: string }[] {
  const results: { path: string; content: string }[] = [];
  for (const sub of readdirSync(subDirPath, { withFileTypes: true })) {
    if (!sub.isFile()) { continue; }
    const subPath = join(subDirPath, sub.name);
    if (shouldIncludeFile(subPath)) {
      results.push({ path: relative(baseDirPath, subPath), content: readFileSync(subPath, FILE_ENCODING) });
    }
  }
  return results;
}

function readSourceFiles(dirPath: string): { path: string; content: string }[] {
  if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) { return []; }

  const results: { path: string; content: string }[] = [];

  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...readSubdirectoryFiles(fullPath, dirPath));
    } else if (entry.isFile() && shouldIncludeFile(fullPath)) {
      results.push({ path: entry.name, content: readFileSync(fullPath, FILE_ENCODING) });
    }
  }

  return results;
}

/** Extract the cn function from the utils index as a standalone file. */
function extractCnSource(utilsIndexPath: string): string {
  const content = readFileSync(utilsIndexPath, FILE_ENCODING);
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

/** Try to classify specifier as a shared types import */
function tryClassifyTypesImport(specifier: string, registryDeps: Set<string>): boolean {
  if (/^\.\.\/\.\.\/types(?:\/.*)?$/.test(specifier)) {
    registryDeps.add('dsai-types');
    return true;
  }
  return false;
}

/** Try to classify specifier as a hook import */
function tryClassifyHookImport(specifier: string, registryDeps: Set<string>): boolean {
  const hookMatch = /\.\.\/(?:\.\.\/)?hooks\/(\w+)/.exec(specifier);
  if (hookMatch?.[1]) {
    const regName = hookDirectoryToRegistryName[hookMatch[1]];
    if (regName) { registryDeps.add(regName); }
    return true;
  }
  return false;
}

/** Try to classify specifier as a util import */
function tryClassifyUtilImport(specifier: string, registryDeps: Set<string>): boolean {
  const utilMatch = /\.\.\/(?:\.\.\/)?utils(?:\/(.+))?$/.exec(specifier);
  if (utilMatch) {
    const regName = UTIL_SUBPATH_TO_REGISTRY[utilMatch[1] ?? 'index'];
    if (regName) { registryDeps.add(regName); }
    return true;
  }
  return false;
}

/** Try to classify specifier as a sibling util directory import */
function tryClassifySiblingUtilImport(specifier: string, registryDeps: Set<string>): boolean {
  const siblingMatch = /^\.\.\/([a-z][\w-]*)(?:\/.*)?$/.exec(specifier);
  if (siblingMatch?.[1]) {
    const regName = UTIL_SUBPATH_TO_REGISTRY[siblingMatch[1]];
    if (regName) { registryDeps.add(regName); return true; }
  }
  return false;
}

/** Try to classify specifier as a component cross-import */
function tryClassifyComponentImport(specifier: string, registryDeps: Set<string>): boolean {
  const compMatch = /^\.\.\/(\.\.\/)?(?:components\/)?([A-Z]\w+)(?:\/.*)?$/.exec(specifier);
  if (compMatch?.[2]) {
    const regName = directoryToRegistryName[compMatch[2]];
    if (regName) { registryDeps.add(regName); }
    return true;
  }
  return false;
}

/** Try to classify specifier as an external npm package */
function tryClassifyNpmImport(specifier: string, npmDeps: Set<string>): void {
  if (specifier.startsWith('.') || specifier.startsWith('/')) { return; }

  const parts = specifier.split('/');
  const pkgName = specifier.startsWith('@') && parts.length >= 2
    ? `${parts[0]}/${parts[1]}`
    : (parts[0] ?? specifier);

  if (pkgName && !REACT_BUILTINS.has(pkgName) && !pkgName.startsWith('@dsai-io/')) {
    npmDeps.add(pkgName);
  }
}

/** Classify a single import specifier and add to the appropriate dep set */
function classifyImport(
  specifier: string,
  registryDeps: Set<string>,
  npmDeps: Set<string>,
): void {
  if (tryClassifyTypesImport(specifier, registryDeps)) { return; }
  if (tryClassifyHookImport(specifier, registryDeps)) { return; }
  if (tryClassifyUtilImport(specifier, registryDeps)) { return; }
  if (tryClassifySiblingUtilImport(specifier, registryDeps)) { return; }
  if (tryClassifyComponentImport(specifier, registryDeps)) { return; }
  tryClassifyNpmImport(specifier, npmDeps);
}

function analyzeImports(files: { content: string }[], knownNpmDeps: string[]): AnalyzedDeps {
  const registryDeps = new Set<string>();
  const npmDeps = new Set<string>(knownNpmDeps);

  const importPattern = /(?:import|export)\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;

  for (const file of files) {
    let m: RegExpExecArray | null;
    importPattern.lastIndex = 0;
    while ((m = importPattern.exec(file.content)) !== null) {
      classifyImport(m[1] ?? '', registryDeps, npmDeps);
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
    type: (extname(f.path) === '.css' ? REGISTRY_STYLE : meta.type) as RegistryItemType,
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
    type: (extname(f.path) === '.css' ? REGISTRY_STYLE : meta.type) as RegistryItemType,
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
    files = [{ path: 'cn.ts', type: REGISTRY_UTIL, content: cnSource }];
  } else if (name === MERGE_REFS) {
    // merge-refs maps to utils/dom
    const dirPath = join(reactSrcDir, 'utils', 'dom');
    const sourceFiles = readSourceFiles(dirPath);
    const analyzed = analyzeImports(sourceFiles, []);
    registryDeps = analyzed.registryDeps;
    npmDeps = analyzed.npmDeps;
    files = sourceFiles.map((f) => ({
      path: `dom/${f.path}`,
      type: (extname(f.path) === '.css' ? REGISTRY_STYLE : REGISTRY_UTIL) as RegistryItemType,
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
      type: (extname(f.path) === '.css' ? REGISTRY_STYLE : REGISTRY_UTIL) as RegistryItemType,
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
      type: TYPE_TYPE,
      content,
    };
  });

  return {
    name: 'dsai-types',
    type: TYPE_TYPE,
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

/** Scan a directory for items using a name-lookup map and a builder function */
function scanDirectoryItems(
  dir: string,
  nameMap: Record<string, string>,
  builder: (name: string, dirPath: string, log: (msg: string) => void) => RegistryItem | null,
  log: (msg: string) => void,
): RegistryItem[] {
  const items: RegistryItem[] = [];
  if (!existsSync(dir)) { return items; }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) { continue; }
    const registryName = nameMap[entry.name];
    if (!registryName) {
      log(`  [SKIP] Unknown directory: ${entry.name}`);
      continue;
    }
    log(`  Building ${registryName}...`);
    const item = builder(registryName, join(dir, entry.name), log);
    if (item) { items.push(item); }
  }
  return items;
}

/** Write registry items to disk and return the index */
function writeRegistryOutput(
  allItems: RegistryItem[],
  outputDir: string,
  log: (msg: string) => void,
): RegistryIndex {
  log(`[registry] Writing ${allItems.length} items to ${outputDir}...`);

  for (const sub of ['components', 'hooks', 'utils', 'types']) {
    const dir = join(outputDir, sub);
    if (!existsSync(dir)) { mkdirSync(dir, { recursive: true }); }
  }

  for (const item of allItems) {
    const subdir = TYPE_TO_SUBDIR[item.type] ?? 'utils';
    const filePath = join(outputDir, subdir, `${item.name}.json`);
    writeFileSync(filePath, JSON.stringify(item, null, 2) + '\n', FILE_ENCODING);
    log(`  Wrote ${relative(outputDir, filePath)}`);
  }

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

  writeFileSync(join(outputDir, 'index.json'), JSON.stringify(registryIndex, null, 2) + '\n', FILE_ENCODING);
  log(`[registry] Wrote index.json (${registryIndex.count} items)`);

  return registryIndex;
}

export function buildRegistry(options: BuildRegistryOptions): RegistryIndex {
  const { reactSrcDir, outputDir, verbose = false } = options;
  const log = verbose ? (msg: string) => console.log(msg) : (_msg: string) => {};

  const allItems: RegistryItem[] = [];

  // --- Components ---
  log('[registry] Scanning components...');
  allItems.push(
    ...scanDirectoryItems(join(reactSrcDir, 'components'), directoryToRegistryName, buildComponentItem, log),
  );

  // --- Hooks ---
  log('[registry] Scanning hooks...');
  allItems.push(
    ...scanDirectoryItems(join(reactSrcDir, 'hooks'), hookDirectoryToRegistryName, buildHookItem, log),
  );

  // --- Utils ---
  log('[registry] Scanning utils...');
  for (const name of Object.keys(utilMap)) {
    log(`  Building ${name}...`);
    const item = buildUtilItem(name, reactSrcDir, log);
    if (item) { allItems.push(item); }
  }

  // --- Shared Types ---
  log('[registry] Building shared types...');
  const typesItem = buildTypesItem(reactSrcDir, log);
  if (typesItem) {
    allItems.push(typesItem);
    log(`  Built dsai-types (${typesItem.files.length} files)`);
  }

  return writeRegistryOutput(allItems, outputDir, log);
}
