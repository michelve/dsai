/**
 * Project Detector Module
 *
 * Detects the project type, framework, package manager, and configuration
 * from the filesystem to provide intelligent setup recommendations.
 *
 * @packageDocumentation
 * @module @dsai/tools/cli/init/detector
 *
 * @remarks
 * Currently supports React framework integration.
 * TODO: Add support for Vue, Angular, Svelte, Solid, and other frameworks (coming soon)
 */

/* eslint-disable security/detect-non-literal-fs-filename */

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// ============================================================================
// Types
// ============================================================================

/**
 * Supported frontend frameworks
 *
 * @remarks
 * Currently React is fully supported.
 * TODO: Vue, Angular, Svelte, Solid, Preact, Lit support coming soon
 */
export type Framework =
  | 'react'
  | 'vue'
  | 'angular'
  | 'svelte'
  | 'solid'
  | 'preact'
  | 'lit'
  | 'vanilla'
  | 'unknown';

/**
 * Frameworks with full integration support
 */
export const SUPPORTED_FRAMEWORKS: Framework[] = ['react', 'vanilla'];

/**
 * Frameworks coming soon
 * TODO: Implement full support for these frameworks
 */
export const COMING_SOON_FRAMEWORKS: Framework[] = [
  'vue',
  'angular',
  'svelte',
  'solid',
  'preact',
  'lit',
];

/**
 * Supported meta-frameworks and build tools
 */
export type MetaFramework =
  | 'next'
  | 'nuxt'
  | 'remix'
  | 'astro'
  | 'gatsby'
  | 'vite'
  | 'webpack'
  | 'parcel'
  | 'rollup'
  | 'esbuild'
  | 'turbopack'
  | 'none';

/**
 * Supported package managers
 */
export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

/**
 * Supported styling solutions
 */
export type StylingApproach =
  | 'css'
  | 'scss'
  | 'less'
  | 'styled-components'
  | 'emotion'
  | 'tailwind'
  | 'css-modules'
  | 'vanilla-extract'
  | 'multiple'
  | 'unknown';

/**
 * Project detection result
 */
export interface ProjectInfo {
  /** Whether a valid project was detected */
  isProject: boolean;

  /** Whether this is a monorepo */
  isMonorepo: boolean;

  /** Monorepo tool if detected */
  monorepoTool?: 'nx' | 'turborepo' | 'lerna' | 'pnpm-workspaces' | 'yarn-workspaces';

  /** Main framework used */
  framework: Framework;

  /** Meta-framework or build tool */
  metaFramework: MetaFramework;

  /** Detected package manager */
  packageManager: PackageManager;

  /** Whether TypeScript is used */
  typescript: boolean;

  /** Whether ESM modules are used */
  esm: boolean;

  /** Styling approach detected */
  styling: StylingApproach;

  /** Whether design tokens already exist */
  hasExistingTokens: boolean;

  /** Existing DSAI configuration file if present */
  existingConfigFile?: string;

  /** Project name from package.json */
  projectName?: string;

  /** Source directory */
  sourceDir?: string;

  /** Detected style directories */
  styleDirectories: string[];

  /** Package.json path */
  packageJsonPath?: string;

  /** Raw package.json data */
  packageJson?: PackageJsonData;
}

/**
 * Minimal package.json structure for detection
 */
export interface PackageJsonData {
  name?: string;
  type?: 'module' | 'commonjs';
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  workspaces?: string[] | { packages: string[] };
  packageManager?: string;
}

// ============================================================================
// Safe File System Helpers
// ============================================================================

/**
 * Safely check if a path exists
 * @param basePath - Base directory path (must be validated)
 * @param relativePath - Relative path within the base directory
 */
function safeExists(basePath: string, ...relativePath: string[]): boolean {
  const fullPath = resolve(basePath, ...relativePath);

  // Ensure the resolved path is within the base path (prevent path traversal)
  if (!fullPath.startsWith(resolve(basePath))) {
    return false;
  }

  return existsSync(fullPath);
}

/**
 * Safely read a file
 * @param basePath - Base directory path (must be validated)
 * @param relativePath - Relative path within the base directory
 */
function safeReadFile(basePath: string, ...relativePath: string[]): string | undefined {
  const fullPath = resolve(basePath, ...relativePath);

  // Ensure the resolved path is within the base path (prevent path traversal)
  if (!fullPath.startsWith(resolve(basePath))) {
    return undefined;
  }

  if (!existsSync(fullPath)) {
    return undefined;
  }

  try {
    return readFileSync(fullPath, 'utf-8');
  } catch {
    return undefined;
  }
}

// ============================================================================
// Detection Functions
// ============================================================================

/**
 * Detect package manager from lock files
 */
