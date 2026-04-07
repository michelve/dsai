/**
 * Package.json Modifier Utilities
 *
 * Safe utilities for reading and modifying package.json files
 * with proper backup and validation.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/init/package-modifier
 */

/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */

import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

import type { PackageManager } from './detector.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Script entry to add to package.json
 */
export interface ScriptEntry {
  /** Script name */
  name: string;
  /** Script command */
  command: string;
  /** Whether to overwrite existing script */
  overwrite?: boolean;
}

/**
 * Dependency to add to package.json
 */
export interface DependencyEntry {
  /** Package name */
  name: string;
  /** Package version (with semver prefix) */
  version: string;
  /** Dependency type */
  type: 'dependencies' | 'devDependencies' | 'peerDependencies';
}

/**
 * Result of a package.json modification
 */
export interface ModificationResult {
  /** Whether the modification was successful */
  success: boolean;
  /** Path to the backup file if created */
  backupPath?: string;
  /** Error message if failed */
  error?: string;
  /** Changes made */
  changes: {
    scriptsAdded: string[];
    scriptsUpdated: string[];
    dependenciesAdded: string[];
    dependenciesUpdated: string[];
  };
}

/**
 * Options for modifying package.json
 */
export interface ModifyOptions {
  /** Create a backup before modifying */
  createBackup?: boolean;
  /** Dry run - don't actually modify */
  dryRun?: boolean;
  /** Scripts to add/modify */
  scripts?: ScriptEntry[];
  /** Dependencies to add/modify */
  dependencies?: DependencyEntry[];
  /** Custom fields to add/modify */
  customFields?: Record<string, unknown>;
  /** Upgrade existing dependencies to new versions */
  upgradeDependencies?: boolean;
}

// ============================================================================
// Package.json Structure
// ============================================================================

/**
 * Minimal package.json structure for modification
 */
interface PackageJson {
  name?: string;
  version?: string;
  type?: 'module' | 'commonjs';
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [key: string]: unknown;
}

// ============================================================================
// Constants
// ============================================================================

const PACKAGE_JSON_FILENAME = 'package.json';

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Read and parse package.json from a directory
 */
export function readPackageJson(cwd: string): PackageJson | undefined {
  const packageJsonPath = resolve(cwd, PACKAGE_JSON_FILENAME);

  if (!existsSync(packageJsonPath)) {
    return undefined;
  }

  try {
    const content = readFileSync(packageJsonPath, 'utf-8');
    return JSON.parse(content) as PackageJson;
  } catch {
    return undefined;
  }
}

/**
 * Write package.json to a directory
 */
export function writePackageJson(cwd: string, pkg: PackageJson): void {
  const packageJsonPath = resolve(cwd, PACKAGE_JSON_FILENAME);
  const content = JSON.stringify(pkg, null, 2) + '\n';
  writeFileSync(packageJsonPath, content, 'utf-8');
}

/**
 * Create a backup of package.json
 */
export function backupPackageJson(cwd: string): string | undefined {
  const packageJsonPath = resolve(cwd, PACKAGE_JSON_FILENAME);

  if (!existsSync(packageJsonPath)) {
    return undefined;
  }

  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, '-');
  const backupDir = resolve(cwd, '.dsai-backups');
  const backupPath = resolve(backupDir, `package.json.${timestamp}.backup`);

  // Ensure backup directory exists
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }

  copyFileSync(packageJsonPath, backupPath);
  return backupPath;
}

/**
 * Get the install command for a package manager
 */
