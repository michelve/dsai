/**
 * Registry file writer.
 * @module @dsai-io/tools/registry/writer
 */

/* eslint-disable security/detect-non-literal-fs-filename */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import { normalizeExtensions, transformImports } from './transformer.js';

import type { ResolvedTree } from './types.js';
import type { ResolvedAliasesConfig, ResolvedComponentsConfig } from '../config/types.js';

export interface WriteOptions {
  projectDir: string;
  aliases: ResolvedAliasesConfig;
  components: ResolvedComponentsConfig;
  overwrite?: boolean;
  dryRun?: boolean;
  log?: (message: string) => void;
}

export interface WriteResult {
  written: string[];
  skipped: string[];
  installedDeps: string[];
}

function getTargetDir(type: string, aliases: ResolvedAliasesConfig): string {
  switch (type) {
    case 'registry:ui': return aliases.ui;
    case 'registry:hook': return aliases.hooks;
    case 'registry:util': return aliases.utils;
    case 'registry:lib': return aliases.lib;
    case 'registry:component': return aliases.components;
    case 'registry:type': return aliases.components;
    case 'registry:style': return aliases.ui;
    default: return aliases.lib;
  }
}

function detectPackageManager(projectDir: string): 'pnpm' | 'yarn' | 'npm' | 'bun' {
  if (existsSync(join(projectDir, 'pnpm-lock.yaml'))) {return 'pnpm';}
  if (existsSync(join(projectDir, 'bun.lockb')) || existsSync(join(projectDir, 'bun.lock'))) {return 'bun';}
  if (existsSync(join(projectDir, 'yarn.lock'))) {return 'yarn';}
  return 'npm';
}

function getInstallArgs(pm: string, packages: string[], dev: boolean): [string, string[]] {
  switch (pm) {
    case 'pnpm': return ['pnpm', ['add', ...(dev ? ['-D'] : []), ...packages]];
    case 'yarn': return ['yarn', ['add', ...(dev ? ['--dev'] : []), ...packages]];
    case 'bun': return ['bun', ['add', ...(dev ? ['--dev'] : []), ...packages]];
    default: return ['npm', ['install', ...(dev ? ['--save-dev'] : []), ...packages]];
  }
}

/** Resolve the target file path for a registry file */
function resolveTargetPath(
  file: { path: string; target?: string },
  itemType: string,
  itemName: string,
  projectDir: string,
  targetBaseDir: string
): string {
  if (file.target) {
    return join(projectDir, file.target);
  }

  const usesItemSubdir =
    itemType === 'registry:ui' ||
    itemType === 'registry:component' ||
    itemType === 'registry:hook';

  if (usesItemSubdir) {
    return join(projectDir, targetBaseDir, itemName, basename(file.path));
  }

  if (file.path.includes('/')) {
    return join(projectDir, targetBaseDir, file.path);
  }

  return join(projectDir, targetBaseDir, basename(file.path));
}

/** Write a single file to disk (or log dry-run), returning 'written' | 'skipped' */
function writeSingleFile(
  targetPath: string,
  content: string,
  shouldOverwrite: boolean,
  dryRun: boolean | undefined,
  log: ((message: string) => void) | undefined
): 'written' | 'skipped' {
  if (existsSync(targetPath) && !shouldOverwrite) {
    if (log) {log(`  Skipped (exists): ${targetPath}`);}
    return 'skipped';
  }

  if (dryRun) {
    if (log) {log(`  Would write: ${targetPath}`);}
    return 'written';
  }

  const dir = dirname(targetPath);
  if (!existsSync(dir)) {mkdirSync(dir, { recursive: true });}
  writeFileSync(targetPath, content, 'utf-8');
  if (log) {log(`  Written: ${targetPath}`);}
  return 'written';
}

/** Filter out npm dependencies already present in package.json */
function findMissingDeps(projectDir: string, deps: string[]): string[] {
  const pkgJsonPath = join(projectDir, 'package.json');
  if (!existsSync(pkgJsonPath)) {return deps;}

  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
  const allDeps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
  return deps.filter((dep) => !Reflect.get(allDeps, dep));
}

/** Install missing npm dependencies (or log dry-run) */
function installDeps(
  projectDir: string,
  deps: string[],
  dryRun: boolean | undefined,
  log: ((message: string) => void) | undefined
): void {
  if (deps.length === 0) {return;}

  if (dryRun) {
    if (log) {log(`  Would install: ${deps.join(', ')}`);}
    return;
  }

  const pm = detectPackageManager(projectDir);
  const [cmd, args] = getInstallArgs(pm, deps, false);
  if (log) {log(`  Installing: ${cmd} ${args.join(' ')}`);}
  execFileSync(cmd, args, { cwd: projectDir, stdio: 'inherit' });
}

export function writeRegistryItems(tree: ResolvedTree, options: WriteOptions): WriteResult {
  const { projectDir, aliases, components, overwrite, dryRun, log } = options;
  const result: WriteResult = { written: [], skipped: [], installedDeps: [] };
  const shouldOverwrite = overwrite ?? components.overwrite;

  for (const item of tree.items) {
    const targetBaseDir = getTargetDir(item.type, aliases);

    for (const file of item.files) {
      const targetPath = resolveTargetPath(file, item.type, item.name, projectDir, targetBaseDir);

      let content = file.content;
      content = transformImports(content, { aliases, tsx: components.tsx });
      content = normalizeExtensions(content, components.tsx);

      const outcome = writeSingleFile(targetPath, content, shouldOverwrite, dryRun, log);
      result[outcome === 'written' ? 'written' : 'skipped'].push(targetPath);
    }
  }

  const depsToInstall = findMissingDeps(projectDir, tree.dependencies);
  installDeps(projectDir, depsToInstall, dryRun, log);
  if (depsToInstall.length > 0) {
    result.installedDeps = depsToInstall;
  }

  return result;
}