export function detectPackageManager(cwd: string): PackageManager {
  const basePath = resolve(cwd);

  if (safeExists(basePath, 'bun.lockb') || safeExists(basePath, 'bun.lock')) {
    return 'bun';
  }
  if (safeExists(basePath, 'pnpm-lock.yaml')) {
    return 'pnpm';
  }
  if (safeExists(basePath, 'yarn.lock')) {
    return 'yarn';
  }
  if (safeExists(basePath, 'package-lock.json')) {
    return 'npm';
  }

  // Check for specific package manager fields in package.json
  const content = safeReadFile(basePath, 'package.json');
  if (content) {
    try {
      const pkg = JSON.parse(content) as PackageJsonData;

      // Check packageManager field (corepack)
      if (typeof pkg.packageManager === 'string') {
        const pm = pkg.packageManager;
        if (pm.startsWith('pnpm')) {
          return 'pnpm';
        }
        if (pm.startsWith('yarn')) {
          return 'yarn';
        }
        if (pm.startsWith('bun')) {
          return 'bun';
        }
        if (pm.startsWith('npm')) {
          return 'npm';
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  return 'npm'; // Default fallback
}

/**
 * Detect framework from dependencies
 */
export function detectFramework(pkg: PackageJsonData): Framework {
  const allDeps: Record<string, string> = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };

  // Check for frameworks in order of specificity
  if (allDeps['react'] || allDeps['react-dom']) {
    return 'react';
  }
  if (allDeps['vue']) {
    return 'vue';
  }
  if (allDeps['@angular/core']) {
    return 'angular';
  }
  if (allDeps['svelte']) {
    return 'svelte';
  }
  if (allDeps['solid-js']) {
    return 'solid';
  }
  if (allDeps['preact']) {
    return 'preact';
  }
  if (allDeps['lit'] || allDeps['lit-element']) {
    return 'lit';
  }

  return 'vanilla';
}

/**
 * Detect meta-framework or build tool
 */
export function detectMetaFramework(pkg: PackageJsonData, cwd: string): MetaFramework {
  const basePath = resolve(cwd);
  const allDeps: Record<string, string> = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  // Check for meta-frameworks first (more specific)
  if (allDeps['next']) {
    return 'next';
  }
  if (allDeps['nuxt']) {
    return 'nuxt';
  }
  if (allDeps['@remix-run/react'] || allDeps['remix']) {
    return 'remix';
  }
  if (allDeps['astro']) {
    return 'astro';
  }
  if (allDeps['gatsby']) {
    return 'gatsby';
  }

  // Check for build tools
  if (allDeps['vite']) {
    return 'vite';
  }
  if (allDeps['turbo']) {
    return 'turbopack';
  }
  if (allDeps['webpack'] || allDeps['webpack-cli']) {
    return 'webpack';
  }
  if (allDeps['parcel']) {
    return 'parcel';
  }
  if (allDeps['rollup']) {
    return 'rollup';
  }
  if (allDeps['esbuild']) {
    return 'esbuild';
  }

  // Check for config files
  if (safeExists(basePath, 'vite.config.ts') || safeExists(basePath, 'vite.config.js')) {
    return 'vite';
  }
  if (safeExists(basePath, 'next.config.js') || safeExists(basePath, 'next.config.mjs')) {
    return 'next';
  }
  if (safeExists(basePath, 'webpack.config.js')) {
    return 'webpack';
  }
  if (safeExists(basePath, 'rollup.config.js') || safeExists(basePath, 'rollup.config.mjs')) {
    return 'rollup';
  }

  return 'none';
}

/**
 * Detect styling approach
 */
export function detectStyling(pkg: PackageJsonData, cwd: string): StylingApproach {
  const basePath = resolve(cwd);
  const allDeps: Record<string, string> = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  const approaches: StylingApproach[] = [];

  // Check dependencies
  if (allDeps['tailwindcss']) {
    approaches.push('tailwind');
  }
  if (allDeps['styled-components']) {
    approaches.push('styled-components');
  }
  if (allDeps['@emotion/react'] || allDeps['@emotion/styled']) {
    approaches.push('emotion');
  }
  if (allDeps['@vanilla-extract/css']) {
    approaches.push('vanilla-extract');
  }
  if (allDeps['sass'] || allDeps['node-sass']) {
    approaches.push('scss');
  }
  if (allDeps['less']) {
    approaches.push('less');
  }

  // Check for config files
  if (safeExists(basePath, 'tailwind.config.js') || safeExists(basePath, 'tailwind.config.ts')) {
    if (!approaches.includes('tailwind')) {
      approaches.push('tailwind');
    }
  }

  if (approaches.length > 1) {
    return 'multiple';
  }

  if (approaches.length === 1) {
    const first = approaches[0];
    if (first !== undefined) {
      return first;
    }
  }

  // Check for CSS/SCSS files in common locations
  const styleLocations = [
    'src/styles',
    'src/css',
    'styles',
    'css',
    'src/assets/styles',
    'assets/styles',
  ];

  for (const loc of styleLocations) {
    if (safeExists(basePath, loc)) {
      // Check if scss files exist
      if (
        safeExists(basePath, loc, 'main.scss') ||
        safeExists(basePath, loc, 'index.scss') ||
        safeExists(basePath, loc, 'global.scss')
      ) {
        return 'scss';
      }
      return 'css';
    }
  }

  return 'unknown';
}

/**
 * Detect monorepo configuration
 */
export function detectMonorepo(
  pkg: PackageJsonData,
  cwd: string
): { isMonorepo: boolean; tool?: ProjectInfo['monorepoTool'] } {
  const basePath = resolve(cwd);

  // Check for monorepo tools
  if (safeExists(basePath, 'nx.json')) {
    return { isMonorepo: true, tool: 'nx' };
  }
  if (safeExists(basePath, 'turbo.json')) {
    return { isMonorepo: true, tool: 'turborepo' };
  }
  if (safeExists(basePath, 'lerna.json')) {
    return { isMonorepo: true, tool: 'lerna' };
  }

  // Check for workspace configuration
  if (pkg.workspaces) {
    if (safeExists(basePath, 'pnpm-workspace.yaml')) {
      return { isMonorepo: true, tool: 'pnpm-workspaces' };
    }
    return { isMonorepo: true, tool: 'yarn-workspaces' };
  }

  if (safeExists(basePath, 'pnpm-workspace.yaml')) {
    return { isMonorepo: true, tool: 'pnpm-workspaces' };
  }

  return { isMonorepo: false };
}

/**
 * Detect TypeScript usage
 */
export function detectTypeScript(pkg: PackageJsonData, cwd: string): boolean {
  const basePath = resolve(cwd);
  const allDeps: Record<string, string> = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  if (allDeps['typescript']) {
    return true;
  }

  // Check for tsconfig
  if (
    safeExists(basePath, 'tsconfig.json') ||
    safeExists(basePath, 'tsconfig.base.json') ||
    safeExists(basePath, 'tsconfig.build.json')
  ) {
    return true;
  }

  return false;
}

/**
 * Detect ESM module usage
 */
export function detectESM(pkg: PackageJsonData, cwd: string): boolean {
  const basePath = resolve(cwd);

  if (pkg.type === 'module') {
    return true;
  }

  // Check for .mjs config files
  const mjsConfigs = [
    'vite.config.mjs',
    'next.config.mjs',
    'rollup.config.mjs',
    'eslint.config.mjs',
  ];

  for (const config of mjsConfigs) {
    if (safeExists(basePath, config)) {
      return true;
    }
  }

  return false;
}

/**
 * Detect existing design token files
 */
export function detectExistingTokens(cwd: string): boolean {
  const basePath = resolve(cwd);
  const tokenLocations = [
    'tokens',
    'design-tokens',
    'src/tokens',
    'src/design-tokens',
    'figma-exports',
    'collections',
    'theme.json',
    'tokens.json',
  ];

  for (const loc of tokenLocations) {
    if (safeExists(basePath, loc)) {
      return true;
    }
  }

  return false;
}

/**
 * Detect existing DSAI configuration
 */
export function detectExistingConfig(cwd: string): string | undefined {
  const basePath = resolve(cwd);
  const configFiles = [
    'dsai.config.mjs',
    'dsai.config.js',
    'dsai.config.ts',
    'dsai.config.json',
    '.dsairc',
    '.dsairc.json',
    '.dsairc.yaml',
  ];

  for (const config of configFiles) {
    if (safeExists(basePath, config)) {
      return config;
    }
  }

  return undefined;
}

/**
 * Detect source directory
 */
export function detectSourceDir(cwd: string): string | undefined {
  const basePath = resolve(cwd);
  const sourceDirs = ['src', 'app', 'lib', 'source', 'client'];

  for (const dir of sourceDirs) {
    if (safeExists(basePath, dir)) {
      return dir;
    }
  }

  return undefined;
}

/**
 * Detect style directories
 */
export function detectStyleDirectories(cwd: string): string[] {
  const basePath = resolve(cwd);
  const styleLocations = [
    'src/styles',
    'src/css',
    'src/scss',
    'styles',
    'css',
    'scss',
    'src/assets/styles',
    'src/assets/css',
    'assets/styles',
    'public/styles',
  ];

  return styleLocations.filter((loc) => safeExists(basePath, loc));
}

/**
 * Load and parse package.json
 */
export function loadPackageJson(cwd: string): PackageJsonData | undefined {
  const basePath = resolve(cwd);
  const content = safeReadFile(basePath, 'package.json');

  if (!content) {
    return undefined;
  }

  try {
    return JSON.parse(content) as PackageJsonData;
  } catch {
    return undefined;
  }
}

// ============================================================================
// Main Detection Function
// ============================================================================

/**
 * Detect all project information
 *
 * Performs comprehensive project detection including framework, build tool,
 * package manager, TypeScript usage, styling approach, and more.
 *
 * @param cwd - The directory to analyze (defaults to process.cwd())
 * @returns Complete project information
 *
 * @example
 * ```typescript
 * const info = detectProject('/path/to/my-app');
 * console.log(info.framework); // 'react'
 * console.log(info.metaFramework); // 'next'
 * console.log(info.packageManager); // 'pnpm'
 * ```
 */
export function detectProject(cwd: string = process.cwd()): ProjectInfo {
  const basePath = resolve(cwd);
  const packageJson = loadPackageJson(basePath);

  // No package.json - not a valid project
  if (!packageJson) {
    return {
      isProject: false,
      isMonorepo: false,
      framework: 'unknown',
      metaFramework: 'none',
      packageManager: detectPackageManager(basePath),
      typescript: false,
      esm: false,
      styling: 'unknown',
      hasExistingTokens: detectExistingTokens(basePath),
      styleDirectories: [],
    };
  }

  const monorepoInfo = detectMonorepo(packageJson, basePath);

  return {
    isProject: true,
    isMonorepo: monorepoInfo.isMonorepo,
    monorepoTool: monorepoInfo.tool,
    framework: detectFramework(packageJson),
    metaFramework: detectMetaFramework(packageJson, basePath),
    packageManager: detectPackageManager(basePath),
    typescript: detectTypeScript(packageJson, basePath),
    esm: detectESM(packageJson, basePath),
    styling: detectStyling(packageJson, basePath),
    hasExistingTokens: detectExistingTokens(basePath),
    existingConfigFile: detectExistingConfig(basePath),
    projectName: packageJson.name,
    sourceDir: detectSourceDir(basePath),
    styleDirectories: detectStyleDirectories(basePath),
    packageJsonPath: join(basePath, 'package.json'),
    packageJson,
  };
}

/**
 * Get a human-readable summary of the project
 */
export function getProjectSummary(info: ProjectInfo): string[] {
  const summary: string[] = [];

  if (!info.isProject) {
    summary.push('No package.json found - this may not be a Node.js project');
    return summary;
  }

  if (info.projectName) {
    summary.push(`Project: ${info.projectName}`);
  }

  if (info.isMonorepo && info.monorepoTool) {
    summary.push(`Monorepo: ${info.monorepoTool}`);
  }

  summary.push(`Framework: ${info.framework}`);

  if (info.metaFramework !== 'none') {
    summary.push(`Build Tool: ${info.metaFramework}`);
  }

  summary.push(`Package Manager: ${info.packageManager}`);
  summary.push(`TypeScript: ${info.typescript ? 'Yes' : 'No'}`);
  summary.push(`Module System: ${info.esm ? 'ESM' : 'CommonJS'}`);

  if (info.styling !== 'unknown') {
    summary.push(`Styling: ${info.styling}`);
  }

  if (info.existingConfigFile) {
    summary.push(`Existing Config: ${info.existingConfigFile}`);
  }

  if (info.hasExistingTokens) {
    summary.push('Existing Tokens: Detected');
  }

  return summary;
}

/**
 * Get recommended configuration based on project info
 */
export function getRecommendedConfig(info: ProjectInfo): {
  configFormat: 'mjs' | 'js' | 'ts';
  outputFormats: string[];
  prefix: string;
  outputDir: string;
  sourceDir: string;
} {
  // Determine config format
  let configFormat: 'mjs' | 'js' | 'ts' = 'mjs';
  if (info.typescript) {
    configFormat = 'ts';
  } else if (!info.esm) {
    configFormat = 'js';
  }

  // Determine output formats based on project
  const outputFormats = ['css'];

  if (info.styling === 'scss' || info.styling === 'multiple') {
    outputFormats.push('scss');
  }

  if (info.typescript) {
    outputFormats.push('ts');
  } else {
    outputFormats.push('js');
  }

  outputFormats.push('json');

  // Determine prefix based on project name
  const prefix = info.projectName
    ? `--${info.projectName.replace(/[@/]/g, '').replace(/[^a-z0-9-]/gi, '-')}-`
    : '--dsai-';

  // Determine output directory
  let outputDir = 'dist/tokens';
  if (info.metaFramework === 'next') {
    outputDir = 'src/styles/tokens';
  } else if (info.metaFramework === 'vite') {
    outputDir = 'src/tokens';
  } else if (info.sourceDir) {
    outputDir = `${info.sourceDir}/tokens`;
  }

  // Determine source directory for Figma exports
  const sourceDir = 'figma-exports';

  return {
    configFormat,
    outputFormats,
    prefix,
    outputDir,
    sourceDir,
  };
}
