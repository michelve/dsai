/**
 * Registry module for DSAi component distribution.
 * @module @dsai-io/tools/registry
 */

export type {
  RegistryFile,
  RegistryIndex,
  RegistryIndexEntry,
  RegistryItem,
  RegistryItemType,
  ResolvedTree,
} from './types.js';

export {
  registryFileSchema,
  registryIndexEntrySchema,
  registryIndexSchema,
  registryItemSchema,
  registryItemTypeSchema,
} from './schema.js';

export { buildRegistry } from './builder.js';
export type { BuildRegistryOptions } from './builder.js';

export { resolveTree } from './resolver.js';

export { transformImports, normalizeExtensions } from './transformer.js';
export type { TransformOptions as RegistryTransformOptions } from './transformer.js';

export { writeRegistryItems } from './writer.js';
export type { WriteOptions, WriteResult } from './writer.js';
