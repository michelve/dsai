/**
 * Registry type definitions for DSAi component distribution.
 * @module @dsai-io/tools/registry/types
 */

export type RegistryItemType =
  | 'registry:ui'
  | 'registry:hook'
  | 'registry:util'
  | 'registry:lib'
  | 'registry:component'
  | 'registry:style'
  | 'registry:type';

export interface RegistryFile {
  path: string;
  type: RegistryItemType;
  content: string;
  target?: string;
}

export interface RegistryItem {
  name: string;
  type: RegistryItemType;
  title: string;
  description: string;
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
  cssVars?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  categories?: string[];
}

export interface RegistryIndex {
  version: string;
  count: number;
  items: RegistryIndexEntry[];
}

export interface RegistryIndexEntry {
  name: string;
  type: RegistryItemType;
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  categories?: string[];
}

export interface ResolvedTree {
  items: RegistryItem[];
  dependencies: string[];
  devDependencies: string[];
  cssVars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}