export function getInstallCommand(packageManager: PackageManager, deps: DependencyEntry[]): string {
  const devDeps = deps.filter((d) => d.type === 'devDependencies');
  const regularDeps = deps.filter((d) => d.type === 'dependencies');

  const commands: string[] = [];

  if (regularDeps.length > 0) {
    const pkgs = regularDeps.map((d) => `${d.name}@${d.version}`).join(' ');
    switch (packageManager) {
      case 'pnpm':
        commands.push(`pnpm add ${pkgs}`);
        break;
      case 'yarn':
        commands.push(`yarn add ${pkgs}`);
        break;
      case 'bun':
        commands.push(`bun add ${pkgs}`);
        break;
      default:
        commands.push(`npm install ${pkgs}`);
    }
  }

  if (devDeps.length > 0) {
    const pkgs = devDeps.map((d) => `${d.name}@${d.version}`).join(' ');
    switch (packageManager) {
      case 'pnpm':
        commands.push(`pnpm add -D ${pkgs}`);
        break;
      case 'yarn':
        commands.push(`yarn add -D ${pkgs}`);
        break;
      case 'bun':
        commands.push(`bun add -d ${pkgs}`);
        break;
      default:
        commands.push(`npm install -D ${pkgs}`);
    }
  }

  return commands.join(' && ');
}

/**
 * Get the run command for a package manager
 */
export function getRunCommand(packageManager: PackageManager, script: string): string {
  switch (packageManager) {
    case 'pnpm':
      return `pnpm ${script}`;
    case 'yarn':
      return `yarn ${script}`;
    case 'bun':
      return `bun run ${script}`;
    default:
      return `npm run ${script}`;
  }
}

// ============================================================================
// Main Modification Function
// ============================================================================

/** Dangerous keys that could be used for prototype pollution */
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Process script entries into package.json
 */
function processScripts(
  pkg: PackageJson,
  scripts: ScriptEntry[],
  changes: ModificationResult['changes']
): void {
  pkg.scripts ??= {};

  for (const script of scripts) {
    const exists = pkg.scripts[script.name] !== undefined;

    if (!exists) {
      pkg.scripts[script.name] = script.command;
      changes.scriptsAdded.push(script.name);
    } else if (script.overwrite) {
      pkg.scripts[script.name] = script.command;
      changes.scriptsUpdated.push(script.name);
    }
  }
}

/**
 * Process a single dependency entry into package.json
 */
