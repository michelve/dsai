/**
 * Registry dependency resolver.
 * @module @dsai-io/tools/registry/resolver
 */

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

export function resolveTree(names: string[], registryDir: string): ResolvedTree {
  const visited = new Map<string, RegistryItem>();
  const queue = [...names];

  // BFS: collect all items and transitive dependencies
  while (queue.length > 0) {
    const name = queue.shift()!;
    if (visited.has(name)) continue;
    const item = loadItem(name, registryDir);
    if (!item) {
      throw new Error(`Registry item "${name}" not found. Run \`dsai registry build\` or check the name.`);
    }
    visited.set(name, item);
    for (const dep of item.registryDependencies) {
      if (!visited.has(dep)) queue.push(dep);
    }
  }

  // Topological sort (Kahn's algorithm)
  const inDeg = new Map<string, number>();
  for (const [name, item] of visited) {
    inDeg.set(name, item.registryDependencies.filter((d) => visited.has(d)).length);
  }

  const sorted: RegistryItem[] = [];
  const ready: string[] = [];
  for (const [name, deg] of inDeg) {
    if (deg === 0) ready.push(name);
  }

  while (ready.length > 0) {
    const name = ready.shift()!;
    sorted.push(visited.get(name)!);
    for (const [otherName, otherItem] of visited) {
      if (otherItem.registryDependencies.includes(name)) {
        const newDeg = (inDeg.get(otherName) ?? 1) - 1;
        inDeg.set(otherName, newDeg);
        if (newDeg === 0) ready.push(otherName);
      }
    }
  }

  if (sorted.length !== visited.size) {
    const missing = [...visited.keys()].filter((n) => !sorted.some((s) => s.name === n));
    throw new Error(`Circular dependency detected involving: ${missing.join(', ')}`);
  }

  const allDeps = new Set<string>();
  const allDevDeps = new Set<string>();
  const lightVars: Record<string, string> = {};
  const darkVars: Record<string, string> = {};
  for (const item of sorted) {
    for (const dep of item.dependencies) allDeps.add(dep);
    for (const dep of item.devDependencies) allDevDeps.add(dep);
    if (item.cssVars?.light) Object.assign(lightVars, item.cssVars.light);
    if (item.cssVars?.dark) Object.assign(darkVars, item.cssVars.dark);
  }

  return {
    items: sorted,
    dependencies: [...allDeps],
    devDependencies: [...allDevDeps],
    cssVars: { light: lightVars, dark: darkVars },
  };
}
