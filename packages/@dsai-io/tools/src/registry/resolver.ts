/**
 * Registry dependency resolver.
 * @module @dsai-io/tools/registry/resolver
 */

/* eslint-disable security/detect-non-literal-fs-filename */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { RegistryItem, ResolvedTree } from './types.js';

function loadItem(name: string, registryDir: string): RegistryItem | null {
  const subdirs = ['components', 'hooks', 'utils', 'lib', 'styles', 'types'];
  for (const sub of subdirs) {
    const filePath = join(registryDir, sub, `${name}.json`);
    if (existsSync(filePath)) {
      return JSON.parse(readFileSync(filePath, 'utf-8')) as RegistryItem;
    }
  }
  return null;
}

/** BFS: collect all items and their transitive dependencies. */
function collectTransitiveDeps(
  names: string[],
  registryDir: string,
): Map<string, RegistryItem> {
  const visited = new Map<string, RegistryItem>();
  const queue = [...names];

  while (queue.length > 0) {
    const name = queue.shift()!;
    if (visited.has(name)) {continue;}
    const item = loadItem(name, registryDir);
    if (!item) {
      throw new Error(`Registry item "${name}" not found. Run \`dsai registry build\` or check the name.`);
    }
    visited.set(name, item);
    for (const dep of item.registryDependencies) {
      if (!visited.has(dep)) {queue.push(dep);}
    }
  }

  return visited;
}

/** Topological sort (Kahn's algorithm) on visited items. */
function topologicalSort(visited: Map<string, RegistryItem>): RegistryItem[] {
  const inDeg = new Map<string, number>();
  for (const [name, item] of visited) {
    inDeg.set(name, item.registryDependencies.filter((d) => visited.has(d)).length);
  }

  const sorted: RegistryItem[] = [];
  const ready: string[] = [];
  for (const [name, deg] of inDeg) {
    if (deg === 0) {ready.push(name);}
  }

  while (ready.length > 0) {
    const name = ready.shift()!;
    sorted.push(visited.get(name)!);
    for (const [otherName, otherItem] of visited) {
      if (otherItem.registryDependencies.includes(name)) {
        const newDeg = (inDeg.get(otherName) ?? 1) - 1;
        inDeg.set(otherName, newDeg);
        if (newDeg === 0) {ready.push(otherName);}
      }
    }
  }

  if (sorted.length !== visited.size) {
    const missing = [...visited.keys()].filter((n) => !sorted.some((s) => s.name === n));
    throw new Error(`Circular dependency detected involving: ${missing.join(', ')}`);
  }

  return sorted;
}

/** Aggregate npm deps, dev deps, and CSS vars from sorted items. */
function aggregateDependencies(sorted: RegistryItem[]): {
  dependencies: string[];
  devDependencies: string[];
  cssVars: { light: Record<string, string>; dark: Record<string, string> };
} {
  const allDeps = new Set<string>();
  const allDevDeps = new Set<string>();
  const lightVars: Record<string, string> = {};
  const darkVars: Record<string, string> = {};

  for (const item of sorted) {
    for (const dep of item.dependencies) {allDeps.add(dep);}
    for (const dep of item.devDependencies) {allDevDeps.add(dep);}
    if (item.cssVars?.light) {Object.assign(lightVars, item.cssVars.light);}
    if (item.cssVars?.dark) {Object.assign(darkVars, item.cssVars.dark);}
  }

  return {
    dependencies: [...allDeps],
    devDependencies: [...allDevDeps],
    cssVars: { light: lightVars, dark: darkVars },
  };
}

export function resolveTree(names: string[], registryDir: string): ResolvedTree {
  const visited = collectTransitiveDeps(names, registryDir);
  const sorted = topologicalSort(visited);
  const { dependencies, devDependencies, cssVars } = aggregateDependencies(sorted);

  return { items: sorted, dependencies, devDependencies, cssVars };
}