function processSingleDependency(
  pkg: PackageJson,
  dep: DependencyEntry,
  upgradeDependencies: boolean,
  changes: ModificationResult['changes']
): void {
  if (DANGEROUS_KEYS.has(dep.name)) {
    return;
  }

  const section = dep.type;

  if (!pkg[section]) {
    (pkg as Record<string, Record<string, string>>)[section] = {};
  }

  const depsSection = pkg[section] as Record<string, string>;
  const exists = dep.name in depsSection;

  if (!exists) {
    Object.defineProperty(depsSection, dep.name, {
      value: dep.version,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    changes.dependenciesAdded.push(dep.name);
    return;
  }

  if (upgradeDependencies && depsSection[dep.name] !== dep.version) {
    Object.defineProperty(depsSection, dep.name, {
      value: dep.version,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    changes.dependenciesUpdated.push(dep.name);
  }
}

/**
 * Modify package.json with the given options
 *
 * @param cwd - Working directory containing package.json
 * @param options - Modification options
 * @returns Result of the modification
 */
export function modifyPackageJson(cwd: string, options: ModifyOptions): ModificationResult {
  const result: ModificationResult = {
    success: false,
    changes: {
      scriptsAdded: [],
      scriptsUpdated: [],
      dependenciesAdded: [],
      dependenciesUpdated: [],
    },
  };

  const pkg = readPackageJson(cwd);
  if (!pkg) {
    result.error = 'package.json not found';
    return result;
  }

  // Create backup if requested
  if (options.createBackup && !options.dryRun) {
    const backupPath = backupPackageJson(cwd);
    if (backupPath) {
      result.backupPath = backupPath;
    }
  }

  if (options.scripts && options.scripts.length > 0) {
    processScripts(pkg, options.scripts, result.changes);
  }

  if (options.dependencies && options.dependencies.length > 0) {
    for (const dep of options.dependencies) {
      processSingleDependency(pkg, dep, options.upgradeDependencies ?? false, result.changes);
    }
  }

  if (options.customFields) {
    for (const [key, value] of Object.entries(options.customFields)) {
      pkg[key] = value;
    }
  }

  if (options.dryRun) {
    result.success = true;
  } else {
    try {
      writePackageJson(cwd, pkg);
      result.success = true;
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Failed to write package.json';
      return result;
    }
  }

  return result;
}

// ============================================================================
// DSAI-Specific Functions
// ============================================================================

/**
 * Default DSAI dependencies to add
 */
export const DSAI_DEPENDENCIES: DependencyEntry[] = [
  {
    name: '@dsai-io/tools',
    version: '^0.0.1',
    type: 'devDependencies',
  },
];

/**
 * Optional DSAI dependencies
 */
export const DSAI_OPTIONAL_DEPENDENCIES: Record<string, DependencyEntry> = {
  'figma-tokens': {
    name: '@dsai-io/figma-tokens',
    version: '^1.0.0',
    type: 'devDependencies',
  },
  'style-dictionary': {
    name: 'style-dictionary',
    version: '^5.1.1',
    type: 'devDependencies',
  },
  bootstrap: {
    name: 'bootstrap',
    version: '^5.3.8',
    type: 'devDependencies',
  },
  sass: {
    name: 'sass',
    version: '^1.97.2',
    type: 'devDependencies',
  },
};

/**
 * Default DSAI scripts to add
 */
export const DSAI_SCRIPTS: ScriptEntry[] = [
  {
    name: 'tokens:build',
    command: 'dsai tokens build',
  },
  {
    name: 'tokens:validate',
    command: 'dsai tokens validate',
  },
  {
    name: 'tokens:watch',
    command: 'dsai tokens build --watch',
  },
];

/**
 * Optional DSAI scripts
 */
export const DSAI_OPTIONAL_SCRIPTS: Record<string, ScriptEntry> = {
  // Figma integration scripts
  'figma-fetch': {
    name: 'figma:fetch',
    command: 'node --env-file=.env figma.config.mjs export',
  },
  'figma-sync': {
    name: 'figma:sync',
    command: 'node --env-file=.env figma.config.mjs sync',
  },
  'figma-info': {
    name: 'figma:info',
    command: 'node --env-file=.env figma.config.mjs info',
  },
  // Token processing scripts
  'tokens-transform': {
    name: 'tokens:transform',
    command: 'dsai tokens transform',
  },
  'tokens-full': {
    name: 'tokens:full',
    command: 'npm run figma:fetch && npm run tokens:transform && npm run tokens:build',
  },
  // Icon scripts
  'icons-build': {
    name: 'icons:build',
    command: 'dsai icons build',
  },
  // SCSS/Bootstrap integration scripts
  'scss-build': {
    name: 'scss:build',
    command: 'sass src/scss/theme.scss:dist/theme.css --style=compressed --load-path=node_modules',
  },
  'scss-watch': {
    name: 'scss:watch',
    command:
      'sass src/scss/theme.scss:dist/theme.css --watch --style=compressed --load-path=node_modules',
  },
  'styles-all': {
    name: 'styles:all',
    command: 'npm run tokens:build && npm run scss:build',
  },
};

/**
 * Push an optional dependency by key if it exists
 */
function pushOptionalDep(dependencies: DependencyEntry[], depKey: string): void {
  const dep = DSAI_OPTIONAL_DEPENDENCIES[depKey];
  if (dep) {
    dependencies.push(dep);
  }
}

/**
 * Push optional scripts by keys if they exist
 */
function pushOptionalScripts(scripts: ScriptEntry[], scriptKeys: string[]): void {
  for (const key of scriptKeys) {
    const script = DSAI_OPTIONAL_SCRIPTS[key];
    if (script) {
      scripts.push(script);
    }
  }
}

/**
 * Add DSAI configuration to package.json
 *
 * @param cwd - Working directory
 * @param options - Configuration options
 */
export function addDsaiToPackageJson(
  cwd: string,
  options: {
    includeFigmaTokens?: boolean;
    includeStyleDictionary?: boolean;
    includeIconsBuild?: boolean;
    includeScssIntegration?: boolean;
    includeBootstrap?: boolean;
    upgradeDependencies?: boolean;
    dryRun?: boolean;
    createBackup?: boolean;
  } = {}
): ModificationResult {
  const dependencies = [...DSAI_DEPENDENCIES];
  const scripts = [...DSAI_SCRIPTS];

  if (options.includeFigmaTokens) {
    pushOptionalDep(dependencies, 'figma-tokens');
    pushOptionalScripts(scripts, [
      'figma-fetch', 'figma-sync', 'figma-info', 'tokens-transform', 'tokens-full',
    ]);
  }

  if (options.includeStyleDictionary) {
    pushOptionalDep(dependencies, 'style-dictionary');
  }

  if (options.includeIconsBuild) {
    pushOptionalScripts(scripts, ['icons-build']);
  }

  if (options.includeScssIntegration) {
    pushOptionalScripts(scripts, ['scss-build', 'scss-watch', 'styles-all']);
    pushOptionalDep(dependencies, 'sass');
  }

  if (options.includeBootstrap) {
    pushOptionalDep(dependencies, 'bootstrap');
  }

  return modifyPackageJson(cwd, {
    dependencies,
    scripts,
    upgradeDependencies: options.upgradeDependencies,
    dryRun: options.dryRun,
    createBackup: options.createBackup ?? true,
  });
}

/**
 * Check if DSAI is already installed in package.json
 */
export function isDsaiInstalled(cwd: string): boolean {
  const pkg = readPackageJson(cwd);
  if (!pkg) {
    return false;
  }

  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };

  return Boolean(allDeps['@dsai-io/tools']);
}

/**
 * Get summary of changes that would be made
 */
export function getChangesSummary(result: ModificationResult): string[] {
  const summary: string[] = [];

  if (result.changes.scriptsAdded.length > 0) {
    summary.push(`Scripts added: ${result.changes.scriptsAdded.join(', ')}`);
  }

  if (result.changes.scriptsUpdated.length > 0) {
    summary.push(`Scripts updated: ${result.changes.scriptsUpdated.join(', ')}`);
  }

  if (result.changes.dependenciesAdded.length > 0) {
    summary.push(`Dependencies added: ${result.changes.dependenciesAdded.join(', ')}`);
  }

  if (result.changes.dependenciesUpdated.length > 0) {
    summary.push(`Dependencies updated: ${result.changes.dependenciesUpdated.join(', ')}`);
  }

  if (result.backupPath) {
    summary.push(`Backup created: ${result.backupPath}`);
  }

  return summary;
}

// ============================================================================
// Dependency Version Detection
// ============================================================================

/**
 * Information about an outdated dependency
 */
export interface OutdatedDependency {
  /** Package name */
  name: string;
  /** Currently installed version */
  currentVersion: string;
  /** Latest recommended version */
  latestVersion: string;
  /** Dependency type (devDependencies, dependencies, etc.) */
  type: 'dependencies' | 'devDependencies' | 'peerDependencies';
  /** Whether this is a major version change */
  isMajorChange: boolean;
  /** Warning message about potential breaking changes */
  warning?: string;
}

/**
 * Parse semver version to extract major version number
 */
function getMajorVersion(version: string): number | null {
  // Remove ^ or ~ prefix and extract major version
  const cleanVersion = version.replaceAll(/^[\^~]/g, '');
  const match = /^(\d+)/.exec(cleanVersion);
  if (!match?.[1]) {
    return null;
  }
  return Number.parseInt(match[1], 10);
}

/**
 * Check if upgrading from one version to another is a major change
 */
function isMajorVersionChange(currentVersion: string, newVersion: string): boolean {
  const currentMajor = getMajorVersion(currentVersion);
  const newMajor = getMajorVersion(newVersion);

  if (currentMajor === null || newMajor === null) {
    return false;
  }

  return newMajor > currentMajor;
}

/**
 * Get warning message for specific package upgrades
 */
function getUpgradeWarning(
  packageName: string,
  currentVersion: string,
  newVersion: string
): string | undefined {
  const isMajor = isMajorVersionChange(currentVersion, newVersion);

  // Package-specific warnings
  const warnings: Record<string, string> = {
    bootstrap: isMajor
      ? 'Major Bootstrap upgrade may include breaking CSS/JS API changes. Review the Bootstrap migration guide.'
      : 'Minor Bootstrap update. Check changelog for any CSS class changes.',
    sass: isMajor
      ? 'Major Sass upgrade may include breaking changes to @use/@import syntax.'
      : (undefined as unknown as string),
    'style-dictionary': isMajor
      ? 'Major Style Dictionary upgrade may require config file updates. Review migration guide.'
      : (undefined as unknown as string),
    '@dsai-io/tools': 'DSAI tools upgrade. Review changelog for any config schema changes.',
    '@dsai-io/figma-tokens': 'Figma tokens upgrade. Check for any API changes.',
  };

  return warnings[packageName];
}

/**
 * Detect outdated DSAI-related dependencies in package.json
 *
 * @param cwd - Working directory containing package.json
 * @param targetDependencies - Dependencies to check against
 * @returns List of outdated dependencies with upgrade information
 */
export function detectOutdatedDependencies(
  cwd: string,
  targetDependencies: DependencyEntry[]
): OutdatedDependency[] {
  const pkg = readPackageJson(cwd);
  if (!pkg) {
    return [];
  }

  const outdated: OutdatedDependency[] = [];

  for (const targetDep of targetDependencies) {
    const section = targetDep.type;
    const depsSection = pkg[section];

    if (!depsSection) {
      continue;
    }

    const currentVersion = depsSection[targetDep.name];
    if (!currentVersion) {
      continue;
    }

    // Compare versions (simple string comparison, not full semver)
    if (currentVersion !== targetDep.version) {
      const isMajor = isMajorVersionChange(currentVersion, targetDep.version);
      const warning = getUpgradeWarning(targetDep.name, currentVersion, targetDep.version);

      outdated.push({
        name: targetDep.name,
        currentVersion,
        latestVersion: targetDep.version,
        type: section,
        isMajorChange: isMajor,
        warning,
      });
    }
  }

  return outdated;
}

/**
 * Get all DSAI dependencies (required + optional based on options)
 */
export function getAllDsaiDependencies(
  options: {
    includeFigmaTokens?: boolean;
    includeStyleDictionary?: boolean;
    includeScssIntegration?: boolean;
    includeBootstrap?: boolean;
  } = {}
): DependencyEntry[] {
  const deps = [...DSAI_DEPENDENCIES];

  if (options.includeFigmaTokens) {
    const figmaTokensDep = DSAI_OPTIONAL_DEPENDENCIES['figma-tokens'];
    if (figmaTokensDep) {
      deps.push(figmaTokensDep);
    }
  }

  if (options.includeStyleDictionary) {
    const styleDictDep = DSAI_OPTIONAL_DEPENDENCIES['style-dictionary'];
    if (styleDictDep) {
      deps.push(styleDictDep);
    }
  }

  if (options.includeScssIntegration) {
    const sassDep = DSAI_OPTIONAL_DEPENDENCIES['sass'];
    if (sassDep) {
      deps.push(sassDep);
    }
  }

  if (options.includeBootstrap) {
    const bootstrapDep = DSAI_OPTIONAL_DEPENDENCIES['bootstrap'];
    if (bootstrapDep) {
      deps.push(bootstrapDep);
    }
  }

  return deps;
}
