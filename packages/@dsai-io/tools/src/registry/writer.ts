/**
 * Registry file writer.
 * @module @dsai-io/tools/registry/writer
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import { normalizeExtensions, transformImports } from './transformer.js';

import type { ResolvedAliasesConfig, ResolvedComponentsConfig } from '../config/types.js';
import type { ResolvedTree } from './types.js';

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
  if (existsSync(join(projectDir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(projectDir, 'bun.lockb')) || existsSync(join(projectDir, 'bun.lock'))) return 'bun';
  if (existsSync(join(projectDir, 'yarn.lock'))) return 'yarn';
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

export function writeRegistryItems(tree: ResolvedTree, options: WriteOptions): WriteResult {
  const { projectDir, aliases, components, overwrite, dryRun, log } = options;
  const result: WriteResult = { written: [], skipped: [], installedDeps: [] };
  const shouldOverwrite = overwrite ?? components.overwrite;

  for (const item of tree.items) {
    const targetBaseDir = getTargetDir(item.type, aliases);

    for (const file of item.files) {
      const fileName = basename(file.path);
      let targetPath: string;

      if (file.target) {
        targetPath = join(projectDir, file.target);
      } else if (item.type === 'registry:ui' || item.type === 'registry:component') {
        targetPath = join(projectDir, targetBaseDir, item.name, fileName);
      } else if (item.type === 'registry:type') {
        // Types keep their subdirectory structure: components/types/<filename>
        targetPath = join(projectDir, targetBaseDir, file.path);
      } else {
        targetPath = join(projectDir, targetBaseDir, fileName);
      }

      if (existsSync(targetPath) && !shouldOverwrite) {
        if (log) log(`  Skipped (exists): ${targetPath}`);
        result.skipped.push(targetPath);
        continue;
      }

      let content = file.content;
      content = transformImports(content, { aliases, tsx: components.tsx });
      content = normalizeExtensions(content, components.tsx);

      if (dryRun) {
        if (log) log(`  Would write: ${targetPath}`);
        result.written.push(targetPath);
        continue;
      }

      const dir = dirname(targetPath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(targetPath, content, 'utf-8');
      if (log) log(`  Written: ${targetPath}`);
      result.written.push(targetPath);
    }
  }

  // Install npm dependencies
  const depsToInstall = tree.dependencies.filter((dep) => {
    const pkgJsonPath = join(projectDir, 'package.json');
    if (existsSync(pkgJsonPath)) {
      const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
      const allDeps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
      return !Reflect.get(allDeps, dep);
    }
    return true;
  });

  if (depsToInstall.length > 0 && !dryRun) {
    const pm = detectPackageManager(projectDir);
    const [cmd, args] = getInstallArgs(pm, depsToInstall, false);
    if (log) log(`  Installing: ${cmd} ${args.join(' ')}`);
    execFileSync(cmd, args, { cwd: projectDir, stdio: 'inherit' });
    result.installedDeps = depsToInstall;
  } else if (depsToInstall.length > 0 && dryRun) {
    if (log) log(`  Would install: ${depsToInstall.join(', ')}`);
    result.installedDeps = depsToInstall;
  }

  return result;
}
